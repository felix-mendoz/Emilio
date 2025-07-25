import React from "react";
import "../css/styles.css";

const Faqs: React.FC = () => {
    return (
        <section className="faqs-container">
            <h2 className="faqs-title">Preguntas Frecuentes</h2>
            <div className="faqs-list">
                <div className="faq-item">
                    <h3>¿Cómo puedo subir mis documentos?</h3>
                    <p>Ve a la sección de Documentos y haz clic en el botón "Subir nuevo documento".</p>
                </div>
                <div className="faq-item">
                    <h3>¿Qué tipos de archivos son soportados?</h3>
                    <p>Soportamos PDF, Word, Excel, PowerPoint y archivos de imagen.</p>
                </div>
                <div className="faq-item">
                    <h3>¿Cómo cambio mi contraseña?</h3>
                    <p>Actualmente puedes restablecerla desde la página de login.</p>
                </div>
            </div>
        </section>
    );
};

export default Faqs;