/**
 * @namespace Array
 */

/**
 * Loops over all the items in the array.
 * @method Array#forEach
 * @param {Function} cb The function that is called for each item.
 * @param {*} cb.item Returns the item within the scope of cb.
 * @param {String} cb.index Returns the index within the scope of cb.
 * @param {String} cb.array Returns the array on which cb in invoked.
 */

/**
 * Loops over all the items in the array, but can be stopped by returning false in the cb.
 * @method Array#each
 * @param {Function} cb The function that is called for each item. Can stop the each loop by returning false.
 * @param {*} cb.item Returns the item within the scope of cb.
 * @param {String} cb.index Returns the index within the scope of cb.
 */

/**
 * Returns the last index for the given key, returns -1 if not found.
 * @method Array#lastIndexOf
 * @param {*} value The value that need to be found.
 * @returns {Integer} The last index for the given key.
 */

/**
 * Returns a stripped version of the array where all double values are removed.
 * @method Array#unique
 * @returns {Array} The stripped array.
 */

/**
 * Returns a combined array
 * @method Array#merge
 * @param {value} arr The array that need to be combined with.
 * @returns {Array} The combined array.
 */

/**
 * Sets the length of the array to 0
 * @method Array#erase
 * @returns {Array} The erased array.
 */

/**
 * Checks if the array contains the value.
 * @method Array#contains
 * @param {*} value The value that need to be found.
 * @returns {Boolean} True when the value is within the Array. False otherwise.
 */

/**
 * Return a shuffled array.
 * @method Array#shuffle
 * @returns {Array} The shuffled array.
 */

/**
 * Cleans the array from empty items.
 * @method Array#clean
 * @param {Boolean} allowEmptyString Allows empty strings.
 * @returns {Array} The cleaned array.
 */

/**
 * Clones the array.
 * @method Array#clone
 * @returns {Array} The cloned array.
 */

/**
 * Create a new array containing only one key of all objects.
 * @method Array#pluck
 * @param {String} key The key that needs to be looked for in the array.
 * @returns {Array} The newly created array.
 */

/**
 * Returns the difference between the object and the param (note: not vice versa).
 * @method Array#diff
 * @param {Array} arr The Array that need to be compared.
 * @returns {Array} The difference between the object and the param.
 */

/**
 * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
 * @method Array#indexOf
 * @param {*} value Value to search for.
 * @returns {Number}
 */

 /**
 * Creates a new array with the results of calling a provided function on every element in this array.
 * @method Array#map
 * @param {Function} callback The function to invoke on each element.
 * @param {*} callback.value The current value that callback is invoked with.
 * @param {Number} callback.index The current index that callback is invoked with.
 * @param {Array} callback.array The array that is iterated over.
 * @param {Object} thisArg The object to use as this when invoking the callback.
 * @returns {Array} The newly created array.
 */

/**
 * Creates a new array with all elements that pass the test implemented by the provided function.
 * @method Array#filter
 * @param {Function} callback Function to test each element of the array. Return true to keep the element, false otherwise.
 * @param {*} callback.value The current value that callback is invoked with.
 * @param {Number} callback.index The current index that callback is invoked with.
 * @param {Array} callback.array The array that is iterated over.
 * @param {Object} thisArg The object to use as this when invoking the callback.
 * @returns {Array} The newly created array.
 */

/**
 * Tests whether all elements in the array pass the test implemented by the provided function.
 * @method Array#every
 * @param {Function} callback Function to test each element of the array. Return true to keep the element, false otherwise.
 * @param {*} callback.value The current value that callback is invoked with.
 * @param {Number} callback.index The current index that callback is invoked with.
 * @param {Array} callback.array The array that is iterated over.
 * @param {Object} thisArg The object to use as this when invoking the callback.
 * @returns {Boolean} Returns true if the callback function returns true for all array elements; otherwise, false.
 */

/**
 * Tests whether some element in the array passes the test implemented by the provided function.
 * @method Array#some
 * @param {Function} callback Function to test each element of the array. Return true to keep the element, false otherwise.
 * @param {*} callback.value The current value that callback is invoked with.
 * @param {Number} callback.index The current index that callback is invoked with.
 * @param {Array} callback.array The array that is iterated over.
 * @param {Object} thisArg The object to use as this when invoking the callback.
 * @returns {Boolean} Returns true if the callback function returns true for any array element; otherwise, false.
 */

 /**
 * Alias for array.forEach
 * @method Array.forEach
 * @param {Array} arr Array to use.
 * @param {Object} callback The callback to use.
 * @param {Object} scope The object to use as this when invoking the callback.
 */

/**
 * Alias for array.each
 * @method Array.each
 * @param {Array} arr Array to use.
 * @param {Object} callback The callback to use.
 * @param {Object} scope The object to use as this when invoking the callback.
 */

/**
 * Alias for array.slice
 * @method Array.slice
 * @param {Array} arr Array to use.
 * @param {Number} start Zero-based index at which to begin extraction. As a negative index, begin indicates an offset from the end of the sequence. slice(-2) extracts the last two elements in the sequence. If begin is undefined, slice begins from index 0.
 * @param {Number} end Zero-based index at which to end extraction. slice extracts up to but not including end. slice(1,4) extracts the second element through the fourth element (elements indexed 1, 2, and 3). As a negative index, end indicates an offset from the end of the sequence. slice(2,-1) extracts the third element through the second-to-last element in the sequence. If end is omitted, slice extracts through the end of the sequence (arr.length).
 * @returns {Array} Returns a shallow copy of a portion of the array into a new array object.
 */

/**
 * Wraps the given input with a new Array.
 * @method Array.from
 * @param {*} arr Variable to wrap.
 * @returns {Array} Returns a new Array object.
 */

/**
 * Creates a new Array instance from arguments.
 * @method Array.of
 * @param {...*} arr Items to turn into array.
 * @returns {Array} Returns a new array object.
 */

/**
 * Alias for array.pluck.
 * @method Array.pluck
 * @param {Array} arr Array to pluck.
 * @param {String} key The key that needs to be looked for in the array.
 * @returns {Array} The newly created array.
 */

/**
 * Alias for array.push.
 * @method Array.push
 * @param {Array} arr Array to push to.
 * @param {*} obj The item to push into the array.
 * @returns {Number} The new length property of the array.
 */

/**
 * Alias for array.join.
 * @method Array.join
 * @param {Array} arr Array to push to.
 * @param {String} separator Specifies a string to separate each element of the array.
 * @returns {String} The joined elements of the array.
 */
