import Header from "@/components/Header";
import { PasteForm } from "@/components/PasteForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto mt-8 px-4">
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-center">Create a New Paste</CardTitle>
          </CardHeader>
          <CardContent>
            <PasteForm />
          </CardContent>
        </Card>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        Powered by Firebase and Google AI
      </footer>
    </div>
  );
}
