import { getPaste } from "@/lib/db";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { CodeView } from "@/components/CodeView";

interface ViewPageProps {
  params: {
    id: string;
  };
}

export default async function ViewPage({ params }: ViewPageProps) {
  const paste = await getPaste(params.id);

  if (!paste) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto mt-8 px-4">
        <CodeView paste={paste} />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        Powered by Firebase and Google AI
      </footer>
    </div>
  );
}
