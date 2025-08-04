# VibeRMM Frontend

A modern, responsive Remote Monitoring and Management (RMM) system frontend built with Next.js and Tailwind CSS.

## Overview

VibeRMM is a comprehensive RMM solution designed for IT professionals and MSPs to efficiently monitor and manage client systems. The frontend provides an intuitive interface for device management, monitoring, patching, alerting, and more.

## Features

- **Dashboard**: Customizable dashboard with drag-and-drop widgets
- **Asset Management**: Track and manage all devices across multiple clients
- **Monitoring**: Real-time monitoring of system metrics, network performance, and disk usage
- **Patch Management**: Automated patch assessment, deployment, and compliance reporting
- **Alerts & Notifications**: Configurable alert policies with multiple notification channels
- **Scripts & Automation**: Create and deploy scripts for automated remediation
- **Reporting**: Generate detailed reports on system performance and health
- **User Management**: Role-based access control and user profiles

## Tech Stack

- **Framework**: Next.js 15.x (React 19)
- **Styling**: Tailwind CSS 4.x
- **State Management**: React Context API
- **UI Components**:
  - Headless UI
  - Radix UI
  - class-variance-authority for component variants
- **Charts & Visualization**: 
  - Chart.js
  - react-chartjs-2
  - Nivo
- **Forms**: react-hook-form with Zod validation
- **API Integration**: Axios, SWR, and React Query
- **Layout**: react-grid-layout for dashboard widgets
- **Icons**: Heroicons and Lucide React

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/theonlytruebigmac/vibermm-frontend.git
cd vibermm-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
# Add other environment variables as needed
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:9005](http://localhost:9005).

### Building for Production

Build the application:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm run start
# or
yarn start
```

### Code Quality and Type Checking

Run ESLint:

```bash
npm run lint
# or
yarn lint
```

Run TypeScript type checking:

```bash
npm run typecheck
# or
yarn typecheck
```

## Project Structure

```
vibermm-frontend/
├── src/                    # Source files
│   ├── app/                # Next.js app directory
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   ├── alerts/         # Alert management
│   │   ├── assets/         # Asset management
│   │   ├── companies/      # Company management
│   │   ├── dashboard/      # Dashboard and widgets
│   │   ├── login/          # Authentication
│   │   ├── monitoring/     # System monitoring
│   │   ├── patching/       # Patch management
│   │   ├── policies/       # Policy configuration
│   │   ├── profile/        # User profile
│   │   ├── reporting/      # Reports
│   │   ├── settings/       # System settings
│   │   └── workflows/      # Automation workflows
│   ├── components/         # Reusable components
│   │   ├── assets/         # Asset-related components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   ├── table/          # Table components
│   │   └── ui/             # UI components library
│   ├── constants/          # Application constants
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── services/           # API services
│   └── types/              # TypeScript type definitions
├── public/                 # Static files
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.mjs      # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Authentication

The application uses a custom authentication system with JWT tokens. User session information is stored in localStorage for persistence between page refreshes.

## Theming

The application uses a dark theme by default, with teal (#23a69a) as the primary accent color. Button styling is consistent across all pages using the Button component with predefined variants.

## Best Practices

- Use TypeScript for type safety
- Use React hooks for state management
- Follow the component-based architecture
- Maintain consistent styling using Tailwind CSS utility classes
- Use the UI component library for consistent interface elements

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)