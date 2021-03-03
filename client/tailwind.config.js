module.exports = {
	purge: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		minHeight: {
			'min': 'min-content',
			'10': '2.5rem'
		},
		extend: {},
		colors: {
		  'gray-dark': {
				'50': '#808080',
				'100': '#7a7a7a',
				'200': '#707070',
				'300': '#5e5e5e',
				'400': '#4a4a4a',
				'500': '#363636',
				'600': '#212121',
				'700': '#0f0f0f',
				'800': '#050505',
				'900': '#000000',
		  },
		  'gray-light': {
				'50': '#ffffff',
				'100': '#fafafa',
				'200': '#f0f0f0',
				'300': '#dedede',
				'400': '#c9c9c9',
				'500': '#b5b5b5',
				'600': '#a1a1a1',
				'700': '#8f8f8f',
				'800': '#858585',
				'900': '#808080',
		  },
		},
	},
	variants: {
		extend: {
			'borderWidth': ['last'],
			'backgroundColor': ['even', 'odd'],
			'rotate': ['group-hover'],
			'margin': ['last', 'first'],
		},
	},
	plugins: [],
}
