import { AdminInputField } from '../components/input-field.js';
import { AdminPasswordField } from '../components/password-field.js';
import { AdminLoadingButton } from '../components/loading-button.js';
import { ValidationMessage } from '../components/validation-msg.js';
import { validators } from '../utils/validators.js';
import { AdminSession } from '../utils/api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Session Manager
  AdminSession.init();

  // If already authenticated, redirect to dashboard
  if (AdminSession.isAuthenticated()) {
    window.location.href = 'dashboard.html';
    return;
  }

  // Handle URL query parameters (e.g. ?expired=1)
  const urlParams = new URLSearchParams(window.location.search);
  const errorBanner = new ValidationMessage('error-banner');
  
  if (urlParams.get('expired')) {
    errorBanner.show('Your session has expired. Please log in again.', 'warning');
    // Remove query param from URL without reload
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Initialize Form Components
  const emailField = new AdminInputField('email-group', {
    validateFn: (val) => validators.getEmailError(val),
    onChange: () => updateSubmitButtonState()
  });

  const passwordField = new AdminPasswordField('password-group', {
    validateFn: (val) => validators.getPasswordError(val),
    onChange: () => updateSubmitButtonState()
  });

  const submitBtn = new AdminLoadingButton('login-btn');
  const loginForm = document.getElementById('login-form');

  // Disable button initially
  submitBtn.setDisabled(true);

  // Form Validity Checker
  function updateSubmitButtonState() {
    const isEmailValid = !validators.getEmailError(emailField.getValue());
    const isPasswordValid = !validators.getPasswordError(passwordField.getValue());
    
    submitBtn.setDisabled(!(isEmailValid && isPasswordValid));
  }

  // Form Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Final validation before submit
    const isEmailValid = emailField.validate();
    const isPasswordValid = passwordField.validate();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const email = emailField.getValue();
    const password = passwordField.getValue();

    // Start loading state
    emailField.setDisabled(true);
    passwordField.setDisabled(true);
    submitBtn.setLoading(true);
    errorBanner.hide();

    try {
      // Attempt login via API (Mock)
      await AdminSession.login(email, password);
      
      // Success: fade out login form and redirect
      document.querySelector('.admin-auth-layout').style.animation = 'fadeOut var(--transition-slow) forwards';
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 300);

    } catch (error) {
      // Handle Errors
      emailField.setDisabled(false);
      passwordField.setDisabled(false);
      submitBtn.setLoading(false);
      
      // Clear password for security
      passwordField.setValue('');
      passwordField.input.focus();

      // Show error message
      if (error.type === 'account_locked') {
        errorBanner.show(error.message, 'error');
        // Disable form entirely if locked
        emailField.setDisabled(true);
        passwordField.setDisabled(true);
        submitBtn.setDisabled(true);
      } else {
        errorBanner.show(error.message || 'An error occurred. Please try again.', 'error');
      }
    }
  });
});
