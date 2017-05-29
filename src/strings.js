/**
 * @namespace String
 */

/**
 * Returns a string produced according to the formatting string fmt.
 * @method String.sprintf
 * @param {String} fmt The format string is composed of zero or more directives: ordinary characters (excluding %) that are copied directly to the result, and conversion specifications, each of which results in fetching its own parameter.
 * <ul style="list-style:none;">
 * <li>% - a literal percent character. No argument is required.
 * <li>b - the argument is treated as an integer, and presented as a binary number.
 * <li>c - the argument is treated as an integer, and presented as the character with that ASCII value.
 * <li>d - the argument is treated as an integer, and presented as a (signed) decimal number.
 * <li>e - the argument is treated as scientific notation (e.g. 1.2e+2). The precision specifier stands for the number of digits after the decimal point since PHP 5.2.1. In earlier versions, it was taken as number of significant digits (one less).
 * <li>E - like %e but uses uppercase letter (e.g. 1.2E+2).
 * <li>f - the argument is treated as a float, and presented as a floating-point number (locale aware).
 * <li>F - the argument is treated as a float, and presented as a floating-point number (non-locale aware). Available since PHP 4.3.10 and PHP 5.0.3.
 * <li>g - shorter of %e and %f.
 * <li>G - shorter of %E and %f.
 * <li>o - the argument is treated as an integer, and presented as an octal number.
 * <li>s - the argument is treated as and presented as a string.
 * <li>u - the argument is treated as an integer, and presented as an unsigned decimal number.
 * <li>x - the argument is treated as an integer and presented as a hexadecimal number (with lowercase letters).
 * <li>X - the argument is treated as an integer and presented as a hexadecimal number (with uppercase letters).
 * </ul>
 * @returns {String} The formatted string.
 */

/**
 * Return a formatted string. Operates as String.sprintf() but accepts an array of arguments, rather than a variable number of arguments.
 * @method String.vsprintf
 * @param {String} fmt The string to use as format.
 * @param {Array} str The items to use in the format.
 * @returns {String} The formatted string.
 */

/**
 * Decodes html into it's string contents.
 * @method String.htmlDecode
 * @param {String} str The string to decode.
 * @returns {String} The decoded string.
 */

/**
 * Parses a url parameter string into an object.
 * @method String.parseQueryString
 * @param {String} str The string to parse.
 * @returns {Object} The object representation of the parsed string.
 */

/**
 * Removes leading and trailing whitespace from string.
 * @method String#trim
 * @returns {String} The trimmed string.
 */

/**
 * Truncates string if it’s longer than the given maximum string length.
 * @method String#truncate
 * @param {Number} end Maximum string length.
 * @returns {String} The truncated string.
 */

/**
 * Strips html tags from the string.
 * @method String#stripTags
 * @param {String} tag Tag to strip from the string.
 * @param {Boolean} [contents=false] Remove the contents of the tags.
 * @returns {String} The stripped string.
 */

/**
 * Escapes html entities (&"'<>) within the string.
 * @method String#htmlEscape
 * @returns {String} The html escaped string.
 */

/**
 * Cleans the string from whitespace characters.
 * @method String#clean
 * @returns {String} The cleaned string.
 */

/**
 * Repeats the given string n times.
 * @method String#repeat
 * @param {Number} count Number times the string should be repeated.
 * @param {String} [separator=''] Optional separator between each repetition of the string.
 * @returns {String} The repeated string.
 */

/**
 * Reverses the string.
 * @method String#reverse
 * @returns {String} The reversed string.
 */

/**
 * Converts string to camel case.
 * @method String#camelize
 * @returns {String} The string in camel case.
 */

/**
 * Converts the first character of string to upper case and the remaining to lower case.
 * @method String#capitalize
 * @returns {String} The capitalized string.
 */

/**
 * Converts string to hyphen case.
 * @method String#hyphenate
 * @returns {String} The hyphenated string.
 */

 /**
 * Returns true of false based on whether value is in string or not.
 * @method String#contains
 * @param {String} value Value to check for.
 * @returns {Boolean}
 */

/**
 * Converts string to dash case.
 * @method String#dasherize
 * @returns {String} The dasherized string.
 */

/**
 * Determines whether a string ends with the characters of a specified string, returning true or false as appropriate.
 * @method String#endsWith
 * @param {String} searchString The characters to be searched for at the end of this string.
 * @param {Number} [position] If provided starts the match from the length of the string minus the second argument. If omitted, the default value is the length of the string.
 * @returns {Boolean} true if the given characters are found at the end of the string; otherwise, false.
 */

/**
 * Determines whether one string may be found within another string, returning true or false as appropriate.
 * @method String#includes
 * @param {String} searchString A string to be searched for within this string.
 * @param {Number} [position=0] The position within the string at which to begin searching for searchString.
 * @returns {Boolean} true if the given string is found anywhere within the search string; otherwise, false if not.
 */

 /**
 * Determines whether a string begins with the characters of a specified string, returning true or false as appropriate.
 * @method String#startsWith
 * @param {String} searchString The characters to be searched for at the start of this string.
 * @param {Number} [position=0] The position in this string at which to begin searching for searchString.
 * @returns {Boolean} true if the given characters are found at the beginning of the string; otherwise, false.
 */
