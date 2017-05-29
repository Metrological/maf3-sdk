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
/**
 * Check if a vlue is defined.
 * @function Globals#isDefined
 * @param {*} obj Value to check.
 * @returns {Boolean} true if the value is defined, false otherwise.
 */
/**
 * Check if a value is undefined.
 * @function Globals#isUndefined
 * @param {*} obj Value to check.
 * @returns {Boolean} true if the value is undefined, false otherwise.
 */
/**
 * Extend one Object with the properties from another.
 * @function Globals#extend
 * @param {Object} target Object to extend.
 * @param {Object} source Object to copy properties from.
 * @returns {Object} The extended Object.
 */
/**
 * Determines if the passed value is "empty".
 * @function Globals#empty
 * @param {Object} obj Value to check.
 * @returns {Boolean} true if the value is "emtpy", false otherwise.
 */
/**
 * Recursively merge multiple Objects together.
 * @function Globals#merge
 * @param {Object} [obj={}] Objects to merge.
 * @returns {Object} Merged Object or empty Object when no parameters where given.
 */
/**
 * Parses a String with the given Regular Expression and returns the result in an Object.
 * @function Globals#parseWithRegExp
 * @param {String} text String to parse.
 * @param {RegEx} reg Regular Expression to use.
 * @param {Function} [processValue] Optional Function to run on results.
 * @returns {Object} Parsed result.
 */
/**
 * Parses a URL querystring into an Object.
 * @function Globals#parseQueryVariables
 * @param {String} s Querystring to parse.
 * @returns {Object} Parsed querystring.
 */
/**
 * Converts unicode to a text String.
 * @function Globals#unescapeUnicode
 * @param {String} text unicode to convert.
 * @returns {String} Converted unicode.
 */
/**
 * Convert a String to lowercase.
 * @function Globals#lower
 * @param {String} [str] String to convert.
 * @returns {String} Lowercased String or empty string when none was provided.
 */
/**
 * Convert a String to uppercase.
 * @function Globals#upper
 * @param {String} [str] String to convert.
 * @returns {String} Uppercased String or empty string when none was provided.
 */
/**
 * Check if a value is contained within the provided item.
 * @function Globals#contains
 * @param {*} needle Value to search for.
 * @param {Object|Array|String} haystack Value to search within.
 * @param {alt} [alt=false] Check in object for value instead of key.
 * @returns {String} Uppercased String or empty string when none was provided.
 */
/**
 * Check if a value is contained within the provided item.
 * @function Globals#splat
 * @param {*} obj .
 * @returns {Array} .
 */
/**
 * Execute the given function at a later moment in time.
 * @function Globals#later
 * @param {Number} when Time to wait before executing the function in milliseconds.
 * @param {Function|String} fn Function to execute.
 * @param {Object} scope Scope to use when executing the function.
 * @param {*} data Arguments to use when executing the function.
 * @param {Boolean} [periodic=false] Execute the function periodically instead of just once.
 * @returns {Object} An Object with an interval property and cancel method.
 */
/**
 * Helper function for calling async functions in order.
 * @function Globals#queue
 * @param {Array} funcs Array of functions to execute in specific order. Each function get's invoked with a callback argument as the first parameter. And any given arguments as well.
 * @param {Object} [scope={}] The (shared) scope to use when invoking each function.
 */
