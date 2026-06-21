# Balaji Printers

A mobile and web application for Balaji Printers — a printing services company.

## Tech Stack

- **Expo SDK 56** (React Native)
- **Expo Router v3** (file-based routing)
- **TypeScript** (strict mode)
- **Zustand** (state management)
- **Axios** (HTTP client)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on specific platforms
npx expo start --android   # Android
npx expo start --web       # Web browser
```

## Project Structure

```
app/                    # Expo Router file-based routes
├── _layout.tsx         # Root layout (fonts, providers)
├── index.tsx           # Splash → Auth Gate
├── (auth)/             # Unauthenticated screens
│   ├── login.tsx
│   └── verify-otp.tsx
└── (tabs)/             # Authenticated screens (bottom tabs)
    ├── print.tsx
    ├── store.tsx
    ├── orders.tsx
    └── profile.tsx

src/
├── components/         # Reusable UI components
├── constants/          # Design tokens (colors, spacing, typography)
├── hooks/              # Custom React hooks
├── services/           # API & storage services
├── store/              # Zustand state management
└── types/              # TypeScript type definitions
```

## Phase Roadmap

- **Phase 0** ✅ — App bootstrap, auth gate, navigation
- **Phase 1** — Login / OTP authentication
- **Phase 2** — Print & Store screens
- **Phase 3** — Cart & checkout
- **Phase 4** — Product catalog
- **Phase 5** — Payment integration
- **Phase 6** — Order management

## Development Notes

- **Mock Login**: Use the "Mock Login (Dev)" button on the login screen to simulate authentication
- **Auth Token**: Mock tokens use format `mock_token_{userId}_{timestamp}` with 30-day expiry
- **Web Support**: Full feature parity on web via `npx expo start --web`
