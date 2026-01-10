'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import headerIcon from '@/assets/headericon/h.png';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <a
              href="https://moviessam-linktree.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="MovieSSam Linktree"
            >
              <img
                src={headerIcon}
                alt="MovieSSam"
                className="w-12 h-12 object-contain"
              />
            </a>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <span className="text-2xl">✨</span>
              <span>우정 타로</span>
            </Link>
          </div>

          <nav className="flex gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-button transition-colors duration-fast ${
                isActive('/')
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-text hover:bg-surface'
              }`}
            >
              홈
            </Link>
            <Link
              href="/journal"
              className={`px-4 py-2 rounded-button transition-colors duration-fast ${
                isActive('/journal')
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-text hover:bg-surface'
              }`}
            >
              기록
            </Link>
            <Link
              href="/settings"
              className={`px-4 py-2 rounded-button transition-colors duration-fast ${
                isActive('/settings')
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-text hover:bg-surface'
              }`}
            >
              설정
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
