/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
    colors: {
        // dark: "#161616",
        // dark2: "#1a1a1a",
        // dark3: "#252525",
        // white: "#ffffff",
        icbackground: "#1a1a1a",
        icbackgroundlight: "#f5f4f0",
        icbackgroundcard: "#252525",
        ictext: "#fcfcfc",
        ictheme: "#9999ff",
        icwhite: "#FEFEFE",
        icgrey: "#606060",
        icgreylight: "#C9C9C9",
        icactive: "#009966",
        icred: "#FF5252",

    },
  },
  plugins: [],
}