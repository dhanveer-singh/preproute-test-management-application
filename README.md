# Preproute Test Management Application

A React + TypeScript test management application developed as part of the Preproute frontend developer evaluation task.

## Requirements

- Node.js 20+
- npm

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd preproute-test-management-application
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-api-url.com/api
```

Do not commit `.env` files containing sensitive information.

## Run the Project

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

Format the project:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

## Import Alias

The project uses `@` as an alias for the `src` directory.

Example:

```tsx
import LoginPage from '@/pages/auth/LoginPage';
```

TypeScript and Vite are both configured to resolve this alias.

## Code Quality

The project uses:

- TypeScript
- ESLint
- Prettier
- ESLint import ordering
- Type-only imports where applicable

Before submitting, run:

```bash
npm run lint
npm run format:check
npm run build
```

## Design

Figma:

https://www.figma.com/design/Xe45bF7fnHroM1g1gDGXFR/Preproute-Assignment

## Backend

API documentation and staging backend were provided as part of the Preproute evaluation task.

## Assignment Deliverables

The final submission includes:

- GitHub repository
- Deployed application
- Walkthrough video
- Brief technical explanation

Submission is made through the Google Form provided by Preproute.
