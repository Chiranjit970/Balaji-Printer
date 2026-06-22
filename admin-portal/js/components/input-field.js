import { validators } from '../utils/validators.js';

/**
 * AdminInputField Component Manager
 */
export class AdminInputField {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) throw new Error(`Container ${containerId} not found`);

    this.input = this.container.querySelector('input');
    this.icon = this.container.querySelector('.admin-input-icon');
    this.errorText = this.container.querySelector('.error-text');
    this.wrapper = this.container.querySelector('.admin-input-wrapper');
    
    this.validateFn = options.validateFn || (() => null);
    this.onChangeCallback = options.onChange || (() => {});

    this.initEvents();
  }

  initEvents() {
    // Handle Focus
    this.input.addEventListener('focus', () => {
      this.wrapper.classList.add('focus');
    });

    // Handle Blur (Validation)
    this.input.addEventListener('blur', () => {
      this.wrapper.classList.remove('focus');
      this.validate();
    });

    // Handle Input
    this.input.addEventListener('input', (e) => {
      // Clear error on type
      if (this.hasError()) {
        this.clearError();
      }
      this.onChangeCallback(e.target.value);
    });
  }

  getValue() {
    return this.input.value.trim();
  }

  setValue(value) {
    this.input.value = value;
  }

  validate() {
    const errorMsg = this.validateFn(this.getValue());
    if (errorMsg) {
      this.setError(errorMsg);
      return false;
    }
    this.clearError();
    return true;
  }

  setError(message) {
    this.container.classList.add('error');
    this.input.setAttribute('aria-invalid', 'true');
    if (this.errorText) {
      this.errorText.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        ${message}
      `;
      // Add shake animation
      this.input.style.animation = 'none';
      this.input.offsetHeight; /* trigger reflow */
      this.input.style.animation = 'shake var(--transition-fast)';
    }
  }

  clearError() {
    this.container.classList.remove('error');
    this.input.removeAttribute('aria-invalid');
    if (this.errorText) {
      this.errorText.innerHTML = '';
      this.input.style.animation = 'none';
    }
  }

  hasError() {
    return this.container.classList.contains('error');
  }

  setDisabled(disabled) {
    this.input.disabled = disabled;
    if (disabled) {
      this.container.style.opacity = '0.6';
    } else {
      this.container.style.opacity = '1';
    }
  }
}
