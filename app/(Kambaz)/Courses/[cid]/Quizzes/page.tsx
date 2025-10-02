"use client";
import { useParams, useRouter } from "next/navigation";
import { BsRocket, BsRocketFill, BsThreeDots } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import * as client from "./client";
import {
    setQuizzes,
    addQuizLocal,
    updateQuizLocal,
    deleteQuizLocal,
} from "./reducer";
import QuizModal from "./QuizModal";

export default function QuizzesPage() {
    const { cid } = useParams<{ cid: string }>();
    const router = useRouter();
    const dispatch = useDispatch();
    const { quizzes } = useSelector((s: any) => s.quizzesReducer);
    const { currentUser } = useSelector((s: any) => s.accountReducer);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShow] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    const isFaculty = currentUser?.role === "FACULTY";

    const load = async () => {
        const data = await client.listQuizzes(cid!);
        dispatch(setQuizzes(data));
    };

    useEffect(() => { if (cid) load(); }, [cid]);

    const filtered = (quizzes || [])
        .filter((q: any) => q.course === cid)
        .filter((q: any) => q.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const onSave = async (quizData: any) => {
        if (editing) {
            const updated = await client.updateQuiz({ ...editing, ...quizData });
            dispatch(updateQuizLocal(updated));
        } else {
            const created = await client.createQuiz(cid!, quizData);
            dispatch(addQuizLocal(created));
        }
        setShow(false);
        setEditing(null);
    };

    const onDelete = async (qid: string) => {
        await client.deleteQuiz(qid);
        dispatch(deleteQuizLocal(qid));
    };

    const togglePublish = async (quiz: any) => {
        const fresh = await client.publishQuiz(quiz._id, !quiz.published);
        dispatch(updateQuizLocal(fresh));
    };

    return (
        <div id="wd-quizzes">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    className="form-control w-50"
                    placeholder="Search for Quiz"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {isFaculty && (
                    <button className="btn btn-danger" onClick={() => setShow(true)}>
                        <FaPlus className="me-1" /> Quiz
                    </button>
                )}
            </div>

            <h4 className="mb-2">Assignment Quizzes</h4>

            {filtered.length === 0 ? (
                <div className="alert alert-info">
                    Empty. {isFaculty && "Click “+ Quiz” to create your first quiz."}
                </div>
            ) : (
                <div className="list-group">
                    {filtered.map((quiz: any) => (
                        <div key={quiz._id} className="d-flex align-items-center border-bottom py-3">
                            <button
                                className="btn btn-link p-0 me-3"
                                title={quiz.published ? "Unpublish" : "Publish"}
                                onClick={() => isFaculty && togglePublish(quiz)}
                                disabled={!isFaculty}
                            >
                                {quiz.published ? (
                                    <BsRocketFill className="text-success" size={20} />
                                ) : (
                                    <BsRocket className="text-secondary" size={20} />
                                )}
                            </button>

                            <div className="flex-grow-1">
                                <h6 className="mb-1">
                                    <a
                                        className="text-decoration-none"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`);
                                        }}
                                        href="#"
                                    >
                                        {quiz.title}
                                    </a>
                                </h6>

                                <div className="text-muted small">
                                    {/* availability text */}
                                    {(() => {
                                        const now = new Date().getTime();
                                        const from = quiz.availableFrom ? new Date(quiz.availableFrom).getTime() : null;
                                        const until = quiz.availableUntil ? new Date(quiz.availableUntil).getTime() : null;

                                        let availability = "";
                                        if (from && now < from) {
                                            availability = `Not available until ${new Date(from).toLocaleString()}`;
                                        } else if (until && now > until) {
                                            availability = "Closed";
                                        } else {
                                            availability = "Available";
                                        }
                                        return <span className="me-3">{availability}</span>;
                                    })()}

                                    {quiz.dueDate && <span className="me-3">Due {new Date(quiz.dueDate).toLocaleString()}</span>}
                                    <span className="me-3">{quiz.points || 0} pts</span>
                                    <span>{(quiz.questions || []).length} Questions</span>
                                </div>
                            </div>

                            {/* context menu */}
                            {isFaculty && (
                                <div className="dropdown">
                                    <button className="btn btn-link text-muted p-0" data-bs-toggle="dropdown">
                                        <BsThreeDots />
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <button className="dropdown-item" onClick={() => setEditing(quiz)}>
                                                Edit
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="dropdown-item text-danger"
                                                onClick={() => onDelete(quiz._id)}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {(showModal || editing) && (
                <QuizModal
                    show={showModal || !!editing}
                    onClose={() => {
                        setShow(false);
                        setEditing(null);
                    }}
                    onSave={onSave}
                    quiz={editing}
                    editMode={!!editing}
                />
            )}
        </div>
    );
}
