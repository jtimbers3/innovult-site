import { SiteNav } from "@/components/site-nav";
import { db } from "@/lib/db";

export default async function TriviaPage() {
  const questions = await db.triviaQuestion.findMany({ take: 5, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-4">
      <SiteNav />
      <h1 className="text-2xl font-semibold">Oscar Trivia</h1>
      {questions.map((q) => (
        <div className="card" key={q.id}>
          <p className="text-xs text-gold">{q.category}</p>
          <p>{q.question}</p>
        </div>
      ))}
    </div>
  );
}
