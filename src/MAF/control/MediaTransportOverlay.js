/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2014  Metrological
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/
/** 
 * @class MAF.control.MediaTransportOverlay
 * @extends MAF.element.Container
 * @example
 * var player = new MAF.control.MediaTransportOverlay({
	theme: false,
	forwardseekButton: true,
	backwardseekButton: true,
	fadeTimeout: 5,
	events: {
		onTransportButtonPress: function (event) {
			var timeIndex;
			switch(event.payload.button) {
				case 'forward':
					event.stop();
					MAF.mediaplayer.control.seek(60);
					break;
				case 'rewind':
					event.stop();
					timeindex = MAF.mediaplayer.player && MAF.mediaplayer.player.currentTimeIndex || null;
					if (timeindex && (timeindex - (60*1000)) < 0 && MAF.mediaplayer.playlist.currentIndex > 0) {
						MAF.mediaplayer.playlist.previousEntry();
					} else if (view.visible && MAF.mediaplayer.player.currentPlayerState === MAF.mediaplayer.constants.states.PLAY) {
						MAF.mediaplayer.control.seek(-60);
					}
					break;
				case 'forwardseek':
					event.stop();
					MAF.mediaplayer.control.forward();
					break;
				case 'backwardseek':
					event.stop();
					timeindex = MAF.mediaplayer.player && MAF.mediaplayer.player.currentTimeIndex || null;
					if (timeindex && (timeindex - (600*1000)) < 0 && MAF.mediaplayer.playlist.currentIndex > 0) {
						MAF.mediaplayer.playlist.previousEntry();
					} else {
						MAF.mediaplayer.control.rewind();
					}
					break;
				case 'stop':
					if (!view.frozen) {
						MAF.application.previousView();
					}
					break;
			}
		}
	}
}).appendTo(this);
 */
/**
 * @cfg {Array} buttonOrder Order of the buttons to be shown in this component. 
 * @example
 * var player = new MAF.control.MediaTransportOverlay({
 *    buttonOrder: ['backwardseekButton', 'rewindButton', 'playButton', 'forwardButton', 'forwardseekButton', 'stopButton', 'infoButton', 'resizeButton']
 * }).appendTo(this);
 * @memberof MAF.control.MediaTransportOverlay
 */
/**
 * @cfg {Boolean} playButton True if the play button should be visible. Default is true.
 * @memberof MAF.control.MediaTransportOverlay
 */
/**
 * @cfg {Boolean} stopButton True if the stop button should be visible. Default is true.
 * @memberof MAF.control.MediaTransportOverlay
 */
/**
 * @cfg {Boolean} rewindButton True if the rewind button should be visible. Default is true.
 * @memberof MAF.control.MediaTransportOverlay
 */
/**
 * @cfg {Boolean} forwardButton True if the forward button should be visible. Default is true.
 * @memberof MAF.control.MediaTransportOverlay
 */
/**
 * @cfg {Boolean} forwardseekButton True if the forwardseek button should be visible. Default is false.
 * @memberof MAF.control.MediaTransportOverlay
 */
/**
 * @cfg {Boolean} backwardseekButton True if the backwardseek button should be visible. Default is false.
 * @memberof MAF.control.MediaTransportOverlay
 */
/**
 * @cfg {Boolean} infoButton True if the info button should be visible. Default is true.
 * @memberof MAF.control.MediaTransportOverlay
 */
/**
 * @cfg {Boolean} resizeButton True if the resize button should be visible. Default is true.
 * @memberof MAF.control.MediaTransportOverlay
 */

/**
 * Fired when a 
 * @event MAF.control.MediaTransportOverlay#onTransportButtonPress
 */
