var Horizon = (function (body) {
	var fontSize = '1em',
		fontColor = 'rgba(255,255,255,.4)',
		portalFade = widget.getSetting('portal') === 'fade',
		hidden = false,
		showing = true,
		sideBySide = false,
		isBlocked = false,
		translate3d = 'translateZ(0)',
		isBoot = window.boot,
		exited = isBoot,
		noLive = widget.getSetting('noLive') || false,
		isHelios = widget.getSetting('isHelios'),
		isSD = ApplicationManager.isSD(),
		clockInterval, animationTimer;

	Theme.Fonts.add('InterstatePro-Bold', 'Fonts/InterstatePro-Bold');
	Theme.Fonts.add('InterstatePro-ExtraLight', 'Fonts/InterstatePro-ExtraLight');
	Theme.Fonts.add('InterstatePro-Light', 'Fonts/InterstatePro-Light');
	Theme.Fonts.add('InterstatePro-Regular', 'Fonts/InterstatePro-Regular');
	Theme.Fonts.add('InterstatePro-Thin', 'Fonts/InterstatePro-Thin');
	Theme.Fonts.add('UPCDigital-Bold', 'Fonts/UPCDigital-Bold');
	Theme.Fonts.add('UPCDigital-Regular', 'Fonts/UPCDigital-Regular');

	Theme.Fonts.setDefault('InterstatePro-Regular');

	MAF.mediaplayer.init();

	function setVisibility(obj, value) {
		obj[portalFade ? 'opacity' : 'display'] = portalFade ? value : ((value === 0) ? 'none' : null);
		return obj;
	}

	body.setStyles(setVisibility({
		transform: portalFade && isBoot ? 'scale(0.8)' : 'scale(1)',
		transformOrigin: '50% 50%',
		transition: portalFade ? 'all 0.4s ease' : null
	}, portalFade ? (isBoot ? 0 : 1) : (isBoot ? 0 : null)));

	var background = new Frame({
		styles: {
			transform: portalFade ? 'translate3d(0,0,0)' : (Browser.cisco ? 'translateZ(0)' : null),
			width: 1920,
			height: 1080,
			backgroundImage: widget.getPath('Images/Horizon/PortalBackground.png'),
			backgroundRepeat: 'no-repeat'
		}
	}).inject(body);

	var blockedText = new Text({
		label: $_('BLOCKEDTEXT'),
		frozen: true,
		styles: {
			width: 1920 - 664,
			hOffset: 644,
			vAlign: 'center',
			color: fontColor,
			fontFamily: 'InterstatePro-Light',
			fontSize: '1.15em',
			textAlign: 'center'
		}
	}).inject(body);

	var header = new Frame({
		styles: {
			width: 1920,
			height: 284,
			transform: translate3d,
			backgroundRepeat: 'no-repeat'/*,
			backgroundPosition: '50% 0%'*/
		}
	}).inject(body);

	var title = new Text({
		label: $_('APP_STORE'),
		styles: {
			transform: translate3d,
			hOffset: 134,
			vOffset: (isHelios && isSD) ? 64 : 47,
			color: fontColor,
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize
		}
	}).inject(header);

	var subtitle = new Text({
		label: $_('ALL_APPS'),
		styles: {
			transform: translate3d,
			hOffset: title.hOffset,
			vOffset: title.height + title.vOffset,
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize
		}
	}).inject(header);

	function getDate(){
		var offset = widget.getSetting('dateOffset');
		var date = new Date();
		if(offset) {
			date = new Date(date.getTime() + offset);
		}
		return date;
	}


	var clock = new Text({
		label: Date.format(getDate(), 'HH:mm') + '<br/>' + Date.format(getDate(), 'ddd D MMM').toUpperCase(),
		styles: {
			transform: translate3d,
			hAlign: 'right',
			hOffset: 134,
			vOffset: title.vOffset,
			color: fontColor,
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize,
			textAlign: 'right'
		}
	}).inject(header);

	function updateClock() {
		if (!showing) return;
		var d = getDate();
		clock.data = Date.format(d, 'HH:mm') + '<br/>' + Date.format(d, 'ddd D MMM').toUpperCase();
	}

	clockInterval = updateClock.periodical(60000);

	var playing = new Text({
		styles: {
			transform: translate3d,
			width: 800,
			height: 40,
			hOffset: 560,
			vOffset: (isHelios && isSD) ? 64 : 47,
			fontFamily: 'InterstatePro-Light',
			fontSize: fontSize,
			color: fontColor,
			anchorStyle: 'center',
			truncation: 'end'
		}
	}).inject(header);

	function setPortalBackground() {
		background.setStyle('backgroundImage', widget.getPath('Images/Horizon/PortalBackground.png'));
	}

	function updateNowPlaying() {
		if (noLive) return;
		var assetTitle = MAF.mediaplayer.currentAsset.title,
			now = '';
		if (assetTitle) {
			now += $_('NOW_PLAYING') + ' ';
			if (MAF.mediaplayer.isTVActive) {
				now += $_('LIVE_TV');
			} else {
				now += $_('APPS');
			}
			now += ' - ' + assetTitle;
		}
		playing.data = now;
	}

	var stateBackground = 0;

	function updateBackground() {
		var prevStateBackground = stateBackground * 1;
		if (!showing && MAF.mediaplayer.isTVActive && widget.getSetting('blocked') && !MAF.mediaplayer.currentAsset.title) {
			if (stateBackground === 2) return;
			isBlocked = true;
			stateBackground = 2;
			background.setStyle('backgroundImage', widget.getPath('Images/Horizon/BlockedBackground.png'));
			blockedText.frozen = false;
		} else if (!showing) {
			if ((stateBackground === 1 && sideBySide) || (stateBackground === 3 && !sideBySide)) return;
			isBlocked = false;
			stateBackground = sideBySide ? 1 : 3;
			blockedText.frozen = true;
			background.setStyle('backgroundImage', sideBySide ? widget.getPath('Images/Horizon/SidebarBackground.png') : null);
		} else if (showing) {
			if (stateBackground === 0) return;
			isBlocked = false;
			stateBackground = 0;
			blockedText.frozen = true;
			background.setStyle('backgroundImage', widget.getPath('Images/Horizon/PortalBackground.png'));
		}
		if (!showing && prevStateBackground !== 2 && prevStateBackground !== 1 && prevStateBackground !== 3) {
			header.setStyle('backgroundImage', widget.getPath('Images/Horizon/Header.png'));
		} else if (showing && prevStateBackground !== 0) {
			header.setStyle('backgroundImage', null);
		}
	}

	function hideNowPlaying(callback) {
		if (!sideBySide && !isBlocked && !Browser.activevideo) {
			updateBackground();
			if (animationTimer) {
				clearTimeout(animationTimer);
				animationTimer = undefined;
			}
			animationTimer = (function () {
				if (showing) return;
				animationTimer = undefined;
				hidden = true;
				body.setStyles(setVisibility({
					transform: 'scale(1.6)'
				}, 0));
				if (callback && callback.call) requestAnimationFrame(callback);
			}).delay(3000);
		} else if (callback && callback.call) {
			callback();
		}
	}

	function showNowPlaying(callback) {
		if (!Browser.activevideo) {
			updateBackground();
			if (animationTimer) {
				clearTimeout(animationTimer);
				animationTimer = undefined;
			}
			body.setStyles(setVisibility({
				transform: 'scale(1)'
			}, 1));
			(function () {
				hidden = false;
				if (callback && callback.call) requestAnimationFrame(callback);
			}).delay(portalFade ? 600 : 0);
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
				updateNowPlaying();
				showNowPlaying(hideNowPlaying);
				break;
		}
	}).subscribeTo(MAF.mediaplayer, 'onStateChange');

	(function channelEvents() {
		if (exited || !showing) return;
		if (animationTimer) {
			clearTimeout(animationTimer);
			animationTimer = undefined;
		}
		updateNowPlaying();
		if (!showing) showNowPlaying(hideNowPlaying);
	}).subscribeTo(MAF.mediaplayer, 'onChannelChange');

	function hide() {
		if (!showing) return;
		sideBySide = false;
		showing = false;
		requestAnimationFrame(hideNowPlaying);
	}

	function show() {
		if (showing) return;
		sideBySide = false;
		showing = true;
		requestAnimationFrame(showNowPlaying);
		updateClock();
	}

	function setSidebarBackground(showBackground) {
		sideBySide = showBackground;
		if (animationTimer) {
			clearTimeout(animationTimer);
			animationTimer = undefined;
		}
		if (showBackground)
			showNowPlaying();
		else
			hideNowPlaying();
	}

	function resume() {
		if (isBoot) isBoot = false;
		if (!exited) return;
		exited = false;
		updateNowPlaying();
		try {
			MAF.system.setState('resume');
		} catch(err) {}
		if (!showing) show();
		body.setStyles(setVisibility({ transform: 'scale(1)' }, 1));
	}

	function exit() {
		if (exited) return;
		exited = true;
		body.setStyles(setVisibility({ transform: 'scale(1.6)' }, 0));
		if (portalFade)
			body.setStyles.delay(500, body, [{ transform: 'scale(0.8)' }]);
		if (!isBoot)
			(function () {
				try {
					MAF.system.setState('paused');
				} catch(err) {}
			}).delay(portalFade ? 400 : 0);
	}

	if (!isBoot) {
		try {
			MAF.system.setState('resume');
		} catch(err) {}
	}

	updateNowPlaying();

	return {
		hide: hide,
		show: show,
		resume: resume,
		exit: exit,
		setPortalBackground: setPortalBackground,
		setSidebarBackground: setSidebarBackground,
		isHidden: function () {
			return hidden;
		},
		setText: function (s) {
			if (subtitle.data !== s) subtitle.data = s;
		},
		destroy: function () {
			background = blockedText = header = title = subtitle = clock = playing = null;
			if (animationTimer) {
				clearTimeout(animationTimer);
				animationTimer = undefined;
			}
			if (clockInterval) {
				clearInterval(clockInterval);
				clockInterval = undefined;
			}
		}
	};
}.call(window, document.body));
