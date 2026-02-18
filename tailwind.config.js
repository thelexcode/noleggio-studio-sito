/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#FF4D4D', // Red form Logo Light
                    DEFAULT: '#CC0000', // Red form Logo Dark
                    dark: '#990000', // Deep Red
                },
                secondary: '#64748b', // Slate 500
                accent: '#0f172a', // Slate 900
                background: '#ffffff',
                surface: '#f8fafc', // Slate 50
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'serif'], // Adding a serif for elegant headings
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            }
        },
    },
    plugins: [],
}
