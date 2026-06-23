<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Login - Balaji Printers</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="{{ asset('assets/css/design-system.css') }}">
  <link rel="stylesheet" href="{{ asset('assets/css/login.css') }}">
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body>

  <main class="admin-auth-layout">
    <!-- Left Panel -->
    <section class="admin-auth-left" aria-labelledby="left-panel-heading">
      <div class="brand-header">
        <div class="brand-logo-container">
          <svg class="brand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <h1 class="brand-name text-display">Balaji Printers</h1>
        </div>
        <div class="brand-subtitle-container">
          <span class="brand-subtitle text-caption-semibold">Admin Panel</span>
          <div class="brand-accent-line"></div>
        </div>
      </div>

      <div class="value-prop">
        <h2 id="left-panel-heading" class="text-h1">Manage your business with ease</h2>
        <p class="text-body">View and manage orders, products, users, reports and much more from your admin dashboard.</p>
      </div>

      <div class="dashboard-preview">
        <img src="{{ asset('assets/images/dashboard-preview.png') }}" alt="Dashboard preview showing metrics" />
      </div>

      <div class="decorative-illustration">
        <img src="{{ asset('assets/images/decorative-plant.png') }}" alt="Decorative plant illustration" />
      </div>
    </section>

    <!-- Right Panel -->
    <section class="admin-auth-right" aria-labelledby="auth-heading">
      <div class="auth-card">
        <div class="auth-header">
          <div class="security-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <rect x="9" y="11" width="6" height="4" rx="1"></rect>
              <path d="M12 11v-2a2 2 0 1 1 4 0"></path>
            </svg>
          </div>
          <h2 id="auth-heading" class="auth-title text-h1">Welcome Back!</h2>
          <p class="auth-subtitle text-body">Sign in to continue to your admin account</p>
        </div>

        @if ($errors->any())
        <div class="validation-banner flex items-center p-3 mb-4 rounded bg-red-50 text-red-700" role="alert" aria-live="assertive" style="display:flex;">
          <svg class="banner-icon mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span class="banner-text">{{ $errors->first() }}</span>
        </div>
        @endif

        <form method="POST" action="{{ route('admin.login') }}" class="auth-form" x-data="{ showPassword: false }">
          @csrf
          
          <!-- Email Field -->
          <div id="email-group" class="admin-input-group">
            <label for="email" class="admin-label text-caption-semibold">Email Address <span class="text-danger">*</span></label>
            <div class="admin-input-wrapper">
              <svg class="admin-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <input type="email" name="email" id="email" class="admin-input @error('email') border-red-500 @enderror" value="{{ old('email') }}" placeholder="admin@example.com" autocomplete="email" required autofocus>
            </div>
          </div>

          <!-- Password Field -->
          <div id="password-group" class="admin-input-group mt-4">
            <label for="password" class="admin-label text-caption-semibold">Password <span class="text-danger">*</span></label>
            <div class="admin-input-wrapper">
              <svg class="admin-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <input :type="showPassword ? 'text' : 'password'" name="password" id="password" class="admin-input @error('password') border-red-500 @enderror" placeholder="Enter your password" autocomplete="current-password" required>
              <button type="button" @click="showPassword = !showPassword" class="password-toggle" aria-label="Show password">
                <svg x-show="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <svg x-show="showPassword" x-cloak xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              </button>
            </div>
          </div>

          <!-- Options Row -->
          <div class="auth-options mt-4">
            <label class="admin-checkbox-label">
              <input type="checkbox" name="remember" id="remember" class="admin-checkbox" {{ old('remember') ? 'checked' : '' }}>
              <span class="text-body">Remember me</span>
            </label>
            <a href="#" class="admin-link text-body">Forgot Password?</a>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="admin-button text-button mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            Login
          </button>

          <div class="divider mt-6">
            <span>or</span>
          </div>

          <!-- Security Reassurance -->
          <div class="security-notice mt-6">
            <svg class="security-notice-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
            <div>
              <h3 class="security-notice-title text-caption-semibold">Secure Admin Access</h3>
              <p class="security-notice-desc text-caption">Protected by encrypted authentication and secure session management.</p>
            </div>
          </div>
        </form>
      </div>

      <footer class="auth-footer mt-auto pt-6 text-center">
        <p class="text-caption text-gray-500">© 2026 Balaji Printers. All rights reserved.</p>
      </footer>
    </section>
  </main>
</body>
</html>
