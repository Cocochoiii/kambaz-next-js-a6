import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER =
    (typeof import.meta !== "undefined" &&
        (import.meta as any).env &&
        (import.meta as any).env.VITE_HTTP_SERVER) ||
    "http://localhost:4000";

const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

export const listQuizzes = async (courseId: string) => {
    const { data } = await axiosWithCredentials.get(
        `${COURSES_API}/${courseId}/quizzes`
    );
    return data;
};

export const createQuiz = async (courseId: string, quiz: any) => {
    const { data } = await axiosWithCredentials.post(
        `${COURSES_API}/${courseId}/quizzes`,
        quiz
    );
    return data;
};

export const getQuiz = async (qid: string) => {
    const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${qid}`);
    return data;
};

export const updateQuiz = async (quiz: any) => {
    const { data } = await axiosWithCredentials.put(
        `${QUIZZES_API}/${quiz._id}`,
        quiz
    );
    return data;
};

export const deleteQuiz = async (qid: string) => {
    const { data } = await axiosWithCredentials.delete(`${QUIZZES_API}/${qid}`);
    return data;
};

export const publishQuiz = async (qid: string, published: boolean) => {
    const { data } = await axiosWithCredentials.put(
        `${QUIZZES_API}/${qid}/publish`,
        { published }
    );
    return data;
};

export const addQuestion = async (qid: string, question: any) => {
    const { data } = await axiosWithCredentials.post(
        `${QUIZZES_API}/${qid}/questions`,
        question
    );
    return data;
};

export const updateQuestion = async (
    qid: string,
    questionId: string,
    updates: any
) => {
    const { data } = await axiosWithCredentials.put(
        `${QUIZZES_API}/${qid}/questions/${questionId}`,
        updates
    );
    return data;
};

export const deleteQuestion = async (qid: string, questionId: string) => {
    const { data } = await axiosWithCredentials.delete(
        `${QUIZZES_API}/${qid}/questions/${questionId}`
    );
    return data;
};

export const submitAttempt = async (qid: string, answers: any[]) => {
    const { data } = await axiosWithCredentials.post(
        `${QUIZZES_API}/${qid}/attempts`,
        { answers }
    );
    return data;
};

export const lastAttempt = async (qid: string) => {
    const { data } = await axiosWithCredentials.get(
        `${QUIZZES_API}/${qid}/attempts/last`
    );
    return data;
};
