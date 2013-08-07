var loadTemplate = (function () {
	var current;
	return function (type, id) {
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
			if (current) {
				getElementById('@' + current).frozen = true;
			}
		}
		if (!template) {
			switch(type) {
				case 'sidebar':
					template = new Frame({
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
					template = new Frame({
						id: '@' + type,
						styles: {
							width: 1920,
							height: 1080
						}
					}).appendTo(app.document.body);
					break;
				default: 
					break;
			}
		} else {
			template.frozen = false;
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
			var data = event.getData();
			loadTemplate.call(this, data.type, data.id);
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
			var result = event.getResult();
			loadTemplate.call(this, result.type, result.id);
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
