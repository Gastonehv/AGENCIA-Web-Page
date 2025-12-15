/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['"Manrope"', 'sans-serif'],
                body: ['"Manrope"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
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
