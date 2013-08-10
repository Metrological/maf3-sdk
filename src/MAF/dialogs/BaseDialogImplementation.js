define('MAF.dialogs.BaseDialogImplementation', function () {
	return new MAF.Class({
		ClassName: 'BaseDialogImplementation',

		Implements: [
			Library.Storage
		],

		Protected: {
			removeHandler: function() {
				if(this._boundDispatcher) {
					this._boundDispatcher.unsubscribeFrom(MAF.application, ['onDialogDone', 'onDialogCancelled', 'onHideView']);
					this._boundDispatcher = null;
				}
			}
		},

		config: {
			focusOnCompletion: null,
			isModal: false
		},
		
		initialize: function () {
			this.store('key', md5(this._classID));
		},
		
		show: function() {
			if(!MAF.application.isSidebarLoaded()) {
				log("refusing to show a dialog when we are in snippet mode.");
				return;
			}
			this._viewId = MAF.application.getCurrentViewId();
			this._boundDispatcher = this.dispatcher.subscribeTo(MAF.application, ['onDialogDone', 'onDialogCancelled', 'onHideView'], this);
			// we need this since this is the only place where we activate dialogs
			// ??? it would be nice if this was responding to an onShowDialog event or something
			this._pauseKeyboardState();
			MAF.HostEventManager.send('showDialog', this.getDialogConfig());
		},
		
		hide: function() {
			this.removeHandler();
			MAF.HostEventManager.send('hideDialog', this.getDialogConfig());
		},

		_keyboardWasActive: false,

		_pauseKeyboardState: function () {
			var KeyboardInput = MAF.keyboard.KeyboardInput;
			if (KeyboardInput && KeyboardInput.setRemoteKeyboard) {
				if (KeyboardInput.setRemoteKeyboard.active()) {
					this._keyboardWasActive = true;
					this._keyboardWasActiveValue = KeyboardInput.setRemoteKeyboard.getValue();
					this._keyboardWasActiveLayout = KeyboardInput.setRemoteKeyboard.getLayout();
					KeyboardInput.setRemoteKeyboard(false);
				}
			}
		},

		_resumeKeyboardState: function (eventType) {
			if (['onDialogDone', 'onDialogCancelled', 'onHideView'].indexOf(eventType) != -1) {
				var KeyboardInput = MAF.keyboard.KeyboardInput;
				if (KeyboardInput && KeyboardInput.setRemoteKeyboard) {
					if (this._keyboardWasActive) {
						KeyboardInput.setRemoteKeyboard.setLayout(this._keyboardWasActiveLayout);
						KeyboardInput.setRemoteKeyboard.setValue(this._keyboardWasActiveValue);
						KeyboardInput.setRemoteKeyboard(true);
						this._keyboardWasActive = false;
					}
				}
			}
		},
		
		dispatcher: function(event) {
			this._resumeKeyboardState(event.type);
			log('dispatcher', event.payload);
			if(event.type == "onHideView") {
				if(this._viewId !== event.payload.viewId) {
					return;
				}
				log("We got a onHideView from the UI before we got an onDialogDone. Concider this dialog 'aborted'");
				this.removeHandler();
				return;
			}
			if(event.payload.key !==  this.retrieve('key')) {
				log('key compared to event.payload.key', this.retrieve('key'),'/',event.payload.key);
				return;
			}
			this.removeHandler();
			if (event.type === 'onDialogCancelled') event.payload.cancelled = true;
			
			if(this.config.focusOnCompletion && this.config.focusOnCompletion.focus && this.config.focusOnCompletion.focus.call) {
				this.config.focusOnCompletion.focus();
			}
			this.handleCallback(event.payload);
		},
		
		getDialogConfig: function() {
			throw new Error("All subclasses must provide this method!");
		},
		
		handleCallback: function(response) {
			throw new Error("All subclasses must provide this method!");
		}
	});
});
