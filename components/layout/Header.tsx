import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-800 bg-[#09090b]/95 backdrop-blur supports-[backdrop-filter]:bg-[#09090b]/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            width={200}
            height={200}
            alt="Logo"
            className="mb-6"
          />
          <span className="font-bold text-gray-100"></span>
        </Link>
      </div>
    </header>
  );
}
