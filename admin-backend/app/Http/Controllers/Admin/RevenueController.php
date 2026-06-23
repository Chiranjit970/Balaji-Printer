<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\RevenueReportService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RevenueController extends Controller
{
    public function __construct(
        protected RevenueReportService $reportService
    ) {}

    /**
     * Display reports dashboard.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['range', 'start_date', 'end_date', 'group_by']);
        $filters['range'] = $filters['range'] ?? 'this_week';
        $filters['group_by'] = $filters['group_by'] ?? 'day';

        // Parse date limits
        [$start, $end] = $this->reportService->parseDates($filters);
        [$prevStart, $prevEnd] = $this->reportService->getPreviousPeriod($start, $end);

        // Get summaries & charts
        $summary = $this->reportService->getSummary($start, $end, $prevStart, $prevEnd);
        $chartData = $this->reportService->getRevenueChartData($start, $end, $filters['group_by']);
        $ordersByStatus = $this->reportService->getOrdersByStatusData($start, $end);
        
        // Tables
        $revenueSummary = $this->reportService->getRevenueSummary($start, $end, $filters['group_by']);
        $topCategories = $this->reportService->getTopSellingCategories($start, $end);

        return view('admin.revenue.index', compact(
            'filters',
            'start',
            'end',
            'prevStart',
            'prevEnd',
            'summary',
            'chartData',
            'ordersByStatus',
            'revenueSummary',
            'topCategories'
        ));
    }

    /**
     * Export revenue summary as CSV.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $filters = $request->only(['range', 'start_date', 'end_date', 'group_by']);
        $filters['range'] = $filters['range'] ?? 'this_week';
        $filters['group_by'] = $filters['group_by'] ?? 'day';

        [$start, $end] = $this->reportService->parseDates($filters);
        $data = $this->reportService->getRevenueSummary($start, $end, $filters['group_by']);

        $filename = 'balaji-printers-report-' . $start->format('Y-m-d') . '-' . $end->format('Y-m-d') . '.csv';

        $response = new StreamedResponse(function () use ($data) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM for Excel compatibility
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // Header columns
            fputcsv($handle, ['Date/Period', 'Orders Count', 'Revenue (INR)', 'Average Order Value (INR)']);

            // Body rows (plain numbers for amounts to avoid formatting bugs in Excel)
            foreach ($data as $row) {
                fputcsv($handle, [
                    $row['period'],
                    $row['orders'],
                    round($row['revenue'], 2),
                    round($row['aov'], 2)
                ]);
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }
}
