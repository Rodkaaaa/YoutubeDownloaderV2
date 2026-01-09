"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <h1 className="text-xl font-bold text-blue-400">YouTube Downloader</h1>
          </div>
          <div className="flex gap-6">
            <Link
              href="/"
              className={`font-medium pb-1 transition ${
                pathname === "/"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-blue-400"
              }`}
            >
              Descargar
            </Link>
            <Link
              href="/about"
              className={`font-medium pb-1 transition ${
                pathname === "/about"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-blue-400"
              }`}
            >
              Sobre mí
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
