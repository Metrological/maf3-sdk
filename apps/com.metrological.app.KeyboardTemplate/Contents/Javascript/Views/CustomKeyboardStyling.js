// Create a new View class and extend it from the MAF.system.FullscreenView
var CustomKeyboardStyling = new MAF.Class( {
	ClassName: 'CustomKeyboardStyling',

	Extends: MAF.system.FullscreenView,

	initView: function() {
		this.setStyle( 'backgroundColor', 'rgba(0, 0, 0, 0.8)' );
	},

	// Create the view template
	createView: function() {
		var backButton = new MAF.control.BackButton( {
			label: $_( 'BACK' )
		} ).appendTo( this );

		var keyboardInput = this.elements.keyboardInput = new MAF.element.Text( {
			label: $_( 'General_searchBar' ),
			styles: {
				width: this.width - 200,
				height: 70,
				hOffset: 60,
				vOffset: backButton.outerHeight + 50,
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				truncation: 'end',
				paddingLeft: 20,
				paddingRight: 20,
				paddingTop: 10,
				color: '#F1F1F1',
				textAlign: 'leftCenter',
				fontSize: 30,
				borderRadius: 10
			}
		} ).appendTo( this );

		new MAF.control.TextButton( {
			guid: 'keyboardButtonClear',
			label: FontAwesome.get( 'times' ),
			theme: false,
			styles: {
				fontSize: 40,
				width: 60,
				height: keyboardInput.height,
				hOffset: keyboardInput.outerWidth + 20,
				vOffset: keyboardInput.vOffset,
				backgroundColor: Theme.getStyles( 'BaseGlow', 'backgroundColor' ),
				borderRadius: 10
			},
			textStyles: { anchorStyle: 'center' },
			events: {
				onSelect: function() {
					log( 'Clear keyboard value' );
					this.owner.elements.keyboard.clearValue();
					this.owner.elements.keyboardInput.setText( $_( 'General_searchBar' ) );
				},
				onFocus: function() {
					this.setStyle( 'backgroundColor', 'orange' );
				},
				onBlur: function() {
					this.setStyle( 'backgroundColor', Theme.getStyles( 'BaseGlow', 'backgroundColor' ) );
				}
			}
		} ).appendTo( this );

		// By using a ClassName on your element you can use specific custom CSS in your theme
		// See the Javascript/Theme.js file for an example of the class definition
		this.elements.keyboard = new MAF.control.Keyboard( {
			ClassName: 'CustomStyling',
			controlSize: 'small',
			maxLength: 80,
			styles: {
				width: this.width,
				vOffset: keyboardInput.outerHeight + 20
			},
			autoAdjust: true,
			availableLayouts: [ 'custom_alpha', 'custom_digits' ],
			KeyLayouts: [ {
				id: 'custom_alpha',
				label: 'abc',
				glyph: '',
				keyrows: [ [
					{ keyid: 'key-a' },
					{ keyid: 'key-b' },
					{ keyid: 'key-c' },
					{ keyid: 'key-d' },
					{ keyid: 'key-e' },
					{ keyid: 'key-f' },
					{ keyid: 'key-g' },
					{ keyid: 'key-h' },
					{ keyid: 'key-i' },
					{ keyid: 'key-j' },
					{ keyid: 'key-k' },
					{ keyid: 'key-l' },
					{ keyid: 'key-m' },
					{ keyid: 'key-n' },
					{ keyid: 'key-o' },
					{ keyid: 'key-p' },
					{ keyid: 'key-q' },
					{ keyid: 'key-r' },
					{ keyid: 'key-s' },
					{ keyid: 'key-t' },
					{ keyid: 'key-u' },
					{ keyid: 'key-v' },
					{ keyid: 'key-w' },
					{ keyid: 'key-x' },
					{ keyid: 'key-y' },
					{ keyid: 'key-z' },
					{ keyid: 'key-uspace' },
					{ keyid: 'action-backspace' },
					{ keyid: 'action-nextlayout' }
				] ]
			}, {
				id: 'custom_digits',
				label: '123',
				glyph: '',
				keyrows: [ [
					{ keyid: 'key-1' },
					{ keyid: 'key-2' },
					{ keyid: 'key-3' },
					{ keyid: 'key-4' },
					{ keyid: 'key-5' },
					{ keyid: 'key-6' },
					{ keyid: 'key-7' },
					{ keyid: 'key-8' },
					{ keyid: 'key-9' },
					{ keyid: 'key-0' },
					{ keyid: 'action-backspace' },
					{ keyid: 'action-nextlayout' }
				] ]
			} ],
			events: {
				onValueChanged: function( event ) {
					this.owner.elements.keyboardInput.setText( event.payload.value );
				}
			}
		} ).appendTo( this );
	}
} );
