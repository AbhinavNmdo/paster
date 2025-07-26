import Header from "@/components/Header";
import { PasteForm } from "@/components/PasteForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto mt-8 px-4 py-8">
        <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Create a New Paste</CardTitle>
            <CardDescription>Share code, notes, and snippets securely.</CardDescription>
          </CardHeader>
          <CardContent>
            <PasteForm />
          </CardContent>
        </Card>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Powered by Firebase and Google AI
      </footer>
    </div>
  );
}
