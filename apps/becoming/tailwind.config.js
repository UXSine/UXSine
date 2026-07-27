/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — see DESIGN_SYSTEM.md, Layer 2.
        paper: '#F1EDE4', // daily-function page background
        flyleaf: '#E4DFD2', // secondary/reflective surface
        ink: '#17130E', // text, ALL state indication, dark identity surfaces
        garnet: '#521E28', // identity + user-initiated action only — never state
        midnight: '#202B3D', // evidence + data only
        gilt: '#A8894F', // graduation only
        pearl: '#F4F1EA', // text on dark surfaces
      },
      fontFamily: {
        // Caslon carries meaning, Plex carries function.
        display: ['"Libre Caslon Text"', 'Georgia', 'serif'],
        eyebrow: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        data: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        control: '12px',
        card: '20px',
        widget: '28px',
      },
      transitionTimingFunction: {
        // Structural spring — no overshoot (see Motion stance).
        structural: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
