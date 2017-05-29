/**
 * @namespace Function
 */

/**
 * #### Subscribes a method to a list of events. Each event subscribed will only be fired once, after which it is unsubscribed.
 * @method Function#subscribeOnce
 * @param {Class} publisher Object or Class on which you want to register the method.
 * @param {String|Array} eventTypes String or array containing eventTypes to which to subscribe this method to.
 * @param {Object} [scope] Scope in which the method will run when the event fires.
 * @returns {Function} Method as subscribed.
 */

/**
 * #### Subscribes a method to a list of events
 * @method Function#subscribeTo
 * @param {Class} publisher Object or Class on which you want to register the method.
 * @param {String|Array} eventTypes String or array containing eventTypes to which to subscribe this method to.
 * @param {Object} [scope] Scope in which the method will run when the event fires.
 * @returns {Function} Method as subscribed.
 */

/**
 * #### Unsubscribes a method from a list of events
 * @example
 *  var differentScope = new new MAF.Class({ // Create and initialize a new MAF.Class in one go.
 *    version: 123
 *  });
 *
 *  var publisher = new new MAF.Class({  // Create and initialize a new MAF.Class in one go.
 *    version: 321
 *  });
 *
 *  var fnOriginal = function (ev) {
 *     switch (ev.type) {
 *        case 'withScope':
 *           console.log('Running in differentScope scope, version: ', this.version);
 *           break;
 *        case 'noScope':
 *           console.log('Running in publisher scope, version: ', this.version);
 *           break;
 *        }
 *  };
 *
 *  //If you subscribed with using a scope, you have to unsubscribe using the returned method.
 *  var fnSubscribed = fnOriginal.subscribeTo(publisher, ['withScope'], differentScope);
 *  fnOriginal.subscribeTo(publisher, ['noScope']);
 *
 *  publisher.fire('withScope');
 *  publisher.fire('noScope');
 *  fnSubscribed.unsubscribeFrom(publisher, ['withScope']);
 *  fnOriginal.unsubscribeFrom(publisher, ['noScope']);
 *
 * @method Function#unsubscribeFrom
 * @param {Class} publisher Object or Class on which you want to unregister the method.
 * @param {String|Array} eventTypes String or array containing eventTypes from which to unsubscribe this method to.
 * @returns {Function} Method as unsubscribed.
 */

/**
 * Creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.
 * @method Function#bind
 * @param {Function} thisArg The value to be passed as the this parameter to the target function when the bound function is called.
 * @returns {Function} The bound function.
 */

/**
 * Alias for function.bind.
 * @method Function#bindTo
 * @returns {Function} The bound function.
 */

/**
 * Creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.
 * @method Function#pass
 * @param {Array} [arg=[]] Arguments to prepend to the bound function.
 * @param {Object} thisArg The value to be passed as the this parameter to the target function when the bound function is called.
 * @returns {Function} The newly bound function.
 */

 /**
 * Delays execution of the function by the given delay.
 * @method Function#delay
 * @param {Number} delay Time to delay in milliseconds.
 * @param {Object} thisArg Object to use for this when calling the function.
 * @param {Array} args Arguments to use when calling the function.
 * @returns {Number} The numerical timeout ID of the delayed function.
 */

/**
 * Alias for function.delay.
 * @method Function#defer
 * @returns {Number} The numerical ID of the timeout.
 */

/**
 * Periodically call the function with the given scope and arguments.
 * @method Function#periodical
 * @param {Number} periodical Number of milliseconds to wait before each call to function.
 * @param {Object} scope Scope to use when invoking function.
 * @param {Array} args Arguments to use when calling the function.
 * @returns {Number} The numerical ID of the interval.
 */

