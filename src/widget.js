/**
 * @class widget
 * @classdesc > The widget instance has several things that usefull for the application scope.
 * @singleton
 * @example
 *  //metadata.json example file
 * {
	"identifier": "com.metrological.app.EmptyTemplate",
	"name": "Empty App Template",
	"version": "0.0.1",
	"author": "Metrological Widgets",
	"company": "Metrological Widgets",
	"copyright": "Metrological Widgets 2014",
	"description": "A clean App structure",
	"categories": [
		"video"
	],
	"scripts": "Javascript/init.js",
	"images": {
		"about": "Images/Icon.png",
		"icon": {
			"192x192": "Images/Icon.png"
		}
	}
}
 */

//
/**
 * Defines if the application is running or not.
 * @var {Boolean} active
 * @memberof widget
 */

//
/**
 * Defines if the application has a dialog active on the screen or not.
 * @var {Boolean} isDialogActive
 * @memberof widget
 */

//
/**
 * Author of the app as defined in the metadata.json
 * @constant {String} author
 * @memberof widget
 */

//
/**
 * Company that made the app as defined in the metadata.json
 * @constant {String} company
 * @memberof widget
 */

//
/**
 * Copyright text as defined in the metadata.json
 * @constant {String} copyright
 * @memberof widget
 */

//
/**
 * Description of the app as defined in the metadata.json 
 * @constant {String} description
 * @memberof widget
 */

//
/**
 * App identifier as defined in the metadata.json
 * @constant {String} identifier
 * @memberof widget
 */

//
/**
 * The locale the app is currently running in.
 * @constant {String} locale
 * @memberof widget
 */

//
/**
 * Name of the app as defined in the metadata.json
 * @constant {String} name
 * @memberof widget
 */

/**
 * Version of the app as defined in the metadata.json
 * @constant {String} version
 * @memberof widget
 */

//
/**
 * Translate the language key in the active language.
 * @method widget#getLocalizedString
 * @param {String} key Translation key.
 * @param {Array} args Array with the values to fill in the string. These can be parsed to certain types specified in the translation string.<br>
 * The type specifier says what type the argument data should be treated as. Possible types:
 * * % - a literal percent character. No argument is required.  
 * * b - the argument is treated as an integer, and presented as a binary number.
 * * c - the argument is treated as an integer, and presented as the character with that ASCII value.
 * * d - the argument is treated as an integer, and presented as a (signed) decimal number.
 * * e - the argument is treated as scientific notation (e.g. 1.2e+2). The precision specifier stands for the number of digits after the decimal point. 
 * * E - like %e but uses uppercase letter (e.g. 1.2E+2).
 * * f - the argument is treated as a float, and presented as a floating-point number.
 * * F - the argument is treated as a float, and presented as a floating-point number.
 * * g - shorter of %e and %f.
 * * G - shorter of %E and %f.
 * * o - the argument is treated as an integer, and presented as an octal number.
 * * s - the argument is treated as and presented as a string.
 * * u - the argument is treated as an integer, and presented as an unsigned decimal number.
 * * x - the argument is treated as an integer and presented as a hexadecimal number (with lowercase letters). 
 * * X - the argument is treated as an integer and presented as a hexadecimal number (with uppercase letters). 
 * @returns {String} The translated string or the key.
 * @example <caption>The below code lines do the same:</caption>
 * widget.getLocalizedString('close_button');
 * $_('close_button');
 *
 * //Translation string: 
 * //"nrMonkeys" = "There are %d monkeys in the %s.";
 * widget.getLocalizedString('nrMonkeys', [2, 'tree']); // Returns -> There are 2 monkeys in the tree.
 */

/**
 * Close down the app.
 * @method widget#close
 */

//
/**
 * Get a image (as element) with the source as defined in metadata.json
 * Get the image source string defined in the metadata of the app.
 * @method widget#getImage
 * @param {String} key Key of the image source string to retrieve.
 * @param {String} [type] Type of the image source string to retrieve.
 * @returns {Element} The image as a HTML Dom element.
 */

//
/**
 * Get the image source string defined in the metadata of the app.
 * @method widget#getImageSource
 * @param {String} key Key of the image source string to retrieve.
 * @param {String} [type] Type of the image source string to retrieve.
 * @returns {String} Image location string.
 * @example
 * widget.getImageSource('about');
 * //Returns: 'Images/about.png'
 *
 * widget.getImageSource('icon', '192x192');
 * //Returns: 'Images/Icon.png'
 */

//
/**
 * @method widget#getPath
 * @returns {String} Path of your application.
 */

/**
 * @method widget#getURL
 * @returns {String} External path of an asset in your application.
 */
