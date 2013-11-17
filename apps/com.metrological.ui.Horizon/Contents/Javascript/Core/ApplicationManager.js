var loadTemplate = (function () {
	var current = {};
	var maxProfiles = 5;
	var keyboardDialogs = [
		'textentry',
		'pincreation',
		'pin',
		'twitter-login',
		'profile-create',
		'profile-pincreation',
		'profile-pin'
	];
	return function ApplicationManager_loadTemplate(data) {
		var type = data.type,
			id = data.id;
		if (!type) {
			return;
		}
		var app = this,
			identifier = app.widget && app.widget.identifier,
			body = app.document.body,
			getElementById = app.widget && app.widget.getElementById,
			template = type && getElementById && getElementById('@' + type);
		//log('loadTemplate', type, current, template);
		if (!identifier) {
			return;
		}
		if (!template) {
			var fragment;
			if (type !== 'waitIndicator') {
				fragment = widget.createDocumentFragment();
			}
			switch (type) {
				case 'waitIndicator':
					var smallSpinner = getElementById('@'+current[identifier]+'-home'),
						largeSpinner = getElementById('@'+current[identifier]+'-loading');
					if (!smallSpinner || !largeSpinner || identifier !== ApplicationManager.active) {
						return;
					}
					switch (data.id) {
						case '0':
							if (current[identifier] === 'sidebar') {
								smallSpinner.text = FontAwesome.get('home');
								smallSpinner.frozen = (smallSpinner && smallSpinner.focusable) ? false : true;
							}
							largeSpinner.text = FontAwesome.get('refresh');
							largeSpinner.frozen = true;
							break;
						case '1':
							if (current[identifier] === 'sidebar') {
								smallSpinner.text = FontAwesome.get(['refresh', 'spin']);
								smallSpinner.frozen = false;
							}
							largeSpinner.text = FontAwesome.get('refresh');
							largeSpinner.frozen = true;
							break;
						case '2':
							largeSpinner.text = FontAwesome.get(['refresh', 'spin']);
							largeSpinner.frozen = false;
							break;
						case '3':
							largeSpinner.text = FontAwesome.get('refresh');
							largeSpinner.frozen = true;
							break;
					}
					return;
				case 'sidebar':
					var sidebarButtons = [
						{ value: '@AppButtonSidebarClose', label: 'times', action: 'close-all' },
						{ value: '@AppButtonSidebarSettings', label: 'cog', action: 'app-settings' },
						{ value: '@AppButtonSidebarProfiles', label: 'user', action: 'switch-profile' },
						{ value: '@AppButtonSidebarVideoSize', label: 'arrows-alt', action: 'viewport-toggle' }
					];

					if (Muzzley.enabled) {
						var last = sidebarButtons.pop();
						sidebarButtons.push({ value: '@AppButtonSidebarMuzzley', label: 'qrcode', action: 'app-muzzley' });
						sidebarButtons.push(last);
					}

					if (identifier === widget.identifier) {
						sidebarButtons.shift();
					}
					template = new View({
						id: '@' + type,
						styles: {
							transform: 'translateZ(0)',
							overflow: 'visible',
							backgroundColor: 'rgba(22,22,27,.9)',
							borderRadius: '10px',
							boxShadow: '0 0 3px 3px #262a35',
							width: 588,
							height: 1032,
							top: 22,
							left: 22
						},
						events: {
							select: function (event) {
								var target = event.target;
								if (target) {
									var btnId = Array.pluck(sidebarButtons, 'value').indexOf(target.getAttribute('id'));
									if (isNumber(btnId) && btnId !== -1) {
										ApplicationManager.fire(identifier, 'onActivateAppButton', {
											id: this.retrieve('current'),
											type: sidebarButtons[btnId].action
										});
									}
								}
							},
							navigateoutofbounds: function (event) {
								var El = false;
								switch (event.detail.direction) {
									case 'up':
										El = getElementById('@' + type + '-home');
										break;
									case 'down':
										El = getElementById('@AppButtonSidebarSettings');
										break;
								}

								if (El && El.focusable) {
									return El.focus();
								}
							}
						}
					}).appendTo(fragment);

					app.widget.getImage('header', 'normal').setStyle('borderRadius', '10px 10px 0 0').appendTo(template);

					new Text({
						id: '@' + type + '-home',
						label: FontAwesome.get('home'),
						frozen: true,
						styles: {
							width: 64,
							height: 42,
							hAlign: 'right',
							vOffset: 12,
							anchorStyle: 'center',
							fontSize: 30
						},
						events: {
							focus: function () {
								var focused = app.widget.getImageSource('header', 'focused');
								if (focused) {
									this.parentNode.firstChild.source = focused;
								}
								this.setStyle('color', app.Theme.getStyles('BaseFocus', 'backgroundColor'));
							},
							blur: function () {
								var normal = app.widget.getImageSource('header', 'normal');
								if (normal) {
									this.parentNode.firstChild.source = normal;
								}
								this.setStyle('color', null);
							},
							select: function () {
								ApplicationManager.fire(identifier, 'onActivateAppButton', {
									id: this.retrieve('current'),
									type: 'app-home'
								});
							},
							navigate: function (event) {
								if (event.detail.direction === 'down') {
									getElementById(this.retrieve('current')).element.navigate('down', [0, 0]);
								}
								event.preventDefault();
							}
						}
					}).appendTo(template).store('id', id);

					new Text({
						id: '@' + type + '-loading',
						label: FontAwesome.get('refresh'),
						frozen: true,
						styles: {
							backgroundColor: 'black',
							opacity: 0.7,
							zIndex: Animator.ZORDER + 1,
							width: 588,
							height: 930,
							vOffset: 64,
							anchorStyle: 'center',
							fontSize: 40
						}
					}).appendTo(template);

					sidebarButtons.forEach(function (btnConfig, key) {
						new Text({
							id: btnConfig.value,
							focus: true,
							label: FontAwesome.get(btnConfig.label),
							styles: {
								hAlign: 'center',
								vAlign: 'bottom',
								hOffset: 15 + (30 * (-(sidebarButtons.length/2)+key)),
								vOffset: 3,
								fontSize: 20
							},
							events: {
								focus: function () {
									this.setStyle('color', app.Theme.getStyles('BaseFocus', 'backgroundColor'));
								},
								blur: function () {
									this.setStyle('color', null);
								},
								navigate: function (event) {
									if (event.detail.direction === 'down') {
										event.preventDefault();
									}
								}
							}
						}).appendTo(template);
					});

					body.appendChild(fragment);
					break;
				case 'fullscreen':
					template = new View({
						id: '@' + type,
						styles: {
							transform: 'translateZ(0)',
							width: 1920,
							height: 1080
						}
					}).appendTo(fragment);

					new Text({
						id: '@' + type + '-loading',
						label: FontAwesome.get('refresh'),
						frozen: true,
						styles: {
							backgroundColor: 'black',
							opacity: 0.7,
							zIndex: Animator.ZORDER + 1,
							width: 1920,
							height: 1080,
							anchorStyle: 'center',
							fontSize: 40
						}
					}).appendTo(template);
					body.appendChild(fragment);
					break;
				case 'dialog':
					var currentStyle = getElementById('@' + current[identifier]).style,
						focusAfterDialog = app.document.activeElement,
						totalHeight = 0,
						buttons = [],
						isKeyboard = keyboardDialogs.indexOf(id) !== -1,
						KeyboardValueManager = isKeyboard && new MAF.keyboard.KeyboardValueManager();

					// Default buttons
					switch (id) {
						case 'login':
							buttons.push({ value: '$ok', label: 'OK' });
							buttons.push({ value: '$back', label: 'BACK' });
							buttons.push({ value: '$cancel', label: 'CANCEL' });
							break;
						case 'twitter-login':
						case 'textentry':
						case 'pincreation':
							buttons.push({ value: '$ok', label: 'OK' });
							buttons.push({ value: '$cancel', label: 'CANCEL' });
							break;
						case 'profile':
							var profiles = ProfileManager.getProfiles();
							profiles.forEach(function (name) {
								buttons.push({ value: '$profile-options', label: name });
							});
							var max = maxProfiles;
							if (!ProfileManager.isFamily) {
								buttons.push({ value: '$logout', label: 'LOGOUT' });
								max = (max - 1);
							}
							if (profiles.length < max) {
								buttons.push({ value: '$profile-create', label: 'ADD_PROFILE' });
							}
							buttons.push({ value: '$cancel', label: 'CANCEL' });
							break;
						case 'profile-create':
							buttons.push({ value: '$profile-pincreation', label: 'NEXT' });
							buttons.push({ value: '$profile', label: 'BACK' });
							break;
						case 'profile-pincreation':
							buttons.push({ value: '$profile-pincreated', label: 'STORE_PROFILE' });
							buttons.push({ value: '$profile', label: 'BACK' });
							break;
						case 'profile-options':
							buttons.push({ value: '$profile-pin', label: 'SELECT' });
							buttons.push({ value: '$profile-remove', label: 'REMOVE' });
							buttons.push({ value: '$profile', label: 'BACK' });
							break;
						case 'profile-pin':
						case 'pin':
							//buttons.push({ value: '$forgot', label: 'FORGOT_PIN' });
							buttons.push({ value: '$cancel', label: 'CANCEL' });
							break;
						case 'muzzley':
						case 'facebook-login':
							buttons.push({ value: '$profile-switch', label: ProfileManager.isFamily ? 'SELECT_PROFILE' : 'SWITCH_PROFILE' });
							buttons.push({ value: '$cancel', label: 'CANCEL' });
							break;
					}

					var dialogConfig = Object.merge({buttons: buttons}, data.conf);

					template = new Dialog({
						id: '@' + (data.key ? data.key : type),
						styles: {
							overflow: currentStyle.overflow,
							backgroundColor: 'rgba(0,0,0,.5)',
							border: currentStyle.border,
							borderRadius: currentStyle.width !== 1920 ? '15px' : null,
							width: currentStyle.width,
							height: currentStyle.height,
							top: currentStyle.top,
							left: currentStyle.left,
							zOrder: Animator.ZORDER + 2
						},
						events: {
							select: function (event) {
								var target = event.target,
									selectedValue = target && target.retrieve('value'),
									selectedLabel = target && target.retrieve('label'),
									dialogKey = this.retrieve('key');
								if (target && target.id && target.id.indexOf('button') > 0) {
									event.preventDefault();
									var keyboard = getElementById('@' + type + '-keyboard'),
										keyboardValue = KeyboardValueManager && KeyboardValueManager.value;
									if (keyboard && keyboard.firstChild && keyboard.firstChild.owner) {
										keyboard.firstChild.owner.suicide();
									}
									this.destroy();
									if (focusAfterDialog) {
										focusAfterDialog.focus();
										focusAfterDialog = null;
									}
									if (KeyboardValueManager) {
										KeyboardValueManager.suicide();
										KeyboardValueManager = null;
									}
									switch (selectedValue) {
										case '$forgot':
											ApplicationManager.fire(identifier, 'onDialogDone', { key: dialogKey, success: false, forgot: true });
											break;
										case '$ok':
											ApplicationManager.fire(identifier, 'onDialogDone', { key: dialogKey, response: keyboardValue });
											break;
										case '$cancel':
											ApplicationManager.fire(identifier, 'onDialogCancelled', { key: dialogKey, previousDialog: data.previousDialog });
											break;
										case '$logout':
											ProfileManager.logout();
											ApplicationManager.fire(identifier, 'onDialogProfile', { key: dialogKey, previousDialog: data.previousDialog });
											break;
										case '$profile':
											ApplicationManager.fire(identifier, 'onDialogProfile', { key: dialogKey, previousDialog: data.previousDialog });
											break;
										case '$profile-switch':
											ApplicationManager.fire(identifier, 'onDialogProfileSwitch', { key: dialogKey, previousDialog: data });
											break;
										case '$profile-create':
											ApplicationManager.fire(identifier, 'onDialogProfileCreate', { key: dialogKey, previousDialog: data.previousDialog });
											break;
										case '$profile-options':
											ApplicationManager.fire(identifier, 'onDialogProfileOptions', { key: dialogKey, profile: selectedLabel, previousDialog: data.previousDialog });
											break;
										case '$profile-remove':
											ApplicationManager.fire(identifier, 'onDialogProfileRemove', { key: dialogKey, profile: data.conf.profile, previousDialog: data.previousDialog });
											break;
										case '$profile-pincreation':
											ApplicationManager.fire(identifier, 'onDialogProfileCreatePIN', { key: dialogKey, profile: keyboardValue, previousDialog: data.previousDialog });
											break;
										case '$profile-pincreated':
											ApplicationManager.fire(identifier, 'onDialogProfileCreated', { key: dialogKey, profile: data.conf.profile, pin: keyboardValue, previousDialog: data.previousDialog });
											break;
										case '$profile-pin':
											ApplicationManager.fire(identifier, 'onDialogProfilePIN', { key: dialogKey, profile: data.conf.profile, previousDialog: data.previousDialog });
											break;
										default:
											if (data.previousDialog) {
												ApplicationManager.fire(identifier, 'onDialogPrevious', { key: dialogKey, previousDialog: data.previousDialog });
											} else {
												ApplicationManager.fire(identifier, 'onDialogDone', { key: dialogKey, selectedValue: selectedValue });
											}
											break;
									}
								}
							},
							back: function (event) {
								var dialogKey = this.retrieve('key');
								event.preventDefault();
								event.stopPropagation();
								this.destroy();
								if (focusAfterDialog) {
									focusAfterDialog.focus();
									focusAfterDialog = null;
								}
								ApplicationManager.fire(identifier, 'onDialogCancelled', { key: dialogKey });
								if (KeyboardValueManager) {
									KeyboardValueManager.suicide();
									KeyboardValueManager = null;
								}
							}
						}
					}).appendTo(fragment);

					// Keeps track of which dialog send this.
					template.store('key', dialogConfig.key);

					var contentFrame = new Frame({
						styles: {
							width: 568,
							height: 666,
							hAlign: 'center',
							vAlign: 'center',
							borderRadius: '15px',
							border: '2px solid #FFFFFF',
							backgroundColor: 'black',
							visible: false
						}
					}).appendTo(template);

					new Text({
						id: '@' + type + '-title',
						label: widget.getLocalizedString(dialogConfig.title || ''),
						styles: {
							width: '100%',
							height: 64,
							paddingLeft: 10,
							paddingRight: 10,
							anchorStyle: 'leftCenter',
							borderBottom: '2px solid grey'
						}
					}).appendTo(contentFrame);

					if (!ProfileManager.isFamily && (id === 'facebook-login' || id === 'profile')) {
						new Text({
							id: '@' + type + '-profile',
							label: FontAwesome.get('user') + ' ' + profile.name,
							styles: {
								width: '100%',
								height: 64,
								paddingLeft: 10,
								paddingRight: 10,
								anchorStyle: 'rightCenter'
							}
						}).appendTo(contentFrame);
					}

					var messageLabel;
					switch (id) {
						case 'facebook-login':
							if (!ProfileManager.isFamily) {
								messageLabel = widget.getLocalizedString(dialogConfig.message || '', [dialogConfig.code]);
							} else {
								messageLabel = widget.getLocalizedString('PROFILE_REQUIRED');
							}
							break;
						case 'profile-options':
							messageLabel = widget.getLocalizedString((dialogConfig.message || ''), [data.conf.profile]);
							break;
						case 'profile':
							if (!ProfileManager.isFamily) {
								messageLabel = widget.getLocalizedString((dialogConfig.message || '') + '_ACTIVE', [profile.name]);
							} else {
								messageLabel = widget.getLocalizedString(dialogConfig.message || '');
							}
							break;
						default:
							messageLabel = widget.getLocalizedString(dialogConfig.message || '');
							break;
					}

					var dialogMessage = new Text({
						id: '@' + type + '-message',
						label: messageLabel,
						styles: {
							width: '100%',
							paddingLeft: 10,
							paddingRight: 10,
							vOffset: 66,
							wrap: true
						}
					}).appendTo(contentFrame);

					var keyboardContainer;
					if (isKeyboard) {
						keyboardContainer = new Frame({
							id: '@' + type + '-keyboard',
							styles: {
								width: 'inherit',
								vAlign: 'bottom',
								vOffset: (dialogConfig.buttons.length * 56) + 5
							},
							events: {
								focus: function () {
									if (this.firstChild && this.firstChild.owner && this.firstChild.owner.focus && this.firstChild.owner.focus.call) {
										this.wantsFocus = false;
										this.firstChild.owner.focus();
									}
								}
							}
						}).appendTo(contentFrame);
					}

					dialogConfig.buttons.forEach(function (btnConfig, key) {
						var dialogbutton = new Frame({
							id: '@' + type + '-button' + key,
							focus: true,
							styles: {
								height: 51,
								width: contentFrame.width - 34,
								borderRadius: '15px',
								border: '2px solid #FFFFFF',
								vAlign: 'bottom',
								hOffset: 15,
								vOffset: (((dialogConfig.buttons.length-1) - key) * 56) + 5,
								//paddingLeft: 10,
								//paddingRight: 10,
								backgroundColor: app.Theme.getStyles('BaseGlow', 'backgroundColor')
							},
							events: {
								focus: function () {
									this.setStyle('backgroundColor', app.Theme.getStyles('BaseFocus', 'backgroundColor'));
								},
								blur: function () {
									this.setStyle('backgroundColor', app.Theme.getStyles('BaseGlow', 'backgroundColor'));
								}
							}
						}).appendTo(contentFrame);

						dialogbutton.store('label', btnConfig.label);
						dialogbutton.store('value', btnConfig.value);

						var buttonLabel;
						switch (btnConfig.value) {
							case '$profile-options':
								buttonLabel = FontAwesome.get('user') + ' ' + btnConfig.label;
								break;
							case '$profile-pincreated':
							case '$profile-pin':
								buttonLabel = FontAwesome.get('lock') + ' ' + widget.getLocalizedString(btnConfig.label);
								break;
							case '$profile-pincreation':
								buttonLabel = FontAwesome.get('unlock') + ' ' + widget.getLocalizedString(btnConfig.label);
								break;
							case '$profile-remove':
								buttonLabel = FontAwesome.get('trash-o') + ' ' + widget.getLocalizedString(btnConfig.label);
								break;
							case '$profile-remove':
								buttonLabel = FontAwesome.get('trash-o') + ' ' + widget.getLocalizedString(btnConfig.label);
								break;
							case '$profile':
								if (id && id.indexOf('profile-') === 0) {
									buttonLabel = FontAwesome.get('rotate-left') + ' ' + widget.getLocalizedString(btnConfig.label);
								} else {
									buttonLabel = widget.getLocalizedString(btnConfig.label);
								}
								break;
							default:
								buttonLabel = widget.getLocalizedString(btnConfig.label);
								break;
						}

						new Text({
							label: buttonLabel,
							styles: {
								width: '100%',
								height: 'inherit',
								paddingLeft: 10,
								paddingRight: 10,
								truncation: 'end',
								anchorStyle: 'leftCenter'
							}
						}).appendTo(dialogbutton);
					});

					totalHeight += (dialogConfig.buttons.length * 56) + 66 + 50;

					if (id === 'muzzley') {
						var muzzleyImage = new Image({
							src: Muzzley.qrCode,
							styles: {
								width: 370,
								height: 370,
								vAlign: 'bottom',
								vOffset: (dialogConfig.buttons.length * 56) + 10 + 10,
								hAlign: 'center'
							}
						}).appendTo(contentFrame);

						(function (event) {
							Muzzley.changeDevice('swipeNavigator', false, event.payload);
							var dialogKey = template.retrieve('key');
							template.destroy();
							if (focusAfterDialog) {
								focusAfterDialog.focus();
								focusAfterDialog = null;
							}
							ApplicationManager.fire(identifier, 'onDialogCancelled', { key: dialogKey });
							if (KeyboardValueManager) {
								KeyboardValueManager.suicide();
								KeyboardValueManager = null;
							}
						}).subscribeOnce(Muzzley, 'onParticipantJoin', this);

						totalHeight += 370;
					} else if (id === 'facebook-login' && Muzzley.enabled) {
						Muzzley.changeDevice('webview');
						(function (event) {
							Muzzley.changeDevice('webview');
						}).subscribeOnce(Muzzley, 'onParticipantJoin', this);
						(function (event) {
							var payload = event.payload;
							if (payload.action === 'WebViewReady') {
								payload.callback(true, null, { url: 'http://m.facebook.com/device' });
							}
						}).subscribeOnce(Muzzley, 'onDeviceMessage', this);
					} else if (id === 'twitter-login' && Muzzley.enabled) {
						Muzzley.changeDevice('webview');
						(function (event) {
							Muzzley.changeDevice('webview');
						}).subscribeOnce(Muzzley, 'onParticipantJoin', this);
						(function (event) {
							var payload = event.payload;
							if (payload.action === 'WebViewReady') {
								payload.callback(true, null, { url: dialogConfig.key });
							}
						}).subscribeOnce(Muzzley, 'onDeviceMessage', this);
					}
					var dialogFocus = 'button0';
					if (isKeyboard) {
						var keyboard;
						var onPinDone = function (authorized) {
							if (authorized) {
								var dialogKey = template.retrieve('key');
								if (keyboard && keyboard.firstChild && keyboard.firstChild.owner) {
									keyboard.firstChild.owner.suicide();
								}
								template.destroy();
								if (focusAfterDialog) {
									focusAfterDialog.focus();
									focusAfterDialog = null;
								}
								if (KeyboardValueManager) {
									KeyboardValueManager.suicide();
									KeyboardValueManager = null;
								}
								ApplicationManager.fire(identifier, 'onDialogDone', { key: dialogKey, success: authorized, previousDialog: data.previousDialog });
							} else {
								getElementById('@' + type + '-title').setStyle('backgroundColor', 'red');
								getElementById('@' + type + '-message').data = widget.getLocalizedString(data.conf.errorMessage || data.conf.message);
								KeyboardValueManager.value = '';
							}
						};

						(function (event) {
							var payload = event.payload || {},
								i;
							if (event.type === 'valuechanged') {
								switch (id) {
									case 'profile-pincreation':
										for (i=0; i<4; i++) {
											if (payload.value.length > i) {
												pinDots.childNodes[i].data = payload.value[i];
											} else {
												pinDots.childNodes[i].data = '';
											}
										}
										break;
									case 'profile-pin':
										for (i=0; i<4; i++) {
											if (payload.value.length > i) {
												pinDots.childNodes[i].data = FontAwesome.get('circle');
											} else {
												pinDots.childNodes[i].data = '';
											}
										}
										if (payload.value.length === 4) {
											if (ProfileManager.select(data.conf.profile, payload.value)) {
												onPinDone.defer(500, null, true);
											} else {
												onPinDone.defer(500, null, false);
											}
										}
										break;
									case 'pin':
										for (i=0; i<4; i++) {
											if (payload.value.length > i) {
												pinDots.childNodes[i].data = FontAwesome.get('circle');
											} else {
												pinDots.childNodes[i].data = '';
											}
										}
										if (payload.value.length === 4) {
											if (ProfileManager.profile.validatePIN(payload.value, data.conf.type)) {
												onPinDone.defer(500, null, true);
											} else {
												onPinDone.defer(500, null, false);
											}
										} else if (!ProfileManager.profile.hasPIN(data.conf.type)) {
											onPinDone.defer(500, null, true);
										}
										break;
									case 'profile-create':
									case 'twitter-login':
									case 'textentry':
										if (input) {
											input.data = payload.value;
										}
										break;
								}
							}
						}).subscribeTo(KeyboardValueManager, ['valuechanged']);

						switch (id) {
							case 'profile-create':
							case 'twitter-login':
							case 'textentry':
								keyboard = new MAF.keyboard.ReuseKeyboard({
									maxLength: (data && data.conf && data.conf.maxLength) ? data.conf.maxLength : 99,
									controlSize: 'small',
									layout: 'alphanumeric'
								}).appendTo(keyboardContainer);
								KeyboardValueManager.setMaxLength((data && data.conf && data.conf.maxLength) ? data.conf.maxLength : 99);
								keyboardContainer.wantsFocus = true;
								keyboardContainer.setStyle('height', keyboard.height || 0);
								keyboard.hAlign = 'center';

								var input = new Text({
									editable: true,
									styles: {
										vAlign: 'bottom',
										vOffset: (dialogConfig.buttons.length * 56) + 10 + keyboard.height + 10,
										width: keyboard.width - 70,
										display: 'block',
										hOffset: 10,
										minHeight: '40px',
										height: 'auto',
										padding: '5px',
										border: '2px solid white',
										borderRadius: '10px',
										backgroundColor: 'rgba(150,150,150,.5)',
										truncation: 'end',
										opacity: 0.9
									}
								}).appendTo(contentFrame);

								var cleanButton = new Frame({
									id: '@' + type + '-clear',
									focus: true,
									styles: {
										border: '2px solid white',
										borderRadius: '10px',
										width: 60,
										height: 44,
										hAlign: 'right',
										vAlign: 'bottom',
										hOffset: 12,
										vOffset: input.vOffset - 2
									},
									events: {
										select: function () {
											KeyboardValueManager.value = '';
										},
										focus: function () {
											this.setStyle('backgroundColor', app.Theme.getStyles('BaseFocus', 'backgroundColor'));
										},
										blur: function () {
											this.setStyle('backgroundColor', app.Theme.getStyles('BaseGlow', 'backgroundColor'));
										}
									}
								}).appendTo(contentFrame);

								new Text({
									data: FontAwesome.get('times'),
									styles: {
										width: '100%',
										height: '100%',
										anchorStyle: 'center'
									}
								}).appendTo(cleanButton);

								totalHeight += input.height + 20;

								break;
							case 'profile-pincreation':
							case 'profile-pin':
							case 'pincreation':
							case 'pin':
								keyboard = new MAF.keyboard.ReuseKeyboard({
									maxLength: 4,
									controlSize: 'small',
									layout: 'pinentry'
								}).appendTo(keyboardContainer);
								KeyboardValueManager.setMaxLength(4);
								keyboardContainer.wantsFocus = true;
								keyboardContainer.setStyle('height', keyboard.height || 0);
								keyboard.hAlign = 'center';

								var pinDots = new Frame({
									styles: {
										hAlign: 'center',
										vAlign: 'bottom',
										width: keyboard.width,
										height: 88,
										hOffset: 2,
										vOffset: (dialogConfig.buttons.length * 56) + 10 + keyboard.height
									}
								}).appendTo(contentFrame);

								for (var i = 0; i < 4; i++) {
									new Text({
										styles: {
											fontSize: 50,
											borderRadius: '15px',
											backgroundColor: 'grey',
											border: '2px solid white',
											width: (pinDots.width/4)-4,
											height: 84,
											anchorStyle: 'center',
											hOffset: (pinDots.width/4) * i
										}
									}).appendTo(pinDots);
								}

								totalHeight += pinDots.height;

								break;
						}
						if (keyboard) {
							totalHeight += keyboard.height;
							dialogFocus = 'keyboard';
							keyboard.onKeyDown = function (event) {
								var packet = {
									payload: Object.merge(event, { layout: this.config.layout })
								};
								KeyboardValueManager.handleExternalKeyInput(packet);
							};
						}
					}

					body.appendChild(fragment);
					contentFrame.height = totalHeight + ((dialogMessage.totalLines - 0.5) * dialogMessage.lineHeight);
					contentFrame.visible = true;

					var focusEl = getElementById('@' + type + '-' + dialogFocus);
					if (focusEl && focusEl.focus && focusEl.focus.call) {
						focusEl.focus();
					} else {
						// Blur focus on view?
						warn('Did not find a element to focus!');
					}
					return;
				default:
					break;
			}
		} else {
			if (type === 'sidebar') {
				var home = getElementById('@' + type + '-home');
				if (app.MAF.application.isDefaultView() || (app.widget.hacks && app.widget.hacks.home === false)) {
					home.wantsFocus = false;
					home.frozen = true;
				} else {
					home.store('current', id);
					home.frozen = false;
					home.wantsFocus = true;
				}
			}
			template.frozen = false;
		}
		if (current[identifier] && current[identifier] !== type) {
			getElementById('@' + current[identifier]).frozen = true;
		}
		if (!getElementById(id)) {
			new View({
				id: id,
				focus: true,
				frozen: true,
				styles: type === 'sidebar' ? { top: 64, transform: 'translateZ(0)' } : { transform: 'translateZ(0)' }
			}).appendTo(template);
		}
		current[identifier] = type;
	};
}());

