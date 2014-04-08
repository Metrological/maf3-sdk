/**
 * @classdesc MAF.messages provides a persist key-based hash table to store messages combined with broadcast events when hash data is added or updated.
 * @class MAF.messages
 * @singleton
 * @example
 *  var valueChanged = function (event) {
 *     log("Key: ", event.payload.key, " changed value to: ",event.payload.value);
 *  };
 *  valueChanged.subscribeTo(MAF.messages, MAF.messages.eventType);
 *  MAF.messages.store('numbers', [9,15,1,30]);
 */
/**
 * Fired when values in the messages hash table is changed.
 * @event MAF.messages#onBroadcast
 */

/**
 * Retrieves the value associated with the given key from the hash table. Returns null if not found.
 * @method  MAF.messages#fetch
 * @param {String} key Key to look for in the Hash table.
 * @return {Mixed} The value associated with the given key.
 */
/**
 * Checks if a given key exists.
 * @method  MAF.messages#exists
 * @param {String} key Key to look for in the Hash table.
 * @return {Boolean} If the key exists 'true' will be returned.
 */
/**
 * Updates the value associated with the given key in the hash table. Notifies all event listeners for the given key with the new value.
 * @method  MAF.messages#store
 * @param {String} key Updates the value associated with the given key.
 * @param {Mixed} value Value to store on the given key. The value can be an object, array, or any primitive type.
 */
/**
 * Deletes the value associated with the given key from the hash table. Notifies all event listeners for the given key that the value has changed (deleted).
 * @method  MAF.messages#remove
 * @param {String} key Deletes the value associated with the given key.
 */
/**
 * Resets the hash table and list of event listeners to null.
 * @method  MAF.messages#reset
 */
/**
 * Iterate through all keys in the hash table.
 * @method  MAF.messages#forEach
 * @param {Function} fn Key will be the parameter.
 * @param {Mixed} scope Scope in which to run the function in.
 * @example MAF.messages.forEach(function(key){
 *    if (key === 'example')
 *       console.log('This key has already data stored.', MAF.messages.fetch(key));
 * });
 */
