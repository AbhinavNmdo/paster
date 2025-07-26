import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full max-w-4xl">
      <Link href="/" className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-headline font-bold text-center group">
          <FileText className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
          <h1 className="bg-gradient-to-r from-primary to-blue-400 text-transparent bg-clip-text">
            Text Sharer
          </h1>
      </Link>
    </header>
  );
}
