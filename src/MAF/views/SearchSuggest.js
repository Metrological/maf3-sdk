define('MAF.views.SeachSuggest', function () {
	return new MAF.Class({
		ClassName: 'SearchSuggestView',
		Extends: MAF.system.SidebarView,

		config: {
			//BackButtonTitle: MAF.utility.INTL.get("Back") || "Back",
			//SearchButtonTitle: MAF.utility.INTL.get("Search") || "Search",
			//NoResultsMessage: MAF.utility.INTL.get("NO_RESULTS_FOUND") || "No results found",
			Cursor: "_",
			DisplayDefaultValue: "",
			AutocompleteThreshold: 3,
			GridRows: 6,
			GridColumns: 1,
			// ok, back to the regularly scheduled program
			bulletCharacter: "\u2022",
			secureMask: false,
			secureMaskType: "mask-submitted",
			formBackgroundColor: "#000",
			keyboard: {
				startFocused: true,
				maxLength: 15
			}
		},

		createView: emptyFn,
		updateView: emptyFn
	});
});
