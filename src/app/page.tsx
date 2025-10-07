import Image from "next/image";
import { LoginButtons } from "../components/LoginButtons";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      {/* Cavos Icon */}
      <div className="mb-12">
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

      {/* Login Buttons */}
      <div className="mb-8">
        <LoginButtons />
      </div>

      {/* Aegis sdk example text */}
      <p className="text-gray-400 text-sm">Aegis sdk example</p>
    </div>
  );
}
