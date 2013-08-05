define('MAF.dialogs.BaseDialogImplementation', function () {
	return new MAF.Class({
		ClassName: 'BaseDialogImplementation',
		
		config: {
			focusOnCompletion: null,
			isModal: false
		},
		
		initialize: function () {
			//this._key = md5(typeof(this) + '100');
			//animator.milliseconds.toString());
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
			// we aren't using this method right now
			this._removeHandler();
			MAF.HostEventManager.send('hideDialog', this.getDialogConfig());
			// don't need this in here since we are responding to the onDialogDone/Cancelled events the dock send back as a result of this
			//this._resumeKeyboardState();
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
		
		_removeHandler: function() {
			if(this._boundDispatcher) {
				this._boundDispatcher.unsubscribeFrom(MAF.application, ['onDialogDone', 'onDialogCancelled', 'onHideView']);
				this._boundDispatcher = null;
			}
		},
		
		dispatcher: function(event) {
			this._resumeKeyboardState(event.type);
			
			if(event.type == "onHideView") {
				if(this._viewId != event.payload.viewId) {
					return;
				}
				log("We got a onHideView from the dock before we got an onDialogDone. Concider this dialog 'aborted'");
				this._removeHandler();
				return;
			}
			if(event.payload.key != this._key) {
				log('this._key vs. event.payload.key',this._key,'/',event.payload.key);
				return;
			}
			this._removeHandler();
			if (event.type=='onDialogCancelled') event.payload.cancelled = true;
			this.handleCallback(event.payload);
			if(this.config.focusOnCompletion && this.config.focusOnCompletion.focus && this.config.focusOnCompletion.focus.call) {
				this.config.focusOnCompletion.focus();
			}
		},
		
		getDialogConfig: function() {
			throw new Error("All subclasses must provide this method!");
		},
		
		handleCallback: function(response) {
			throw new Error("All subclasses must provide this method!");
		}
	});
});
