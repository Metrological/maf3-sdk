var SearchSuggestView = new MAF.Class({
	Extends: MAF.views.SearchSuggest,

	ClassName: 'SearchSuggestView',

	config: {
		NoResultsMessage: $_('NO_RESULTS_FOUND')
	},

	initialize: function() {
		this.parent();
	},

	performRowSelected: function(item) {
		if (item) {
			console.log('performRowSelected', item);

			MAF.application.previousView({
				city: item.name,
				lat: item.latitude,
				lng: item.longitude
			});
		}
	},

	performSearch: function(userInput) {
		log('performSearch', userInput);
		getSuggestions(function(results) {
			var items = [];
			for (var i = 0; i < results.length; i++) {
				items.push({ label: results[i].name + ' (' + results[i].cname + ')', value: results[i]});
			}
			this.dataReady(results);
		}.bindTo(this), userInput, this.persist.type);
	},

	cellContentUpdater: function(content, dataitem) {
		content.setText(dataitem.city + ' (' + dataitem.country + ')');
	}
});
