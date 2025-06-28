"use client";

import React from "react";

interface Question {
    question: string;
    answer: string;
}

const questions: Question[] = [
    {
    question: "¿?",
<<<<<<< HEAD
    answer: "Haz clic en '¿Olvidaste tu contraseña?' y sigue los pasos.",
    },
    {
    question: "¿Dónde puedo cambiar mi correo?",
    answer: "Desde la sección de perfil puedes actualizar tu correo electrónico.",
    },
    {
    question: "¿Qué pasa si no recibo el correo de verificación?",
    answer: "Revisa tu carpeta de spam o intenta reenviarlo desde la configuración.",
    },
    {
    question: "¿Puedo eliminar mi cuenta permanentemente?",
    answer: "Sí, ve a configuración de cuenta y selecciona 'Eliminar cuenta'.",
=======
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
>>>>>>> 0d2f521c0e463cf86c52caa4ec2ac2324d7d26f7
    },
];

const QuestionSection: React.FC = () => {
    return (
    <section className="max-w-4xl mx-auto my-16 p-10 bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
<<<<<<< HEAD
            Preguntas Frecuentes
=======
        Preguntas Frecuentes
>>>>>>> 0d2f521c0e463cf86c52caa4ec2ac2324d7d26f7
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
