var loadTemplate = (function () {
	var current;
	return function (data) {
		var type = data.type,
			id = data.id;
		if (!type) {
			return;
		}
		var app = this,
			identifier = app.widget.identifier,
			getElementById = app.widget.getElementById,
			template = type && getElementById('@' + type);
		//log('loadTemplate', type, current, template);
		if (template) {
			if (type === 'sidebar') {
				var home = getElementById('@' + type + '-home');
				if (home.retrieve('id') === id) {
					home.wantsFocus = false;
					home.frozen = true;
				} else {
					home.store('current', id);
					home.frozen = false;
					home.wantsFocus = true;
				}
			}
		}
		if (!template) {
			switch(type) {
				case 'sidebar':
					template = new View({
						id: '@' + type,
						styles: {
							overflow: 'visible',
							backgroundColor: 'rgba(0,0,0,.5)',
							border: '2px solid white',
							borderRadius: '15px',
							width: 588,
							height: 1032,
							top: 22,
							left: 22
						},
						events: {
							navigateoutofbounds: function (event) {
								var home = getElementById('@' + type + '-home');
								if (home && home.focusable && event.detail.direction === 'up') {
									home.focus();
								}
							}
						}
					}).appendTo(app.document.body);
					app.widget.getImage('header', 'normal').appendTo(template);
					new Text({
						id: '@' + type + '-home',
						label: '&#x238B;',
						frozen: true,
						styles: {
							width: 64,
							height: 42,
							hAlign: 'right',
							vOffset: 12,
							anchorStyle: 'center',
							fontSize: 34
						},
						events: {
							focus: function () {
								var focused = app.widget.getImageSource('header', 'focused');
								if (focused) {
									this.parentNode.firstChild.source = focused;
								}
								this.setStyle('color', 'red');
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
					break;
				case 'fullscreen':
					template = new View({
						id: '@' + type,
						styles: {
							width: 1920,
							height: 1080
						}
					}).appendTo(app.document.body);
					break;
				case 'dialog':
					var currentStyle = getElementById('@' + current).style;
					var buttons = [];
					var KeyboardValueManager = new MAF.keyboard.KeyboardValueManager();
					var onPinDone = function (authorized) {
						if (authorized) {
							var dialogKey = template.retrieve('key');
							focusAfterDialog.focus();
							if (keyboard && keyboard.firstChild && keyboard.firstChild.owner) {
								keyboard.firstChild.owner.suicide();
							}
							KeyboardValueManager.value = '';
							focusAfterDialog = null;
							KeyboardValueManager.suicide();
							KeyboardValueManager = null;
							template.destroy();
							ApplicationManager.fire(identifier, 'onDialogDone', { key: dialogKey, success: authorized });
						} else {
							getElementById('@' + type + '-title').setStyle('backgroundColor', '#610B0B');
							getElementById('@' + type + '-message').data = data.errorMessage || data.message;
							var pindotEl = pinDots.firstChild;
							do {
								if (pindotEl.nodeType === 1) {
									pindotEl.data = '';
								}
								pindotEl = pindotEl.nextSibling;
							} while (pindotEl);
						}
					};
					var onValueManagerEvent = function (event) {
						var payload = event.payload || {};
						if (event.type === 'valuechanged') {
							switch (id) {
								case 'pin':
									for (var i=0; i<4; i++) {
										if (payload.value.length > i) {
											pinDots.childNodes[i].data = '&#9679';
										} else {
											pinDots.childNodes[i].data = '';
										}
									}
									if (payload.value.length === 4) {
										// TODO: Profile/Admin Pin checking
										if (data.isAdminPIN) {
											onPinDone.defer(1000, null, true);
										} else {
											if (data.profileId) {
												onPinDone.defer(1000, null, true);
											} else {
												onPinDone.defer(1000, null, true);
											}
										}
									}
									break;
								case 'textentry':
									if (input) {
										input.data = payload.value;
									}
									break;
							}
						}
					}.subscribeTo(KeyboardValueManager, ['valuechanged']);
					// Default buttons
					switch (id) {
						case 'login':
							buttons.push({ value: '$ok', label: widget.getLocalizedString('ok') });
							buttons.push({ value: '$back', label: widget.getLocalizedString('back'), opacity: 0 });
							buttons.push({ value: '$cancel', label: widget.getLocalizedString('cancel') });
							break;
						case 'textentry':
						case 'pincreation':
							buttons.push({ value: '$ok', label: widget.getLocalizedString('ok') });
							buttons.push({ value: '$cancel', label: widget.getLocalizedString('cancel') });
							break;
						case 'pin':
							buttons.push({ value: '$forgot', label: widget.getLocalizedString('forgot_pin') });
							buttons.push({ value: '$cancel', label: widget.getLocalizedString('cancel') });
							break;
					}
					
					var dialogConfig = Object.merge({buttons: buttons}, data.conf);

					template = new Dialog({
						id: '@' + type,
						styles: {
							overflow: currentStyle.overflow,
							backgroundColor: 'rgba(0,0,0,.5)',
							border: currentStyle.border,
							borderRadius: '15px',
							width: currentStyle.width,
							height: currentStyle.height,
							top: currentStyle.top,
							left: currentStyle.left
						},
						events: {
							select: function (event) {
								var target = event.target,
									selectedValue = target && target.retrieve('value'),
									dialogKey = this.retrieve('key');
								if (target && target.id && target.id.indexOf('button') > 0) {
									event.preventDefault();
									var keyboard = getElementById('@' + type + '-keyboard');
									if (keyboard && keyboard.firstChild && keyboard.firstChild.owner) {
										keyboard.firstChild.owner.suicide();
									}
									KeyboardValueManager.suicide();
									KeyboardValueManager = null;
									this.destroy();
									switch (selectedValue) {
										case '$forgot':
											focusAfterDialog.focus();
											focusAfterDialog = null;
											ApplicationManager.fire(identifier, 'onDialogDone', { key: dialogKey, success: false, forgot: true });
											break;
										case '$ok':
											focusAfterDialog.focus();
											focusAfterDialog = null;
											ApplicationManager.fire(identifier, 'onDialogDone', { key: dialogKey, response: KeyboardValueManager.value });
											break;
										case '$cancel':
											focusAfterDialog.focus();
											focusAfterDialog = null;
											ApplicationManager.fire(identifier, 'onDialogCancelled', { key: dialogKey });
											break;
										default:
											focusAfterDialog.focus();
											focusAfterDialog = null;
											ApplicationManager.fire(identifier, 'onDialogDone', { key: dialogKey, selectedValue: selectedValue });
											break;
									}
								}
							},
							back: function (event) {
								var dialogKey = this.retrieve('key');
								event.preventDefault();
								ApplicationManager.fire(identifier, 'onDialogCancelled', { key: dialogKey });
								this.destroy();
							}
						}
					}).appendTo(app.document.body);

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
							backgroundColor: 'black'
						}
					}).appendTo(template);

					new Text({
						id: '@' + type + '-title',
						label: widget.getLocalizedString(dialogConfig.title || ''),
						styles: {
							borderBottom: '2px solid grey',
							height: 64
						}
					}).appendTo(contentFrame).addClass('ControlTextButtonText');

					new Text({
						id: '@' + type + '-message',
						label: widget.getLocalizedString(dialogConfig.message || ''),
						styles: {
							vOffset: 66,
							wrap: true
						}
					}).appendTo(contentFrame).addClass('ControlTextButtonText');

					var keyboardContainer = new Frame({
						id: '@' + type + '-keyboard',
						styles: {
							width: 'inherit',
							height: 0,
							vAlign: 'bottom',
							vOffset: (dialogConfig.buttons.length * 56) + 5
						},
						events: {
							focus: function (event) {
								if (this.firstChild && this.firstChild.owner && this.firstChild.owner.focus && this.firstChild.owner.focus.call) {
									this.wantsFocus = false;
									this.firstChild.owner.focus();
								}
							}
						}
					}).appendTo(contentFrame);

					dialogConfig.buttons.forEach(function(btnConfig, key){
						var styles = {
							height: 51,
							width: contentFrame.width - 30,
							borderRadius: '15px',
							border: '2px solid #FFFFFF',
							vAlign: 'bottom',
							hOffset: 15,
							vOffset: (((dialogConfig.buttons.length-1) - key) * 56) + 5,
							backgroundColor: 'black'
						};
						var button = new Text({
							label: widget.getLocalizedString(btnConfig.label),
							id: '@' + type + '-button'+key,
							focus: true,
							styles: styles,
							events: {
								focus: function () {
									this.setStyle('backgroundColor', 'red');
								},
								blur: function () {
									this.setStyle('backgroundColor', 'black');
								}
							}
						}).appendTo(contentFrame).addClass('ControlTextButtonText').store('value', btnConfig.value);			
					});

					var keyboard, focusEl;
					switch (id) {
						case 'textentry':
							keyboard = new MAF.keyboard.ReuseKeyboard({
								maxLength: 24,
								controlSize: "small",
								layout: 'alphanumeric'
							}).appendTo(keyboardContainer);
							KeyboardValueManager.setMaxLength(24);
							keyboardContainer.wantsFocus = true;
							keyboardContainer.setStyle('height', keyboard.height || 0);
							keyboard.hAlign = 'center';

							var input = new Text({
								focus: true,
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
										this.setStyle('backgroundColor', 'red');
									},
									blur: function () {
										this.setStyle('backgroundColor', 'black');
									}
								}
							}).appendTo(contentFrame);

							new Text({
								data: '&#8999;',
								styles: {
									width: 'inherit',
									height: 'inherit',
									anchorStyle: 'center'
								}
							}).appendTo(cleanButton);

							focusEl = getElementById('@' + type + '-keyboard');
							break;
						case 'pincreation':
						case 'pin':
							keyboard = new MAF.keyboard.ReuseKeyboard({
								maxLength: 4,
								controlSize: "small",
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
										fontSize: 60,
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

							focusEl = getElementById('@' + type + '-keyboard');
							break;
						case 'alert':
							focusEl = getElementById('@' + type + '-button0');
							break;
					}

					if (keyboard) {
						keyboard.onKeyDown = function (event) {
							var packet = {
								payload: Object.merge(event, { layout: this.config.layout })
							};
							KeyboardValueManager.handleExternalKeyInput(packet);
						};
					}
					var height = (dialogConfig.buttons.length * 56) + 66 + 80 + (pinDots && pinDots.height || 0) + (input && input.height || 0) + keyboardContainer.height;
					contentFrame.setStyle('height', height);

					var focusAfterDialog = document.activeElement;
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
			template.frozen = false;
		}
		if (current && current !== type) {
			getElementById('@' + current).frozen = true;
		}
		if (!getElementById(id)) {
			new View({
				id: id,
				frozen: true,
				styles: type === 'sidebar' ? { top: 64 } : null
			}).appendTo(template);
		}
		current = type;
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
			loadTemplate.call(this, data);
			break;
		default:
			break;
	}
	return true;
};

widget.handleHostEvent = function (event) {
	//log('handleHostEvent', event.subject, event);
	switch(event.subject) {
		case 'onActivateSnippet':
			if (event.id !== widget.identifier) {
				document.body.frozen = true;
			}
			loadTemplate.call(this, event.getResult());
			break;
		case 'onAppFin':
			if (event.error) {
				warn('Their are issues closing your App, please check your code');
				return false;
			}
			if (event.id !== widget.identifier) {
				document.body.frozen = false;
			}
			break;
		default:
			break;
	}
	return true;
};
