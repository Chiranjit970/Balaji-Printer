@props(['product' => null])

<div class="space-y-4">
    @if($product)
        {{-- Existing Images (for edit mode) --}}
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            @foreach($product->productImages as $img)
                <div class="relative group aspect-square border border-slate-200 rounded-lg overflow-hidden bg-slate-100 flex flex-col justify-between">
                    <img src="{{ $img->image_url }}" alt="Product Image" class="w-full h-full object-cover">
                    
                    {{-- Primary Badge --}}
                    @if($img->is_primary)
                        <span class="absolute top-1.5 left-1.5 px-2 py-0.5 text-[9px] font-bold bg-green-600 text-white rounded shadow-sm">
                            PRIMARY
                        </span>
                    @endif

                    {{-- Actions Hover Overlay --}}
                    <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                        @if(!$img->is_primary)
                            <form action="{{ route('admin.products.images.setPrimary', $img->id) }}" method="POST" class="w-full px-2">
                                @csrf
                                @method('PATCH')
                                <button type="submit" class="w-full py-1 text-center bg-white/90 hover:bg-white text-slate-800 text-[10px] font-bold rounded transition-colors">
                                    Set Primary
                                </button>
                            </form>
                        @endif

                        <form action="{{ route('admin.products.images.destroy', $img->id) }}" method="POST" class="w-full px-2">
                            @csrf
                            @method('DELETE')
                            <button type="submit" onclick="return confirm('Remove this image?')" class="w-full py-1 text-center bg-red-600/90 hover:bg-red-600 text-white text-[10px] font-bold rounded transition-colors">
                                Remove
                            </button>
                        </form>
                    </div>
                </div>
            @endforeach

            {{-- Upload Slot if count < 5 --}}
            @if($product->productImages->count() < 5)
                <div class="relative border-2 border-dashed border-slate-300 rounded-lg aspect-square hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center p-4">
                    <form action="{{ route('admin.products.images.store', $product->id) }}" method="POST" enctype="multipart/form-data" class="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer" onclick="document.getElementById('fileInput').click()">
                        @csrf
                        <svg class="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
                        </svg>
                        <span class="text-xs font-semibold text-slate-600">Add Image</span>
                        <input type="file" id="fileInput" name="images[]" multiple class="hidden" accept="image/jpeg,image/png" onchange="this.form.submit()">
                    </form>
                </div>
            @endif
        </div>
    @else
        {{-- For Create Mode --}}
        <div x-data="{ files: [] }" class="space-y-4">
            <div class="relative border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center text-center">
                <input type="file" name="images[]" multiple class="absolute inset-0 opacity-0 cursor-pointer" accept="image/jpeg,image/png" 
                       @change="files = Array.from($event.target.files).slice(0, 5)">
                <svg class="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="text-sm font-semibold text-slate-700">Choose images to upload</span>
                <span class="text-xs text-slate-500 mt-1">Select up to 5 images (JPG or PNG, max 2MB each)</span>
            </div>

            {{-- Selected Images Preview --}}
            <div x-show="files.length > 0" class="grid grid-cols-2 md:grid-cols-5 gap-3" style="display: none;">
                <template x-for="(file, index) in files" :key="index">
                    <div class="relative aspect-square border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-1 flex items-center justify-center">
                        <div class="text-center w-full px-2">
                            <svg class="w-6 h-6 text-slate-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <span class="text-[10px] font-medium text-slate-700 truncate block" x-text="file.name"></span>
                            <span class="text-[9px] text-slate-400 block" x-text="(file.size/1024/1024).toFixed(2) + ' MB'"></span>
                            <span x-show="index === 0" class="inline-block mt-1 px-1.5 py-0.5 text-[8px] font-bold bg-green-100 text-green-800 rounded">
                                PRIMARY
                            </span>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    @endif
</div>
