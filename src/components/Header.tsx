import { FileText } from 'lucide-react';
import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';

export default function Header() {
  return (
    <header className="w-full max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-headline font-bold group">
            <FileText className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
            <h1 className="bg-gradient-to-r from-primary to-blue-400 text-transparent bg-clip-text">
              Text Sharer
            </h1>
        </Link>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
