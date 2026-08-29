/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50:  "#ecedee",
          100: "#a9adb3",
          200: "#8b8f95",
          300: "#7d8187",
          400: "#6b6f75",
          500: "#4d5159",
          600: "#2a2d32",
          700: "#1f2126",
          800: "#16181c",
          900: "#111317",
          950: "#0b0c0e",
        },
        accent: {
          DEFAULT: "#ffed00",
          soft: "#e8dd8a",
        },
        surface: "#1a1c21",
      },
      fontFamily: {
        archivo: ["Archivo", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
      },
      backgroundImage: {
        stripe: "repeating-linear-gradient(135deg, #16181c 0 12px, #101216 12px 24px)",
      },
      animation: {
        floatIn: "floatIn 0.8s ease both",
      },
      keyframes: {
        floatIn: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
