var PercentageBar = new MAF.Class( {
	Extends: MAF.element.Container,

	initialize: function() {
		// Call MAF.element.Container's initialize function
		this.parent();

		this.elements = {};

		this.elements.bar = new MAF.element.Container( {
			styles:{
				height: this.height,
				backgroundColor: this.config.barColor
			}
		} ).appendTo( this );

		this.elements.label = new MAF.element.Text( {
			label: '0/100',
			styles: {
				width: this.width,
				height: this.height,
				anchorStyle: 'center'
			}
		} ).appendTo( this );
	},

	// Alter the width of the inner bar to match the percentage
	setPercentage: function( percentage ) {
		this.elements.bar.setStyle( 'width', ( this.width / 100 ) * percentage );
		this.elements.label.setText( percentage + '/100' );
	},

	suicide: function(){
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
