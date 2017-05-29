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
 * Return the value of the first element in the array that satisfies the provided testing function. Otherwise undefined is returned.
 * @method Array.find
 * @param {Function} callback Function to execute on each value in the array, taking three arguments:
 * @param {*} callback.element The current element being processed in the array.
 * @param {Number} callback.index The index of the current element being processed in the array.
 * @param {Array} callback.array The array that is iterated over.
 * @param {Object} [thisArg] The object to use as this when invoking the callback.
 * @returns {*} A value in the array if an element passes the test; otherwise, undefined.
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
 * @param {Object} [thisArg] The object to use as this when invoking the callback.
 * @returns {Array} The newly created array.
 */

/**
 * Creates a new array with all elements that pass the test implemented by the provided function.
 * @method Array#filter
 * @param {Function} callback Function to test each element of the array. Return true to keep the element, false otherwise.
 * @param {*} callback.value The current value that callback is invoked with.
 * @param {Number} callback.index The current index that callback is invoked with.
 * @param {Array} callback.array The array that is iterated over.
 * @param {Object} [thisArg] The object to use as this when invoking the callback.
 * @returns {Array} The newly created array.
 */

/**
 * Tests whether all elements in the array pass the test implemented by the provided function.
 * @method Array#every
 * @param {Function} callback Function to test each element of the array. Return true to keep the element, false otherwise.
 * @param {*} callback.value The current value that callback is invoked with.
 * @param {Number} callback.index The current index that callback is invoked with.
 * @param {Array} callback.array The array that is iterated over.
 * @param {Object} [thisArg] The object to use as this when invoking the callback.
 * @returns {Boolean} Returns true if the callback function returns true for all array elements; otherwise, false.
 */

/**
 * Tests whether some element in the array passes the test implemented by the provided function.
 * @method Array#some
 * @param {Function} callback Function to test each element of the array. Return true to keep the element, false otherwise.
 * @param {*} callback.value The current value that callback is invoked with.
 * @param {Number} callback.index The current index that callback is invoked with.
 * @param {Array} callback.array The array that is iterated over.
 * @param {Object} [thisArg] The object to use as this when invoking the callback.
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

/**
 * Determines whether the passed value is an Array.
 * @method Array.isArray
 * @param {*} obj The object to be checked.
 * @returns {Boolean} true if the object is an {Array}, false otherwise.
 */

/**
 * Shallow copies part of an array to another location in the same array and returns it, without modifying its size.
 * @method Array#copyWithin
 * @param {Number} target Zero based index at which to copy the sequence to. If negative, target will be counted from the end. If target is at or greater than arr.length, nothing will be copied. If target is positioned after start, the copied sequence will be trimmed to fit arr.length.
 * @param {Number} [start] Zero based index at which to start copying elements from. If negative, start will be counted from the end. If start is omitted, copyWithin will copy from the start (defaults to 0).
 * @param {Number} [end] Zero based index at which to end copying elements from. copyWithin copies up to but not including end. If negative, end will be counted from the end. If end is omitted, copyWithin will copy until the end (default to arr.length).
 * @returns {Array} The modified array.
 */

/**
 * Fills all the elements of an array from a start index to an end index with a static value.
 * @method Array#fill
 * @param {*} value Value to fill an array.
 * @param {Number} [start=0] Start index, defaults to 0.
 * @param {Number} [end] End index, defaults to this.length.
 * @returns {Array} The modified array.
 */

/**
 * Returns the index of the first element in the array that satisfies the provided testing function. Otherwise -1 is returned.
 * @method Array#findIndex
 * @param {Function} callback Function to execute on each value in the array, taking three arguments:
 * @param {*} callback.element The current element being processed in the array.
 * @param {Number} callback.index The index of the current element being processed in the array.
 * @param {Array} callback.array The array findIndex was called upon.
 * @param {Object} [thisArg] The object to use as this when invoking the callback.
 * @returns {Number} An index in the array if an element passes the test; otherwise, -1.
 */

/**
 * Determines whether an array includes a certain element, returning true or false as appropriate.
 * @method Array#includes
 * @param {*} searchElement The element to search for.
 * @param {Number} [fromIndex] The position in this array at which to begin searching for searchElement. A negative value searches from the index of array.length + fromIndex by asc. Defaults to 0.
 * @returns {Boolean} true if the searchElement is in the array, false otherwise.
 */

/**
 * Applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single value.
 * @method Array#reduce
 * @param {Function} callback Function to execute on each element in the array, taking four arguments:
 * @param {*} callback.accumulator The accumulator accumulates the callback's return values; it is the accumulated value previously returned in the last invocation of the callback, or initialValue, if supplied.
 * @param {*} callback.currentValue The current element being processed in the array.
 * @param {Number} callback.currentIndex The index of the current element being processed in the array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {Array} callback.array The array reduce was called upon.
 * @param {Object} [initialValue] Value to use as the first argument to the first call of the callback. If no initial value is supplied, the first element in the array will be used. Calling reduce on an empty array without an initial value is an error.
 * @returns {*} The value that results from the reduction.
 */

/**
 * Applies a function against an accumulator and each value of the array (from right-to-left) to reduce it to a single value.
 * @method Array#reduceRight
 * @param {Function} callback Function to execute on each element in the array, taking four arguments:
 * @param {*} callback.previousValue The value previously returned in the last invocation of the callback, or initialValue, if supplied.
 * @param {*} callback.currentValue The current element being processed in the array.
 * @param {Number} callback.index The index of the current element being processed in the array.
 * @param {Array} callback.array The array reduce was called upon.
 * @param {Object} [initialValue] Optional. Object to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 */
