/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      borderWidth: {
        '3': '3px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            '> *': {
              gridColumn: '2',
            },
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.blue.800'),
                textDecoration: 'underline',
              },
            },
            h1: {
              color: theme('colors.gray.800'),
              fontWeight: '600',
            },
            h2: {
              color: theme('colors.gray.800'),
              fontWeight: '600',
            },
            h3: {
              color: theme('colors.gray.800'),
              fontWeight: '600',
            },
            h4: {
              color: theme('colors.gray.800'),
              fontWeight: '600',
            },
            blockquote: {
              borderLeftColor: theme('colors.blue.200'),
              backgroundColor: theme('colors.blue.50'),
              color: theme('colors.gray.700'),
              fontStyle: 'normal',
              padding: theme('spacing.4'),
              borderRadius: theme('borderRadius.md'),
            },
            pre: {
              backgroundColor: theme('colors.gray.50'),
              borderWidth: '1px',
              borderColor: theme('colors.gray.200'),
              borderRadius: theme('borderRadius.md'),
              padding: theme('spacing.4'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
