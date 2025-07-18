# Clerk Authentication Setup

This app now includes Clerk authentication to protect portfolio downloads. Here's how to set it up:

## 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose "Next.js" as your framework

## 2. Get Your API Keys

1. In your Clerk dashboard, go to "API Keys"
2. Copy your **Publishable Key** and **Secret Key**

## 3. Configure Google OAuth (Required for Google Sign-in)

1. In your Clerk dashboard, go to "User & Authentication" → "Social Connections"
2. Click on "Google" to enable it
3. You'll need to create a Google OAuth application:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `https://clerk.your-app.com/v1/oauth_callback`
     - `http://localhost:3000/v1/oauth_callback` (for development)
   - Copy the Client ID and Client Secret
4. Back in Clerk, paste your Google Client ID and Client Secret
5. Save the configuration

## 4. Configure Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key-here
CLERK_SECRET_KEY=sk_test_your-secret-key-here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 5. Add Your Portfolio File

Replace the placeholder file at `public/portfolio.pdf` with your actual portfolio PDF.

## 6. Customize the App

- Update the title and description in `src/app/layout.tsx`
- Modify the dashboard content in `src/app/dashboard/page.tsx`
- Customize the public profile in `src/components/public-profile-client.tsx`

## 7. Test the Authentication

1. Start your development server: `pnpm dev`
2. Visit your app - you should see "Sign In" and "Sign Up" buttons
3. Create an account or sign in
4. You'll be redirected to the dashboard where you can download your portfolio

## Features

- ✅ User authentication with Clerk
- ✅ Google OAuth sign-in
- ✅ Protected portfolio download
- ✅ Responsive design with dark theme
- ✅ Sign in/Sign up pages
- ✅ Dashboard for authenticated users
- ✅ Automatic redirects

## Security

- The `/dashboard` route is protected and requires authentication
- Users must sign in to access the portfolio download
- All authentication is handled securely by Clerk
