/**
 * ValidationMessage Component Manager (Error Banner)
 */
export class ValidationMessage {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) throw new Error(`Container ${containerId} not found`);
    
    this.textElement = this.container.querySelector('.banner-text');
  }

  show(message, type = 'error') {
    if (this.textElement) {
      this.textElement.textContent = message;
    }
    
    // Reset classes
    this.container.className = 'validation-banner';
    this.container.classList.add(type);
    this.container.classList.add('show');
  }

  hide() {
    this.container.classList.remove('show');
  }
}
