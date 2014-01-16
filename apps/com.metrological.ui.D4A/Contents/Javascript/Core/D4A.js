var D4A = (function (body) {
	var fontSize = '1em',
		fontColor = 'rgba(255,255,255,.4)',
		fontFamily = 'UPCDigital-Regular',
		visible = true,
		sideBySide = false;

	Theme.Fonts.add('UPCDigital-Bold', 'Fonts/UPCDigital-Bold');
	Theme.Fonts.add('UPCDigital-Regular', 'Fonts/UPCDigital-Regular');

	Theme.Fonts.setDefault(fontFamily);

	MAF.mediaplayer.init();

	body.setStyles({
		transformOrigin: '50% 50%',
		backgroundRepeat: 'no-repeat',
		backgroundImage: widget.getPath('Images/PortalBackground.jpg')
	});

	var container = new Frame({
		styles: {
			width: 'inherit',
			height: 'inherit'
		}
	}).inject(body);

	var clock = new Text({
		label: Date.format(new Date(), 'ddd D MMM').toLowerCase() + ' ' + Date.format(new Date(), 'HH:mm'),
		styles: {
			fontFamily: fontFamily,
			opacity: 0.7,
			hAlign: 'right',
			hOffset: 153,
			vOffset: 127,
			color: 'white',
			fontSize: '1.4em',
			textAlign: 'right',
			zOrder: 1
		}
	}).inject(container);

	(function updateClock() {
		clock.data = Date.format(new Date(), 'ddd D MMM').toLowerCase() + ' ' + Date.format(new Date(), 'HH:mm');
	}).periodical(60000);

	var playing = new Text({
		styles: {
			fontFamily: fontFamily,
			opacity: 0.7,
			width: 634,
			hOffset: 692,
			vOffset: 127,
			fontSize: '1.4em',
			color: 'white',
			anchorStyle: 'center',
			truncation: 'end',
			zOrder: 1
		}
	}).inject(container);

	function updateNowPlaying() {
		playing.data = $_('NOW_PLAYING') + ' ' + MAF.mediaplayer.currentAsset.title;
	}

	(function playerEvents(event) {
		var states = this.constants.states;
		switch(event.payload.newState) {
			case states.STOP:
			case states.PAUSE:
			case states.PLAY:
			case states.INFOLOADED:
				updateNowPlaying();
				break;
		}
	}).subscribeTo(MAF.mediaplayer, 'onStateChange');

	(function channelEvents() {
		updateNowPlaying();
	}).subscribeTo(MAF.mediaplayer, 'onChannelChange');

	function hide() {
		visible = false;
		body.setStyle('backgroundImage', null);
		container.visible = false;
	}

	function sidebar() {
		body.setStyle('backgroundImage', widget.getPath('Images/SidebarBackground.png'));
		container.visible = true;
	}

	function show() {
		body.setStyle('backgroundImage', widget.getPath('Images/PortalBackground.jpg'));
		container.visible = true;
		visible = true;
	}

	updateNowPlaying();

	return {
		hide: hide,
		show: show,
		sidebar: sidebar
	};
}.call(window, document.body));
