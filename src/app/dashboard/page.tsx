"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAegis } from "@cavos/aegis";

export default function DashboardPage() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [ethBalance, setEthBalance] = useState<string>("");
  const [strkBalance, setStrkBalance] = useState<string>("");
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [isLoadingStrkBalance, setIsLoadingStrkBalance] =
    useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [lastTransactionHash, setLastTransactionHash] = useState<string>("");
  const [isProcessingOAuth, setIsProcessingOAuth] = useState<boolean>(false);
  const [loginMethod, setLoginMethod] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);
  const { signOut, isConnected, currentAddress, aegisAccount } = useAegis();

  useEffect(() => {
    // Set client state to avoid hydration mismatch
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if this is an OAuth callback by looking for OAuth parameters in URL
      const urlParams = new URLSearchParams(window.location.search);
      const hasOAuthParams =
        urlParams.has("code") ||
        urlParams.has("state") ||
        urlParams.has("error") ||
        urlParams.has("user_data");

      console.log("🔍 Checking for OAuth params...");
      console.log("🔍 URL params:", Object.fromEntries(urlParams.entries()));
      console.log("🔍 hasOAuthParams:", hasOAuthParams);
      console.log("🔍 aegisAccount available:", !!aegisAccount);

      if (hasOAuthParams && aegisAccount) {
        console.log("🚀 OAuth callback detected on dashboard");
        console.log("📍 Current URL:", window.location.href);
        console.log("🔍 URL search params:", window.location.search);

        setIsProcessingOAuth(true);

        try {
          // Get the current URL with all parameters
          const currentUrl = window.location.href;
          console.log("🔗 OAuth callback URL:", currentUrl);

          // Handle the OAuth callback
          console.log("🔄 Processing OAuth callback...");
          await aegisAccount.handleOAuthCallback(currentUrl);
          console.log("✅ OAuth callback completed successfully");

          // Get the social wallet data from the SDK
          console.log("📊 Getting social wallet data...");
          const socialWallet = aegisAccount.getSocialWallet();
          console.log("📊 Social wallet data:", socialWallet);

          if (!socialWallet) {
            throw new Error("Failed to get social wallet data after OAuth");
          }

          // Save wallet address and user data to localStorage
          console.log("💾 Saving data to localStorage...");
          if (socialWallet.wallet?.address) {
            localStorage.setItem("walletAddress", socialWallet.wallet.address);
            setWalletAddress(socialWallet.wallet.address);
            console.log(
              "💾 Saved wallet address:",
              socialWallet.wallet.address
            );
          }
          if (socialWallet.email) {
            localStorage.setItem("userEmail", socialWallet.email);
            setUserEmail(socialWallet.email);
            console.log("💾 Saved user email:", socialWallet.email);
          }

          // Save complete social wallet data for context restoration
          localStorage.setItem(
            "fullSocialWalletData",
            JSON.stringify(socialWallet)
          );
          console.log(
            "💾 Saved complete social wallet data for context restoration"
          );

          // Detect if this is Apple login and save the info
          if (socialWallet.email && socialWallet.email.includes("@")) {
            // Check if the user_data parameter contains Apple-specific data
            const userDataParam = urlParams.get("user_data");
            if (userDataParam) {
              try {
                const userData = JSON.parse(decodeURIComponent(userDataParam));
                if (userData.user_id && userData.user_id.startsWith("apple|")) {
                  setLoginMethod("Apple");
                  localStorage.setItem("loginMethod", "Apple");
                  console.log("🍎 Apple login detected");
                } else if (
                  userData.user_id &&
                  userData.user_id.startsWith("google")
                ) {
                  setLoginMethod("Google");
                  localStorage.setItem("loginMethod", "Google");
                  console.log("🔍 Google login detected");
                  console.log("🔍 userData.user_id:", userData.user_id);
                }
              } catch (error) {
                console.log("Could not parse user_data:", error);
              }
            }
          }

          // Clean up URL parameters
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          console.log("✅ OAuth callback processing completed");
        } catch (error) {
          console.error("❌ OAuth callback failed:", error);
          alert(
            `OAuth failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        } finally {
          setIsProcessingOAuth(false);
        }
      } else {
        console.log(
          "ℹ️ No OAuth callback detected or aegisAccount not available"
        );
        if (!hasOAuthParams) {
          console.log("ℹ️ No OAuth parameters found in URL");
        }
        if (!aegisAccount) {
          console.log("ℹ️ aegisAccount not available yet");
        }
      }
    };

    console.log("🏠 Dashboard loaded");
    console.log("🔍 isConnected:", isConnected);
    console.log("🔍 currentAddress:", currentAddress);
    console.log("🔍 aegisAccount:", aegisAccount);

    // Handle OAuth callback if needed
    handleOAuthCallback();

    // Get wallet address from localStorage or SDK
    const storedAddress = localStorage.getItem("walletAddress");
    const storedEmail = localStorage.getItem("userEmail");
    const storedLoginMethod = localStorage.getItem("loginMethod");

    console.log("💾 Stored address:", storedAddress);
    console.log("💾 Stored email:", storedEmail);
    console.log("💾 Stored login method:", storedLoginMethod);
    console.log("🔍 Current loginMethod state:", loginMethod);

    // Set login method
    if (storedLoginMethod) {
      setLoginMethod(storedLoginMethod);
      console.log("🔐 Login method restored:", storedLoginMethod);
    }

    // Auto-reconnect in-app wallet if needed (following mobile pattern)
    const reconnectInAppWallet = async () => {
      if (storedLoginMethod === "In-App" && aegisAccount) {
        const storedPrivateKey = localStorage.getItem("inAppPrivateKey");
        if (storedPrivateKey && !isConnected) {
          console.log("🔄 Auto-reconnecting in-app wallet...");
          try {
            await aegisAccount.connectAccount(storedPrivateKey);
            console.log("✅ In-app wallet reconnected successfully");

            // Update wallet address from SDK (like mobile does)
            if (aegisAccount.address) {
              setWalletAddress(aegisAccount.address);
              localStorage.setItem("walletAddress", aegisAccount.address);
              console.log("📍 Wallet address updated:", aegisAccount.address);
            }
          } catch (error) {
            console.error("❌ Failed to reconnect in-app wallet:", error);
          }
        }
      }
    };

    reconnectInAppWallet();

    if (storedAddress) {
      setWalletAddress(storedAddress);
      console.log("✅ Using stored wallet address");
    } else if (currentAddress) {
      setWalletAddress(currentAddress);
      console.log("✅ Using SDK current address");
    }

    if (storedEmail) {
      setUserEmail(storedEmail);
      console.log("✅ Using stored email");
    }

    // If we have stored data but SDK is not connected, show info
    if (storedAddress && !isConnected) {
      console.log(
        "⚠️ Stored data exists but SDK not connected - this is normal after OAuth"
      );
    }
  }, [currentAddress, isConnected, aegisAccount]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      // For in-app wallets, disconnect the account
      if (loginMethod === "In-App" && aegisAccount) {
        console.log("🔌 Disconnecting in-app wallet...");
        await aegisAccount.disconnect();
        console.log("✅ In-app wallet disconnected");
      }

      await signOut();
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("fullSocialWalletData"); // Clear full social wallet data
      localStorage.removeItem("loginMethod"); // Clear login method
      localStorage.removeItem("inAppPrivateKey"); // Clear in-app private key
      // Redirect to main page
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleGetETHBalance = async () => {
    try {
      setIsLoadingBalance(true);
      setEthBalance("");

      // Check if we have aegisAccount
      if (!aegisAccount) {
        console.error("Aegis account not available");
        setEthBalance("Error: Aegis account not available");
        return;
      }

      // Use stored address if SDK is not connected but we have stored data
      const addressToUse = isConnected ? currentAddress : walletAddress;

      if (!addressToUse) {
        console.error("No address available");
        setEthBalance("Error: No address available");
        return;
      }

      console.log("Getting ETH balance for address:", addressToUse);
      console.log("Using stored address:", !isConnected && walletAddress);

      const balance = await aegisAccount.getETHBalance();
      setEthBalance(balance);
      console.log("ETH Balance:", balance);
    } catch (error) {
      console.error("Failed to get ETH balance:", error);
      setEthBalance("Error: Failed to fetch balance");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleGetSTRKBalance = async () => {
    try {
      setIsLoadingStrkBalance(true);
      setStrkBalance("");

      // Check if we have aegisAccount
      if (!aegisAccount) {
        console.error("Aegis account not available");
        setStrkBalance("Error: Aegis account not available");
        return;
      }

      // Use stored address if SDK is not connected but we have stored data
      const addressToUse = isConnected ? currentAddress : walletAddress;

      if (!addressToUse) {
        console.error("No address available");
        setStrkBalance("Error: No address available");
        return;
      }

      const strkTokenAddress =
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
      console.log("Getting STRK balance for address:", addressToUse);
      console.log("Using stored address:", !isConnected && walletAddress);

      const balance = await aegisAccount.getTokenBalance(strkTokenAddress, 18);
      setStrkBalance(balance);
      console.log("STRK Balance:", balance);
    } catch (error) {
      console.error("Failed to get STRK balance:", error);
      setStrkBalance("Error: Failed to fetch balance");
    } finally {
      setIsLoadingStrkBalance(false);
    }
  };

  const handleExecuteApprove = async () => {
    if (!aegisAccount) {
      alert("Error: Aegis SDK not initialized");
      return;
    }

    setIsExecuting(true);
    try {
      // STRK token address on Sepolia testnet
      const strkTokenAddress =
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

      // Spender address and amount (0.5 STRK in wei)
      const spenderAddress = "0x1234567890123456789012345678901234567890";
      const approveAmount = "500000000000000000"; // 0.5 STRK in wei (18 decimals)

      console.log("Executing approve transaction:", {
        contract: strkTokenAddress,
        spender: spenderAddress,
        amount: approveAmount,
        currentAddress: currentAddress,
      });

      // Execute approve transaction using SDK executeBatch method
      const result = await aegisAccount.executeBatch([
        {
          contractAddress: strkTokenAddress,
          entrypoint: "approve",
          calldata: [spenderAddress, approveAmount, "0"],
        },
      ]);

      // Store transaction hash for tracking and display
      setLastTransactionHash(result.transactionHash);

      alert(
        `Transaction Successful!\n\nApprove transaction executed successfully.\n\nTransaction Hash: ${result.transactionHash}\n\nSpender: ${spenderAddress}\nAmount: ${approveAmount}`
      );

      console.log("Approve transaction result:", result);
    } catch (error) {
      console.error("Failed to execute approve transaction:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Error: Failed to execute approve transaction: ${errorMessage}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleOpenVoyager = async () => {
    if (!lastTransactionHash) {
      alert("No transaction hash available");
      return;
    }

    const voyagerUrl = `https://sepolia.voyager.online/tx/${lastTransactionHash}`;
    console.log("Voyager URL:", voyagerUrl);

    try {
      // Open Voyager URL in a new tab
      window.open(voyagerUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to open Voyager URL:", error);
      alert("Failed to open Voyager URL");
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

      {/* Sign Out Button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleSignOut}
          className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
          Sign Out
        </button>
      </div>

      {/* Cavos Icon */}
      <div className="mb-8">
        <div className="w-20 h-20 flex items-center justify-center">
          <Image
            src="/cavos-icon.png"
            alt="Cavos Logo"
            width={80}
            height={80}
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="w-full max-w-sm text-center">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome!</h1>
          {userEmail && (
            <p className="text-gray-400 text-sm mb-4">{userEmail}</p>
          )}
          <p className="text-gray-400 text-sm">Your wallet is connected</p>
        </div>

        {/* Login Method Info */}
        {loginMethod && (
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              {loginMethod === "Apple" ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.03 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.96-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.03-3.11z" />
                </svg>
              ) : loginMethod === "Google" ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white"
                >
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
              ) : loginMethod === "In-App" ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              )}
              <p className="text-blue-400 text-sm font-medium">
                Connected via {loginMethod}
              </p>
            </div>
          </div>
        )}

        {/* Wallet Address Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <p className="text-white text-sm mb-3">Your address:</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-[#4263EB] font-mono text-sm">
              {formatAddress(walletAddress)}
            </span>
            <button
              onClick={handleCopyAddress}
              className="bg-[#4263EB] hover:bg-[#3B5AE0] p-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
              title={copied ? "Copied!" : "Copy address"}
            >
              {copied ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white"
                >
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Connection Status - Hide for Apple, Google and In-App login */}
        {loginMethod !== "Apple" &&
          loginMethod !== "Google" &&
          loginMethod !== "In-App" && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`text-sm ${
                  isConnected ? "text-green-400" : "text-red-400"
                }`}
              >
                {isConnected ? "Connected" : "Not Connected"}
              </span>
            </div>
          )}

        {/* OAuth Processing Indicator */}
        {isProcessingOAuth && (
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
              <p className="text-blue-400 text-sm text-center">
                🔄 Processing Apple login...
              </p>
            </div>
          </div>
        )}

        {/* OAuth Status Message - Hide for Apple, Google and In-App login */}
        {walletAddress &&
          !isConnected &&
          !isProcessingOAuth &&
          loginMethod !== "Apple" &&
          loginMethod !== "Google" &&
          loginMethod !== "In-App" && (
            <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
              <p className="text-yellow-400 text-sm text-center">
                🔐 Connected via OAuth - Some features may be limited until SDK
                reconnects
              </p>
            </div>
          )}

        {/* Debug Info - Hide for Apple, Google and In-App login */}
        {loginMethod !== "Apple" &&
          loginMethod !== "Google" &&
          loginMethod !== "In-App" && (
            <div className="mb-4 p-4 bg-gray-800 rounded-lg text-xs text-gray-400 max-w-sm">
              <p className="text-white font-semibold mb-2">Debug Info:</p>
              <div className="space-y-1">
                <p>
                  <span className="text-gray-300">isConnected:</span>{" "}
                  <span
                    className={isConnected ? "text-green-400" : "text-red-400"}
                  >
                    {isConnected ? "true" : "false"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-300">currentAddress:</span>
                </p>
                <p className="text-blue-400 font-mono text-xs break-all pl-2">
                  {currentAddress || "None"}
                </p>
                <p>
                  <span className="text-gray-300">aegisAccount:</span>{" "}
                  <span
                    className={aegisAccount ? "text-green-400" : "text-red-400"}
                  >
                    {aegisAccount ? "Available" : "Not Available"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-300">storedAddress:</span>
                </p>
                <p className="text-blue-400 font-mono text-xs break-all pl-2">
                  {isClient
                    ? localStorage.getItem("walletAddress") || "None"
                    : "Loading..."}
                </p>
                <p>
                  <span className="text-gray-300">storedEmail:</span>{" "}
                  <span className="text-blue-400">
                    {isClient
                      ? localStorage.getItem("userEmail") || "None"
                      : "Loading..."}
                  </span>
                </p>
              </div>
            </div>
          )}

        {/* ETH Balance Display */}
        {ethBalance && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
            <p className="text-white text-sm mb-1">ETH Balance:</p>
            <p className="text-[#4263EB] font-mono text-lg">{ethBalance}</p>
          </div>
        )}

        {/* STRK Balance Display */}
        {strkBalance && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
            <p className="text-white text-sm mb-1">STRK Balance:</p>
            <p className="text-[#4263EB] font-mono text-lg">{strkBalance}</p>
          </div>
        )}

        {/* Transaction Hash Display */}
        {lastTransactionHash && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
            <p className="text-white text-sm mb-3">Last Transaction:</p>
            <p className="text-[#4263EB] font-mono text-xs break-all mb-3">
              {lastTransactionHash}
            </p>
            <button
              onClick={handleOpenVoyager}
              className="w-full bg-[#4263EB] hover:bg-[#3B5AE0] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
              </svg>
              View on Voyager
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGetETHBalance}
            disabled={isLoadingBalance}
            className="w-full bg-[#4263EB] hover:bg-[#3B5AE0] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoadingBalance && (
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
            {isLoadingBalance ? "Loading..." : "Get ETH Balance"}
          </button>
          <button
            onClick={handleGetSTRKBalance}
            disabled={isLoadingStrkBalance}
            className="w-full bg-[#4263EB] hover:bg-[#3B5AE0] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoadingStrkBalance && (
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
            {isLoadingStrkBalance ? "Loading..." : "Get STRK Balance"}
          </button>
          <button
            onClick={handleExecuteApprove}
            disabled={isExecuting}
            className="w-full bg-[#4263EB] hover:bg-[#3B5AE0] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isExecuting && (
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
            {isExecuting ? "Executing..." : "Execute Approve"}
          </button>
        </div>
      </div>

      {/* Aegis sdk example text */}
      <p className="text-gray-400 text-sm mt-8">Aegis sdk example</p>
    </div>
  );
}
