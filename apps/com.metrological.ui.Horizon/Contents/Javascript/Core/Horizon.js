var Horizon = (function (body) {
	var fontSize = '1em',
		fontColor = 'rgba(255,255,255,.4)',
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
		transformOrigin: '50% 50%',
		backgroundRepeat: 'no-repeat',
		backgroundImage: widget.getPath('Images/Horizon/PortalBackground.png')
	});

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
		return !visible && MAF.mediaplayer.isTVActive && !MAF.mediaplayer.currentAsset.title;
	}

	function updateHeader() {
		if (blocked()) {
			body.setStyle('backgroundImage', widget.getPath('Images/Horizon/BlockedBackground.png'));
		} else if (sideBySide) {
			body.setStyle('backgroundImage', widget.getPath('Images/Horizon/SidebarBackground.png'));
		} else if (!visible) {
			body.setStyle('backgroundImage', null);
		}
		container.setStyle('backgroundImage', widget.getPath(ApplicationManager.active === widget.identifier ? 'Images/Horizon/HeaderBig.png' : 'Images/Horizon/Header.png'));
	}

	function hideNowPlaying(callback) {
		if (!visible && !sideBySide && !blocked() && !Browser.activevideo) {
			updateHeader();
			body.animate({
				scale: 1.6,
//				opacity: 0,
				delay: 5,
				duration: 0.6,
				callback: callback && callback.call ? callback : null
			});
		} else if (callback && callback.call) {
			body.setStyle('transition', null);
			callback();
		}
	}

	function showNowPlaying(callback) {
		if (!visible && !Browser.activevideo) {
			updateHeader();
			body.animate({
				scale: 1,
//				opacity: 1,
				duration: 0.6,
				callback: callback && callback.call ? callback : null
			});
		} else if (callback && callback.call) {
			body.setStyle('transition', null);
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
