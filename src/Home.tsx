import React from 'react';

interface HomeProps {
    userName: string;
}

const Home: React.FC<HomeProps> = ({userName}) => {
    return (
        <div>
            <h2>Bienvenido a tu espacio de trabajo academico {userName}</h2>
            <p>Aqui puedes subir archivos, realizar anotaciones y planificar recordatorios.</p>
        </div>
    )
}

export default Home;