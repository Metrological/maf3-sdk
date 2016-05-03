/**
 * @-class MAF.HostEventManager
 * @-classdesc > Provides communication between the Framework and the app.
 * @-singleton
 */
/**
 * @-method MAF.HostEventManager#send
 * @-param {String} eventType **You can send the following events:**
 * * changeProfile
 * * loadView
 * * hideDialog
 * * showDialog
 * * setSnippetConfs
 * * addSnippetConfs
 * * deleteSnippetConfs
 * * exitToDock
 * * exit
 * * setFavAction
 * * setIcons
 * * setWaitIndicator
 * * setFullscreenVideoMode
 * * toggleViewport
 * * launchApp
 * @-param {Object} args Data you want to send.
 */
/*
			var subscribeableHostEvents = [
				'onAppInit',
				'onAppFin',
				'onDialogCancelled',
				'onDialogDone',
				'onHideView',
				'onLoadProfile',
				'onLoadView',
				'onShowView',
				'onUnloadProfile',
				'onUnloadView',
				'getSnippetConfs',
				'onSelect',
				'onUnselect',
				'onDispatchedChildEvent',
				'onActivateAppButton',
				'onActivateSnippet'
			];

		*/