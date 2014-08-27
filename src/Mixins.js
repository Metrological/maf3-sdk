/**
 * @mixin Library.Storage
 * @classdesc > Do not use this directly, this Library needs to be implemented on a class.
 * @example
 *  var myClassPrototype = new MAF.Class({
 *     Implements: [
 *        Library.Storage
 *     ]
 *  });
 *
 *  var myClass = new myClassPrototype();
 *  myClass.store('some_number', 123);
 *  myClass.retrieve('some_number'); // Returns 123
 *  myClass.eliminate('some_number');
 */
/**
 * Saves a value to be availeble on the instance this Library is placed.
 * @method Library.Storage#store
 * @param {String} key Key needs to be string.
 * @param {Mixed} value Supports the storing of Strings, Numbers, Objects, Arrays. basically any JSONeable value.
 */
/**
 * Retrieves a value from the storage.
 * @method Library.Storage#retrieve
 * @param {String} key Retrieves the value if key exists.
 */
/**
 * Removes a key from the storage.
 * @method Library.Storage#eliminate
 * @param {String} key Deletes the value if key exists.
 */

/**
 * @mixin Library.DOM
 * @classdesc > Do not use this directly, this Library needs to be implemented on a class.
 * @example
 *  var myClassPrototype = new MAF.Class({
 *     Implements: [
 *        Library.DOM
 *     ]
 *  });
 */
/**
 * This method appends a element as the last child of this Class.
 * @method Library.DOM#appendChild
 * @param {ELement|MAF.Class} child Component or element you want to add.
 * @returns {MAF.Class} Returns this.
 * @fires onChildAppended
 * @fires onAppend
 */
/**
 * Append a child or several children to this Class.
 * @method Library.DOM#adopt
 * @param {...MAF.Class} child Component or element you want to add.
 */
/**
 * Add this class element as a child to the specified class.
 * @method Library.DOM#appendTo
 * @param {MAF.Class} parent Which class to append to.
 */
/**
 * Move the Class element to a different class.
 * @method Library.DOM#moveTo
 * @param {MAF.Class} parent Which class to move to.
 */
/**
 * Remove a child.
 * @method Library.DOM#detachChild
 * @param {String|Number|Element} child String can be first or last, Number is position of the child. Element is the child itself.
 * @returns {Element} The detached child element.
 */
/**
 * Remove a child.
 * @method Library.DOM#removeChild
 * @param {String|Number|Element} child String can be first or last, Number is position of the child. Element is the child itself.
 * @returns {Element} The removed child element.
 * @fires onChildRemoved
 */
/**
 * Remove all children.
 * @method Library.DOM#removeChildren
 */
/**
 * Destroy and cleanup this Class and all its children.
 * @method Library.DOM#suicide
 */
/**
 * Remove all Children from this Class
 * @method Library.DOM#empty
 * @returns {MAF.Class} Returns this.
 */


/**
 * @mixin Library.Styles
 * @classdesc > Do not use this directly, this Library needs to be implemented on a class.
 * @example
 *  var myClassPrototype = new MAF.Class({
 *     Implements: [
 *        Library.Styles
 *     ]
 *  });
 */
/**
 * This method modifies element's CSS style properties. Styles are passed as a hash of property-value pairs in which the properties are specified in their camelized form.
 * @method Library.Styles#setStyles
 * @param {Object} styles Object with CSS styles to apply to the element.
 * @example
 *  .setStyles({
 *     backgroundColor: '#900',
 *     fontSize: '12px'
 *  });
 *  @returns {MAF.Class} This
 */
/**
 * @method Library.Styles#setStyle
 * @param {String} key CSS property to apply to on this element.
 * @param {Object} value CSS value
 * @returns {MAF.Class} This
 */
/**
 * This method returns the given CSS property value of element.
 * @method Library.Styles#getStyle
 * @param {String} key CSS property to fetch.
 * @returns {Object} CSS style requested.
 */

/**
 * @method Library.Styles#getStylesCopy
 * @returns {Object} Cloned object with all the styles applied on this component.
 */

/**
 * @mixin Library.Themes
 * @classdesc > Do not use this directly, this Library needs to be implemented on a class.
 * @example
 *  var myClassPrototype = new MAF.Class({
 *     Implements: [
 *        Library.Themes
 *     ]
 *  });
 */
/**
 * If a renderskin is method is defined in the Theme of the class, you can execute it with this method.
 * @method Library.Themes#renderSkin
 * @param {String} name Skin name to render
 * @param {String} [state] State of the skin.
 * @param {Object} [agrs] Optional arguments
 */
/**
 * Remove all skins from the Class
 * @method Library.Themes#removeSkin
 * @returns {MAF.Class} This
 */
