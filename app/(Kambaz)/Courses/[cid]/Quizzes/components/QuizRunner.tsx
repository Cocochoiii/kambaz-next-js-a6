"use client";
import { useEffect, useState } from "react";
import * as client from "../../Quizzes/client";

export default function QuizRunner({
                                       quiz,
                                       mode, // "preview" | "take"
                                       onSubmitted,
                                   }: {
    quiz: any;
    mode: "preview" | "take";
    onSubmitted?: (attempt: any) => void;
}) {
    const [answers, setAnswers] = useState<any>({}); // {questionId: {choiceId|boolean|text}}
    const [result, setResult] = useState<any>(null);

    const setAnswer = (qid: string, patch: any) =>
        setAnswers((prev: any) => ({ ...prev, [qid]: { ...(prev[qid] || {}), ...patch } }));

    const localGrade = () => {
        let total = 0;
        let awarded = 0;
        const rows = quiz.questions.map((q: any) => {
            const ans = answers[q._id] || {};
            total += Number(q.points) || 0;
            let ok = false;
            if (q.type === "MCQ") ok = ans.choiceId === q.correctChoiceId;
            else if (q.type === "TF") ok = Boolean(ans.boolean) === Boolean(q.correctBoolean);
            else {
                const cands = (q.correctAnswers || []).map((s: string) => s.toLowerCase().trim());
                ok = cands.includes(String(ans.text || "").toLowerCase().trim());
            }
            if (ok) awarded += Number(q.points) || 0;
            return { qid: q._id, ok };
        });
        return { total, awarded, rows };
    };

    const submit = async () => {
        if (mode === "preview") {
            const g = localGrade();
            setResult({ totalAwarded: g.awarded, totalPoints: g.total, answers: g.rows });
        } else {
            const payload = quiz.questions.map((q: any) => {
                const a = answers[q._id] || {};
                if (q.type === "MCQ") return { questionId: q._id, choiceId: a.choiceId || "" };
                if (q.type === "TF")  return { questionId: q._id, boolean: !!a.boolean };
                return { questionId: q._id, text: a.text || "" };
            });
            const attempt = await client.submitAttempt(quiz._id, payload);
            setResult(attempt);
            onSubmitted?.(attempt);
        }
    };

    if (!quiz) return null;

    return (
        <div>
            <h4 className="mb-3">{quiz.title}</h4>
            <div className="mb-3 text-muted">{quiz.points} pts • {quiz.questions.length} Questions</div>
            {quiz.questions.map((q: any, idx: number) => (
                <div key={q._id} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between">
                        <div><b>Question {idx + 1}</b> • {q.points} pts</div>
                        <div className="text-uppercase small">{q.type}</div>
                    </div>
                    <div className="mt-2">{q.prompt}</div>

                    {/* input */}
                    {q.type === "MCQ" && (
                        <div className="mt-2">
                            {(q.choices || []).map((c: any) => (
                                <div key={c._id} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name={q._id}
                                        checked={(answers[q._id]?.choiceId) === c._id}
                                        onChange={() => setAnswer(q._id, { choiceId: c._id })}
                                    />
                                    <label className="form-check-label">{c.text}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    {q.type === "TF" && (
                        <div className="mt-2">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name={q._id}
                                       checked={answers[q._id]?.boolean === true}
                                       onChange={() => setAnswer(q._id, { boolean: true })}/>
                                <label className="form-check-label">True</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name={q._id}
                                       checked={answers[q._id]?.boolean === false}
                                       onChange={() => setAnswer(q._id, { boolean: false })}/>
                                <label className="form-check-label">False</label>
                            </div>
                        </div>
                    )}

                    {q.type === "FILL" && (
                        <input
                            className="form-control mt-2"
                            placeholder="Your answer"
                            value={answers[q._id]?.text || ""}
                            onChange={(e) => setAnswer(q._id, { text: e.target.value })}
                        />
                    )}
                </div>
            ))}

            <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={submit}>
                    {mode === "preview" ? "Preview Submit" : "Submit Quiz"}
                </button>
            </div>

            {result && (
                <div className="alert alert-secondary mt-3">
                    <b>Score:</b>{" "}
                    {mode === "preview"
                        ? `${result.awarded ?? result.totalAwarded}/${result.total ?? quiz.points}`
                        : `${result.totalAwarded}/${quiz.points}`}
                </div>
            )}
        </div>
    );
}
