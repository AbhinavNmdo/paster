import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8">
      <Header />
      <main className="w-full max-w-md mt-16">
        <Card className="text-center shadow-lg">
          <CardHeader>
            <div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit">
              <FileQuestion className="w-12 h-12 text-destructive" />
            </div>
            <CardTitle className="text-3xl font-headline mt-4">Paste Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">The paste you are looking for does not exist or may have expired.</p>
            <Button asChild size="lg">
              <Link href="/">Create a new paste</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
