# Stefan's Development Guide & Project Standards

This guide contains comprehensive development standards, project structure patterns, tooling configurations, and coding guidelines for building TypeScript projects.

## Project Philosophy

### Core Principles

- **YAGNI (You Aren't Gonna Need It)** - Only add functionality when actually needed
- **KISS (Keep It Simple, Stupid)** - Prefer simple, obvious solutions
- **Component-Based Architecture** - Clear separation of concerns with composable components
- **Event-Driven Communication** - Decoupled communication between systems
- **Modular Design** - Independent, testable, self-contained modules
- **Iterative Development** - Small, focused changes with regular review

### Development Workflow

- Develop in **small iterations** to allow time for review and git commits
- **Write tests before implementation** (TDD approach)
- **Propose solutions and present options** before implementation
- Only do what's asked - make suggestions afterward without causing changes
- Inspect actual code rather than speculate when diagnosing issues

## Project Structure

### Module Organization Pattern

Each module follows this self-contained pattern:

```bash
/ModuleName/
  ModuleName.ts              # Main implementation
  ModuleName.test.ts         # Unit tests
  helperFunction.ts          # Module-specific utilities (only used by this module)
  helperFunction.test.ts     # Tests for helper functions
  ChildModule.ts             # Child dependencies of ModuleName
  ChildModule.test.ts        # Tests for child dependencies
```

**Example:**

```bash
/UserAccount/
  UserAccount.ts
  UserAccount.test.ts
  calculateSomething.ts      # Only used by UserAccount.ts
  calculateSomething.test.ts
  UserAccountBalance.ts      # Child dependency of UserAccount
  UserAccountBalance.test.ts
```

### File Organization Rules

- **One class/component per file** with matching filename
- **Keep files under 300 lines** for maintainability
- **Private methods at the end** of each file
- **Tests co-located** with source code using `.test.ts` extension
- **Documentation in `/docs` directory**

### Directory Structure Examples

#### Full-Stack Application (Monorepo)

```bash
project-root/
├── backend/               # API Server
│   ├── src/
│   │   ├── controllers/  # API route handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Data models
│   │   ├── middleware/   # Express middleware
│   │   └── utils/        # Server utilities
│   ├── package.json
│   └── tsconfig.json
├── frontend/              # Web UI (React/Vue/Solid)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application pages/screens
│   │   ├── hooks/        # Custom hooks (React)
│   │   ├── services/     # API client services
│   │   └── utils/        # Client utilities
│   ├── package.json
│   └── tsconfig.json
├── shared/                # Shared models and utilities
│   ├── models/           # Common data models
│   └── utils/            # Utilities used by both frontend and backend
├── docs/                  # All documentation
├── CLAUDE.md             # AI assistant guidance
└── DEVELOPMENT_GUIDE.md  # This file
```

#### Single Application Structure

```bash
src/
├── api/                  # Backend API code
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── models/          # Data models
│   └── middleware/      # API middleware
├── client/               # Frontend code
│   ├── components/      # UI components
│   ├── pages/           # Application pages
│   ├── hooks/           # Custom hooks
│   └── services/        # API client
├── shared/               # Shared code
│   ├── models/          # Data models
│   └── utils/           # Common utilities
└── tests/                # Integration tests
```

## TypeScript Configuration

### Recommended tsconfig.json

```jsonc
{
    "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "module": "ESNext",
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "skipLibCheck": true,
        
        /* Bundler mode */
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "allowJs": true,
        "isolatedModules": true,
        "moduleDetection": "force",
        "noEmit": true,
        
        /* Strict Type Checking */
        "strict": true,
        "strictNullChecks": true,
        "noUncheckedIndexedAccess": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "noUncheckedSideEffectImports": true
    },
    "include": ["src/**/*"],
    "exclude": ["dist", "node_modules"]
}
```

### TypeScript Usage Guidelines

```typescript
// ✅ DO: Let TypeScript infer types when obvious
const user = new User(config);
const double = (n: number) => n * 2;

// ✅ DO: Explicitly type complex objects and function parameters
interface ApiConfig {
    baseUrl: string;
    timeout: number;
    retries: number;
}

function processRequest(
    endpoint: string,
    data: RequestData,
    options: RequestOptions
) {
    // Implementation
}

// ❌ DON'T: Add unnecessary return type annotations
function getName(): string {  // Bad
    return this.name;
}

function getName() {  // Good
    return this.name;
}

// ✅ DO: Export at definition
export class MyClass { }
export enum MyEnum { }

// ❌ DON'T: Separate export statements
class MyClass { }
export { MyClass };  // Bad

// ❌ NEVER: Use these in production code
let data: any;                    // Avoid 'any'
const result = data as string;    // Avoid 'as' assertions
const value = data!;              // Avoid '!' non-null assertions

// ✅ DO: Define types with classes when they represent behavior
export class User {
    constructor(
        public id: string,
        public email: string,
        public name: string
    ) {}
}

// ✅ DO: Use interfaces for data models
export interface UserCreateRequest {
    email: string;
    password: string;
    name: string;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}
```

## ESLint Configuration

### Complete eslint.config.js

```javascript
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { 
        ignores: [
            "dist", 
            "node_modules", 
            "eslint.config.js", 
            "vite.config.ts", 
            "jest.config.js"
        ] 
    },
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    stylistic.configs.recommended,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            // Stylistic rules
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/indent': ['error', 4],
            '@typescript-eslint/naming-convention': 'error',
            '@stylistic/member-delimiter-style': ['error', {
                multiline: { delimiter: 'semi', requireLast: true },
                singleline: { delimiter: 'semi', requireLast: false },
            }],
            'import/no-default-export': 'error',

            // Developer Experience
            '@typescript-eslint/restrict-template-expressions': [
                'error', 
                { allowNumber: true, allowNever: true, allowNullish: true, allowAny: true }
            ],
            '@typescript-eslint/require-await': 'off',

            // Disable rules already checked by TypeScript
            '@typescript-eslint/no-undef': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-dupe-class-members': 'off',
            '@typescript-eslint/no-redeclare': 'off',
            '@typescript-eslint/no-loss-of-precision': 'off',
        }
    },
    {
        // Test file specific rules
        files: ['**/*.test.ts', '**/*.spec.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-confusing-void-expression': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-empty-function': 'off',
        },
    }
);
```

## Package.json Scripts

### Recommended scripts for different project types

#### Node.js/TypeScript Backend

```jsonc
{
    "scripts": {
        "dev": "tsx watch src/index.ts",
        "build": "npm run lint && tsc",
        "start": "tsx src/index.ts",
        "lint": "eslint .",
        "test": "vitest",
        "test:watch": "vitest --watch",
        "test:coverage": "vitest --coverage"
    }
}
```

#### Frontend App (with Vite)

```jsonc
{
    "scripts": {
        "start": "npm-run-all --parallel start:*",
        "start:client": "vite",
        "start:server": "tsx watch src/server.ts",
        "dev": "vite",
        "build": "npm run lint && tsc && vite build",
        "lint": "eslint .",
        "test": "vitest",
        "test:watch": "vitest --watch",
        "test:coverage": "vitest --coverage"
    }
}
```

## Testing Strategy

### Testing Philosophy

- **Test behavior, not implementation**
- **Focus on public APIs** - don't test private methods
- **Keep tests close to the code** they test
- **Use realistic test scenarios**
- **Maintain test independence**

### Unit Test Responsibilities

Unit tests should focus on component behavior, logic, and integration - NOT visual appearance or specific content. This separation ensures maintainable tests that don't break when content or styling changes.

#### What Unit Tests SHOULD Test:

##### Component Behavior & Logic
- State changes and updates
- Event handling and user interactions
- Conditional rendering logic
- Component lifecycle behavior
- Error boundary functionality

##### Props Handling & Integration
- Required vs optional props
- Props validation and type safety
- Default prop values
- Props passing to child components
- Custom className handling

##### Accessibility & Semantic Structure
- ARIA labels and roles
- Keyboard navigation support
- Semantic HTML structure (headings, lists, sections)
- Focus management
- Screen reader compatibility

##### Edge Cases & Error Handling
- Empty or missing data states
- Null/undefined prop handling
- Loading and error states
- Boundary conditions (min/max values)
- Network failure scenarios

##### Data Flow & Integration
- API integration behavior
- State management integration
- Context provider/consumer behavior
- Custom hooks functionality
- Component composition patterns

#### What Unit Tests SHOULD NOT Test:

##### Visual Appearance & Styling
```typescript
// ❌ DON'T: Test specific styling or visual appearance
expect(button).toHaveClass('bg-blue-500 text-white rounded-lg');
expect(element).toHaveStyle('color: rgb(59, 130, 246)');

// ✅ DO: Test behavioral aspects of styling
expect(button).toHaveAttribute('disabled');
expect(element).toHaveClass('sr-only'); // For accessibility
```

##### Specific Text Content
```typescript
// ❌ DON'T: Test exact text content
expect(screen.getByText('Welcome to Our Amazing Platform')).toBeInTheDocument();
expect(element).toHaveTextContent('Click here to get started today!');

// ✅ DO: Test that content exists and has proper structure
expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
expect(element.textContent?.trim().length).toBeGreaterThan(0);
```

##### Layout & Responsive Design
```typescript
// ❌ DON'T: Test specific CSS classes for layout
expect(container).toHaveClass('grid-cols-3 gap-4 px-6 py-8');

// ✅ DO: Test that layout containers exist
expect(document.querySelector('.grid')).toBeInTheDocument();
expect(container).toHaveClass('responsive-container');
```

##### Design System Compliance
```typescript
// ❌ DON'T: Test specific design token values
expect(button).toHaveClass('text-action bg-primary border-secondary');

// ✅ DO: Test that design system components are used
expect(screen.getByTestId('design-system-button')).toBeInTheDocument();
```

#### Testing Strategy by Component Type

##### UI Components (Buttons, Cards, Badges)
- Focus on props handling and variants
- Test interactive states (disabled, loading)
- Verify accessibility attributes
- Test custom event handlers

##### Layout Components (Header, Footer, Sections)
- Test navigation behavior
- Verify semantic structure
- Test responsive container logic
- Check accessibility landmarks

##### Content Components (Blog, Portfolio Items)
- Test data rendering logic
- Verify link generation
- Test empty/loading states
- Check content structure

##### Form Components
- Test validation logic
- Verify form submission behavior
- Test error handling
- Check accessibility attributes

#### Visual Testing Responsibility

Visual aspects should be tested through:
- **Storybook Stories** - Component variations and states
- **Chromatic** - Visual regression testing
- **Manual Testing** - Cross-browser compatibility
- **Design System Tools** - Consistency validation

This separation ensures:
- **Maintainable tests** that don't break with content changes
- **Faster test execution** without visual rendering overhead
- **Clear responsibilities** between different testing approaches
- **Better developer experience** with focused, reliable tests

### Test Structure Pattern

```typescript
// ✅ DO: Test behavior with clear arrange-act-assert
describe('UserService', () => {
    it('should create user with hashed password', async () => {
        // Arrange
        const userData = {
            email: 'test@example.com',
            password: 'plaintext123'
        };
        const userService = new UserService();
        
        // Act
        const result = await userService.createUser(userData);
        
        // Assert
        expect(result.email).toBe(userData.email);
        expect(result.password).not.toBe(userData.password); // Should be hashed
        expect(result.id).toBeDefined();
    });
});

// ❌ DON'T: Test private methods or implementation details
describe('UserService', () => {
    it('should call internal hash method', () => {
        // Bad - testing private implementation
        const userService = new UserService();
        spyOn(userService as any, 'hashPassword');
        userService.createUser({ email: 'test@test.com', password: '123' });
        expect((userService as any).hashPassword).toHaveBeenCalled();
    });
});
```

### Test Coverage Guidelines

- Cover all files with tests
- Test **behavior and business logic** only
- **Don't test implementation details**
- Focus on critical paths and edge cases
- Aim for high coverage of business logic, not 100% coverage

### Vitest Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: [{
            test: {
                name: 'Client Side',
                environment: 'jsdom',
                root: './src',
                include: ['client/**/*.test.ts'],
                exclude: [],
            },
        }, {
            test: {
                name: 'Server Side',
                environment: 'node',
                root: './src',
                exclude: ['client/**/*.test.ts'],
            },
        }],
    },
});
```

## Coding Standards

### State Management

```typescript
// ❌ DON'T: Modify state directly
class User {
    balance = 100;
    
