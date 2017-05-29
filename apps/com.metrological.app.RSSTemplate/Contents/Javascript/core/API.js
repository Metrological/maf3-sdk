var getData = function() {
	// Trigger load indicator, only for Sidebar Apps
	MAF.utility.WaitIndicator.up();

	new Request( {
		url: 'http://www.apple.com/main/rss/hotnews/hotnews.rss',
		proxy: {
			json: true // Convert XML into JSON via our proxy
		},
		timeout: 3000, // Timout for the request in miliseconds
		onComplete: function() {
			// Unset load indicator
			MAF.utility.WaitIndicator.down();
		},
		onSuccess: function( json ) {
			var data = json && json.rss && json.rss.channel || {};
			// Do not forget to validate your data!

			// Store data via MAF.messages to fire an event that triggers
			// views that have a registerMessageCenterListenerCallback registered
			MAF.messages.store( 'MyFeedData', data.item || [] );
		},
		// Handle any error in loading your data here
		onError: function( xhr ) {
			log( xhr.statusText );
		},
		// Handle any failure in loading your data here
		onFailure: function( xhr ) {
			log( xhr.statusText );
		},
		// Runs when the Request's timeout is reached
		onTimeout: function() {
			log( 'Timeout reached' );
		}
	} ).send();
};
