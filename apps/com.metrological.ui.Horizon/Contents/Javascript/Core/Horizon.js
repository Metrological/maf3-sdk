var Horizon = (function (body) {
	var fontSize = '1em',
		fontColor = 'rgba(255,255,255,.4)',
		portalFade = widget.getSetting('portal') === 'fade',
		hidden = false,
		showing = true,
		visible = true,
		sideBySide = false;

	Theme.Fonts.add('InterstatePro-Bold', 'Fonts/InterstatePro-Bold');
	Theme.Fonts.add('InterstatePro-ExtraLight', 'Fonts/InterstatePro-ExtraLight');
	Theme.Fonts.add('InterstatePro-Light', 'Fonts/InterstatePro-Light');
	Theme.Fonts.add('InterstatePro-Regular', 'Fonts/InterstatePro-Regular');
	Theme.Fonts.add('InterstatePro-Thin', 'Fonts/InterstatePro-Thin');
	Theme.Fonts.add('UPCDigital-Bold', 'Fonts/UPCDigital-Bold');
	Theme.Fonts.add('UPCDigital-Regular', 'Fonts/UPCDigital-Regular');

	Theme.Fonts.setDefault('InterstatePro-Regular');

	MAF.mediaplayer.init();

	body.setStyles({
		opacity: portalFade ? 1 : null,
		transform: 'scale(1)',
		transformOrigin: '50% 50%',
		transition: 'all 0.4s ease'
	});

	var background = new Frame({
		styles: {
			transform: portalFade ? 'translate3d(0,0,0)' : null,
			width: 1920,
			height: 1080,
			backgroundImage: widget.getPath('Images/Horizon/PortalBackground.png'),
			backgroundRepeat: 'no-repeat'
		}
	}).inject(body);

	var blockedText = new Text({
		label: $_('BLOCKEDTEXT'),
		styles: {
			width: 1920 - 664,
			hOffset: 644,
			vAlign: 'center',
			color: fontColor,
			fontFamily: 'InterstatePro-Light',
			fontSize: '1.15em',
			textAlign: 'center',
			visible: false
		}
	}).inject(body);

	var header = new Frame({
		styles: {
			width: 'inherit',
			height: 'inherit',
			backgroundRepeat: 'no-repeat',
			backgroundPosition: '50% 0%'
		}
	}).inject(body);

	var title = new Text({
		label: $_('APP_STORE'),
		styles: {
			hOffset: 134,
			vOffset: 47,
			color: fontColor,
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize
		}
	}).inject(header);

	var subtitle = new Text({
		label: $_('ALL_APPS'),
		styles: {
			transform: 'translateZ(0)',
			hOffset: title.hOffset,
			vOffset: title.height + title.vOffset,
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize
		}
	}).inject(header);

	var clock = new Text({
		label: Date.format(new Date(), 'HH:mm') + '<br/>' + Date.format(new Date(), 'ddd D MMM').toUpperCase(),
		styles: {
			transform: 'translateZ(0)',
			hAlign: 'right',
			hOffset: 134,
			vOffset: title.vOffset,
			color: fontColor,
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize,
			textAlign: 'right'
		}
	}).inject(header);

	(function updateClock() {
		clock.data = Date.format(new Date(), 'HH:mm') + '<br/>' + Date.format(new Date(), 'ddd D MMM').toUpperCase();
	}).periodical(60000);

	var playing = new Text({
		styles: {
			transform: 'translateZ(0)',
			width: 800,
			height: 40,
			hOffset: 560,
			vOffset: 47,
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize,
			color: fontColor,
			anchorStyle: 'center',
			truncation: 'end'
		}
	}).inject(header);

	function updateNowPlaying() {
		var title = MAF.mediaplayer.currentAsset.title,
			now = '';
		if (title) {
			now += $_('NOW_PLAYING') + ' ';
			if (MAF.mediaplayer.isTVActive) {
				now += $_('LIVE_TV');
			} else {
				now += $_('APPS');
			}
			now += ' - ' + title;
		}
		playing.data = now;
	}

	function blocked() {
		return !showing && MAF.mediaplayer.isTVActive && widget.getSetting('blocked') && !MAF.mediaplayer.currentAsset.title;
	}

	function updateHeader() {
		if (blocked()) {
			background.setStyle('backgroundImage', widget.getPath('Images/Horizon/BlockedBackground.png'));
			blockedText.visible = !showing;
		} else if (!showing && sideBySide) {
			blockedText.visible = false;
			background.setStyle('backgroundImage', widget.getPath('Images/Horizon/SidebarBackground.png'));
		} else if (!showing && !visible) {
			blockedText.visible = false;
			background.setStyle('backgroundImage', null);
		}
	}

	var animationTimer;

	function hideNowPlaying(callback) {
		if (!visible && !sideBySide && !blocked() && !Browser.activevideo) {
			updateHeader();
			if (animationTimer) {
				clearTimeout(animationTimer);
				animationTimer = undefined;
			}
			animationTimer = (function () {
				animationTimer = undefined;
				hidden = true;
				body.setStyles({
					transform: 'scale(1.6)',
					opacity: portalFade ? 0 : null
				});
				if (callback && callback.call) requestAnimationFrame(callback);
			}).delay(3000);
		} else if (callback && callback.call) {
			callback();
		}
	}

	function showNowPlaying(callback) {
		if (!visible && !Browser.activevideo) {
			updateHeader();
			if (animationTimer) {
				clearTimeout(animationTimer);
				animationTimer = undefined;
			}
			body.setStyles({
				transform: 'scale(1)',
				opacity: portalFade ? 1 : null
			});
			(function () {
				hidden = false;
				if (callback && callback.call) requestAnimationFrame(callback);
			}).delay(600);
		} else if (callback && callback.call) {
			callback();
		}
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
				showNowPlaying(hideNowPlaying);
				break;
		}
	}).subscribeTo(MAF.mediaplayer, 'onStateChange');

	(function channelEvents() {
		updateNowPlaying();
		if (showing) return;
		showNowPlaying(hideNowPlaying);
	}).subscribeTo(MAF.mediaplayer, 'onChannelChange');

	function hide() {
		if (!showing) return;
		sideBySide = false;
		showing = false;
		visible = false;
		if (!MAF.mediaplayer.currentAsset.title && MAF.mediaplayer.isTVActive && !visible) {
			background.setStyle('backgroundImage', widget.getPath('Images/Horizon/BlockedBackground.png'));
		} else {
			background.setStyle('backgroundImage', null);
		}
		header.setStyle('backgroundImage', widget.getPath('Images/Horizon/Header.png'));
		requestAnimationFrame(hideNowPlaying);
	}

	function show() {
		if (showing) return;
		showing = true;
		header.setStyle('backgroundImage', null);
		background.setStyle('backgroundImage', widget.getPath('Images/Horizon/PortalBackground.png'));
		requestAnimationFrame(function () {
			showNowPlaying();
			visible = true;
		});
	}

	function setSidebarBackground(show) {
		sideBySide = show;
		if (show) {
			showNowPlaying();
		} else {
			hideNowPlaying();
		}
	}

	function resume() {
		if (portalFade) {
			body.setStyles({
				transform: 'scale(1)',
				opacity: 1
			});
		}
	}

	function exit() {
		if (portalFade) {
			body.setStyles({
				transform: 'scale(1.6)',
				opacity: 0
			});
			(function () {
				body.setStyle('transform', 'scale(0.8)');
			}).delay(400);
		}
	}

	updateNowPlaying();

	return {
		hide: hide,
		show: show,
		resume: resume,
		exit: exit,
		setSidebarBackground: setSidebarBackground,
		isHidden: function () {
			return hidden;
		},
		setText: function (s) {
			subtitle.data = s;
		}
	};
}.call(window, document.body));