    purchase(amount: number) {
        this.balance -= amount; // Direct state modification
    }
}

// ✅ DO: Use methods for state changes and log them
class User {
    private balance = 100;
    
    /**
     * Processes a purchase and updates the user's balance.
     * Logs the transaction for audit trail and debugging.
     */
    purchase(amount: number) {
        const oldBalance = this.balance;
        this.balance = Math.max(0, this.balance - amount);
        
        logger.debug('User purchase processed', { 
            userId: this.id, 
            amount,
            oldBalance,
            newBalance: this.balance 
        });
    }
    
    getBalance() {
        return this.balance;
    }
}
```

### Method Documentation

```typescript
/**
 * Handles user authentication and session management.
 * Provides secure login, logout, and token refresh capabilities.
 */
export class AuthService {
    /**
     * Authenticates a user with email and password.
     * Creates a new session and returns authentication tokens.
     * 
     * @param email - User's email address
     * @param password - User's plain text password
     * @param rememberMe - Whether to create a long-lived session
     * @returns Authentication result with tokens and user data
     */
    async login(
        email: string, 
        password: string, 
        rememberMe: boolean = false
    ): Promise<AuthResult> {
        // Implementation
    }
    
    // Private methods at the end of the file
    private async hashPassword(password: string): Promise<string> {
        // Implementation
    }
}
```

### Performance Patterns

```typescript
// ✅ DO: Batch processing for large datasets
function processUsers(users: User[]) {
    // Process 1000 users at a time
    for (let i = 0; i < users.length; i += 1000) {
        const batch = users.slice(i, i + 1000);
        processBatch(batch);
    }
}

