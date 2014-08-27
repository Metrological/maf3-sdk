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
 *  var differentScope = {
 *     version: 112
 *  };
 *  var publisher = {
 *     version: 102
 *  };
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