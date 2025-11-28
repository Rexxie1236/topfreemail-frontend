module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2B6CB0',
        'primary-dark': '#1E4E8A',
        'bg-dim': '#0F1724',
        card: '#0B1220',
        muted: '#9AAFC8',
        strong: '#E6F0FF',
        success: '#2DD4BF',
        error: '#FF6B6B'
      },
      borderRadius: {
        xl2: '1rem'
      }
    }
  },
  plugins: []
}