widget.handleChildEvent = function (event) {
	//log('handleChildEvent', event.subject, event);
	switch(event.subject) {
		case 'loadView':
			if (event.error) {
				warn('Error during load view from App: ' + event.id);
				return false;
			}
			if (event.id !== ApplicationManager.active && event.id !== widget.identifier) {
				warn('Load view triggered from a non active App: ' + event.id);
				return false;
			}
			loadTemplate.call(this, event.getData());
			break;
		case 'showDialog':
			var data = event.getData();
			data.id = data.type;
			data.type = 'dialog';
			data.key = data.conf && data.conf.key;
			loadTemplate.call(this, data);
			break;
		case 'hideDialog':
			var dialog = event.getData();
			if (dialog && this.widget) {
				this.widget.getElementById('@' + (dialog.conf && dialog.conf.key || 'dialog')).destroy();
			}
			break;
		case 'setWaitIndicator':
			loadTemplate.call(this, {
				id: event.data,
				type: 'waitIndicator'
			});
			break;
		default:
			break;
	}
	return true;
};

widget.handleHostEvent = function (event) {
	//log('handleHostEvent', event.subject, event.data);
	var data;
	switch(event.subject) {
		case 'onActivateAppButton':
			data = event.getData();
			switch(data.type) {
				case 'close-all':
					if (event.id !== widget.identifier) {
						ApplicationManager.fire(event.id, 'onAppFin', {
							id: event.id
						});
					}
					break;
				case 'viewport-toggle':
					var mediaplayer = this.MAF.mediaplayer,
						bounds = mediaplayer && mediaplayer.getViewportBounds();
					if (bounds && bounds.width === 1920) {
						mediaplayer.setViewportBounds(624, 176, 1280, 720);
					} else if (bounds) {
						mediaplayer.setViewportBounds(0, 0, 1920, 1080);
					}
					break;
				case 'switch-profile':
					loadTemplate.call(this, { type: 'dialog', id: 'profile', conf: { title: 'PROFILE_TITLE', message: 'PROFILE_MESSAGE' }});
					break;
				case 'app-muzzley':
					loadTemplate.call(this, { type: 'dialog', id: 'muzzley', conf: { title: 'MUZZLEY_TITLE', message: 'MUZZLEY_MESSAGE' }});
					break;
			}
			break;
		case 'onDialogPrevious':
			data = event.getData();
			if (data.previousDialog) {
				loadTemplate.call(this, data.previousDialog);
			}
			break;
		case 'onDialogProfileSwitch':
		case 'onDialogProfile':
			data = event.getData();
			loadTemplate.call(this, { type: 'dialog', id: 'profile', conf: { title: 'PROFILE_TITLE', message: 'PROFILE_MESSAGE' }, previousDialog: data.previousDialog });
			break;
		case 'onDialogProfileOptions':
			data = event.getData();
			if (data.profile) {
				loadTemplate.call(this, { type: 'dialog', id: 'profile-options', conf: { title: 'PROFILE_OPTIONS', message: 'PROFILE_OPTIONS_MESSAGE', profile: data.profile }, previousDialog: data.previousDialog });
			}
			break;
		case 'onDialogProfileRemove':
			data = event.getData();
			if (data.profile) {
				ProfileManager.remove(data.profile);
				loadTemplate.call(this, { type: 'dialog', id: 'profile', conf: { title: 'PROFILE_TITLE', message: 'PROFILE_MESSAGE' }, previousDialog: data.previousDialog});
			}
			break;
		case 'onDialogProfilePIN':
			data = event.getData();
			if (data.profile) {
				loadTemplate.call(this, { type: 'dialog', id: 'profile-pin', conf: { title: 'PROFILE_PIN', message: 'PROFILE_PIN_MESSAGE', errorMessage: 'PROFILE_PIN_ERROR', profile: data.profile, type: 'passport' }, previousDialog: data.previousDialog });
			}
			break;
		case 'onDialogProfileCreate':
			data = event.getData();
			loadTemplate.call(this, { type: 'dialog', id: 'profile-create', conf: { title: 'PROFILE_CREATE', message: 'PROFILE_CREATE_MESSAGE'}, previousDialog: data.previousDialog });
			break;
		case 'onDialogProfileCreatePIN':
			data = event.getData();
			if (data.profile) {
				loadTemplate.call(this, { type: 'dialog', id: 'profile-pincreation', conf: { title: 'PROFILE_CREATE_PIN', message: 'PROFILE_CREATE_PIN_MESSAGE', profile: data.profile }, previousDialog: data.previousDialog });
			}
			break;
		case 'onDialogProfileCreated':
			data = event.getData();
			if (data.profile && data.pin) {
				ProfileManager.add(data.profile, data.pin);
				if (data.previousDialog) {
					loadTemplate.call(this, data.previousDialog);
				}
			}
			break;
		case 'onDialogCancelled':
		case 'onDialogDone':
			data = event.getData();
			if (data.previousDialog) {
				switch (data.previousDialog.id) {
					case 'facebook-login':
						if (Facebook.userId) {
							return;
						}
						break;
				}
				loadTemplate.call(this, data.previousDialog);
			}
			break;
		case 'onActivateSnippet':
			if (event.id !== widget.identifier) {
				Horizon.hide();
			}
			loadTemplate.call(this, event.getResult());
			break;
		case 'onAppFin':
			if (event.error) {
				warn('Their are issues closing your App, please check your code');
				return false;
			}
			if (event.id !== widget.identifier) {
				Horizon.show();
			}
			break;
		case 'onAppFinComplete':
			ApplicationManager.unload(event.id);
			break;
		case 'getSnippetConfs':
			break;
		case 'showDialog':
			data = event.getData();
			data.id = data.type;
			data.type = 'dialog';
			data.key = data.conf && data.conf.key;
			loadTemplate.call(this, data);
			break;
		case 'hideDialog':
			var dialog = event.getData();
			if (dialog && this.widget) {
				var dlg = this.widget.getElementById('@' + (dialog.conf && dialog.conf.key || 'dialog'));
				if (dlg) {
					dlg.destroy();
				}
			}
			if (Muzzley.enabled) {
				Muzzley.resetDevice();
			}
			break;
		case 'onApplicationAvailable':
			//log(event.data);
			break;
		case 'onApplicationsAvailable':
			//log(event.data);
			MAF.messages.store('myApps', event.getData());
			break;
		case 'onApplicationStartupRequest':
			data = event.data;
			ApplicationManager.load(data);
			ApplicationManager.open(data);
			break;
		default:
			break;
	}
	return true;
};
