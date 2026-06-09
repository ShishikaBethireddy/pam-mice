import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        /* ----- RCD raw palette (constant hex) ----- */
        ink: {
          DEFAULT: "#2A2A28",
          soft: "#5A554D",
          muted: "#948D80",
        },
        /* "copper" accent repointed to sage green (brand reference #B0B89E) */
        copper: {
          DEFAULT: "#6F7E50",
          hover: "#5E6B43",
          active: "#4E5938",
          soft: "#DCE2CF",
        },
        paper: "#FFFFFF",
        canvas: "#F5EFE6",
        cream: {
          DEFAULT: "#E8DDD0",
          soft: "#F0E8DC",
        },
        "disabled-bg": "#E5E0D8",
        "disabled-fg": "#B8B0A6",
        "border-default": "#C9C2B6",
        "border-subtle": "#E5E0D8",
        "border-strong": "#2A2A28",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          soft: "hsl(var(--gold-soft))",
        },
        grey: {
          50: "hsl(var(--grey-50) / <alpha-value>)",
          100: "hsl(var(--grey-100) / <alpha-value>)",
          200: "hsl(var(--grey-200) / <alpha-value>)",
          300: "hsl(var(--grey-300) / <alpha-value>)",
          400: "hsl(var(--grey-400) / <alpha-value>)",
          500: "hsl(var(--grey-500) / <alpha-value>)",
          600: "hsl(var(--grey-600) / <alpha-value>)",
          700: "hsl(var(--grey-700) / <alpha-value>)",
          800: "hsl(var(--grey-800) / <alpha-value>)",
          900: "hsl(var(--grey-900) / <alpha-value>)",
        },
        brand: {
          100: "hsl(var(--brand-100) / <alpha-value>)",
          300: "hsl(var(--brand-300) / <alpha-value>)",
          500: "hsl(var(--brand-500) / <alpha-value>)",
          700: "hsl(var(--brand-700) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          soft: "hsl(var(--success-soft))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          soft: "hsl(var(--warning-soft))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          soft: "hsl(var(--info-soft))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        serif: ['"Isabella Grand"', '"Cormorant Garamond"', "Georgia", "serif"],
        title: ['"Isabella Grand"', '"Cormorant Garamond"', "Georgia", "serif"],
        display: ['"Isabella Grand"', '"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['Poppins', "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-gold": "var(--gradient-gold)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "9999px",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
