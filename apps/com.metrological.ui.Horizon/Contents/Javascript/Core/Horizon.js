var Horizon = (function (body) {
	var fontSize = 22;

	MAF.mediaplayer.init();

	var container = new Frame({
		styles: {
			width: 'inherit',
			height: 'inherit',
			backgroundImage: widget.getPath('Images/Horizon/Header.png'),
			backgroundRepeat: 'no-repeat',
			backgroundPosition: '50% 0%',
			zIndex: 1
		}
	}).inject(body);

	var title = new Text({
		label: $_('APP STORE'),
		styles: {
			hOffset: 134,
			vOffset: 47,
			color: 'rgba(255,255,255,.6)',
			fontSize: fontSize
		}
	}).inject(container);

	var subtitle = new Text({
		label: $_('ALL APPS'),
		styles: {
			hOffset: title.hOffset,
			vOffset: title.height + title.vOffset,
			fontSize: fontSize
		}
	}).inject(container);

	var clock = new Text({
		label: Date.format(new Date(), 'HH:mm') + '<br/>' + Date.format(new Date(), 'ddd d MMM').toUpperCase(),
		styles: {
			hAlign: 'right',
			hOffset: 134,
			vOffset: title.vOffset,
			color: 'rgba(255,255,255,.6)',
			fontSize: fontSize,
			textAlign: 'right'
		}
	}).inject(container);

	(function updateClock() {
		clock.data = Date.format(new Date(), 'HH:mm') + '<br/>' + Date.format(new Date(), 'ddd d MMM').toUpperCase();
	}).periodical(60000);

	var playing = new Text({
		styles: {
			width: 800,
			height: 40,
			hOffset: 560,
			vOffset: 47,
			fontSize: fontSize,
			color: 'rgba(255,255,255,.6)',
			anchorStyle: 'center',
			truncation: 'end'
		}
	}).inject(container);

	(function updatePlaying() {
		var now = $_('NOW PLAYING') + ' ';
		if (MAF.mediaplayer.isTVActive) {
			now += $_('LIVE TV');
		} else {
			now += $_('APPS');
		}
		now += ' - ' + MAF.mediaplayer.currentAsset.title;
		playing.data = now;
	}).periodical(1000);

	function clearAnimator(animator) {
		animator.reset();
	}

	function hide(callback) {
		body.animate({
			scale: 1.6,
			timingFunction: 'linear',
			delay: 5,
			duration: 0.6,
			callback: callback || clearAnimator
		});
	}

	function show(callback) {
		body.animate({
			scale: 1,
			timingFunction: 'linear',
			delay: 0.1,
			duration: 0.15,
			callback: callback || clearAnimator
		});
	}

	(function playerEvents(event) {
		var states = this.constants.states;
		if (ApplicationManager.active === widget.identifier) {
			return;
		}
		switch(event.payload.newState) {
			case states.STOP:
			case states.PLAY:
				show(function (animator) {
					animator.reset();
					hide();
				});
				break;
		}
	}).subscribeTo(MAF.mediaplayer, 'onStateChange');

	(function channelEvents() {
		if (ApplicationManager.active === widget.identifier) {
			return;
		}
		show(function (animator) {
			animator.reset();
			hide();
		});
	}).subscribeTo(MAF.mediaplayer, 'onChannelChange');

	return {
		hide: hide,
		show: show
	};
}.call(window, document.body));
