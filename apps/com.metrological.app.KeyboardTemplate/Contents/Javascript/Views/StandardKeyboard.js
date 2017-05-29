// Create a new View class and extend it from the MAF.system.SidebarView
var StandardKeyboard = new MAF.Class( {
	ClassName: 'StandardKeyboard',

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
			styles: {
				vOffset: keyboardInput.outerHeight + 20
			},
			events:{
				onValueChanged: function( event ) {
					log( 'onValueChanged function value:', event.payload.value );
					this.owner.elements.keyboardInput.setText( event.payload.value );
				}
			}
		} ).appendTo( this );
	}
} );
