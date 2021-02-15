module.exports = {
	purge: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {},
		colors: {
			'gray': {
				'50': '#ebebeb',
				'100': '#e3e3e3',
				'200': '#d1d1d1',
				'300': '#b3b3b3',
				'400': '#8f8f8f',
				'500': '#666666',
				'600': '#424242',
				'700': '#242424',
				'800': '#121212',
				'900': '#0a0a0a',
			},
			'indigo': {
				'50': '#9aace0',
				'100': '#93a7dc',
				'200': '#8298d4',
				'300': '#6983c9',
				'400': '#4e6bbc',
				'500': '#394f8e',
				'600': '#273762',
				'700': '#19233e',
				'800': '#101628',
				'900': '#0d1221',
			},
		},
		minHeight: {
			'80': '20rem',
		}
	},
	variants: {
		extend: {
			'rotate': ['group-hover'],
		},
	},
	plugins: [],
}
