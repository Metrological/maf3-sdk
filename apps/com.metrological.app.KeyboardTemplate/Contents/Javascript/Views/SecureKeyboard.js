// Create a new View class and extend it from the MAF.system.SidebarView
var SecureKeyboard = new MAF.Class( {
	ClassName: 'SecureKeyboard',

	Extends: MAF.system.SidebarView,

	// Create the view template
	createView: function() {
		var backButton = new MAF.control.BackButton( {
			label: $_( 'BACK' )
		} ).appendTo( this );

		var keyboardInput = this.elements.keyboardInput = new MAF.element.Text( {
			label: $_( 'General_searchBar' ),
			styles: {
				width: this.width - 75,
				height: 70,
				hOffset: 5,
				vOffset: backButton.outerHeight + 50,
				backgroundColor: 'black',
				truncation: 'end',
				paddingLeft: 20,
				paddingRight: 20,
				paddingTop: 10,
				color: '#F1F1F1',
				textAlign: 'leftCenter',
				fontSize: 30,
				border: '2px solid #F1F1F1',
				borderRadius: 10
			}
		} ).appendTo( this );

		new MAF.control.TextButton( {
			guid: 'keyboardButtonExit',
			label: FontAwesome.get( 'times' ),
			styles: {
				fontSize: 40,
				width: 60,
				height: keyboardInput.height,
				hOffset: keyboardInput.outerWidth + 5,
				vOffset: keyboardInput.vOffset,
				backgroundColor: 'black',
				border: '2px solid #F1F1F1',
				borderRadius: 10
			},
			textStyles: {
				paddingLeft: 12,
				marginTop: -3
			},
			events: {
				onSelect: function() {
					log( 'Clear keyboard value' );
					this.owner.elements.keyboard.clearValue();
					this.owner.elements.keyboardInput.setText( $_( 'General_searchBar' ) );
				}
			}
		} ).appendTo( this );

		this.elements.keyboard = new MAF.control.Keyboard( {
			secureMask: true,
			secureMaskType: 'mask-character',
			bulletCharacter: '\u2022',
			styles: {
				vOffset: keyboardInput.outerHeight + 20
			},
			events: {
				onValueChanged: function( event ) {
					this.owner.elements.keyboardInput.setText(
						this.getDisplayValue( event.payload.value )
					);
				}
			},
			methods: {
				getDisplayValue: function( value ) {
					// This is adapted behaviour from the TextEntryButton
					// Plain keyboard does not support this by default
					var output   = '';
					var vLength  = value.length;
					var bullet   = this.config.bulletCharacter;
					var masktype = this.config.secureMaskType;
					var masked   = bullet.repeat( vLength );

					if ( this.config.secureMask && masktype && vLength ) {
						if ( masktype === 'mask-character' )
							output = bullet.repeat( vLength - 1 ) + value.charAt( vLength - 1 );
						else if ( masktype === 'mask-submitted' ) output = value;
						else if ( masktype === 'mask-all' ) output = masked;
						else output = masked;
					} else if ( vLength ) output = value;

					return output.htmlEscape();
				}
			}
		} ).appendTo( this );
	}
} );
