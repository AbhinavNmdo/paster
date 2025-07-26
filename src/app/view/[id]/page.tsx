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
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8">
      <Header />
      <main className="w-full max-w-6xl mt-8">
        <CodeView paste={paste} />
      </main>
    </div>
  );
}
