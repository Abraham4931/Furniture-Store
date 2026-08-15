/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#EFEAE2",
        surface: "#F8F5EF",
        ink: "#2B2420",
        inkmuted: "#6B6156",
        line: "#DCD3C4",
        forest: "#33473B",
        forestdark: "#25332B",
        brass: "#A9823C",
        rust: "#A84C32",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Work Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      letterSpacing: {
        widest2: "0.2em",
      },
    },
  },
  plugins: [],
};
