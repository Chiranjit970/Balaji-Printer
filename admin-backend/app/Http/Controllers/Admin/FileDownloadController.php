<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Services\FileDownloadService;

class FileDownloadController extends Controller
{
    protected $fileDownloadService;

    public function __construct(FileDownloadService $fileDownloadService)
    {
        $this->fileDownloadService = $fileDownloadService;
    }

    /**
     * Securely download a print job file.
     */
    public function download($printJobId)
    {
        // 1. Authorize (handled by route middleware / policy in real app)
        
        // 2. Fetch File Path
        // $printJob = PrintJob::findOrFail($printJobId);
        // $filePath = $printJob->file_path;

        $response = $this->fileDownloadService->secureDownload($printJobId);

        if (!$response) {
            return back()->with('error', 'File not found or access denied.');
        }

        return $response;
    }
}
