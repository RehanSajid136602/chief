# RecipeHub - AI-Powered Recipe Discovery Platform

A modern recipe discovery website with smart ingredient matching built with Next.js 14, Tailwind CSS, and NextAuth.js.

## Features

- **Recipe Catalog**: Browse curated recipes with filtering and search
- **AI Ingredient Matcher**: Find recipes based on ingredients you have
- **Authentication**: Google OAuth and email/password login
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode**: Beautiful dark theme by default
- **Performance**: Server-side rendering with Next.js App Router

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Animations**: Framer Motion
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   
   # Optional: Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

5. Generate a secret key:
   ```bash
   openssl rand -base64 32
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── ai/           # AI matcher page
│   │   └── recipes/      # Recipe detail pages
│   ├── components/       # React components
│   │   ├── ui/           # Base UI components
│   │   ├── recipe/       # Recipe-specific components
│   │   ├── home/         # Home page components
│   │   └── ai/           # AI matcher components
│   └── lib/              # Utility functions
├── data/                 # Static data (recipes.json)
├── public/              # Static assets
└── openspec/             # Project specifications
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `NEXTAUTH_URL` | Base URL for the app | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | No |

## License

MIT
