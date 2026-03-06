"use client";

import { useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";

type Option = { label: string; score: 1 | 2 | 3 | 4 };
type Question = { prompt: string; options: Option[] };

const questions: Question[] = [
  {
    prompt:
      "Has your organization defined a future-state accounting classification structure aligned with federal financial reporting standards?",
    options: [
      { label: "Fully defined and approved", score: 4 },
      { label: "Draft structure defined", score: 3 },
      { label: "Initial discussions underway", score: 2 },
      { label: "No defined future structure", score: 1 },
    ],
  },
  {
    prompt: "Does your organization maintain a complete inventory of systems that generate financial transactions?",
    options: [
      { label: "Complete inventory with system owners identified", score: 4 },
      { label: "Partial inventory exists", score: 3 },
      { label: "Informal understanding only", score: 2 },
      { label: "No inventory exists", score: 1 },
    ],
  },
  {
    prompt: "Are system interfaces formally governed with defined ownership and documentation?",
    options: [
      { label: "Fully governed and documented", score: 4 },
      { label: "Mostly documented", score: 3 },
      { label: "Some documentation exists", score: 2 },
      { label: "Interfaces largely unmanaged", score: 1 },
    ],
  },
  {
    prompt: "Has your organization identified the financial data that must be converted into the new ERP system?",
    options: [
      { label: "Data scope defined and mapped", score: 4 },
      { label: "Data scope partially defined", score: 3 },
      { label: "Early discussions only", score: 2 },
      { label: "No conversion strategy", score: 1 },
    ],
  },
  {
    prompt:
      "Are business process owners formally designated for key financial processes such as procure-to-pay and budget execution?",
    options: [
      { label: "Clearly defined process owners", score: 4 },
      { label: "Informal functional leads exist", score: 3 },
      { label: "Partial ownership across offices", score: 2 },
      { label: "No clear ownership", score: 1 },
    ],
  },
  {
    prompt: "Does your program have an established governance structure for ERP decision-making?",
    options: [
      { label: "Fully established governance structure", score: 4 },
      { label: "Governance structure forming", score: 3 },
      { label: "Limited governance", score: 2 },
      { label: "No defined governance", score: 1 },
    ],
  },
  {
    prompt:
      "Has your organization defined an integration approach for connecting ERP systems with feeder systems and reporting tools?",
    options: [
      { label: "Enterprise integration architecture defined", score: 4 },
      { label: "Integration strategy partially defined", score: 3 },
      { label: "Point-to-point integrations planned", score: 2 },
      { label: "No defined integration approach", score: 1 },
    ],
  },
  {
    prompt: "Has a comprehensive testing strategy been developed for the ERP implementation?",
    options: [
      { label: "Full testing strategy defined", score: 4 },
      { label: "Partial testing plan exists", score: 3 },
      { label: "Testing approach under discussion", score: 2 },
      { label: "No defined testing approach", score: 1 },
    ],
  },
  {
    prompt: "How will financial reporting and analytics be delivered after ERP implementation?",
    options: [
      { label: "Reporting architecture defined", score: 4 },
      { label: "Reporting approach partially defined", score: 3 },
      { label: "Reliance on ERP standard reports only", score: 2 },
      { label: "Reporting strategy not defined", score: 1 },
    ],
  },
  {
    prompt: "Has your organization prepared a strategy for training users and managing organizational change?",
    options: [
      { label: "Comprehensive change management strategy", score: 4 },
      { label: "Training plan under development", score: 3 },
      { label: "Limited training considerations", score: 2 },
      { label: "No formal change strategy", score: 1 },
    ],
  },
];

const MAX_SCORE = 40;

const lowScoreRisks: Record<number, string> = {
  1: "An undefined accounting structure can lead to reporting inconsistencies, data conversion issues, and significant rework during ERP implementation.",
  2: "An incomplete inventory of financial feeder systems increases the risk of missing integrations and unexpected data flows during implementation.",
  3: "Unmanaged system interfaces can create data integrity issues and increase the likelihood of integration failures after system deployment.",
  4: "Without a defined data conversion strategy, historical financial data may be incomplete, inaccurate, or unavailable in the new ERP system.",
  5: "Unclear business process ownership can delay decision-making and create inconsistencies in how financial processes are implemented.",
  6: "Limited governance structures increase the risk of delayed decisions, conflicting priorities, and poor program oversight.",
  7: "A lack of integration architecture can lead to fragile system connections and higher maintenance costs after implementation.",
  8: "Insufficient testing planning increases the likelihood of unresolved defects and operational disruptions at system go-live.",
  9: "Without a reporting strategy, organizations may struggle to produce timely and reliable financial insights after ERP deployment.",
  10: "Limited change management planning increases the risk of user resistance, training gaps, and operational disruptions.",
};

function getInterpretation(score: number) {
  if (score >= 80) {
    return {
      title: "High Readiness",
      text: "Your organization appears well positioned for ERP modernization.",
    };
  }
  if (score >= 60) {
    return {
      title: "Moderate Readiness",
      text: "Some planning areas should be strengthened before implementation.",
    };
  }
  if (score >= 40) {
    return {
      title: "Limited Readiness",
      text: "Several readiness gaps could increase implementation risk.",
    };
  }
  return {
    title: "High Risk",
    text: "Significant preparation is needed before undertaking an ERP modernization effort.",
  };
}

export default function AssessmentPage() {
  const quizRef = useRef<HTMLElement | null>(null);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const canGoNext = answers[currentIndex] > 0;
  const allAnswered = answers.every((a) => a > 0);

  const totalScore = useMemo(() => answers.reduce((sum, item) => sum + item, 0), [answers]);
  const readinessPercent = Math.round((totalScore / MAX_SCORE) * 100);
  const interpretation = getInterpretation(readinessPercent);

  const selectedAnswers = useMemo(
    () => questions.map((q, i) => q.options.find((opt) => opt.score === answers[i]) ?? null),
    [answers]
  );

  const discussMailto = useMemo(() => {
    const body = [
      "Hello innovult team,",
      "",
      "I would like to discuss my ERP readiness assessment results.",
      `Readiness score: ${readinessPercent}% (${interpretation.title})`,
    ].join("\n");

    return `mailto:jtimbers@innovult.com?subject=${encodeURIComponent("Discuss My ERP Readiness")}&body=${encodeURIComponent(body)}`;
  }, [interpretation.title, readinessPercent]);

  function handleStart() {
    setStarted(true);
    quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSelect(score: number) {
    setAnswers((prev) => prev.map((value, i) => (i === currentIndex ? score : value)));
  }

  function handleSubmitAssessment() {
    if (!allAnswered) return;
    setSubmitted(true);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function downloadResults() {
    const doc = new jsPDF();

    let y = 18;
    const pageHeight = 282;
    const bottomMargin = 16;

    const ensureSpace = (needed = 10) => {
      if (y + needed > pageHeight - bottomMargin) {
        doc.addPage();
        y = 18;
      }
    };

    const writeLine = (text: string, opts?: { color?: [number, number, number]; indent?: number; bold?: boolean }) => {
      ensureSpace(8);
      doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
      const color = opts?.color ?? [30, 41, 59];
      doc.setTextColor(color[0], color[1], color[2]);
      const x = 14 + (opts?.indent ?? 0);
      const wrapped = doc.splitTextToSize(text, 180 - (opts?.indent ?? 0));
      doc.text(wrapped, x, y);
      y += 6 + (wrapped.length - 1) * 5;
    };

    doc.setFontSize(14);
    writeLine("federal ERP modernization readiness assessment", { bold: true, color: [10, 58, 102] });
    doc.setFontSize(11);
    writeLine(`Readiness Score: ${readinessPercent}%`, { bold: true });
    writeLine(`Interpretation: ${interpretation.title}`, { bold: true });
    writeLine(interpretation.text);

    y += 2;
    writeLine("Question Responses", { bold: true, color: [10, 58, 102] });

    questions.forEach((question, index) => {
      const selected = selectedAnswers[index];
      const lowScore = selected && selected.score <= 2;

      writeLine(`${index + 1}. ${question.prompt}`, { bold: true });
      if (selected) {
        writeLine(`Answer: ${selected.label} (${selected.score}/4)`, {
          indent: 4,
          color: lowScore ? [185, 28, 28] : [30, 41, 59],
          bold: !!lowScore,
        });
        if (lowScore) {
          writeLine("Risk:", {
            indent: 4,
            color: [185, 28, 28],
            bold: true,
          });
          writeLine(lowScoreRisks[index + 1], {
            indent: 8,
            color: [185, 28, 28],
          });
        }
      } else {
        writeLine("Answer: Not answered", { indent: 4, color: [120, 120, 120] });
      }
      y += 2;
    });

    writeLine("Common ERP Modernization Risk Areas", { bold: true, color: [10, 58, 102] });
    [
      "Incomplete feeder system inventories",
      "Limited interface governance",
      "Unclear business process ownership",
      "Data conversion challenges",
      "Insufficient change management planning",
    ].forEach((item) => writeLine(`• ${item}`, { indent: 2 }));

    doc.save("innovult-readiness-assessment-results.pdf");
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-[#0A3A66] sm:text-4xl">
          Federal ERP Modernization Readiness Assessment
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-7 text-slate-700 sm:text-lg">
          This assessment helps organizations evaluate their readiness for ERP modernization initiatives, including
          financial system transformation, system integration, and organizational change.
        </p>
        <button onClick={handleStart} className="btn-primary mt-6 px-5 py-3 text-sm">
          Start Assessment
        </button>
      </section>

      <section ref={quizRef} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-950">Assessment Quiz</h2>
          <p className="text-sm font-medium text-slate-600">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>

        {!started ? (
          <p className="text-slate-700">Select Start Assessment above to begin.</p>
        ) : (
          <div className="space-y-6">
            <p className="text-lg leading-8 text-slate-900">{currentQuestion.prompt}</p>

            <div className="grid gap-3">
              {currentQuestion.options.map((option) => {
                const selected = answers[currentIndex] === option.score;
                return (
                  <label
                    key={option.label}
                    className={`cursor-pointer rounded-lg border px-4 py-3 text-sm transition ${
                      selected
                        ? "border-[#0A3A66] bg-[#0A3A66]/5 text-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentIndex}`}
                      className="mr-3 align-middle"
                      checked={selected}
                      onChange={() => handleSelect(option.score)}
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-between gap-3 pt-2">
              <button
                className="btn-outline px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              >
                Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  className="btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!canGoNext}
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                >
                  Next
                </button>
              ) : (
                <button
                  className="btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!allAnswered}
                  onClick={handleSubmitAssessment}
                >
                  Submit Assessment
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {submitted ? (
        <section id="results" className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <h2 className="text-2xl font-semibold text-slate-950">Readiness Score</h2>
          <p className="text-lg font-medium text-[#0A3A66]">
            Your ERP Modernization Readiness Score: {readinessPercent}%
          </p>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{interpretation.title}</p>
            <p className="mt-1 text-slate-700">{interpretation.text}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-950">Common ERP Modernization Risk Areas</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
              <li>Incomplete feeder system inventories</li>
              <li>Limited interface governance</li>
              <li>Unclear business process ownership</li>
              <li>Data conversion challenges</li>
              <li>Insufficient change management planning</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="btn-outline px-4 py-2 text-sm" onClick={downloadResults}>
              Download Results
            </button>
            <a href={discussMailto} className="btn-primary px-4 py-2 text-sm">
              Discuss My Results
            </a>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-950">Discuss Your Results</h3>
            <p className="mt-2 text-sm text-slate-700">
              Click <strong>Discuss My Results</strong> to open an email to jtimbers@innovult.com with subject
              “Discuss My ERP Readiness”.
            </p>

          </div>
        </section>
      ) : null}
    </div>
  );
}
