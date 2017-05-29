var Article = new MAF.Class( {

	// Extend Article from MAF.element.Container
	Extends: MAF.element.Container,

	initialize: function() {
		// Call MAF.element.Container's initialize
		this.parent();

		this.createContent();
	},

	createContent: function() {
		this.elements = {};

		var title = this.elements.title = new MAF.element.Text( {
			label: 'title',
			styles: {
				fontSize: 45,
				width: 'inherit'
			}
		} ).appendTo( this );

		var description = this.elements.description = new MAF.element.Text( {
			label: 'desc',
			styles: {
				fontSize: 18,
				width: 'inherit',
				vOffset: title.outerHeight + 10
			}
		} ).appendTo( this );

		this.elements.body = new MAF.element.Text({
			label: 'body',
			wrap: true,
			styles: {
				fontSize: 22,
				width: 'inherit',
				vOffset: description.outerHeight + 20
			}
		} ).appendTo( this );
	},

	updateTexts: function( title, desc, body ) {
		// Set the labels of the Text objects
		this.elements.title.setText( title );
		this.elements.description.setText( desc );
		this.elements.body.setText( body );
	},

	suicide: function() {
		// Cleanup all the elements that we stored upon destroying the instance
		Object.forEach( this.elements, function( key, item ) {
			item.suicide();
			item = null;
		} );

		delete this.elements;

		// Call MAF.element.Container's suicide function
		this.parent();
	}
} );
