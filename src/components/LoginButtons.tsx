"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAegis } from "@cavos/aegis";

interface LoginButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const LoginButton = ({
  onClick,
  children,
  className = "",
}: LoginButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full max-w-sm py-4 px-6 rounded-lg font-medium transition-colors duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export const LoginButtons = () => {
  const router = useRouter();
  const { aegisAccount, currentAddress } = useAegis();

  const handleInApp = async () => {
    try {
      console.log("In-app login clicked");

      if (!aegisAccount) {
        alert("Aegis SDK not initialized");
        return;
      }

      // Deploy new wallet (following mobile pattern)
      console.log("Deploying new in-app wallet...");
      const privateKey = await aegisAccount.deployAccount();
      console.log("New wallet deployed:", privateKey);

      // Connect the deployed wallet (like mobile does)
      console.log("Connecting to deployed wallet...");
      await aegisAccount.connectAccount(privateKey);
      console.log("Wallet connected successfully");

      // Save private key securely (like SecureStore in mobile)
      localStorage.setItem("inAppPrivateKey", privateKey);
      localStorage.setItem("loginMethod", "In-App");

      // Get wallet address from SDK (like mobile does with aegisAccount.address)
      const walletAddress = aegisAccount.address;
      if (walletAddress) {
        localStorage.setItem("walletAddress", walletAddress);
        console.log("📍 Wallet address saved:", walletAddress);
      } else {
        console.warn("⚠️ No wallet address available from SDK");
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("In-app wallet deployment failed:", error);
      alert(
        `Failed to create wallet: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleEmailPassword = () => {
    router.push("/auth");
  };

  const handleApple = async () => {
    try {
      console.log("Apple login clicked");

      if (!aegisAccount) {
        alert("Aegis SDK not initialized");
        return;
      }

      // Get the current origin for the redirect URL - redirect directly to dashboard
      const redirectUrl = `${window.location.origin}/dashboard`;

      // Get Apple OAuth URL
      const oauthUrl = await aegisAccount.getAppleOAuthUrl(redirectUrl);
      console.log("Apple OAuth URL:", oauthUrl);

      // Instead of popup, redirect the current window to OAuth
      // This ensures the callback page will be loaded properly
      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Apple login failed:", error);
      alert(
        `Apple login failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleGoogle = async () => {
    try {
      console.log("Google login clicked");

      if (!aegisAccount) {
        alert("Aegis SDK not initialized");
        return;
      }

      // Get the current origin for the redirect URL - redirect directly to dashboard
      const redirectUrl = `${window.location.origin}/dashboard`;

      // Get Google OAuth URL
      const oauthUrl = await aegisAccount.getGoogleOAuthUrl(redirectUrl);
      console.log("Google OAuth URL:", oauthUrl);

      // Instead of popup, redirect the current window to OAuth
      // This ensures the callback page will be loaded properly
      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Google login failed:", error);
      alert(
        `Google login failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      {/* In-App Button (Blue) */}
      <LoginButton
        onClick={handleInApp}
        className="bg-[#4263EB] hover:bg-[#3B5AE0] text-white"
      >
        In-App
      </LoginButton>

      {/* Email/Password Button */}
      <LoginButton
        onClick={handleEmailPassword}
        className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
      >
        Login with Email/Password
      </LoginButton>

      {/* Apple Sign-In Button */}
      <LoginButton
        onClick={handleApple}
        className="bg-black hover:bg-gray-900 text-white border border-gray-600 flex items-center justify-center gap-3"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.03 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.96-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.03-3.11z" />
        </svg>
        Sign in with Apple
      </LoginButton>

      {/* Google Sign-In Button */}
      <LoginButton
        onClick={handleGoogle}
        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center gap-3"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </LoginButton>
    </div>
  );
};
