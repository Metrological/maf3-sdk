define('MAF.utility.timer', function () {
	return {
		setInterval: function (callback, poll) {
			var timer = new Timer();
			timer.onTimerFired = callback;
			timer.interval = poll / 1000;
			timer.ticking = true;
			return timer;
		},
		clearInterval: function (timer) {
			timer.ticking = false;
			delete timer;
		},
		setTimeout: function (callback, poll) {
			var timer = new Timer();
			timer.onTimerFired = function() {
				this.ticking = false;
				callback();
			};
			timer.interval = poll / 1000;
			timer.ticking = true;
			return timer;
		},
		clearTimeout: function (timer) {
			timer.ticking = false;
			delete timer;
		}
	};
});
