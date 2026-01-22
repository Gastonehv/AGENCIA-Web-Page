import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="not-found-container">
            <style>
                {`
                .not-found-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: #fff;
                    color: #000;
                    font-family: 'Outfit', sans-serif;
                    padding: 2rem;
                    text-align: center;
                    margin: 0;
                    overflow: hidden;
                }

                .face {
                    display: block;
                    width: 100%;
                    max-width: 320px;
                    height: auto;
                    margin-bottom: 2rem;
                }

                .face__eyes,
                .face__eye-lid,
                .face__mouth-left,
                .face__mouth-right,
                .face__nose,
                .face__pupil {
                    animation: eyes 1s 0.3s cubic-bezier(0.65, 0, 0.35, 1) forwards;
                }

                .face__eye-lid,
                .face__pupil {
                    animation-duration: 4s;
                    animation-delay: 1.3s;
                    animation-iteration-count: infinite;
                }

                .face__eye-lid {
                    animation-name: eye-lid;
                }

                .face__mouth-left,
                .face__mouth-right {
                    animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
                }

                .face__mouth-left {
                    animation-name: mouth-left;
                }

                .face__mouth-right {
                    animation-name: mouth-right;
                }

                .face__nose {
                    animation-name: nose;
                }

                .face__pupil {
                    animation-name: pupil;
                }

                @keyframes eye-lid {
                    from, 40%, 45%, to { transform: translateY(0); }
                    42.5% { transform: translateY(17.5px); }
                }

                @keyframes eyes {
                    from { transform: translateY(112.5px); }
                    to { transform: translateY(15px); }
                }

                @keyframes pupil {
                    from, 37.5%, 40%, 45%, 87.5%, to {
                        stroke-dashoffset: 0;
                        transform: translate(0, 0);
                    }
                    12.5%, 25%, 62.5%, 75% {
                        stroke-dashoffset: 0;
                        transform: translate(-35px, 0);
                    }
                    42.5% {
                        stroke-dashoffset: 35;
                        transform: translate(0, 17.5px);
                    }
                }

                @keyframes mouth-left {
                    from, 50% { stroke-dashoffset: -102; }
                    to { stroke-dashoffset: 0; }
                }

                @keyframes mouth-right {
                    from, 50% { stroke-dashoffset: 102; }
                    to { stroke-dashoffset: 0; }
                }

                @keyframes nose {
                    from { transform: translate(0, 0); }
                    to { transform: translate(0, 22.5px); }
                }

                .error-content {
                    max-width: 600px;
                    opacity: 0;
                    animation: fadeIn 1s 1.5s forwards;
                    padding: 0 1.5rem;
                }

                .error-phrase {
                    font-size: 1.5rem;
                    font-weight: 300;
                    font-style: italic;
                    margin-bottom: 2rem;
                    color: #333;
                    line-height: 1.4;
                }

                @media (max-width: 480px) {
                    .error-phrase {
                        font-size: 1.1rem;
                    }
                    .not-found-container {
                        padding: 1rem;
                    }
                }

                @keyframes fadeIn {
                    to { opacity: 1; }
                }

                .btn-primary {
                    background: #000;
                    color: #fff;
                    padding: 1rem 2.5rem;
                    border: none;
                    text-transform: uppercase;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    font-size: 0.75rem;
                    cursor: pointer;
                    margin-top: 2rem;
                    transition: opacity 0.3s;
                }

                .btn-primary:hover {
                    opacity: 0.8;
                }
                `}
            </style>

            <main>
                <svg className="face" viewBox="0 0 320 380" width="320px" height="380px" aria-label="A 404 becomes a face, looks to the sides, and blinks. The 4s slide up, the 0 slides down, and then a mouth appears.">
                    <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="25"
                    >
                        <g className="face__eyes" transform="translate(0, 112.5)">
                            <g transform="translate(15, 0)">
                                <polyline className="face__eye-lid" points="37,0 0,120 75,120" />
                                <polyline className="face__pupil" points="55,120 55,155" strokeDasharray="35 35" />
                            </g>
                            <g transform="translate(230, 0)">
                                <polyline className="face__eye-lid" points="37,0 0,120 75,120" />
                                <polyline className="face__pupil" points="55,120 55,155" strokeDasharray="35 35" />
                            </g>
                        </g>
                        <rect className="face__nose" rx="4" ry="4" x="132.5" y="112.5" width="55" height="155" />
                        <g strokeDasharray="102 102" transform="translate(65, 334)">
                            <path className="face__mouth-left" d="M 0 30 C 0 30 40 0 95 0" strokeDashoffset="-102" />
                            <path className="face__mouth-right" d="M 95 0 C 150 0 190 30 190 30" strokeDashoffset="102" />
                        </g>
                    </g>
                </svg>
            </main>
            <div className="error-content">
                <h2 className="error-phrase">
                    “{t('404.description')}”
                </h2>
                <button className="btn-primary" onClick={() => navigate('/')}>
                    {t('404.backHome')}
                </button>
            </div>
        </div>
    );
};

export default NotFound;
