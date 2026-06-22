import { AdminInputField } from './input-field.js';

/**
 * AdminPasswordField Component Manager
 */
export class AdminPasswordField extends AdminInputField {
  constructor(containerId, options = {}) {
    super(containerId, options);
    
    this.toggleBtn = this.container.querySelector('.password-toggle');
    this.isVisible = false;

    if (this.toggleBtn) {
      this.initToggleEvents();
    }
  }

  initToggleEvents() {
    this.toggleBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent form submission
      this.toggleVisibility();
    });
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
    
    if (this.isVisible) {
      this.input.type = 'text';
      this.toggleBtn.setAttribute('aria-label', 'Hide password');
      this.toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
      `; // Eye-off icon
    } else {
      this.input.type = 'password';
      this.toggleBtn.setAttribute('aria-label', 'Show password');
      this.toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      `; // Eye icon
    }
  }

  setDisabled(disabled) {
    super.setDisabled(disabled);
    if (this.toggleBtn) {
      this.toggleBtn.disabled = disabled;
    }
  }
}
