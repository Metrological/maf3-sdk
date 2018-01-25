var ValueSlider = new MAF.Class( {
	ClassName: 'ValueSlider',

	Extends: MAF.element.Container,

	config: {
		styles: {
			fontSize: 28,
			height: 70,
			transform: 'translateZ(0)'
		}
	},

	minValue: -1,
	maxValue: -1,
	value: -1,

	// This function toggles the blocking of the back button.
	toggleBackBlock: function( block ) {
		if ( block )
			this.keyHandler = ( function( event ) {
				event.stop();
			} ).subscribeTo( MAF.application, 'onActivateBackButton', this );
		else if (this.keyHandler ) {
			this.keyHandler.unsubscribeFrom( MAF.application, 'onActivateBackButton' );
			delete this.keyHandler;
		}
	},

	// This function enables custom display methods for the current value set from the view
	buildText: function( value ) {
		if ( this.config.updateText && this.config.updateText.call )
			return this.config.updateText.call( this, value );

		return value;
	},

	initialize: function() {
		// Call MAF.element.Container's initialize function
		this.parent();

		this.elements = {};

		// Use values from the config object set from the view to set internal vars
		if ( this.config.minValue )
			this.minValue = this.config.minValue;

		if ( this.config.maxValue )
			this.maxValue = this.config.maxValue;

		this.stepWidth = ( this.config.styles.width - 123 ) / ( Math.abs( this.minValue - this.maxValue ) - 1 );

		this.elements.slideBar = new MAF.element.Container( {
			styles: {
				height: 20,
				width: this.config.styles.width,
				backgroundColor: '#333333',
				border: '1px solid #636262',
				borderRadius: 10,
				vOffset: 25
			}
		} ).appendTo( this );

		this.elements.slideButton = new MAF.control.TextButton( {
			label: this.buildText( this.config.minValue ),
			styles: {
				height: 70,
				width: 123,
				backgroundColor: '#333333',
				border: '1px solid #636262',
				color: '#F1F1F1',
				boxShadow: '1px 1px 5px 0 rgba(0,0,0,0.5)',
				transform: 'translateZ(0)'
			},
			textStyles:{
				anchorStyle: 'center',
				fontSize: 20
			},
			events: {
				onSelect: function() {
					var slider = this.owner;
					var currentStep = slider.retrieve( 'currentStep' );

					if ( !this.retrieve( 'active' ) ) {

						this.store( 'active', true );

						slider.toggleBackBlock( true );

						this.animate( {
							scale: 1.2,
							duration: 0.3
						} );
					} else {

						this.store( 'active', false );

						if ( slider.value !== currentStep ) {
							slider.value = currentStep;
							slider.fire( 'onValueChanged', { value: slider.value } );
						}

						slider.toggleBackBlock( false );

						this.animate( {
							scale: 1,
							duration: 0.3
						} );
					}
				},
				onNavigate: function( event ) {
					var slider = this.owner;
					var direction = event.payload.direction;
					var currentStep = slider.retrieve( 'currentStep' );

					if ( !this.retrieve( 'active' ) ) return;

					event.stop();

					if ( !currentStep ) currentStep = 0;

					if ( direction === 'left' && currentStep > slider.minValue )
						currentStep--;
					else if ( direction === 'right' && currentStep < slider.maxValue )
						currentStep++;

					slider.store( 'currentStep', currentStep );

					this.hOffset = slider.stepWidth * currentStep;
					this.setText( slider.buildText( currentStep ) );
				}
			}
		} ).appendTo( this );
	},

	suicide: function() {
		// Cleanup all the elements that we stored upon destroying the instance
		Object.forEach( this.elements, function( key, item ) {
			item.suicide();
			item = null;
		} );

		this.elements = null;

		// Call MAF.element.Container's suicide function
		this.parent();
	}
} );