// ✅ DO: Use caching for expensive operations
class ApiService {
    private cache = new Map<string, any>();
    
    async getData(key: string) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        
        const data = await this.fetchFromApi(key);
        this.cache.set(key, data);
        return data;
    }
}

// ✅ DO: Clean up resources properly
class DatabaseConnection {
    dispose() {
        this.connection?.close();
        this.connectionPool?.drain();
        this.eventListeners.clear();
    }
}
```

## Dependency Management

### Recommended Dev Dependencies

```jsonc
{
    "devDependencies": {
        "@eslint/js": "^9.21.0",
        "@stylistic/eslint-plugin": "^5.2.0",
        "@types/node": "^20.0.0",
        "eslint": "^9.21.0",
        "eslint-plugin-import": "^2.32.0",
        "tsx": "^4.20.3",
        "typescript": "~5.7.3",
        "typescript-eslint": "^8.25.0",
        "vite": "^6.2.0",
        "vitest": "^3.2.4",
        "jsdom": "^26.1.0"
    }
}
```

### Running TypeScript

- **Use `npx tsx script.ts`** instead of `npx ts-node` or building first
- tsx handles TypeScript execution more reliably

## Project Setup Checklist

When starting a new project, ensure:

- [ ] Project structure follows modular pattern
- [ ] TypeScript configured with strict settings
- [ ] ESLint configured with stylistic and import rules
- [ ] Test framework set up (Vitest recommended)
- [ ] Build scripts include linting
- [ ] Documentation directory created (`/docs`)
- [ ] CLAUDE.md file for AI assistant guidance
- [ ] Git ignores include `dist/`, `node_modules/`
- [ ] Package.json type set to "module"

## Key Anti-Patterns to Avoid

### ❌ Don't Do These

```typescript
// Don't create types.ts files
// Don't use getter/setter boilerplate unless needed
class User {
    private _email: string;
    
