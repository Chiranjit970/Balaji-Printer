<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\PrintJob;

class FileDownloadService
{
    /**
     * Securely stream file to user and log the access.
     */
    public function secureDownload($printJobId)
    {
        // 1. Authorization check
        if (!auth('admin')->check()) {
            Log::warning("Unauthorized download attempt for Print Job #{$printJobId}");
            return false;
        }

        // 2. Fetch print job
        $printJob = PrintJob::find($printJobId);
        if (!$printJob) {
            Log::error("Print Job #{$printJobId} not found for download");
            return false;
        }

        // 3. Storage existence check (using 'private' or default 'local' disk as configured)
        $disk = Storage::disk('local'); // or 'private' as configured
        if (!$disk->exists($printJob->file_path)) {
            Log::error("File not found on storage disk: {$printJob->file_path} for Print Job #{$printJobId}");
            return false;
        }

        // 4. Log the download access
        $adminId = auth('admin')->id();
        Log::info("Admin ID {$adminId} downloaded Print Job File #{$printJobId} (File: {$printJob->file_name})");

        // 5. Securely stream/download the file
        return $disk->download($printJob->file_path, $printJob->file_name);
    }
}

