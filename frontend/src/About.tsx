import React from "react";
import './About.css'

const About:React.FC = () => {
    return (
        <section className="about-us">
            <div className="container">
                <h2 className="about-title">Sobre nosotros</h2>
                <p className="about-text">
                La vida universitaria puede ser abrumadora: clases, apuntes, fechas límite, trabajos en grupo y archivos por todas partes. Por eso creamos <strong>AcadexPro</strong>, una plataforma digital pensada para ayudarte a tomar el control de tu vida académica.
                </p>

                <h3 className="about-subtitle">¿Qué puedes hacer con AcadexPro?</h3>
                <ul className="features-list">
                <li>📂 <strong>Subir y gestionar archivos:</strong> Organiza tus documentos por materia o curso.</li>
                <li>📝 <strong>Crear recordatorios y tareas:</strong> Recibe avisos y cumple tus fechas importantes.</li>
                <li>🗂️ <strong>Construir tu expediente de estudio:</strong> Visualiza tu progreso académico fácilmente.</li>
                </ul>

                <h3 className="about-subtitle">Nuestra misión</h3>
                <p className="about-text">
                Simplificar y centralizar tus materiales de estudio para que tengas más tiempo y claridad para lo que realmente importa: aprender.
                </p>

                <blockquote className="about-quote">
                “Tú enfócate en aprender. Nosotros te ayudamos a organizar.”
                </blockquote>
            </div>
    </section>
    )
}

export default About;