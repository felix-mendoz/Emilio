import React from 'react';

interface HomeProps {
    userName: string;
}

const Home: React.FC<HomeProps> = ({userName}) => {
    return (
        <div>
            <h2>Start</h2>
            <p>Welcome, {userName}. We are building a web page.</p>
        </div>
    )
}

export default Home;