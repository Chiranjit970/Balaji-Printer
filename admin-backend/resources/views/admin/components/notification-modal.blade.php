<!-- Send Notification Modal using Alpine.js -->
<div x-data="{ 
        open: false, 
        template: 'placed',
        customMessage: '',
        title: 'Update regarding Order {{ $order->display_order_id ?? \'\' }}',
        get messageText() {
            const id = '{{ $order->display_order_id ?? \'\' }}';
            switch(this.template) {
                case 'placed': return 'Order Received! Your order #' + id + ' has been placed.';
                case 'processing': return 'Order Processing. Your order #' + id + ' is being prepared.';
                case 'dispatched': return 'Order Dispatched! Your order #' + id + ' is on its way.';
                case 'delivered': return 'Order Delivered! Your order #' + id + ' has been delivered.';
                case 'custom': return this.customMessage;
                default: return '';
            }
        }
     }" 
     @open-notification-modal.window="open = true"
     @keydown.escape.window="open = false"
     x-show="open" 
     class="fixed inset-0 z-50 overflow-y-auto" 
     aria-labelledby="modal-title" 
     role="dialog" 
     aria-modal="true"
     style="display: none;">
     
    <!-- Backdrop -->
    <div x-show="open" 
         x-transition:enter="ease-out duration-300" 
         x-transition:enter-start="opacity-0" 
         x-transition:enter-end="opacity-100" 
         x-transition:leave="ease-in duration-200" 
         x-transition:leave-start="opacity-100" 
         x-transition:leave-end="opacity-0" 
         class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <!-- Modal Panel -->
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div x-show="open" 
             @click.away="open = false"
             x-transition:enter="ease-out duration-300" 
             x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" 
             x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100" 
             x-transition:leave="ease-in duration-200" 
             x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100" 
             x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" 
             class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
             
            <form action="{{ route('admin.orders.notify', $order->id ?? 0) }}" method="POST">
                @csrf
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 class="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                                Send Notification to Customer
                            </h3>
                            <div class="mt-4 space-y-4">
                                <div>
                                    <label for="template" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Template</label>
                                    <select id="template" x-model="template" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition cursor-pointer">
                                        <option value="placed">Order Received</option>
                                        <option value="processing">Order Processing</option>
                                        <option value="dispatched">Order Dispatched</option>
                                        <option value="delivered">Order Delivered</option>
                                        <option value="custom">Custom Message</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="title" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Notification Title</label>
                                    <input type="text" name="title" id="title" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition" x-model="title" required>
                                </div>
                                <div>
                                    <label for="message" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                                    
                                    <!-- Template Message Preview (Readonly) -->
                                    <textarea x-show="template !== 'custom'" :value="messageText" disabled class="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed focus:outline-none" rows="3"></textarea>
                                    
                                    <!-- Custom Message Input -->
                                    <textarea x-show="template === 'custom'" x-model="customMessage" name="message" id="message" max="200" x-bind:required="template === 'custom'" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition" rows="3" placeholder="Enter custom message (max 200 characters)..."></textarea>
                                    
                                    <!-- Hidden Input to submit value when using predefined templates -->
                                    <input type="hidden" name="message" :value="messageText" x-bind:disabled="template === 'custom'">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                    <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 focus:outline-none sm:w-auto sm:text-sm transition">
                        Send Notification
                    </button>
                    <button type="button" @click="open = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
