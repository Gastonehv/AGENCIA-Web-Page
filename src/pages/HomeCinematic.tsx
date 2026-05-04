import React from 'react';

const Home: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#000',
            color: '#00FF99',
            fontFamily: 'sans-serif'
        }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 'bold' }}>TEST DE CONEXIÓN NETLIFY</h1>
            <p style={{ fontSize: '2rem', marginTop: '2rem' }}>VERSIÓN: RADAR 1.0</p>
            <p style={{ marginTop: '3rem', color: '#FFF' }}>Si puedes leer esto, la conexión GitHub-Netlify funciona correctamente.</p>
        </div>
    );
};

export default Home;
