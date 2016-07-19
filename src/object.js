/**
 * @namespace Object
 */

/**
 * Merges n objects into one.
 * @method Object.merge
 * @param {...Object} obj Object(s) to merge.
 * @returns {Object} A newly created object.
 */

/**
 * Iterate over each of objects properties.
 * @method Object.forEach
 * @param {Object} obj Object to iterate over.
 * @param {Function} callback Function to use as callback.
 * @param {String} callback.key The key that callback is invoked with.
 * @param {*} callback.value The value that callback is invoked with.
 * @param {Object} callback.obj The object that is iterated over.
 * @param {Object} [scope=obj] Object to use as this when invoking callback.
 */

 /**
 * Sorts object by it's keys.
 * @method Object.sort
 * @param {Object} obj Object of which the keys should be sorted.
 * @returns {Object} The sorted object.
 */

/**
 * Iterate over each of objects properties, but returns when the provided callback returns false.
 * @method Object.each
 * @param {Object} obj Object to iterate over.
 * @param {Function} callback Function to use as callback.
 * @param {String} callback.key The key that callback is invoked with.
 * @param {*} callback.value The value that callback is invoked with.
 * @param {Object} callback.obj The object that is iterated over.
 * @param {Object} [scope=obj] Object to use as this when invoking callback.
 */

/**
 * Check whether a key exists in object or not.
 * @method Object.keyOf
 * @param {Object} obj Object to search in.
 * @param {String} key Key to search for in object.
 * @returns {*} Returns key when found or undefined when not found.
 */

/**
 * Check whether a value exists in object or not.
 * @method Object.indexOf
 * @param {Object} obj Object to search in.
 * @param {Function} value value to search for in object.
 * @returns {*} Returns true when found or undefined when not found.
 */

/**
 * Flips all keys and values in object. Keys become values and vice versa.
 * @method Object.flip
 * @param {Object} obj Object to flip.
 * @returns {Object} Returns the flipped object.
 */

/**
 * Returns all keys from the object as array.
 * @method Object.keys
 * @param {Object} obj Object of which to get the keys.
 * @returns {Array} Returns the keys as array.
 */

/**
 * Returns all values from the object as array.
 * @method Object.values
 * @param {Object} obj Object of which to get the values.
 * @returns {Array} Returns the values as array.
 */

/**
 * Check whether or not the given key or value is contained within the object.
 * @method Object.contains
 * @param {Object} obj Object to check.
 * @param {String} key Key to check for.
 * @param {Boolean} [value=false] Check object for value instead of key.
 * @returns {Boolean} True when key is in object. False otherwise.
 */

/**
 * Returns a (deep) clone of the given Object or Array.
 * @method Object.clone
 * @param {Object} obj Object to clone.
 * @returns {Object} The cloned object.
 */

/**
 * Creates a new object with the specified prototype object and properties.
 * @method Object.create
 * @param {Object} prototype Object to use as prototype.
 * @returns {Object} The newly constructed object.
 */

/**
 * Parses (recursivly) the given object into a url query string.
 * @method Object.toQueryString
 * @param {Object} object Object to parse.
 * @returns {String} The created query string.
 */

/**
 * Gets the value from object's given path or null if the path is not valid.
 * @method Object.getFromPath
 * @param {Object} obj Object to walk.
 * @param {String|Array} parts Path to take when walking the object.
 * @returns {*} The value from the specified path.
 */
