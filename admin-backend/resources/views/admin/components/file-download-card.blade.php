@props(['printJob'])

<div class="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
  <div class="flex items-center gap-3">
    <div class="p-2 bg-blue-100 text-blue-600 rounded">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    </div>
    <div>
      <p class="text-sm font-medium text-gray-900">{{ $printJob->file_name ?? 'Document.pdf' }}</p>
      <p class="text-xs text-gray-500">{{ round(($printJob->file_size ?? 0) / 1024) }} KB • Uploaded {{ isset($printJob->created_at) ? \Carbon\Carbon::parse($printJob->created_at)->diffForHumans() : 'Recently' }}</p>
    </div>
  </div>
  
  <a href="{{ route('admin.orders.files.download', $printJob->id) }}" class="text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 bg-white hover:bg-blue-50 px-3 py-1.5 rounded transition flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
    Download
  </a>
</div>
