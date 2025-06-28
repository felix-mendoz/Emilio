"use client";

import React from "react";

interface Question {
    question: string;
    answer: string;
}

const questions: Question[] = [
    {
    question: "¿?",
    answer: "",
    },
    {
    question: "¿?",
    answer: "",
    },
    {
    question: "¿?",
    answer: "",
    },
    {
    question: "¿?",
    answer: "",
    },
];

const QuestionSection: React.FC = () => {
    return (
    <section className="max-w-4xl mx-auto my-16 p-10 bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
        Preguntas Frecuentes
        </h2>

        <div className="space-y-8">
        {questions.map((q, index) => (
            <div key={index}>
            <h3 className="text-xl font-semibold text-emerald-700">
                {q.question}
            </h3>
            <p className="text-slate-600 mt-2">{q.answer}</p>
            </div>
        ))}
        </div>
    </section>
    );
};

export default QuestionSection;