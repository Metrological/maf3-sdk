/**
 * @class MAF.application
 * @singleton
 */
/**
 * Initialized the application with the supplied config.
 * @method MAF.application#init
 * @param {Object} config Application configuration object
 * @param {String} config.defaultViewId Defines which view to load when the application starts or when MAF.application.loadDefaultView() is called.
 * @param {String} [config.settingsViewId] Defines a view which will be loaded when the onActivateSettingsButton event trigger (Button on Sidebar). Also loads this view when MAF.application.loadSettingsView() is called.
 * @param {Array} config.views Containing view configuration objects. Each object is defined by a view id, a view class and a optional data parameter.
 */
/**
 * Remove the view ids defined in the array or string from the application.
 * @method MAF.application#removeView
 * @param {Array|String} ids One or more view ids.
 * @example
 * MAF.application.removeView('view1');
 * MAF.application.removeView(['view2', 'view3']);
 * @todo  implement.
 */
/**
 * @method MAF.application#loadView
 * @param {String} id View identifier, needs to be unique.
 * @param {Object} [params] Data you want to send to the view. (view.persist)
 * @param {Boolean} [nosave] This will prevent that the loaded view will be stored in history.
 */
/**
 * The currently active view will be reloaded. This will not call the createView, but it will call updateView.
 * @method MAF.application#reloadView
 * @param {Object} [params] The view.persist object will be merged with this Object.
 * @param {Boolean} [nosave] Indicates if the view needs to be stored in history, including previous persist object.
 */
/**
 * Loads the previous view by default. If there is no previous view it will close the application.
 * @method MAF.application#previousView
 * @param {Object} [params] Data available on the view this will load (view.backParams)
 * @param {Number} [count] Number of views you want to go back.
 */
/**
 * Empty the view history.
 * @method MAF.application#clearViewHistory
 */
/**
 * @method MAF.application#isDefaultView
 * @return True when the currently active view is the default view.
 */
/**
 * Empties the view history and loads the view that is defined by the defaultViewId property.
 * @method MAF.application#loadDefaultView
 */
/**
 * Load the view that is defined by the settingsViewId property.
 * @method MAF.application#loadSettingsView
 */
/**
 * Get the property of a view.
 * @method MAF.application#getViewProperty
 * @param {String} id View identified by the id property
 * @param {String} key Property name on the view to return.
 * @return {Mixed} Value stored on the key.
 * @example
 * if (MAF.application.getViewProperty('myViewId', 'visible'))
 *    console.log('My view is visible');
 */
/**
 * Method to check if the application has a sidebar view active.
 * @method MAF.application#isSidebarView
 * @return True when a view is active that is inherited from MAF.system.SidebarView
 */
/**
 * Method to check if the application has a view active which allows user interaction.
 * @method MAF.application#isSidebarLoaded
 * @return True when a view is active that is inherited from MAF.system.WindowedView
 */
/**
 * @example
 *  if (MAF.application.getCurrentViewId() === 'myViewId')
 *     MAF.application.reLoadView();
 *  else
 *     MAF.application.loadView('myViewId');
 * @method MAF.application#getCurrentViewId
 * @return {String} Containing the id of the view that is currently active.
 */
/**
 * This is a special case of a loadView method. It will clear the applications view history.
 * @method MAF.application#setHostResultToViewId
 * @param {Event} event The view config will be added on event.result
 * @param {String} viewId Id of the view to be loaded.
 * @param {Object} [params] Data you want to send to the view. (view.persist)
 */
/**
 * @method MAF.application#getViewConfig
 * @param {String} id View id.
 * @return The view config that goes with the id parameter. False if not found.
 */
/**
 * @method MAF.application#launchApp
 * @private
 */
/**
 * Close the application.
 * @method MAF.application#exit
 */
/**
 * Add a view to the application. After this you can load it.
 * @example
 *  var definedView = new MAF.Class({
 *     Extends: MAF.system.SidebarView,
 *     ClassName: 'MainView',
 *     createView: function() {
 *        new MAF.control.TextButton({
 *           label: this.config.data.btnLabel,
 *           events: {
 *              onSelect: function () {
 *                 MAF.application.exit();
 *              }
 *           }
 *        }).appendTo(this);
 *     }
 *  });
 *  MAF.application.addViewConfig({
 *     id: 'addedView',
 *     data: {
 *        btnLabel: 'Exit application',
 *        value: 'This object is available on the view'
 *     },
 *     viewClass: definedView
 *  });
 *  MAF.application.loadView('addedView');
 * @method MAF.application#addViewConfig
 * @param {Object} config View properties.
 */

/**
 * Fired when the back button has been selected.
 * @event MAF.application#onActivateBackButton
 */
/**
 * Fired when the home button has been selected in a sidebar.
 * @event MAF.application#onActivateHomeButton
 */
/**
 * Fired when the favorite button has been selected in a sidebar.
 * @event MAF.application#onActivateFavButton
 */
/**
 * Fired when the settings button has been selected in a sidebar.
 * @event MAF.application#onActivateSettingsButton
 */
/**
 * Fired when a user has selected the snippet.
 * @event MAF.application#onActivateSnippet
 */
/**
 * @event MAF.application#onActivateApp
 */
/**
 * Fired when the view config has loaded and before it starts to build the view.
 * @event MAF.application#onLoadView
 */
/**
 * Fired when the view is going to be destroyed.
 * @event MAF.application#onUnloadView
 */
/**
 * Fired before the view becomes visible.
 * @event MAF.application#onShowView
 */
/**
 * Fired before a view hides.
 * @event MAF.application#onHideView
 */
/**
 * Fired before a view gets focus.
 * @event MAF.application#onSelectView
 */
/**
 * Fired before a view looses focus.
 * @event MAF.application#onUnselectView
 */

/**
 * @event MAF.application#getSnippetConfs
 */
/**
 * Fired when a dialog has been cancelled.
 * @event MAF.application#onDialogCancelled
 */
/**
 * Fired when a dialog has been completed.
 * @event MAF.application#onDialogDone
 */
/**
 * Fired before a application is starting.
 * @event MAF.application#onApplicationStartup
 */
/**
 * Fired before the application is shutting down.
 * @event MAF.application#onApplicationShutdown
 */
/**
 * Fired when profile has loaded.
 * @event MAF.application#onLoadProfile
 */
/**
 * Fired before a profile is unloading.
 * @event MAF.application#onUnloadProfile
 */
/**
 * Fired when a key is pressed while the application is active.
 * @event MAF.application#onWidgetKeyPress
 */
/**
 * Fired when a colored key is pressed while the application is active.
 * @event MAF.application#onColorKeyPress
 */
/**
 * Fired when playback controls are pressed.
 * @event MAF.application#onPlayControlKeyPress
 */
/**
 * Fired before a new view has loaded.
 * @event MAF.application#onViewChangeInitiated
 */
