/**
 * @class FontAwesome
 * @singleton
 * @classdesc > Simple wrapper to build a string that can be used to show FontAwesome icons. You can use them for example on MAF.element.Text components.
 * Look at {@link  http://fortawesome.github.io/Font-Awesome/icons/} for which icons you can use.
 */

/**
 * @method FontAwesome#get
 * @param {...Mixed} arg For each icon you want to be displayed use a Array parameter describing how it should behave. To stack icons use as first paremeter 'stack'.
 * @returns {String} The html string containing the FontAwesome icons.
 * @example
 *  this.elements.iconText = new MAF.element.Text({
 *     label: FontAwesome.get('stack', ['square-o', 'stack-2x'], ['check', 'stack-1x'])
 *  }).appendTo(this);
 */