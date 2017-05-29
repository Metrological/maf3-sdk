// Set base glow and focus theme
Theme.set({
	BaseGlow: {
		styles: {
			color: 'white',
			backgroundColor: 'transparent'
		}
	},
	BaseFocus: {
		styles: {
			backgroundColor: '#5f429c'
		}
	},
	'CustomStyling .ReuseKeyboard .item': {
		normal: {
			styles: {
				backgroundColor: 'transparent',
				color: 'white',
				border: '2px solid transparent',
				fontSize: 30,
				fontWeight: null,
				textShadow: '2px 2px rgba(0,0,0, 0.3)',
				borderRadius: 10
			}
		},
		focused: {
			styles: {
				backgroundColor: 'orange',
				fontWeight: 'bold'
			}
		}
	}
});
