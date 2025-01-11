/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-100': "#064420",
        'primary-200': "#E4EFE7",
        'primary-300': "#E4EFE7",
        'accent-100': "#788189",
        'accent-200': "#e1e4e6",
        'text-100': "#1E2022",
        'text-200': "#52616B",
        'bg-100': "#EEEBDD",
        'bg-200': "#DFD3C3",
        'bg-300': "#C7B198",
      },
    },
  },
  plugins: [
    
  ],
}
