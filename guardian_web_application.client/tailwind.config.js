/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
          "./index.html",
          "./src/**/*.{js,jsx,ts,tsx}",
     ],
     theme: {
     	extend: {
     		borderRadius: {
     			lg: 'var(--radius)',
     			md: 'calc(var(--radius) - 2px)',
     			sm: 'calc(var(--radius) - 4px)'
     		},
     		colors: {
     			background: 'hsl(var(--background))',
     			foreground: 'hsl(var(--foreground))',
     			card: {
     				DEFAULT: 'hsl(var(--card))',
     				foreground: 'hsl(var(--card-foreground))'
     			},
     			popover: {
     				DEFAULT: 'hsl(var(--popover))',
     				foreground: 'hsl(var(--popover-foreground))'
     			},
     			primary: {
     				DEFAULT: 'hsl(var(--primary))',
     				foreground: 'hsl(var(--primary-foreground))'
     			},
     			secondary: {
     				DEFAULT: 'hsl(var(--secondary))',
     				foreground: 'hsl(var(--secondary-foreground))'
     			},
     			muted: {
     				DEFAULT: 'hsl(var(--muted))',
     				foreground: 'hsl(var(--muted-foreground))'
     			},
     			accent: {
     				DEFAULT: 'hsl(var(--accent))',
     				foreground: 'hsl(var(--accent-foreground))'
     			},
     			destructive: {
     				DEFAULT: 'hsl(var(--destructive))',
     				foreground: 'hsl(var(--destructive-foreground))'
     			},
     			border: 'hsl(var(--border))',
     			input: 'hsl(var(--input))',
     			ring: 'hsl(var(--ring))',
     			chart: {
     				'1': 'hsl(var(--chart-1))',
     				'2': 'hsl(var(--chart-2))',
     				'3': 'hsl(var(--chart-3))',
     				'4': 'hsl(var(--chart-4))',
     				'5': 'hsl(var(--chart-5))'
     			}
     		}
          },
          fontFamily: {
               audiowide: ['Audiowide', 'cursive'],
               inter: ['Inter', 'sans-serif'],
               roboto: ['Roboto', 'sans-serif'],
               openSans: ['Open Sans', 'sans-serif'],
               lato: ['Lato', 'sans-serif'],
               montserrat: ['Montserrat', 'sans-serif'],
               merriweather: ['Merriweather', 'serif'],
               georgia: ['Georgia', 'serif'],
               playfair: ['Playfair Display', 'serif'],
               times: ['Times New Roman', 'serif'],
               poppins: ['Poppins', 'sans-serif'],
               oswald: ['Oswald', 'sans-serif'],
               bebas: ['Bebas Neue', 'cursive'],
               audiowide: ['Audiowide', 'cursive'],
               courier: ['Courier New', 'monospace'],
               sourceCode: ['Source Code Pro', 'monospace'],
               jetBrains: ['JetBrains Mono', 'monospace'],
          }
     },
     plugins: [require("tailwindcss-animate")],
};