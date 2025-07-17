# Michael's Guestlist

A secure Next.js application with Firebase authentication and Firestore database for managing guest lists and networking contacts.

## Features

- 🔐 **Secure Authentication**: Firebase Authentication with email/password
- 🗄️ **Firestore Database**: Real-time data storage with security rules
- 🛡️ **Protected Routes**: Server-side and client-side route protection
- 📱 **Responsive Design**: Modern UI with Tailwind CSS
- 🔒 **Security First**: Server-side token verification and proper access controls

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Deployment**: Vercel (recommended)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd Guestlist
pnpm install
```

### 2. Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database

2. **Get Firebase Config**:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click the web icon (</>) to add a web app
   - Copy the config object

3. **Set up Admin SDK**:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

### 3. Environment Variables

Copy `env.example` to `.env.local` and fill in your Firebase configuration:

```bash
cp env.example .env.local
```

Required variables:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:9002
NOTIFICATION_EMAIL=your_admin_email@example.com
```

### 4. Deploy Firestore Rules

```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules
```

### 5. Run the Application

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Security Features

### Authentication
- Firebase Authentication with email/password
- Server-side token verification
- Protected routes with automatic redirects
- Admin-only access controls

### Database Security
- Firestore security rules
- Server-side validation
- Client-side data sanitization
- Rate limiting on API routes

### Environment Security
- Environment variables for sensitive data
- No hardcoded secrets
- Proper CORS configuration
- HTTPS enforcement in production

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard
│   ├── login/            # Authentication pages
│   └── signup/
├── components/            # Reusable components
│   ├── ui/               # Radix UI components
│   └── protected-route.tsx
├── context/              # React contexts
│   └── auth-context.tsx
├── hooks/                # Custom hooks
│   └── use-api.ts
├── lib/                  # Utilities and config
│   ├── firebase.ts       # Firebase config
│   ├── firestore.ts      # Database operations
│   ├── auth-middleware.ts # Server-side auth
│   └── types.ts          # TypeScript types
```

## API Routes

### Authentication
- `GET /api/auth/verify` - Verify user token

### Guest Management
- `GET /api/guests` - Get all guests (admin only)
- `POST /api/guests` - Add new guest
- `PUT /api/guests/[id]` - Update guest (admin only)
- `DELETE /api/guests/[id]` - Delete guest (admin only)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
NOTIFICATION_EMAIL=your_admin_email@example.com
```

## Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript check
```

### Firebase Emulators

For local development with Firebase emulators:

```bash
# Start Firebase emulators
firebase emulators:start

# Set environment variable
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
# GuestList
