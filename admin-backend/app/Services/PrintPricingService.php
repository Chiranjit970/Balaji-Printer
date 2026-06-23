<?php

namespace App\Services;

class PrintPricingService
{
    /**
     * Calculate print job details and pricing.
     *
     * @param int $pages Number of pages in document
     * @param int $copies Number of copies requested
     * @param array $options Configuration options (color, paperSize, sides, binding, lamination)
     * @return array
     */
    public static function calculate(int $pages, int $copies, array $options): array
    {
        // 1. Fetch values from SettingsService
        $bwPrice = (float) SettingsService::get('bw_price_per_page', 1.50);
        $colorMultiplier = (float) SettingsService::get('color_multiplier', 2.00);
        $doubleSideCharge = (float) SettingsService::get('double_side_charge', 0.50);
        $bindingFee = (float) SettingsService::get('binding_fee', 20.00);

        $paperA4Surcharge = (float) SettingsService::get('paper_a4_surcharge', 0.00);
        $paperA3Surcharge = (float) SettingsService::get('paper_a3_surcharge', 0.00);
        $paperPremiumSurcharge = (float) SettingsService::get('paper_premium_surcharge', 1.00);
        $paperGlossySurcharge = (float) SettingsService::get('paper_glossy_surcharge', 1.50);

        $laminationFee = (float) SettingsService::get('lamination_fee', 2.00);
        $spiralBindingFee = (float) SettingsService::get('spiral_binding_fee', 15.00);
        $hardBindingFee = (float) SettingsService::get('hard_binding_fee', 40.00);

        // 2. Base Page Price based on Color Mode
        $colorMode = strtolower($options['color'] ?? $options['color_mode'] ?? 'bw');
        $isColor = $colorMode === 'color';
        $pagePrice = $isColor ? ($bwPrice * $colorMultiplier) : $bwPrice;

        // 3. Double sided surcharge
        $sides = strtolower($options['sides'] ?? 'single');
        $isDoubleSide = $sides === 'double' || $sides === 'double_side';
        if ($isDoubleSide) {
            $pagePrice += $doubleSideCharge;
        }

        // 4. Paper type/size surcharge
        $paperSize = strtolower($options['paperSize'] ?? $options['paper_size'] ?? 'a4');
        $paperType = strtolower($options['paperType'] ?? $options['paper_type'] ?? 'regular');

        if ($paperSize === 'a3') {
            $pagePrice += $paperA3Surcharge;
        } else {
            $pagePrice += $paperA4Surcharge; // default A4
        }

        if ($paperType === 'premium') {
            $pagePrice += $paperPremiumSurcharge;
        } elseif ($paperType === 'glossy') {
            $pagePrice += $paperGlossySurcharge;
        }

        // 5. Total Page Cost
        $totalPageCost = $pagePrice * $pages * $copies;

        // 6. Binding Fees
        $binding = strtolower($options['binding'] ?? 'none');
        $bindingCost = 0.00;
        if ($binding === 'staple') {
            $bindingCost = $bindingFee;
        } elseif ($binding === 'spiral') {
            $bindingCost = $spiralBindingFee;
        } elseif ($binding === 'hard') {
            $bindingCost = $hardBindingFee;
        }

        // 7. Lamination Fees
        $lamination = filter_var($options['lamination'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $laminationCost = 0.00;
        if ($lamination) {
            $laminationCost = $laminationFee * $pages * $copies;
        }

        // 8. Grand Total
        $grandTotal = $totalPageCost + $bindingCost + $laminationCost;

        return [
            'bw_price' => $bwPrice,
            'color_multiplier' => $colorMultiplier,
            'page_price' => $pagePrice,
            'pages' => $pages,
            'copies' => $copies,
            'binding_cost' => $bindingCost,
            'lamination_cost' => $laminationCost,
            'total' => $grandTotal,
        ];
    }
}
