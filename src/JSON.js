/**
 * @namespace JSON
 */
/**
 * Parses a string as JSON, optionally transforming the value produced by parsing.
 * @function JSON#parse
 * @param {String} text The string to parse as JSON.
 * @param {Function} [text] Prescribes how the value originally produced by parsing is transformed, before being returned.
 * @returns {Object} The parsed text as JSON object.
 */
/**
 * Converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is specified, or optionally including only the specified properties if a replacer array is specified.
 * @function JSON#stringify
 * @param {Object} value The value to convert to a JSON string.
 * @param {Function|Array} [replacer] A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string.
 * @param {String|Number} [space] A String or Number object that's used to insert white space into the output JSON string for readability purposes. If this is a Number, it indicates the number of space characters to use as white space; this number is capped at 10 if it's larger than that. Values less than 1 indicate that no space should be used. If this is a String, the string (or the first 10 characters of the string, if it's longer than that) is used as white space. If this parameter is not provided (or is null), no white space is used.
 * @returns {String} The stringified value.
 */
/**
 * Parses a XMLDocument as JSON.
 * @function JSON#fromXML
 * @param {XMLDocument} xml The XMLDocument to parse as JSON.
 * @returns {Object} The parsed XMLDocument as JSON object.
 */
