// Tailwind CSS v4 uses CSS-based configuration
// This file is not needed for v4
module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            keyframes: {
                gradient: {
                    '0%, 100%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                },
            },
            animation: {
                gradient: 'gradient 3s ease infinite',
            },
        },
    },
}