/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#1a1a1a',
            fontSize: '1.25rem',
            lineHeight: '1.7',
            fontFamily: 'var(--font-dm-sans)',
            p: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            a: {
              color: '#111',
              textDecoration: 'underline',
              textDecorationThickness: '1px',
              textUnderlineOffset: '3px',
              '&:hover': {
                color: '#555',
              },
            },
            'h1, h2, h3, h4': {
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: '700',
              letterSpacing: '-0.01em',
            },
            h2: {
              fontSize: '1.75rem',
              marginTop: '2em',
              marginBottom: '1em',
            },
            h3: {
              fontSize: '1.35rem',
              marginTop: '1.75em',
              marginBottom: '0.75em',
            },
            blockquote: {
              fontStyle: 'normal',
              fontWeight: '500',
              borderLeftWidth: '3px',
              borderLeftColor: '#e5e7eb',
              paddingLeft: '1.5rem',
              color: '#374151',
            },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontSize: '0.9em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
