/**
 * @namespace Globals
 * @description These functions are not part of an Object and can be called in the global namespace.
 */
/**
 * Returns a integer, pseudo-random number in the range [0, limit].
 * @function Globals#random
 * @param {Number} [limit=1000] Upper limit for random number.
 * @returns {Number} The random number.
 */
/**
 * Returns a (deep) clone of the given Object or Array.
 * @function Globals#clone
 * @param {Object} obj Object to clone.
 * @returns {Object} The cloned object.
 */
/**
 * Returns a string indicating the type of exp.
 * @function Globals#typeOf
 * @param {Any} exp An expression representing the object or primitive whose type is to be returned.
 * @returns {String} The string indicating the type of exp.
 */
/**
 * Returns if param is an Array.
 * @function Globals#isArray
 * @param {Any} param The value to be checked.
 * @returns {Boolean}
 */
/**
 * Returns if param is a Boolean.
 * @function Globals#isBoolean
 * @param {Any} param The value to be checked.
 * @returns {Boolean}
 */
 /**
 * Returns if param is a Date.
 * @function Globals#isDate
 * @param {Any} param The value to be checked.
 * @returns {Boolean}
 */
/**
 * Returns if param is a Function.
 * @function Globals#isFunction
 * @param {Any} param The value to be checked.
 * @returns {Boolean}
 */
/**
 * Returns if param is a Number.
 * @function Globals#isNumber
 * @param {Any} param The value to be checked.
 * @returns {Boolean}
 */
 /**
 * Returns if param is a String.
 * @function Globals#isString
 * @param {Any} param The value to be checked.
 * @returns {Boolean}
 */
 /**
 * Returns if param is a Regular Expression.
 * @function Globals#isRegExp
 * @param {Any} param The value to be checked.
 * @returns {Boolean}
 */
/**
 * Returns true if param is "empty", undefined, null or zero length.
 * @function Globals#isEmpty
 * @param {Any} param The value to be checked.
 * @returns {Boolean}
 */
/**
 * Any empty function that does nothing.
 * @function Globals#emptyFn
 */
/**
 * Returns an MD5 hash of param.
 * @function Globals#md5
 * @param {Any} param The value to hash.
 * @returns {String}
 */
/**
 * Returns a string containing the Base64 representation of stringToEncode.
 * @function Globals#btoa
 * @param {String} stringToEncode A string whose characters each represent a single byte of binary data to be encoded into ASCII.
 * @returns {String}
 */
/**
 * @function Globals#otab
 * @param {String} encodedData The data to decode.
 * @throws {DOMException} The length of passed-in string must be a multiple of 4.
 * @returns {String} The decoded data.
 */
