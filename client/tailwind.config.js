module.exports = {
	purge: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {},
		colors: {
			'primary': {
				'50': '#9cacd8',
				'100': '#98a9d7',
				'200': '#899dd1',
				'300': '#778dca',
				'400': '#617bc2',
				'500': '#4b68b9',
				'600': '#3b5397',
				'700': '#2f4379',
				'800': '#283967',
				'900': '#273763',
		  },
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
			'rotate': ['group-hover'],
			'margin': ['last', 'first'],
		},
	},
	plugins: [],
}
