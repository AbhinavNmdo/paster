import { FileText, Github } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="w-full max-w-6xl mx-auto px-4 py-2">
      <div className="flex items-center justify-between h-12">
        <Link href="/" className="flex items-center justify-center gap-2 text-xl md:text-2xl font-bold group">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <FileText className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
            </div>
            <h1 className="bg-gradient-to-r from-primary via-purple-400 to-blue-400 text-transparent bg-clip-text">
              Paster
            </h1>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://github.com/Firebase/studio-shows/tree/main/text-sharer" target="_blank">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
