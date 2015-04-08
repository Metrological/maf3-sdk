var Horizon = (function (body) {
	var fontSize = '1em',
		fontColor = 'rgba(255,255,255,.4)',
		showing = true,
		visible = true,
		sideBySide = false/*,
		gpu = widget.getSetting('gpu')*/;

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
		transform: /*gpu !== false ? 'scale3d(1,1,1)' : */'scale(1)',
		transformOrigin: '50% 50%',
		transition: widget.getSetting('animation') !== false ? 'all 0.4s ease' : null,
		backgroundRepeat: 'no-repeat',
		backgroundImage: widget.getPath('Images/Horizon/PortalBackground.png')
	});

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

	var container = new Frame({
		styles: {
			width: 'inherit',
			height: 'inherit',
			backgroundImage: widget.getPath('Images/Horizon/HeaderBig.png'),
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
	}).inject(container);

	var subtitle = new Text({
		label: $_('ALL_APPS'),
		styles: {
			transform: 'translateZ(0)',
			hOffset: title.hOffset,
			vOffset: title.height + title.vOffset,
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize
		}
	}).inject(container);

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
	}).inject(container);

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
	}).inject(container);

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
			body.setStyle('backgroundImage', widget.getPath('Images/Horizon/BlockedBackground.png'));
			blockedText.visible = !showing;
		} else if (sideBySide) {
			blockedText.visible = false;
			body.setStyle('backgroundImage', widget.getPath('Images/Horizon/SidebarBackground.png'));
		} else if (!visible) {
			blockedText.visible = false;
			body.setStyle('backgroundImage', null);
		}
		container.setStyle('backgroundImage', widget.getPath(ApplicationManager.active === widget.identifier ? 'Images/Horizon/HeaderBig.png' : 'Images/Horizon/Header.png'));
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
				body.setStyle('transform', /*gpu !== false ? 'scale3d(1.6,1.6,1.6)' : */'scale(1.6)');
				if (callback && callback.call) callback();
			}).delay(5000);
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
			animationTimer = (function () {
				body.setStyle('transform', /*gpu !== false ? 'scale3d(1,1,1)' : */'scale(1)');
				if (callback && callback.call) callback();
			}).delay(0);
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
		if (ApplicationManager.active === widget.identifier || visible) {
			return;
		}
		showNowPlaying(hideNowPlaying);
	}).subscribeTo(MAF.mediaplayer, 'onChannelChange');

	function hide() {
		showing = false;
		visible = false;
		if (!MAF.mediaplayer.currentAsset.title && MAF.mediaplayer.isTVActive && !visible) {
			body.setStyle('backgroundImage', widget.getPath('Images/Horizon/BlockedBackground.png'));
		} else {
			body.setStyle('backgroundImage', null);
		}
		hideNowPlaying();
		container.setStyle('backgroundImage', widget.getPath('Images/Horizon/Header.png'));
	}

	function show() {
		showing = true;
		showNowPlaying();
		body.setStyle('backgroundImage', widget.getPath('Images/Horizon/PortalBackground.png'));
		container.setStyle('backgroundImage', widget.getPath('Images/Horizon/HeaderBig.png'));
		visible = true;
	}

	function reset() {
		sideBySide = false;
	}

	function setSidebarBackground(show) {
		sideBySide = show;
		if (show) {
			showNowPlaying();
		} else {
			hideNowPlaying();
		}
	}

	updateNowPlaying();

	return {
		hide: hide,
		show: show,
		reset: reset,
		setSidebarBackground: setSidebarBackground,
		setText: function (s) {
			subtitle.data = s;
		}
	};
}.call(window, document.body));
