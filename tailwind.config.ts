import type { Config } from "tailwindcss";

type CustomUtilities = {
  [key: string]: {
    [key: string]: string | { [key: string]: string };
  };
};

// 커스텀 유틸리티 정의
const customUtilities: CustomUtilities = {
  ".text-balance": {
    "text-wrap": "balance",
  },
  ".scrollbar-hide": {
    "-ms-overflow-style": "none",
    "scrollbar-width": "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  ".image-skeleton": {
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    "background-size": "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  ".image-skeleton-dark": {
    background: "linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)",
    "background-size": "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  "@keyframes shimmer": {
    "0%": {
      "background-position": "-200% 0",
    },
    "100%": {
      "background-position": "200% 0",
    },
  },
};

// 플러그인 함수
const addCustomUtilities = ({
  addUtilities,
}: {
  addUtilities: (utilities: CustomUtilities) => void;
}) => {
  addUtilities(customUtilities);
};

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // 라이트 테마 색상
        "theme-bg": "#ffffff",
        "theme-bg-secondary": "#f8f9fa",
        "theme-primary": "#1a1a1a",
        "theme-secondary": "#6b7280",
        "theme-muted": "#9ca3af",
        "theme-border": "#e5e7eb",
        "theme-border-hover": "#d1d5db",
        "theme-hover": "#f3f4f6",
        "theme-shadow-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "theme-shadow-md":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "theme-shadow-lg":
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",

        // 기존 색상들
        primary: "var(--primary-color)",
        "primary-lighten": "var(--primary-color-lighten)",
        "primary-hover": "var(--primary-color-hover)",
        "primary-transparent": "var(--primary-color-transparent)",
        black: "var(--black)",
        "black-48": "var(--black_48)",
      },
      maxWidth: {
        layout: "700px",
      },
      fontFamily: {
        pretendard: ["var(--brand-font)", "sans-serif"],
        code: ["var(--code-font)", "monospace"],
      },
      fontWeight: {
        medium: "500",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      transitionProperty: {
        theme: "background-color, color, border-color, box-shadow",
      },
    },
  },
  plugins: [addCustomUtilities],
};

export default config;
