# Aegis SDK Integration Setup

## 🚀 Quick Start

This project demonstrates how to integrate the Aegis SDK for email/password authentication with Starknet wallets.

## 📋 Prerequisites

1. **Get your App ID**: Visit [https://aegis.cavos.xyz](https://aegis.cavos.xyz) to get your App ID
2. **Node.js**: Version 18 or higher
3. **npm**: Package manager

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
# Aegis SDK Configuration
NEXT_PUBLIC_AEGIS_APP_ID=your-actual-app-id-here
```

### 2. Update Configuration

The SDK is configured in `src/config/aegis.ts`:

```typescript
export const aegisConfig = {
  network: "SN_SEPOLIA", // Starknet Sepolia testnet
  appName: "Aegis SDK Example",
  appId: process.env.NEXT_PUBLIC_AEGIS_APP_ID || "your-app-id",
  walletMode: "social-login",
  enableLogging: true,
};
```

## 🏃‍♂️ Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔐 Authentication Flow

### Features Implemented:

1. **Email/Password Registration**: Users can create new accounts
2. **Email/Password Login**: Existing users can sign in
3. **Error Handling**: Comprehensive error messages and loading states
4. **Responsive Design**: Works on desktop and mobile
5. **Dark Theme**: Consistent with Aegis branding

### Authentication Methods:

- ✅ **Email/Password**: Full registration and login flow
- 🔄 **In-App**: Ready for integration (button placeholder)
- 🔄 **Apple Sign-In**: Ready for integration (button placeholder)
- 🔄 **Google Sign-In**: Ready for integration (button placeholder)

## 🛠️ SDK Integration

The application uses the `@cavos/aegis` SDK with the following key components:

### AegisProvider Setup

```typescript
<AegisProvider config={aegisConfig}>{/* Your app components */}</AegisProvider>
```

### Authentication Methods

```typescript
const { signIn, signUp, signOut, isConnected, currentAddress } = useAegis();

// Register new user
const walletData = await signUp(email, password);

// Sign in existing user
const walletData = await signIn(email, password);

// Sign out
await signOut();
```

## 📱 Pages

- **`/`**: Main landing page with login options
- **`/auth`**: Email/password authentication page

## 🎨 Styling

The application uses Tailwind CSS with a dark theme:

- **Background**: Black (`bg-black`)
- **Primary Color**: Blue (`#4263EB`)
- **Text**: White and gray variants
- **Form Fields**: Dark gray with blue focus states

## 🔧 Development

### Project Structure

```
src/
├── app/
│   ├── layout.tsx          # AegisProvider setup
│   ├── page.tsx            # Main landing page
│   └── auth/
│       └── page.tsx         # Authentication page
├── components/
│   └── LoginButtons.tsx    # Login button components
└── config/
    └── aegis.ts            # SDK configuration
```

### Key Features

- **Client Components**: Uses `"use client"` directive for interactivity
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Visual feedback during authentication
- **Form Validation**: Client-side validation for better UX
- **Responsive Design**: Mobile-first approach

## 🚨 Troubleshooting

### Common Issues:

1. **"App ID not found"**: Make sure to set `NEXT_PUBLIC_AEGIS_APP_ID` in your environment
2. **Network errors**: Verify your App ID is valid and the network is accessible
3. **Type errors**: Ensure you're using the correct network format (`SN_SEPOLIA`)

### Debug Mode:

Enable logging by setting `enableLogging: true` in the config. This will show detailed logs in the browser console.

## 📚 Documentation

- [Aegis SDK NPM Package](https://www.npmjs.com/package/@cavos/aegis)
- [Aegis Platform](https://aegis.cavos.xyz)
- [Starknet Documentation](https://docs.starknet.io/)

## 🤝 Support

For issues related to the Aegis SDK, please check the official documentation or contact the Aegis team.
