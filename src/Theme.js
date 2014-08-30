/**
 * @class Theme
 * @classdesc > Several utilities for handling global styling for your application.
 * @singleton
 * @example
 *  //Change default focus colour of all classes.
 *  Theme.set({
 *     BaseFocus: {
 *        styles: {
 *           backgroundColor: '#c0de70'
 *        }
 *     }
 *  });
 */

/**
 * Retrieve a Theme configuration.
 * @method Theme#get
 * @param {String} name Name of the configuration to retrieve.
 * @param {String} [key] Specific subentry in the configuration to retrieve.
 * @example
 *  //You can store extra things in the configuration besides styles.
 *  Theme.set({
 *     myClass: {
 *        styles: {
 *           width: 30
 *        },
 *        unchecked: FontAwesome.get(['square-o']),
 *        checked: FontAwesome.get(['check-square-o'])
 *     }
 *  });
 *
 *  var isChecked = true;
 *  new MAF.element.Text({
 *     ClassName: 'myClass',
 *     label: Theme.get('myClass', (isChecked) ? 'checked' : 'unchecked')
 *  }).appendTo(this);
 */

/**
 * Set a Theme configuration.
 * @method Theme#set
 * @param {Object} blob This can contain theme settings for several classes
 * @example
 *  Theme.set({
 *     myClass: {
 *        styles: {
 *           backgroundColor: 'white',
 *           width: 'inherit',
 *           height: 52
 *        }
 *     }
 *  });
 *
 *  var myClassPrototype = new MAF.Class({
 *     ClassName: 'myClass',
 *     Extends: MAF.element.Container
 *  });
 */

/**
 * Make a alias of a existing configuration
 * @method Theme#alias
 * @param {String} alias Name of the alias
 * @param {String} original ClassName of a existing configuration.
 * @example
 *  //Set the styling of ControlTextButton to 'myClass'
 *  Theme.alias('myClass', 'ControlTextButton');
 *
 *  var myClassPrototype = new MAF.Class({
 *     ClassName: 'myClass',
 *     Extends: MAF.element.Container
 *  });
 */

/**
 * If a renderskin method is defined in the Theme of the class, you can execute it with this method.
 * @method Theme#renderSkin
 * @param {String} name Class skin you want to build.
 * @param {String} state State of the skin.
 * @param {Number} width Width the skins needs to be.
 * @param {Number} height Height the skin needs to be.
 * @param {Object} [agrs] Optional arguments.
 */

/**
 * Executes the applyLayer method defined in a Theme configuration on the element of the passed Class or element.
 * @param {String} name Name of the component.
 * @param {MAF.Class|Element} view The Class or Element things needs to be applies.
 * @param {Object} [agrs] Optional arguments.
 */

/**
 * @method Theme#getStyles
 * @param {String} controlname Name of the component.
 * @param {String} [state=normal] If the control has styles configured for different states you can retrieve the configuration for a specific state only.
 * @returns {Object} Control configurations, if a state is found it only returns the styles for the specific state. If no state is found the normal styles are returned.
 */

/**
 * Add a font to the application.
 * @name Fonts.add
 * @memberOf Theme
 * @function
 * @param {String} name Font name.
 * @param {String} file Location to the font file.
 * @param {Array} [formats] Default is ['eot', 'woff', 'truetype']
 */

/**
 * Remove a certain font from the application.
 * @name Fonts.remove
 * @memberOf Theme
 * @function
 * @param {String} name Font name which to remove.
 */

/**
 * Check if a certain font is available for the application
 * @name Fonts.has
 * @memberOf Theme
 * @function
 * @param {String} name Font name.
 */

/**
 * Set your application to use a certain font as default font.
 * @name Fonts.setDefault
 * @memberOf Theme
 * @function
 * @param {String} family The font family to use as default font.
 */