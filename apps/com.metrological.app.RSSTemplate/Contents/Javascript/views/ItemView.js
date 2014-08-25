// Create a class and extended it from the MAF.system.SidebarView
var ItemView = new MAF.Class({
	Extends: MAF.system.SidebarView,

	ClassName: 'ItemView',

	// Add back params when going to the previous view
	viewBackParams: {
		reset: false
	},

	// Create your view template
	createView: function () {
		// Reference to the current view
		var view = this;

		var backButton = view.elements.backButton = new MAF.control.BackButton({
			label: $_('BACK'),
			backParams: view.viewBackParams // Add backParms on select of BackButton
		}).appendTo(view);

		view.elements.myTextGrid = new MAF.element.TextGrid({
			styles: {
				width: view.width,
				height: (view.height - backButton.height - 20),
				vOffset: backButton.outerHeight,
				fontSize: 24,
				wrap: true
			}
		}).appendTo(view);
	},

	// When view is created or returning to view the view is updated
	updateView: function () {
		var view = this,
			item = view.persist.item;
		if (typeOf(item) === 'object')
			view.elements.myTextGrid.setText(item.title + '<br />' + Date.format(Date.parse(item.pubDate, DateFormat.RSS)) + '<br /><br />' + item.description);
	}
});
