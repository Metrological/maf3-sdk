// Create a new View class and extend it from the MAF.system.SidebarView
var ExampleView1 = new MAF.Class( {
	ClassName: 'ExampleView1', // CSS classname that is applied in the HTML

	Extends: MAF.system.SidebarView,

	// Create your view template
	createView: function() {

		// Create a Text element with translated label
		var textButtonLabel = new MAF.element.Text( {
			label: $_( 'MAF.control.TextButton' ),
			styles: {
				height: 40,
				width: 400,
				hOffset: ( this.width - 400 ) / 2
			}
		} ).appendTo( this ); // 'this' in the current scope is the current View

		// Create a Text button with a onSelect event
		var textButton = new MAF.control.TextButton( {
			label: $_( 'TextButton' ),
			styles: {
				width: textButtonLabel.width,
				height: 60,
				hOffset: textButtonLabel.hOffset,
				vOffset: textButtonLabel.outerHeight
			},
			textStyles: {
				anchorStyle: 'center'
			},
			events: {
				onSelect: function() {
					log( 'onSelect function TextButton' ); // This will log to your browser console
				}
			}
		} ).appendTo( this );

		var buttonLabel = new MAF.element.Text( {
			label: $_( 'MAF.element.Button' ),
			styles: {
				height: textButtonLabel.height,
				width: textButtonLabel.width,
				hOffset: textButton.hOffset,
				vOffset: textButton.outerHeight + 40
			}
		} ).appendTo( this );

		// Create a Button element and get styling from the Theme
		var elementButton = new MAF.element.Button( {
			styles: {
				width: textButtonLabel.width,
				height: textButton.height,
				hOffset: textButtonLabel.hOffset,
				vOffset: buttonLabel.outerHeight,
				backgroundColor: Theme.getStyles( 'BaseGlow', 'backgroundColor' )
			},
			events: {
				onFocus: function() {
					// Use animate to change scale
					this.animate( {
						duration: 0.2,
						scale: 1.2
					} );
				},
				onBlur: function() {
					this.animate( {
						duration: 0.2,
						scale: 1
					} );
				},
				onSelect: function() {
					log( 'onSelect function Button' );
				}
			}
		} ).appendTo( this );

		var controlButtonLabel = new MAF.element.Text( {
			label: $_( 'MAF.control.Button' ),
			styles: {
				height: textButtonLabel.height,
				width: textButtonLabel.width,
				hOffset: textButton.hOffset,
				vOffset: elementButton.outerHeight + 40
			}
		} ).appendTo( this );

		// Create a Button element with default styling from framework
		// Difference between a MAF.element.Button and MAF.control.Button
		// is basic styling and guid support
		var controlButton = new MAF.control.Button( {
			styles: {
				width: textButtonLabel.width,
				height: textButton.height,
				hOffset: textButtonLabel.hOffset,
				vOffset: controlButtonLabel.outerHeight
			},
			events: {
				onSelect: function() {
					log( 'onSelect function Button' );
				}
			}
		} ).appendTo( this );

		var imageToggleButtonLabel = new MAF.element.Text( {
			label: $_( 'MAF.control.ImageToggleButton' ),
			styles: {
				height: textButtonLabel.height,
				width: textButtonLabel.width,
				hOffset: textButtonLabel.hOffset,
				vOffset: controlButton.outerHeight + 40
			}
		} ).appendTo( this );

		// Create an ImageToggleButton
		var imageToggleButton = new MAF.control.ImageToggleButton( {
			label: $_( 'ImageToggleButton' ),
			value: '0', // This needs to be a string.
			theme: false, // Disable standard Theme
			options: [
				{ value: '0', src: 'Images/ButnOff.png' },
				{ value: '1', src: 'Images/ButnOn.png' }
			],
			styles: {
				height: textButton.height,
				width: textButtonLabel.width,
				hOffset: textButtonLabel.hOffset,
				vOffset: imageToggleButtonLabel.outerHeight,
				backgroundColor: Theme.getStyles( 'BaseGlow', 'backgroundColor' )
			},
			textStyles: {
				fontSize: 22,
				vOffset: 2,
				hOffset: 10
			},
			events: {
				onFocus: function() {
					if ( parseInt( this.getValue(), 10 ) === 1 )
						this.valueDisplay.setSource( 'Images/ButnOnF.png' );
					else
						this.valueDisplay.setSource( 'Images/ButnOffF.png' );
				},
				onBlur: function() {
					if ( parseInt( this.getValue(), 10 ) === 1 )
						this.valueDisplay.setSource( 'Images/ButnOn.png' );
					else
						this.valueDisplay.setSource( 'Images/ButnOff.png' );
				},
				onValueChanged: function( event ) {
					var value = parseInt( event.payload.value, 10 );

					log( 'onValueChanged function ImageToggleButton', value );

					this.valueDisplay.setSource( value === 1 ? 'Images/ButnOnF.png' : 'Images/ButnOffF.png' );

					// Prevent default behaviour
					event.stop();
					// event.stop(); calls both event.preventDefault() and event.stopPropagation();
				}
			}
		} ).appendTo( this );

		var toggleButtonLabel = new MAF.element.Text( {
			label: $_( 'MAF.control.ToggleButton' ),
			styles: {
				height: textButtonLabel.height,
				width: textButtonLabel.width,
				hOffset: textButtonLabel.hOffset,
				vOffset: imageToggleButton.outerHeight + 40
			}
		} ).appendTo( this );

		// Create a ToggleButton
		// Since we do not reference it later, we do not need to store it in a variable
		new MAF.control.ToggleButton( {
			label: $_( 'ToggleButton' ),
			value: '0',
			styles: {
				height: textButton.height,
				width: textButtonLabel.width,
				hOffset: textButtonLabel.hOffset,
				vOffset: toggleButtonLabel.outerHeight
			},
			options: [
				{ value: '0', label: $_( 'Option1' ) },
				{ value: '1', label: $_( 'Option2' ) }
			],
			events: {
				onValueChanged: function( event ) {
					var value = parseInt( event.payload.value, 10 );
					log( 'onValueChanged function ToggleButton', value );
				}
			}
		} ).appendTo( this );

		// Create a TextButton to load the next view, by adding it into
		// the view.controls object and adding an unique guid the focus
		// will be remembered by the view
		this.controls.nextView = new MAF.control.TextButton( {
			guid: 'loadExampleView2',
			label: $_( 'ExampleView2' ),
			styles: {
				width: textButtonLabel.width,
				height: textButton.height,
				hOffset: textButtonLabel.hOffset,
				vOffset: this.height - 100
			},
			textStyles: {
				hOffset: 10
			},
			content: [
				new MAF.element.Text( {
					label: FontAwesome.get( 'chevron-right' ), // Create a FontAwesome icon
					styles: {
						height: 'inherit',
						width: 'inherit',
						hOffset: -10,
						anchorStyle: 'rightCenter'
					}
				} )
			],
			events: {
				onSelect: function() {
					// Load next Example view with data
					MAF.application.loadView( 'Example2', {
						myData: [ 1, 2, 3 ]
					} );
				}
			}
		} ).appendTo( this );
	},

	// After create view and when returning to the view the update view is called
	updateView: function() {
		// Data transfered from the previous view
		var myBackData = this.backParams.myBackData;
		if ( myBackData )
			log( 'updateView recieved data from previous view', myBackData );
	}
} );
