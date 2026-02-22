## ADDED Requirements

### Requirement: Email/password signup
The `/auth/signup` route SHALL render a form accepting name, email, and password. On successful submission, the user account is created and the user is signed in and redirected to the homepage or `callbackUrl`.

#### Scenario: Successful signup
- **WHEN** a user submits a valid name, email, and password (≥8 chars)
- **THEN** the account is created, the user is signed in, and they are redirected to `/`

#### Scenario: Duplicate email rejected
- **WHEN** a user submits an email already registered
- **THEN** an error message "Email already in use" is displayed and no account is created

#### Scenario: Invalid password rejected
- **WHEN** a user submits a password shorter than 8 characters
- **THEN** an inline validation error is shown and submission is prevented

### Requirement: Email/password login
The `/auth/login` route SHALL render a form accepting email and password. On success, the user is signed in and redirected. On failure, a generic error is shown.

#### Scenario: Successful login
- **WHEN** a user submits correct credentials
- **THEN** a session is created and the user is redirected to `/` or `callbackUrl`

#### Scenario: Wrong credentials rejected
- **WHEN** a user submits an unrecognized email or wrong password
- **THEN** the error "Invalid email or password" is displayed

### Requirement: Google OAuth login
Both `/auth/login` and `/auth/signup` pages SHALL display a "Continue with Google" button that initiates the Google OAuth flow via NextAuth.js.

#### Scenario: Google OAuth redirects to provider
- **WHEN** a user clicks "Continue with Google"
- **THEN** they are redirected to Google's consent screen

#### Scenario: Successful Google OAuth creates session
- **WHEN** a user completes the Google OAuth flow
- **THEN** they are signed in and redirected to `/` or `callbackUrl`

### Requirement: Session persistence
Sessions SHALL be JWT-based, persisting across page reloads within the browser session. The session SHALL expire after 30 days of inactivity.

#### Scenario: Session persists on reload
- **WHEN** an authenticated user reloads the page
- **THEN** they remain signed in

### Requirement: Navbar auth state
The navbar SHALL display the user's name/avatar and a "Sign out" button when authenticated, and "Log in" / "Sign up" links when unauthenticated.

#### Scenario: Authenticated nav state
- **WHEN** a user is signed in
- **THEN** the navbar shows their name or avatar and a sign-out option

#### Scenario: Unauthenticated nav state
- **WHEN** no session exists
- **THEN** the navbar shows "Log in" and "Sign up" links

### Requirement: Sign-out
The user SHALL be able to sign out from the navbar. After sign-out, any attempt to access `/ai` SHALL redirect to `/auth/login`.

#### Scenario: Sign-out clears session
- **WHEN** a user clicks "Sign out"
- **THEN** the session is destroyed and the navbar reverts to unauthenticated state

### Requirement: Middleware-enforced route protection
Next.js middleware SHALL intercept requests to `/ai` (and any other protected paths) and redirect unauthenticated users to `/auth/login?callbackUrl=<requested-path>`. This check SHALL happen at the edge, before any page renders.

#### Scenario: Middleware redirects unauthenticated request
- **WHEN** an unauthenticated request is made to `/ai`
- **THEN** middleware redirects it to `/auth/login?callbackUrl=/ai` before the page renders

#### Scenario: Middleware allows authenticated request
- **WHEN** an authenticated request with a valid session token is made to `/ai`
- **THEN** middleware allows the request to pass through to the page
