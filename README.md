# MechBridge

A React-based e-commerce application for mechanical parts and services, built with Vite, React, and Tailwind CSS.

## Features

- Product catalog with filtering
- Shopping cart functionality
- User authentication
- QR code generation and scanning
- Admin panel for logo generation
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router
- **UI Components**: Radix UI
- **Build Tool**: Vite
- **Deployment**: Render (Static Site)

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment Issues and Solutions

### GitHub Pages Deployment Issues

**Problem**: 404 errors when navigating to routes other than the home page.

**Root Cause**: GitHub Pages serves static files and doesn't handle client-side routing. When users navigate to routes like `/catalog`, GitHub Pages tries to load that path on the server, which doesn't exist.

**Solution**:
1. Added `404.html` file in `public/` folder that redirects all 404 requests back to `index.html`
2. Set `base: '/MechBridge/'` in `vite.config.js` for GitHub Pages subdirectory deployment
3. The 404.html uses a script that converts the URL path and query string into a query string and redirects to the root with the path information

### Render Deployment Issues

**Problem 1**: `npm error ENOENT: no such file or directory, open '/opt/render/project/src/package.json'`

**Root Cause**: Render was looking for `package.json` in `/opt/render/project/src/` instead of the project root.

**Solution**: Created `render.yaml` configuration file specifying the correct root directory and build settings.

**Problem 2**: `Failed to load module script: Expected a JavaScript module but server responded with MIME type "binary/octet-stream"`

**Root Cause**: Using `npm run preview` (which starts a Node.js server) instead of serving static files directly.

**Solution**: Changed service type to `static` in `render.yaml` and set `staticPublicPath: dist`.

**Problem 3**: `Manifest fetch failed, code 404`

**Root Cause**: Missing `manifest.json` file required for PWA functionality.

**Solution**: Created `manifest.json` in `public/` folder with proper PWA configuration.

### Git Merge Issues

**Problem**: `fatal: Need to specify how to reconcile divergent branches`

**Root Cause**: Local and remote branches had different commit histories.

**Solution**: Used `git pull --allow-unrelated-histories` to merge unrelated histories.

## Deployment Configuration

### Render (Recommended)

1. Connect your GitHub repository to Render
2. Use the `render.yaml` configuration file for automatic setup
3. Deploy as a static site

### GitHub Pages

1. Build the project: `npm run build`
2. Deploy the `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

## Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_BASE_URL=your_api_url
VITE_APP_LEGACY_SDK_IMPORTS=false
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.
