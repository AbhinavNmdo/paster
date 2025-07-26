import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-transparent backdrop-blur supports-[backdrop-filter]:bg-transparent/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center justify-center gap-2 text-xl md:text-2xl font-bold group">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <FileText className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
            </div>
            <h1 className="bg-gradient-to-r from-primary via-purple-400 to-blue-400 text-transparent bg-clip-text">
              Paster
            </h1>
        </Link>
      </div>
    </header>
  );
}
