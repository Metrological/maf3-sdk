define('MAF.utility.WaitIndicator', function () {
	var tasks = 0,
		last = null,
		stale = 60,
		active = false,
		timer = new Timer(6, function() {
					MAF.utility.WaitIndicator.police(true);
				});
	return {
		up: function () {
			tasks = tasks + 1;
			last = Date.now();
			return this.check();
		},
		down: function () {
			tasks = Math.max(0, tasks - 1);
			return this.check();
		},
		on: function () {
			return (this.tasks > 0) ? (last = Date.now()) && this.check() : this.up();
		},
		off: function () {
			this.hide(true);
		},
		show: function (force) {
			timer.start();
			return active || (active=true) && MAF.utility.BusyIndicators.check(tasks);
		},
		hide: function (force) {
			if (force) {
				tasks = 0;
			}
			
			return !active || (active=false) || MAF.utility.BusyIndicators.check(tasks);
		},
		police: function (force) {
			if (force || last + 1000 * stale < Date.now()) {
				timer.stop();
				return this.hide(true);
			}
		},
		toggle: function () {
			return active ? this.hide(true) : (tasks = 1) && this.show();
		},
		check: function () {
			if (tasks > 0) {
				this.show();
			} else {
				this.hide();
			}
			this.police();
			return tasks;
		}
	};
});