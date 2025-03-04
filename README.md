# Universe 3

A React + Vite template powered by shadcn/ui. This repository will serve as a base for the Findest Universe, next version, implementing modern frontend technologies, development best practices, and a clean, modular, and scalable architecture.

[ShadCn](https://ui.shadcn.com/) is used as the base component library. See the [shadcn/ui](https://ui.shadcn.com/) documentation for more information.
Component units install directly in to `src/components/ui/`. From here, they can be called in any component, and passed props/styling and configuration to extend and customise the primitive.

## DISCLAIMER:

This is a work in progress and is intended to achieve the result of a pixel-perfect replication of the current Findest Universe UI.
The key objective is to implement a flow, featuring all of the required composite elements and functionality present in the existing universe, but implementing proper and robust state management, frontend architectural process and best practices, with the aim of minimising the impact on the business.

## DISCUSSION:

Wide open for discussion, this is encouraged, as the whole team will need to have a say in the architecture and standards we'll be looking to implement.

## 🎉 Features

- **React** - A JavaScript library for building user interfaces.
- **Vite** - A fast, opinionated frontend build tool.
- **TypeScript** - A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS** - A utility-first CSS framework.
- **Tailwind Prettier Plugin** - A Prettier plugin for formatting Tailwind CSS classes.
- **ESLint** - A pluggable linting utility for JavaScript and TypeScript.
- **PostCSS** - A tool for transforming CSS with JavaScript.
- **Autoprefixer** - A PostCSS plugin to parse CSS and add vendor prefixes.
- **shadcn/ui** - Beautifully designed components that you can copy and paste into your apps.
- **i18n Support** - Supports mutlilingual labels and routing.

## REPO RULES:

During the initial phase of development, there was a single developer establishing the fundamental setup for the project. As this expands and matures, we're hoping to onboard more devs onto this flow and to do so in both an inclusive and non-intrusive way.

## Primary Branch

The primary branch from which the project is published is:

<pre>
   <code>
   findest/dev-prototype
   </code>
</pre>

- this will eventually be changed to main/production, but to encourage adoption of incumbent workflows, this branch requires a pull request for any/all changes being merged to primary branch.

Developers invited to clone the repo, checkout and create a new feature branch off of findest/dev-prototype. Until such a time as convention changes this, new and feature-branches should be created with the format:

[contributor-name]/FN-XXXX-brief-description-of-tasks

- branches will be configured to be auto-deleted when merges complete.

## ⚙️ Prerequisites

Make sure you have the following installed on your development machine:

- Node.js (version 18 or above)
- [pnpm](https://pnpm.io/) pnpm (package manager), why? [here's why](https://peerlist.io/blog/engineering/what-is-pnpm-and-why-you-should-use-it)

## 🚀 Getting Started

Follow these steps to get started with the react-vite-ui template:

1. Clone the repository:

   ```bash
   git clone https://github.com/FindestBV/universe3
   ```

2. Navigate to the project directory:

   ```bash
   cd universe3
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

Development server will start on

```bash
   localhost:5173
```

### Login

To log in, use your findest email.

## 📜 Available Scripts

- pnpm dev - Starts the development server.
- pnpm build - Builds the production-ready code.
- pnpm lint - Runs ESLint to analyze and lint the code.
- pnpm preview - Starts the Vite development server in preview mode.

## 📂 Project Structure

The project structure follows a standard React application layout:

```
universe3/
  ├── node_modules/        # Project dependencies
  ├── public/              # Public assets
  ├── src/
  |   ├── assets/         # Static assets
  │   ├── components/     # React components
  |   |   └── common/     # Shared components
  |   |   |     └── cards/
  |   |   |     └── dialogs/
  |   |   |     └── editor/
  |   |   |     |   └── extensions/
  |   |   |     |   └── menus/
  |   |   |     |   └── Pages/
  |   |   |     |   └── panels/
  |   |   |     |   └── ui/
  |   |   |     └── forms/
  |   |   |     └── layout/
  |   |   |     └── loaders/
  |   |   |     └── login/
  |   |   |     └── projects/
  |   |   |     └── search/
  |   |   |     └── sidebar/
  |   |   |     └── user/
  |   |   |     └── utilities/
  |   |   |
  |   |   └── ui/        # shadcn/ui components
  |   |
  │   ├── hooks/         # Custom React hooks
  │   ├── i18n/          # Internationalization
  │   ├── lib/           # Utilities and helpers
  │   ├── api/          # API integration
  |   |   └── api.ts    # Base API configuration
  │   |   └── auth/     # Authentication
  │   |   └── documents/ # Document management
  │   |   └── projects/ # Project management
  │   |   └── search/   # Search functionality
  │   |   └── activity/ # Activity tracking
  │   |   └── utilities/
  │   ├── styles/       # Global styles
  │   |   └── colors/
  │   |   └── components/
  │   |   └── typography/
  │   |   └── utilities/
  │   |
  │   ├── types/        # TypeScript type definitions
  │   ├── views/        # Page components
  │   ├── App.tsx       # Root component
  │   └── main.tsx      # Entry point
  |   └── store.ts      # Redux store configuration
  │
  ├── eslint.config.js  # ESLint configuration
  ├── index.html        # HTML template
  ├── postcss.config.js # PostCSS configuration
  ├── tailwind.config.ts # Tailwind configuration
  ├── tsconfig.json     # TypeScript configuration
  └── vite.config.ts    # Vite configuration
```
