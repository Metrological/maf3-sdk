var TestView9 = new MAF.Class({
	Extends: MAF.views.SearchSuggest,

	ClassName: 'TestView9',

	config: {
		NoResultsMessage: $_('NO_RESULTS_FOUND')
	},

	initialize: function() {
		this.parent();
	},

	performRowSelected: function(item) {
		if (item) {
			MAF.application.previousView({
				city: item.name,
				lat: item.latitude,
				lng: item.longitude
			});
		}
	},

	performSearch: function(userInput) {
		getSuggestions(function(results) {
			this.dataReady(results, true);
		}.bindTo(this), userInput, this.persist.type);
	},

	cellContentUpdater: function(content, dataitem) {
		content.setText(dataitem.city + ' (' + dataitem.country + ')');
	}
});
