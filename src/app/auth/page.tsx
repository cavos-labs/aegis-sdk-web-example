"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAegis } from "@cavos/aegis";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { signIn, signUp, error: aegisError } = useAegis();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Sign in with Aegis SDK
        const walletData = await signIn(email, password);
        console.log("Sign in successful:", walletData);

        // Save wallet address to localStorage
        if (walletData.wallet?.address) {
          localStorage.setItem("walletAddress", walletData.wallet.address);
          localStorage.setItem("userEmail", walletData.email || email);
          localStorage.setItem("loginMethod", "Email/Password");
        }

        // Redirect to dashboard after successful login
        router.push("/dashboard");
      } else {
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          setIsLoading(false);
          return;
        }
        // Sign up with Aegis SDK
        const walletData = await signUp(email, password);
        console.log("Sign up successful:", walletData);

        // Save wallet address to localStorage
        if (walletData.wallet?.address) {
          localStorage.setItem("walletAddress", walletData.wallet.address);
          localStorage.setItem("userEmail", walletData.email || email);
          localStorage.setItem("loginMethod", "Email/Password");
        }

        // Redirect to dashboard after successful registration
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);

      // Check if it's a successful registration that was incorrectly treated as an error
      if (
        error.message &&
        error.message.includes("Sign up failed: Invalid response structure")
      ) {
        // This is actually a successful registration, show success message
        setError(null);
        setSuccessMessage(
          "Registration successful! Please sign in with your credentials."
        );
        setIsLogin(true); // Switch to login mode

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(error.message || "Authentication failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back
        </Link>
      </div>

      {/* Cavos Icon */}
      <div className="mb-8">
        <div className="w-16 h-16 flex items-center justify-center">
          <Image
            src="/cavos-icon.png"
            alt="Cavos Logo"
            width={64}
            height={64}
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Auth Form */}
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-400 text-center text-sm">
            {isLogin ? "Sign in to your account" : "Sign up for a new account"}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-900/20 border border-green-500/50 rounded-lg">
            <p className="text-green-400 text-sm text-center">
              {successMessage}
            </p>
          </div>
        )}

        {/* Error Display */}
        {(error || aegisError) && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center">
              {error || aegisError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#4263EB] focus:ring-1 focus:ring-[#4263EB] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#4263EB] focus:ring-1 focus:ring-[#4263EB] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Confirm Password Field (only for register) */}
          {!isLogin && (
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full py-4 px-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#4263EB] focus:ring-1 focus:ring-[#4263EB] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4263EB] hover:bg-[#3B5AE0] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isLoading
              ? "Processing..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        {/* Toggle between Login/Register */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#4263EB] hover:text-[#3B5AE0] font-medium text-sm mt-1 transition-colors duration-200"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>

      {/* Aegis sdk example text */}
      <p className="text-gray-400 text-sm mt-8">Aegis sdk example</p>
    </div>
  );
}
