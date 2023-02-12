/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        screens: {
            sm: { min: "0px", max: "767px" },
            md: { min: "768px", max: "991px" },
            lg: { min: "992px", max: "1199px" },
            xl: { min: "1200px" },
        },
        extend: {
            colors: {
                primary: "#0A092B",
                secondary: "#303854",
                highlight: "#AAB1F9",
                text: "#F9F7FB",
            },
        },
    },
    plugins: [],
}
