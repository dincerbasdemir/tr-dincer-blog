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
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'rgb(17, 17, 17)',
            fontSize: '16px',
            lineHeight: '30px',
            fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
            p: { marginTop: '1.4em', marginBottom: '1.4em' },
            a: {
              color: '#111',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              '&:hover': { color: '#555' },
            },
            'h1, h2, h3, h4': {
              fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
            },
            h1: { fontWeight: '800', fontSize: '45px', lineHeight: '54px' },
            h2: { fontWeight: '700', fontSize: '24px', lineHeight: '44px' },
            h3: { fontWeight: '700', fontSize: '20px', lineHeight: '36px' },
            h4: { fontWeight: '700', fontSize: '17px', lineHeight: '30px' },
            blockquote: {
              fontStyle: 'italic',
              borderLeftWidth: '3px',
              borderLeftColor: '#d1d5db',
              paddingLeft: '1.5rem',
              color: '#4b5563',
            },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '0.15em 0.4em',
              borderRadius: '3px',
              fontSize: '0.88em',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
