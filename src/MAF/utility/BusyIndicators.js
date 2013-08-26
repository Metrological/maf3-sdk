define('MAF.utility.BusyIndicators', function () {
	//0: 'no indicators', 
	//1: 'small spinner only', 
	//2: 'dimmed loading overlay', 
	//3: 'clear loading overlay' 
	return {
		check: function (state) {
			state = state || 0;
			if (MAF.utility.LoadingOverlay.check()) {
				state = 2;
			} else if (MAF.utility.WaitIndicator.check() > 0) {
				state = 1;
			}
			return MAF.HostEventManager.send('setWaitIndicator', state);
		}
	};
});