    get email() { return this._email; }  // Unnecessary
    set email(value) { this._email = value; }  // Unnecessary
}

// Don't create proxy methods to dependencies
class UserService {
    private logger: Logger;
    
    log(message: string) {  // Unnecessary proxy
        this.logger.log(message);
    }
}

// Don't do semantic testing - test behavior instead
it('should call internal validation method', () => {
    // Bad - testing implementation
    const userService = new UserService();
    spyOn(userService as any, 'validateEmail');
    userService.createUser({ email: 'test@test.com' });
    expect((userService as any).validateEmail).toHaveBeenCalled();
});

// Don't add unnecessary type annotations
function getUserName(): string {  // TypeScript can infer this
    return this.name;
}

// Don't use any, as, or ! in production code
const data: any = response;
const name = data as string;
const value = nullable!;

// Don't create generic types/ folders - put types with classes or make them models
// Bad
/types/User.ts           // Generic types folder
/types/ApiResponse.ts

// Good  
/User/User.ts            // Type with class
/models/UserModel.ts     // Standalone data model
```

### ✅ Do These Instead

```typescript
// Use direct property access
class User {
    email: string;  // Simple and direct
    balance: number = 0;
}

// Use dependencies directly
class UserService {
    constructor(private logger: Logger) {}
    
