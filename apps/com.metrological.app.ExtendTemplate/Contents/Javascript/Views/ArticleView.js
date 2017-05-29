// Create a class and extended it from the BaseView
var ArticleView = new MAF.Class( {
	ClassName: 'ArticleView',

	Extends: BaseView,

	// Create the view template
	createView: function() {
		// Call BaseView's createView function
		this.parent();

		// Make an instance of our custom Container called Article
		this.elements.article = new Article( {
			styles:{
				width: this.width - 100,
				height: 800,
				hOffset: 50,
				vOffset: 100
			}
		} ).appendTo( this );
	},

	updateView: function() {
		// Call BaseView's updateView function
		this.parent();

		// Get an article from our fake API
		API.getArticle( '103', function( article ) {

			// Update our article with the retrieved data
			this.elements.article.updateTexts(
				article.title,
				article.desc,
				article.body
			);
		}, this );
	}
} );
