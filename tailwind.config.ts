import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        // Official Radboud University colors
        "red-impact": "var(--red-impact)",
        poppy: "var(--poppy)",
        ladybug: "var(--ladybug)", 
        berry: "var(--berry)",
        maroon: "var(--maroon)",
        mahogany: "var(--mahogany)",
        // Secondary colors
        gray: "var(--gray)",
        orange: "var(--orange)",
        blue: "var(--blue)",
        petrol: "var(--petrol)",
        green: "var(--green)",
        yellow: "var(--yellow)",
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "gradient-shift": {
          "0%, 100%": { 
            background: "linear-gradient(to bottom right, hsl(358, 100%, 45%, 0.7), hsl(10, 78%, 31%, 0.6), hsl(6, 93%, 23%, 0.7))"
          },
          "33%": { 
            background: "linear-gradient(to bottom right, hsl(10, 78%, 31%, 0.7), hsl(6, 93%, 23%, 0.6), hsl(358, 100%, 45%, 0.7))"
          },
          "66%": { 
            background: "linear-gradient(to bottom right, hsl(6, 93%, 23%, 0.7), hsl(358, 100%, 45%, 0.6), hsl(10, 78%, 31%, 0.7))"
          }
        },
        "fade-in-slow": {
          "0%": { opacity: "0" },
          "100%": { opacity: "0.4" }
        },
        "float-1": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)", opacity: "0.8" },
          "25%": { transform: "translateY(-20px) translateX(10px)", opacity: "0.4" },
          "50%": { transform: "translateY(-10px) translateX(-5px)", opacity: "0.6" },
          "75%": { transform: "translateY(-15px) translateX(15px)", opacity: "0.3" }
        },
        "float-2": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)", opacity: "0.6" },
          "25%": { transform: "translateY(15px) translateX(-10px)", opacity: "0.3" },
          "50%": { transform: "translateY(25px) translateX(8px)", opacity: "0.8" },
          "75%": { transform: "translateY(5px) translateX(-12px)", opacity: "0.4" }
        },
        "float-3": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)", opacity: "0.7" },
          "33%": { transform: "translateY(-25px) translateX(-8px)", opacity: "0.3" },
          "66%": { transform: "translateY(-12px) translateX(12px)", opacity: "0.9" }
        },
        "float-4": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)", opacity: "0.5" },
          "30%": { transform: "translateY(18px) translateX(6px)", opacity: "0.8" },
          "60%": { transform: "translateY(-8px) translateX(-10px)", opacity: "0.2" }
        },
        "slide-up": {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-shift": "gradient-shift 8s ease-in-out infinite",
        "fade-in-slow": "fade-in-slow 2s ease-out",
        "float-1": "float-1 6s ease-in-out infinite",
        "float-2": "float-2 8s ease-in-out infinite",
        "float-3": "float-3 7s ease-in-out infinite",
        "float-4": "float-4 9s ease-in-out infinite",
        "slide-up": "slide-up 1s ease-out",
        "fade-in": "fade-in 1s ease-out"
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
