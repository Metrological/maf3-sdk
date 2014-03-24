var AutoStart = new MAF.Class({
	ClassName: 'AutoStart',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
		this.parent();
		this.registerMessageCenterListenerCallback(this.dataHasChanged);
	},

	dataHasChanged: function (event) {
		if (event.payload.value && event.payload.key === 'myApps') {
			this.startApp();
		}
	},

	startApp: function () {
		var apps = ApplicationManager.getApplications();
		if (apps && apps[0]) {
			ApplicationManager.load(apps[0]);
			ApplicationManager.open(apps[0]);
		}
	},

	focusView: function () {
		if (MAF.messages.exists('myApps')) {
			this.startApp();
		}
	}
});
