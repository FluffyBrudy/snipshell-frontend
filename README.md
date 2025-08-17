# SnipShell Frontend

A modern React/Next.js frontend for the SnipShell command snippet management system.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── store/             # Zustand store configuration
│   │   ├── slice/         # Store slices
│   │   │   ├── auth.slice.ts
│   │   │   └── commands.slice.ts
│   │   └── index.ts       # Store exports
│   └── types/             # App-specific types
├── config/                # Configuration files
│   └── api.config.ts      # API endpoints configuration
├── lib/                   # Library code
│   ├── api/               # API client and services
│   │   ├── client.api.ts  # Axios client with interceptors
│   │   └── service/       # API service classes
│   │       ├── auth.service.ts
│   │       ├── commands.service.ts
│   │       └── index.ts
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCommands.ts
│   │   └── index.ts
│   └── utils/             # Utility functions
│       ├── validation.ts
│       └── index.ts
└── types/                 # TypeScript type definitions
    ├── auth.ts           # Authentication types
    ├── commands.ts       # Command-related types
    ├── tags.ts           # Tag types
    ├── common.ts         # Common utility types
    ├── store.ts          # Store types
    └── index.ts          # Type exports
```

## Features

### Authentication
- User registration and login
- JWT token management with automatic refresh
- Protected routes and components
- Form validation based on API specifications

### Command Management
- Search system commands
- Create, view, and search user command snippets
- Tag-based organization
- Pagination support

### State Management
- Zustand store for global state
- Separate slices for auth and commands
- Type-safe actions and state

### API Integration
- Axios-based HTTP client
- Automatic token refresh
- Error handling and interceptors
- Service layer abstraction

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running (default: http://localhost:3001)

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Development
```bash
npm run dev
```

## Usage Examples

### Authentication
```typescript
import { useAuth } from '@/lib/hooks';

const { login, register, logout, isAuthenticated, user } = useAuth();

// Login
const handleLogin = async () => {
  const result = await login({ email: 'user@example.com', password: 'Password123!' });
  if (result.success) {
    // Redirect or update UI
  }
};
```

### Commands
```typescript
import { useCommands } from '@/lib/hooks';

const { 
  searchSystemCommands, 
  getUserCommands, 
  createUserCommand,
  systemCommands,
  userCommands 
} = useCommands();

// Search system commands
await searchSystemCommands('git');

// Create user command
await createUserCommand({
  command: 'git',
  arguments: 'commit -m "Initial commit"',
  note: { description: 'Git commit with message' },
  tags: ['git', 'version-control']
});
```

### Validation
```typescript
import { validation } from '@/lib/utils';

// Validate email
const isValid = validation.isValidEmail('user@example.com');

// Validate password
const isStrongPassword = validation.isValidPassword('StrongP@ss123');
```

## API Endpoints

The frontend integrates with the following backend endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Token refresh
- `GET /command` - Search system commands
- `GET /usercommand` - Get user commands
- `POST /usercommand` - Create user command
- `GET /usercommand/search` - Search user commands

## Type Safety

All API interactions are fully typed based on the OpenAPI specification. The types are organized by domain:

- `auth.ts` - Authentication-related types
- `commands.ts` - Command and user command types
- `tags.ts` - Tag management types
- `common.ts` - Shared utility types
- `store.ts` - Zustand store types

## Contributing

1. Follow the existing directory structure
2. Use TypeScript for all new code
3. Add proper type definitions
4. Use the established patterns for API calls and state management
5. Follow the validation patterns from the API specification

## License

MIT
