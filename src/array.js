/**
 * @namespace Array
 */

/**
 * Loops over all the items in the array.
 * @method Array#forEach
 * @param {Function} cb The function that is called for each item.
 * @param {*} cb.item Returns the item within the scope of cb.
 * @param {String} cb.index Returns the index within the scope of cb.
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
 * @returns {Boolean}
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
 * @param {String} key The key that need to be looked for in the items.
 * @returns {Array} The newly created array.
 */

/**
 * Returns the difference between the object and the param (note: not vice versa).
 * @method Array#diff
 * @param {Array} arr The Array that need to be compared.
 * @returns {Array} The difference between the object and the param.
 */


