// Aegis SDK Configuration
// Get your app ID from https://aegis.cavos.xyz

export const aegisConfig = {
  network:
    (process.env.NEXT_PUBLIC_AEGIS_NETWORK as
      | "SN_MAINNET"
      | "SN_SEPOLIA"
      | "SN_DEVNET") || "SN_SEPOLIA",
  appName: process.env.NEXT_PUBLIC_AEGIS_APP_NAME || "Aegis SDK Example",
  appId: process.env.NEXT_PUBLIC_AEGIS_APP_ID || "your-app-id",
  walletMode:
    (process.env.NEXT_PUBLIC_AEGIS_WALLET_MODE as "social-login" | "in-app") ||
    "social-login",
  enableLogging:
    process.env.NEXT_PUBLIC_AEGIS_ENABLE_LOGGING === "true" || true,
};
