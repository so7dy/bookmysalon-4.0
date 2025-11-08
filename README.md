# BookMySalon Frontend 4.0

React + TypeScript + Vite + Tailwind CSS frontend for BookMySalon AI appointment booking platform.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Runs on http://localhost:5173

### Build
```bash
npm run build
```

### Production Preview
```bash
npm run preview
```

## Environment Variables

Create `.env.local` based on `.env.example`:

```
VITE_API_URL=https://api.yourdomain.com
VITE_CAL_CLIENT_ID=your_cal_id
VITE_GOOGLE_CLIENT_ID=your_google_id
VITE_ENABLE_DEMO_MODE=false
```

## Deployment to Bolt.new

1. **Clone this repository** to Bolt.new
2. **Install dependencies**: `npm install`
3. **Set environment variables** in Bolt dashboard (Settings → Environment)
4. **Start development**: `npm run dev` or let Bolt auto-run
5. **Test** with demo mode first (`VITE_ENABLE_DEMO_MODE=true`)
6. **Disable demo mode** for production

## Features

- ✅ Frontend-only (no backend code)
- ✅ No secrets exposed in repository
- ✅ Demo/offline mode support
- ✅ Graceful error handling
- ✅ OAuth-ready configuration
- ✅ All API calls use environment variables

## API Integration

All API endpoints are configured via `VITE_API_URL` environment variable.

If backend is unavailable and demo mode is enabled, app displays mock data.

## Project Structure

```
src/
├── components/     # UI components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and helpers
├── pages/          # Page components
├── App.tsx         # Root component
├── main.tsx        # Entry point
└── index.css       # Global styles

public/            # Static assets
```

## Key Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **TanStack Query** - Server state management
- **Wouter** - Client-side routing
- **Radix UI** - Accessible components

## Support

For issues or questions, please refer to the [BookMySalon documentation](https://github.com/so7dy/bookmysalon-4.0).
