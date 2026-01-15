# Humanize Frontend - Vue 3 + TypeScript

A modern frontend for the Humanize talent management platform, built with Vue 3, TypeScript, and TailwindCSS.

## Tech Stack

- **Vue 3** (Composition API)
- **TypeScript 5.x**
- **Vite** (Build tool)
- **TailwindCSS** (Styling)
- **Pinia** (State management)
- **Vue Router 4** (Routing)
- **Vue-i18n** (Internationalization - Arabic/English)
- **Axios** (HTTP client)
- **HeadlessUI** (Accessible components)
- **Heroicons** (Icons)

## Project Structure

```
src/
├── assets/          # Static assets (CSS, fonts, images)
├── components/      # Reusable Vue components
│   ├── common/      # Generic UI components
│   ├── auth/        # Authentication components
│   └── layout/      # Layout components (Header, Sidebar)
├── composables/     # Vue composables (hooks)
├── layouts/         # Page layouts
├── locales/         # i18n translation files
├── pages/           # Route pages
├── plugins/         # Vue plugins (i18n, etc.)
├── router/          # Vue Router configuration
├── services/        # API services
├── stores/          # Pinia stores
├── types/           # TypeScript interfaces
└── utils/           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
```

## Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:9000
```

## Features

### Implemented (Phase 1)

- [x] Project scaffolding with Vite
- [x] TailwindCSS with custom theme
- [x] Vue Router with guards
- [x] Pinia state management
- [x] Axios with JWT interceptors
- [x] i18n (Arabic/English with RTL)
- [x] Dark mode support
- [x] Authentication pages (Login, Register, Forgot Password)
- [x] Dashboard layout with sidebar

### Coming Soon

- [ ] Human registration wizard (Phase 2)
- [ ] Company registration wizard (Phase 3)
- [ ] Job management (Phase 4)
- [ ] Contest management (Phase 5)
- [ ] Event management (Phase 6)
- [ ] Real-time chat (Phase 7)
- [ ] Notifications (Phase 8)

## Styling

The project uses TailwindCSS with a custom theme matching the existing Humanize design:

### Colors
- Primary: `#24598c` (Blue)
- Accent: `#92bbd1`
- Success: `#0fae4e`
- Danger: `#e63f4f`
- Warning: `#fba209`

### Fonts
- English: Bw Modelica
- Arabic: Almarai

### Dark Mode

Toggle dark mode with the button in the header. The theme uses CSS variables for seamless switching.

## API Integration

The frontend connects to the Django backend API. Configure the API URL in `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

JWT tokens are automatically managed with refresh token rotation.

## i18n

The app supports English and Arabic with full RTL support:

- Switch languages via the globe icon in the header
- Translations are in `src/locales/`
- RTL is handled via TailwindCSS RTL plugin

## Mobile Apps

The project is configured for Capacitor (already set up in the main project):

```bash
npm run build
npx cap sync
npx cap open android
npx cap open ios
```

## Contributing

See the main project's CONTRIBUTING.rst for guidelines.

## License

MIT