    createUser(userData: UserData) {
        this.logger.log('User created');  // Direct usage
        // Implementation
    }
}

// Test behavior and outcomes
it('should create user with valid email', async () => {
    // Good - testing behavior
    const userData = { email: 'test@example.com', password: '123' };
    const result = await userService.createUser(userData);
    expect(result.email).toBe('test@example.com');
    expect(result.id).toBeDefined();
});

// Let TypeScript infer return types
function getUserEmail() {  // TypeScript infers string return type
    return this.email;
}

// Use proper typing without assertions
interface ApiResponse {
    user: User;
    token: string;
}
const response: ApiResponse = await api.login();
const user = response.user;  // Type-safe access

// Organize types correctly
// Good: Types with behavior as classes
export class User {
    constructor(public id: string, public email: string) {}
    
    updateEmail(newEmail: string) {
        this.email = newEmail;
    }
}

// Good: Data models as interfaces in models/ folder
export interface UserCreateRequest {
    email: string;
    password: string;
}
```

## Architecture Patterns

### Event-Driven Communication

```typescript
// Use EventBus for decoupled communication
export class EventBus {
    private listeners = new Map<string, Function[]>();
    
    emit(event: string, data: any) {
        const handlers = this.listeners.get(event) || [];
        handlers.forEach(handler => handler(data));
    }
    
    on(event: string, handler: Function) {
        const handlers = this.listeners.get(event) || [];
        handlers.push(handler);
        this.listeners.set(event, handlers);
    }
}

// Components communicate through events
class UserService {
    constructor(private eventBus: EventBus) {}
    
    async createUser(userData: UserData) {
        const user = await this.saveUser(userData);
        this.eventBus.emit('user:created', { 
            userId: user.id, 
            email: user.email 
        });
        return user;
    }
}

// Other services listen to events
class EmailService {
    constructor(eventBus: EventBus) {
        eventBus.on('user:created', this.sendWelcomeEmail.bind(this));
    }
    
    private sendWelcomeEmail(data: { userId: string; email: string }) {
        // Send welcome email
    }
}
```

### React Component Standards

```typescript
// ✅ DO: Use arrow functions for React components
import React, { FC } from 'react';

interface Props {
    title: string;
    onAction?: () => void;
    children?: React.ReactNode;
}

export const MyComponent: FC<Props> = ({ title, onAction, children }) => {
    return (
        <div>
            <h1>{title}</h1>
            {children}
        </div>
    );
};

// ✅ DO: Use simple Props interface name
interface Props {
    user: User;
    isLoading?: boolean;
}

export const UserCard: FC<Props> = ({ user, isLoading = false }) => {
    if (isLoading) return <div>Loading...</div>;
    
    return (
        <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
};

// ❌ DON'T: Use function declarations for React components
export function MyComponent({ title }: { title: string }) {
    return <div>{title}</div>;
}

// ❌ DON'T: Use verbose interface names
interface MyComponentProps {
    title: string;
}

// ❌ DON'T: Export interfaces unless needed elsewhere
export interface Props {
    title: string;
}
```

### Component-Based Design

```typescript
// Break down complex entities into focused components
export class User {
    readonly profile: UserProfile;         // Personal information
    readonly auth: AuthComponent;          // Authentication
    readonly preferences: UserPreferences; // User settings
    readonly subscription: SubscriptionComponent; // Payment/billing
    readonly activity: ActivityTracker;    // Usage tracking
    
    constructor(config: UserConfig) {
        this.profile = new UserProfile(config.profile);
        this.auth = new AuthComponent(config.auth);
        this.preferences = new UserPreferences(config.preferences);
        this.subscription = new SubscriptionComponent(config.subscription);
        this.activity = new ActivityTracker(config.activity);
    }
}

// Each component handles its own concerns
class UserProfile {
    constructor(private data: ProfileData) {}
    
    updateEmail(email: string) {
        this.data.email = email;
        // Validation and persistence logic
    }
    
    updateName(firstName: string, lastName: string) {
        this.data.firstName = firstName;
        this.data.lastName = lastName;
    }
}
```

This development guide ensures consistent, maintainable, and performant code across all projects while maintaining simplicity and clarity.
