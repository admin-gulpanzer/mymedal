/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	theme: {
		extend: {
			backdropBlur: {
				xs: "2px",
			},
			height: {
				78: "19.5rem",
				108: "27rem",
			},
		},
	},
	plugins: [],
};
