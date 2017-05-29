// Create a class and extended it from the BaseView
var MovieView = new MAF.Class( {
	ClassName: 'MovieView',

	Extends: BaseView,

	// Create the view template
	createView: function() {
		this.parent();

		var title = new MAF.element.Text( {
			label: 'Movie of the Day',
			styles:{
				width: this.width - 100,
				fontSize: 45,
				vOffset: 100,
				hOffset: 50,
				anchorStyle: 'center'
			}
		} ).appendTo( this );

		var image = new MAF.element.Image( {
			src: 'Images/dracula.jpg',
			styles:{
				height: 400,
				vOffset: title.outerHeight,
				hAlign: 'center'
			}
		} ).appendTo( this );

		// Make an instance of our custom PercentageBar
		var ratingBar = this.elements.ratingBar = new PercentageBar( {
			barColor: '#5F429C',
			styles:{
				borderRadius:25,
				backgroundColor: 'grey',
				height: 50,
				width: this.width - 100,
				vOffset: image.outerHeight + 50,
				hOffset: 50
			}
		} ).appendTo( this );

		var yourRatingLabel = new MAF.element.Text( {
			label: 'Your Rating:',
			styles:{
				width: this.width - 100,
				fontSize: 35,
				hOffset: 50,
				anchorStyle: 'center',
				vOffset: ratingBar.outerHeight + 50
			}
		} ).appendTo( this );

		// Make an instance of our custom ValueSlider
		new ValueSlider( {
			minValue: 0,
			maxValue: 100,
			styles:{
				width: this.width - 100,
				vOffset: yourRatingLabel.outerHeight + 50,
				hOffset: 50
			},
			updateText: function( value ) { return value + '/100'; },
			events:{
				onValueChanged: function( event ) {
					log( 'Current Value:', event.payload.value );
				}
			}
		} ).appendTo( this );
	},

	updateView: function() {
		this.parent();

		//set the value of our RatingBar
		this.elements.ratingBar.setPercentage( 73 );
	}
} );