define('MAF.control.MediaTransportOverlay', function () {
	var settings = {};

	return new MAF.Class({
		Extends: MAF.element.Container,

		ClassName: 'ControlMediaTransportOverlay',

		config: {
			buttonOrder: ['backwardseekButton', 'rewindButton', 'playButton', 'forwardButton', 'forwardseekButton', 'stopButton', 'infoButton', 'resizeButton'],
			buttonOffset: 10,
			buttonSpacing: 6,
			fadeTimeout: 12,
			playButton: true,
			stopButton: true,
			rewindButton: true,
			forwardButton: true,
			forwardseekButton: false,
			backwardseekButton: false,
			infoButton: false,
			resizeButton: false
		},

		Protected: {
			onAppended: function (event) {
				this.createContent();
				this.viewEventHandler.subscribeTo(this.getView(), ['onUpdateView', 'onHideView', 'onDestroyView'], this);
				settings[this._classID].boundMediaUpdated = this.onMediaUpdated.subscribeTo(MAF.mediaplayer, ['onTimeIndexChanged', 'onStateChange', 'onPlayPlaylistEntry'], this);
			},
			createTimer: function () {
				this.overlayTimer = new Timer();
				this.overlayTimer.ticking = false;
				this.overlayTimer.interval = this.config.fadeTimeout;
				this.overlayTimer.onTimerFired = this.overlayFade.bindTo(this);
			},
			overlayFade: function () {
				if (this.overlayTimer) {
					this.overlayTimer.ticking = false;
				}
				if (this.fire('onTransportOverlayHide')) {
					this.hide();
				}
			},

			resetOverlayTimer: function (state) {
				var states = MAF.mediaplayer.constants.states;
				if ([states.PAUSE, states.STOP, states.REWIND].contains(state)) {
					if (this.overlayTimer) {
						this.overlayTimer.ticking = false;
					}
					if (this.fire("onTransportOverlayShow"))
						this.show();
					return;
				}
				if (!this.overlayTimer) return;
				if (this.overlayTimer.ticking) {
					this.overlayTimer.ticking = false;
				}
				this.overlayTimer.ticking = true;
			},

			viewEventHandler: function (event) {
				switch(event.type) {
					case 'onUpdateView':
						this.registerKeyHandlers();
						break;
					case 'onHideView':
						this.unregisterKeyHandlers();
						break;
					case 'onDestroyView':
						this.unregisterKeyHandlers();
						settings[this._classID].boundMediaUpdated.unsubscribeFrom(MAF.mediaplayer, ['onTimeIndexChanged', 'onStateChange', 'onPlayPlaylistEntry']);
						settings[this._classID].boundMediaUpdated = false;
						break;
				}
			},

			registerKeyHandlers: function () {
				if (!settings[this._classID].boundKeypressHandler)
					settings[this._classID].boundKeypressHandler = this.onKeyPressHandler.subscribeTo(MAF.application, ['onWidgetKeyPress'], this);
			},

			unregisterKeyHandlers: function () {
				if (settings[this._classID].boundKeypressHandler) {
					settings[this._classID].boundKeypressHandler.unsubscribeFrom(MAF.application, ['onWidgetKeyPress']);
					settings[this._classID].boundKeypressHandler = false;
				}
			},

			onMediaUpdated: function (event) {
				switch(event.type) {
					case 'onTimeIndexChanged':
						var states = MAF.mediaplayer.constants.states;
						if ([states.PLAY, states.FORWARD, states.REWIND].contains(MAF.mediaplayer.player.currentPlayerState)) {
							this.updateTimeIndexDisplay();
							this.moveProgressBar(Math.round((Math.ceil(event.payload.timeIndex) / Math.ceil(event.payload.duration)) * settings[this._classID].steps));
						}
						break;
					case 'onStateChange':
						this.updateState(event.payload.newState);
						this.resetOverlayTimer(event.payload.newState);
						break;
					case 'onPlayPlaylistEntry':
						this.resetState();
						break;
				}
			},

			onKeyPressHandler: function (event) {
				if (!this.visible) {
					if (MAF.mediaplayer.player.currentPlayerState === MAF.mediaplayer.constants.states.PLAY && (event.payload.key !== 'back' && event.payload.key !== 'playpause' && event.payload.key !== 'stop' && event.payload.key !== 'forward' && event.payload.key !== 'rewind')) {
						event.stop();
					}
					if (this.fire("onTransportOverlayShow")) {
						this.show();
					}
				}
				this.resetOverlayTimer(MAF.mediaplayer.player.currentPlayerState);
			},

			createContent: function () {
				this.controls = {};
				this.body = new MAF.element.Container({
					ClassName: this.ClassName + 'Body',
					styles: Theme.getStyles(this.ClassName + 'Body', 'normal')
				}).appendTo(this);

				this.progressBar = new MAF.element.Container({
					ClassName: this.ClassName + 'ProgressBar'
				}).appendTo(this.body);

				this.controls.troth = new MAF.element.Container({ 
					ClassName: this.ClassName + 'ProgressBarTroth' 
				}).appendTo(this.progressBar);

				this.controlBar = new MAF.element.Container({
					ClassName: this.ClassName + 'ControlBar',
					styles: Theme.getStyles(this.ClassName + 'ControlBar', 'normal')
				}).appendTo(this.body);
				this.createControls();

				this.createIntervalText();
			},

			createControls: function () {
				var nrButtons = 0,
					overlayStyles = Theme.get('ControlMediaTransportOverlay'),
					btnWidth = Theme.getStyles(this.ClassName + 'Button', 'normal').width + this.config.buttonSpacing;
				this.config.buttonOrder.forEach(function (btn, key) {
					if (this.config[btn]) {
						this.controls[btn] = new MAF.control.Button({
							ClassName: this.ClassName + 'Button',
							content: new MAF.element.Text({
								label: FontAwesome.get(overlayStyles.icons[btn]),
								styles: {
									width: 'inherit',
									height: 'inherit',
									anchorStyle: 'center'
								}
							}),
							styles: {
								hOffset: (nrButtons * btnWidth) + this.config.buttonOffset,
								vAlign: 'center'
							},
							events: {
								onSelect: function(event) {
									if (this.visible) {
										var btnName = btn.replace('Button', '');
										switch (btnName) {
											case 'play':
												switch(MAF.mediaplayer.player.currentPlayerState) {
													case MAF.mediaplayer.constants.states.PLAY:
														if (this.fire("onTransportButtonPress", { button: btnName, action: "pause" })) {
															MAF.mediaplayer.control.pause();
														}
														break;
													default:
														if (this.fire("onTransportButtonPress", { button: btnName, action: "play" })) {
															MAF.mediaplayer.control.play();
														}
														break;
												}
												break;
											case 'stop':
												if (this.fire("onTransportButtonPress", { button: btnName, action: btnName })) {
													MAF.mediaplayer.control.stop();
												}
												break;
											case 'rewind':
												if (this.fire("onTransportButtonPress", { button: btnName, action: btnName })) {
													MAF.mediaplayer.control.rewind();
												}
												break;
											case 'forward':
												if (this.fire("onTransportButtonPress", { button: btnName, action: btnName })) {
													MAF.mediaplayer.control.forward();
												}
												break;
											default:
												if (this.fire("onTransportButtonPress", { button: btnName, action: null })) {
													log('no default handler for ' + btnName);
												}
												break;
										}
									}
								}.bindTo(this)
							}
						}).appendTo(this.controlBar);
						nrButtons++;
					}
				}, this);

				this.body.setStyle('width', (2*this.config.buttonOffset) + (nrButtons * btnWidth));
			},

			createIntervalText: function () {
				this.controls.intervalText = new MAF.element.Text({
					label: ' 00:00:00',
					styles: Object.merge({width: 150, hOffset: this.config.buttonOffset, vOffset: this.config.buttonSpacing }, Theme.getStyles(this.ClassName + 'IntervalText'))
				}).appendTo(this.controlBar);

				this.controls.durationText = new MAF.element.Text({
					label: ' 00:00:00',
					styles: Object.merge({width: 150, hAlign: 'right', hOffset: this.config.buttonOffset, vOffset: this.config.buttonSpacing, anchorStyle: 'right'},Theme.getStyles(this.ClassName + 'IntervalText'))
				}).appendTo(this.controlBar);
			},

			updateState: function (state) {
				var states = MAF.mediaplayer.constants.states,
					overlayStyles = Theme.get('ControlMediaTransportOverlay');
				switch(state) {
					case states.PAUSE:
						if(this.controls.playButton){
							if (overlayStyles.icons && overlayStyles.icons.playButton) {
								this.controls.playButton.content.setText(FontAwesome.get(overlayStyles.icons.playButton));
							} else {
								this.controls.playButton.content.setSource(overlayStyles.sources.playButton);
							}
						}
						if (this.overlayTimer) {
							this.overlayTimer.ticking = false;
						}
						if (!this.visible && this.fire("onTransportOverlayShow")) {
							this.show();
						}
						break;
					case states.PLAY:
					case states.BUFFERING:
						if(this.controls.playButton){
							if (overlayStyles.icons && overlayStyles.icons.playButton) {
								this.controls.playButton.content.setText(FontAwesome.get(overlayStyles.icons.pauseButton));
							} else {
								this.controls.playButton.content.setSource(overlayStyles.sources.pauseButton);
							}
						}
						break;
					case states.STOP:
						this.resetState();
					default:
						if(this.controls.playButton){
							if (overlayStyles.icons && overlayStyles.icons.playButton) {
								this.controls.playButton.content.setText(FontAwesome.get(overlayStyles.icons.playButton));
							} else {
								this.controls.playButton.content.setSource(overlayStyles.sources.playButton);
							}
						}
						break;
				}
			},

			updateTimeIndexDisplay: function (force) {
				if (this.visible || force) {
					if (MAF.mediaplayer.player.currentTimeIndex <= MAF.mediaplayer.player.currentMediaDuration) {
						this.controls.intervalText.setText(this.formatTime(MAF.mediaplayer.player.currentTimeIndex));
						this.controls.durationText.setText(this.formatTime(MAF.mediaplayer.player.currentMediaDuration));
					}
				}
			},

			moveProgressBar: function (step) {
				var increment = this.progressBar.width / settings[this._classID].steps;
				this.controls.troth.setStyles({
					width: Math.round(step * increment),
					hOffset: 0
				});
			}
		},

		initialize: function () {
			this.parent();
			settings[this._classID] = {};
			settings[this._classID].steps = 180;
			this.createTimer();
			this.onAppended.subscribeOnce( this, ['onAppend'], this );
		},

		focus: function () {
			if (this.controls && this.controls.playButton) {
				return this.controls.playButton.focus();
			}
		},

		show: function () {
			this.updateTimeIndexDisplay(true);
			this.parent();
		},

		hide: function () {
			this.parent();
		},

		resetState: function () {
			if (this.fire("onTransportOverlayShow")) {
				this.show();
			}
			this.updateState(MAF.mediaplayer.constants.states.PAUSE);
			this.updateTimeIndexDisplay(true);
			this.moveProgressBar(0);
			this.focus();
		},

		formatTime: function(duration) {
			if (duration) {
				return numeral(Math.floor(duration)).format('00:00:00');
			} else {
				return '00:00:00';
			}
		},

		suicide: function () {
			if (this.controls) {
				Object.forEach(this.controls, function (key, obj) {
					if (obj && obj.suicide) {
						delete this.controls[key];
						obj.suicide();
					}
				}, this);
				delete this.controls;
			}
			if (this.controlBar) {
				this.controlBar.suicide();
				delete this.controlBar;
			}
			if (this.progressBar) {
				this.progressBar.suicide();
				delete this.progressBar;
			}
			if (this.body) {
				this.body.suicide();
				delete this.body;
			}
			if (this.overlayTimer) {
				this.overlayTimer.ticking = false;
				this.overlayTimer.onTimerFired = null;
				delete this.overlayTimer;
			}
			settings[this._classID] = null;
			delete settings[this._classID];
			this.parent();
		}
	});
 }, {
	ControlMediaTransportOverlay: {
		icons: {
			playButton: 'play',
			pauseButton: 'pause',
			stopButton: 'stop',
			rewindButton: 'backward',
			forwardButton: 'forward',
			forwardseekButton: 'fast-forward',
			backwardseekButton: 'fast-backward',
			infoButton: 'info',
			resizeButton: 'expand'
		},
		styles: {
			width: 'inherit',
			height: 'inherit'
		}
	},
	ControlMediaTransportOverlayBody: {
		styles: {
			backgroundColor: 'rgba(0,0,0,.8)',
			hAlign: 'center',
			vAlign: 'bottom',
			vOffset: 200,
			width: 10,
			height: 140
		}
	},
	ControlMediaTransportOverlayProgressBar: {
		styles: {
			backgroundColor: 'darkgrey',
			borderTop: '2px solid grey',
			width: 'inherit',
			height: '10%'
		}
	},
	ControlMediaTransportOverlayControlBar: {
		styles: {
			width: 'inherit',
			height: '90%',
			vAlign: 'bottom'
		}
	},
	ControlMediaTransportOverlayButton: {
		normal: {
			styles: {
				color: 'white',
				fontSize: 40,
				height: 66,
				width: 85
			}
		},
		focused: {
			styles: {
				color: Theme.getStyles('BaseFocus', 'backgroundColor')
			}
		},
		disabled: {
			styles: {
				color: 'grey'
			}
		}
	},
	ControlMediaTransportOverlayProgressBarTroth: {
		styles: {
			backgroundColor: 'darkred',
			borderTop: '2px solid red',
			height: '100%',
			width: 1,
			hOffset: -1
		}
	},
	ControlMediaTransportOverlayIntervalText: {
		styles: {
			minWidth: 150,
			height: '1.3em',
			fontSize: 22
		}
	}
});
