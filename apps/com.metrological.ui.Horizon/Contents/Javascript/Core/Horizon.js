var Horizon = (function (body) {
	var fontSize = '1em',
		fontColor = 'rgba(255,255,255,.4)',
		backgroundColor = 'rgba(0,0,0,.7)',
		floorHeight = 451,
		visible = true;

	Theme.Fonts.add('InterstatePro-Bold', 'Fonts/InterstatePro-Bold');
	Theme.Fonts.add('InterstatePro-ExtraLight', 'Fonts/InterstatePro-ExtraLight');
	Theme.Fonts.add('InterstatePro-Light', 'Fonts/InterstatePro-Light');
	Theme.Fonts.add('InterstatePro-Regular', 'Fonts/InterstatePro-Regular');
	Theme.Fonts.add('InterstatePro-Thin', 'Fonts/InterstatePro-Thin');
	Theme.Fonts.add('UPCDigital-Bold', 'Fonts/UPCDigital-Bold');
	Theme.Fonts.add('UPCDigital-Regular', 'Fonts/UPCDigital-Regular');

	MAF.mediaplayer.init();
//	ApplicationManager.getViewport().setStyle('transformStyle', 'preserve-3d');

	body.setStyle('transformOrigin', '50% 50%');

	var container = new Frame({
		styles: {
			width: 'inherit',
			height: 'inherit',
			backgroundColor: backgroundColor,
			backgroundImage: widget.getPath('Images/Horizon/Header.png'),
			backgroundRepeat: 'no-repeat',
			backgroundPosition: '50% 0%'
		}
	}).inject(body);

	container.animate({
		timingFunction: 'linear',
		delay: 1,
		duration: 1
	});

	var title = new Text({
		label: $_('APP_STORE'),
		styles: {
			hOffset: 134,
			vOffset: 47,
			color: fontColor,
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize,
			zOrder: 1
		}
	}).inject(container);

	var subtitle = new Text({
		label: $_('ALL APPS'),
		styles: {
			hOffset: title.hOffset,
			vOffset: title.height + title.vOffset,
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize,
			zOrder: 1
		}
	}).inject(container);

	var clock = new Text({
		label: Date.format(new Date(), 'HH:mm') + '<br/>' + Date.format(new Date(), 'ddd d MMM').toUpperCase(),
		styles: {
			hAlign: 'right',
			hOffset: 134,
			vOffset: title.vOffset,
			color: fontColor,
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize,
			textAlign: 'right',
			zOrder: 1
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
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize,
			color: fontColor,
			anchorStyle: 'center',
			truncation: 'end',
			zOrder: 1
		}
	}).inject(container);

	var floor = new Frame({
		styles: {
			width: 'inherit',
			height: floorHeight,
			top: 'auto',
			bottom: 0,
			transformOrigin: '50% 0%',
			backgroundImage: widget.getPath('Images/Horizon/FullFloor.png'),
			backgroundRepeat: 'no-repeat'
		}
	}).inject(container);

	if (!MAF.Browser.nds && !MAF.Browser.firefox) {
		floor.animate({
			origin: ['center', 'top'],
			duration: 0.6
		});
	}

	function updateNowPlaying() {
		var now = $_('NOW_PLAYING') + ' ';
		if (MAF.mediaplayer.isTVActive) {
			now += $_('LIVE_TV');
		} else {
			now += $_('APPS');
		}
		now += ' - ' + MAF.mediaplayer.currentAsset.title;
		playing.data = now;
	}

	function hideNowPlaying(callback) {
		if (!visible) {
			body.animate({
				scale: 1.6,
				delay: 5,
				duration: 0.6,
				callback: callback
			});
		} else if (callback) {
			callback();
		}
	}

	function showNowPlaying(callback) {
		if (!visible) {
			body.animate({
				scale: 1,
				duration: 0.6,
				callback: callback
			});
		} else if (callback) {
			callback();
		}
	}

	var animatingNowPlaying = false;
	function allowNowPlayingAnimation(animator) {
		animatingNowPlaying = false;
		if (animator) {
			animator.reset();
		}
	}
	function resetAndHideNowPlaying(animator) {
		if (animator) {
			animator.reset();
		}
		hideNowPlaying(allowNowPlayingAnimation);
	}

	(function playerEvents(event) {
		var states = this.constants.states;
		switch(event.payload.newState) {
			case states.INFOLOADED:
				updateNowPlaying();
				break;
			case states.STOP:
			case states.PAUSE:
			case states.PLAY:
				updateNowPlaying.delay(300);
				if (!animatingNowPlaying) {
					animatingNowPlaying = true;
					showNowPlaying(resetAndHideNowPlaying);
				}
				break;
		}
	}).subscribeTo(MAF.mediaplayer, 'onStateChange');

	(function channelEvents() {
		updateNowPlaying();
		if (ApplicationManager.active === widget.identifier || visible) {
			return;
		}
		if (!animatingNowPlaying) {
			animatingNowPlaying = true;
			showNowPlaying(resetAndHideNowPlaying);
		}
	}).subscribeTo(MAF.mediaplayer, 'onChannelChange');

	function hide() {
		visible = false;
		container.setStyle('backgroundColor', 'rgba(0,0,0,0)');
		floor.setStyles({
			transform: !MAF.Browser.nds && !MAF.Browser.firefox ? 'scale(2)' : null,
			bottom: -floorHeight
		});
		if (!animatingNowPlaying) {
			hideNowPlaying();
		}
	}

	function show() {
		body.setStyle('overflow', 'auto');
		showNowPlaying(function (animator) {
			if (animator) {
				animator.reset();
			}
			body.setStyles({
				overflow: null,
				transform: null
			});
		});
		visible = true;
		floor.setStyles({
			transform: null,
			bottom: 0
		});
		container.setStyle('backgroundColor', backgroundColor);
	}

	updateNowPlaying();

	return {
		hide: hide,
		show: show,
		setText: function (s) {
			subtitle.data = s;
		}
	};
}.call(window, document.body));
