/**
 * AdminLoadingButton Component Manager
 */
export class AdminLoadingButton {
  constructor(buttonId) {
    this.button = document.getElementById(buttonId);
    if (!this.button) throw new Error(`Button ${buttonId} not found`);

    this.originalHTML = this.button.innerHTML;
    this.isLoading = false;
  }

  setLoading(loading) {
    this.isLoading = loading;
    
    if (loading) {
      this.button.disabled = true;
      this.button.innerHTML = `
        <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
      `;
    } else {
      this.button.disabled = false;
      this.button.innerHTML = this.originalHTML;
    }
  }

  setDisabled(disabled) {
    if (this.isLoading) return; // Don't override loading state
    this.button.disabled = disabled;
  }
}
