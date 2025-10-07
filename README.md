# Aegis SDK Web Example

## Overview

This is a Next.js web application that demonstrates how to integrate the **Aegis SDK** for Starknet wallet authentication. The application provides a simple interface for users to:

- Create new accounts with email and password
- Sign in with existing credentials
- Connect to Starknet wallets
- Manage wallet addresses and authentication state

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Aegis App ID from [https://aegis.cavos.xyz](https://aegis.cavos.xyz)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure your App ID**

   - Visit [https://aegis.cavos.xyz](https://aegis.cavos.xyz) to get your App ID
   - Create a `.env.local` file in the project root
   - Add your App ID:
     ```
     NEXT_PUBLIC_AEGIS_APP_ID=your-app-id-here
     ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

### Currently Implemented

- **Email/Password Registration**: Create new user accounts
- **Email/Password Login**: Sign in with existing credentials
- **Wallet Connection**: Connect to Starknet wallets
- **Session Management**: Sign out and manage authentication state
- **Responsive Design**: Works on desktop and mobile devices

### Ready for Integration

- Apple Sign-In authentication
- Google Sign-In authentication
- In-app wallet functionality

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # AegisProvider configuration
│   ├── page.tsx            # Main landing page
│   ├── auth/
│   │   └── page.tsx        # Authentication page
│   └── dashboard/
│       └── page.tsx        # Dashboard after login
├── components/
│   ├── LoginButtons.tsx   # Authentication buttons
│   └── AegisClientProvider.tsx # SDK provider setup
└── config/
    └── aegis.ts            # SDK configuration
```

## SDK Integration

### Basic Usage

```typescript
import { useAegis } from "@cavos/aegis";

const { signIn, signUp, signOut, isConnected, currentAddress } = useAegis();

// Register new user
const walletData = await signUp(email, password);

// Sign in existing user
const walletData = await signIn(email, password);

// Sign out
await signOut();
```

### Configuration

The SDK is configured in `src/config/aegis.ts`:

```typescript
export const aegisConfig = {
  network: "SN_SEPOLIA", // Starknet Sepolia testnet
  appName: "Aegis SDK Example",
  appId: process.env.NEXT_PUBLIC_AEGIS_APP_ID,
  walletMode: "social-login",
  enableLogging: true,
};
```

## Pages

- **`/`** - Landing page with authentication options
- **`/auth`** - Email/password authentication forms
- **`/dashboard`** - Main application interface after login

## Styling

The application uses Tailwind CSS with a dark theme:

- Background: Black (`bg-black`)
- Primary Color: Blue (`#4263EB`)
- Text: White and gray variants
- Form Fields: Dark gray with blue focus states

## Troubleshooting

### Common Issues

**"App ID not found"**

- Ensure `NEXT_PUBLIC_AEGIS_APP_ID` is set in your `.env.local` file
- Verify your App ID is correct at [https://aegis.cavos.xyz](https://aegis.cavos.xyz)

**Application not working**

- Check that your App ID is valid
- Verify internet connection
- Check browser console (F12) for error messages

**Network errors**

- Ensure you're using the correct network format (`SN_SEPOLIA`)
- Verify your App ID has the correct permissions

### Debug Mode

Enable detailed logging by setting `enableLogging: true` in the configuration. This will display comprehensive logs in the browser console.

## Development

### Key Features

- **Client Components**: Uses `"use client"` directive for interactivity
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Visual feedback during authentication processes
- **Form Validation**: Client-side validation for improved user experience
- **Responsive Design**: Mobile-first approach with desktop optimization

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Documentation

- [Aegis SDK Documentation](https://www.npmjs.com/package/@cavos/aegis)
- [Aegis Platform](https://aegis.cavos.xyz)
- [Starknet Documentation](https://docs.starknet.io/)
- [Next.js Documentation](https://nextjs.org/docs)

## Support

For issues related to the Aegis SDK, please refer to the official documentation or contact the Aegis development team.
