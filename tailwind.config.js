/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['"Syne"', 'sans-serif'],
                display: ['"Syne"', 'sans-serif'],
                body: ['"Manrope"', 'sans-serif'],
                mono: ['"Space Mono"', 'monospace'],
            },
            colors: {
                cyan: {
                    500: '#00ffff',
                }
            }
        },
    },
    plugins: [],
}
