# Inventory Order Management App

A modern, professional React application built with Vite, following a scalable feature-based architecture.

## 🚀 Tech Stack

- **Core**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Styling**: CSS Modules / Global CSS (Vanilla)
- **Code Quality**: ESLint (Flat Config), Prettier
- **Path Aliases**: configured via `vite.config.js` and `jsconfig.json`

## 📂 Project Structure

The project follows a **Feature-Based Architecture** to ensure scalability and maintainability.

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Shared components
│   ├── common/      # Generic reusable components (Button, Input, etc.)
│   └── layout/      # Layout components (Header, Sidebar, MainLayout)
├── config/          # Configuration files (constants, env vars)
├── context/         # Global state context providers
├── features/        # Feature-specific modules (slices of the app)
│   └── [feature]/   
│       ├── components/  # Components specific to this feature
│       ├── hooks/       # Hooks specific to this feature
│       └── services/    # API calls specific to this feature
├── hooks/           # Shared custom hooks
├── pages/           # Page components (route targets)
├── routes/          # Routing configuration
├── services/        # Shared API services/axios instance
├── styles/          # Global styles and variables
├── utils/           # Helper functions and utilities
├── App.jsx          # App entry component
└── main.jsx         # Application entry point
```

## 🏗 Architecture Decisions

### 1. Feature-Based Folder Structure
Instead of grouping by file type (e.g., all components together), we group by **feature**. This keeps related code collocated, making it easier to maintain and scale. Shared code resides in `components/common`, `hooks`, or `utils`.

### 2. State Management
- **Local State**: `useState`, `useReducer` for component-specific logic.
- **Global State**: React **Context API** is used for global application state (e.g., Auth, Theme) to avoid prop drilling.
- **Server State**: For API data fetching, custom hooks or libraries like TanStack Query (optional recommendation) are preferred over global store.

### 3. Absolute Imports
Configured `@` alias pointing to `./src` to avoid messy relative paths like `../../components/`.

### 4. Code Quality
- **ESLint**: configured with standard React rules and Prettier integration to ensure code consistency.
- **Prettier**: enforces strict formatting rules automatically.

## 🛠 Setup & Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Linting**
   ```bash
   npm run lint
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📝 Git Workflow
- **Main Branch**: `main` (production-ready code)
- **Feature Branches**: `feature/feature-name`
- **Fix Branches**: `fix/bug-name`

---
© 2026 Inventory Management App
