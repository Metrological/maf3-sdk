var getData = function () {
	// Trigger load inidicator
	MAF.utility.WaitIndicator.up();
	new Request({
		url: APIUrl,
		proxy: {
			json: true // Convert XML into JSON via proxy
		},
		onSuccess: function(json) {
			var data = json && json.rss && json.rss.channel || {};
			// Store data via message to signal the views that have a registerMessageCenterListenerCallback on the view
			MAF.messages.store('MyFeedData', data.item || []);
			// Unset load inidicator
			MAF.utility.WaitIndicator.down();
		}
	}).send();
};
