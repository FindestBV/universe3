# Universe 3

A React + Vite template powered by shadcn/ui. This repository will serve as a base for the Findest Universe, next version, implementing modern frontend technologies, development best practices, and a clean, modular, and scalable architecture.

[ShadCn](https://ui.shadcn.com/) is used as the base component library. See the [shadcn/ui](https://ui.shadcn.com/) documentation for more information.
Component units install directly in to <pre>src/components/ui/</pre>. From here, they can be called in any component, and passed props/styling and configuration to extend and customise the primitive. 

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

## ⚙️ Prerequisites

Make sure you have the following installed on your development machine:

- Node.js (version 18 or above)
- pnpm (package manager)

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

## 📜 Available Scripts

- pnpm dev - Starts the development server.
- pnpm build - Builds the production-ready code.
- pnpm lint - Runs ESLint to analyze and lint the code.
- pnpm preview - Starts the Vite development server in preview mode.

## 📂 Project Structure

The project structure follows a standard React application layout:

```python
universe3/
  ├── node_modules/      # Project dependencies
  ├── public/            # Public assets
  ├── src/
  |   ├── assets    # React components
  │   ├── components/    # React components
  │   │   └── ui/        # shadcn/ui components
  │   ├── hooks/    # React components
  │   ├── lib/    # React components
  │   ├── routes/    # React components
  │   ├── services/    # React components
  |   |   └── api.ts    # Base 
  │   |   └── auth/    # Auth API
  │   |   └── documents/  # Documents
  │   |   └── search/    # Search
  │   |   └── entities/    # Entities
  │   |   └── study/    # Study 
  │   |   └── activity/  # Activity 
  |   ├── styles/        # CSS stylesheets
  │   ├── types           # Utility functions
  │   ├── views/    # React components
  |   |   └── Dashboard/    
  │   |   └── Document/   
  │   |   └── Documents/  
  │   |   └── Entities/  
  │   |   └── Entity/    
  │   |   └── Inbox/   
  │   |   └── LoginPage/  
  │   |   └── NotFound/   
  │   |   └── Queries/  
  │   |   └── Studies/   
  │   |   └── Study/  
  │   |   └── Users/  
  │   ├── App.tsx        # Application entry point
  │   └── main.tsx      # Main rendering file
  |   └── store.ts       # Redux Store
  ├── eslint.config.js     # ESLint configuration
  ├── index.html         # HTML entry point
  ├── postcss.config.js  # PostCSS configuration
  ├── tailwind.config.ts # Tailwind CSS configuration
  ├── tsconfig.json      # TypeScript configuration
  └── vite.config.ts     # Vite configuration
```