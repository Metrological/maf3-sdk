/**
 * @class MAF.Room
 * @classdesc > When you need to communicatie between different users of your app or between your app and a phone. The communication will take place through sockets.
 * @param {String} id Identifier to be used to construct the unique room hash.
 * @eventdesc > The events on this Instance are subcribed through the [function.prototype.subscribeTo](function#function_subscribeTo) method.<br>
 * ```
 * var room = new MAF.Room('MyUniqueIdentifier');
 * (function (event) {
 *    console.log(event.type, event.payload);
 * }).subscribeTo(room, ['onConnected', 'onDisconnected', 'onCreated', 'onDestroyed', 'onJoined', 'onHasLeft', 'onData', 'onError']);
 * room.join();
 * ```
 */

/**
 * When your connected to the server it returns true
 * @member connected
 * @type {Boolean}
 * @memberOf MAF.Room
 */

/**
 * When your connected to the room it returns true
 * @member joined
 * @type {Boolean}
 * @memberOf MAF.Room
 */

/**
 * Unique hash that defines the room id.
 * @member hash
 * @type {String}
 * @memberOf MAF.Room
 */

/**
 * Join the room
 * @method MAF.Room#join
 * @param {Object} [data] Data to be broadcasted to every connection to the room.
 */

/**
 * Leave the room.
 * @method MAF.Room#leave
 * @param {Object} [data] Data to be broadcasted to every connection to the room.
 */

/**
 * Send data to the room.
 * @method MAF.Room#send
 * @param {Object} data Data to be broadcasted to every connection to the room.
 */

/**
 * Destroy the room. If your still connected it will disconnect.
 * @method MAF.Room#destroy
 * @param {Object} [data] Possibility to send some data to the room before disconnecting.
 */

/**
 * Fired when you connect to the room. The creator of the room wil not recieve this event.
 * @event MAF.Room#onConnected
 */

/**
 * Fired only when the room is created.
 * @event MAF.Room#onCreated
 * @param {Object} event The event object.
 * @param {String} event.type Event type.
 * @param {Object} event.payload Payload object containing event data.
 * @param {String} event.payload.hash The room hash.
 * @param {String} event.payload.user The user id that joined the room.
 * @param {Mixed} event.payload.data Data send along when joining the room.<br> 
 * ```
 * var room = new MAF.Room('MyUniqueIdentifier');
 * if (room.users.length > 0)
 *    room.join({msg: 'Client joined the room.'});
 * else
 *    room.join({msg: 'Room is created.'});
 * ```
 */

/**
 * Fired when someone sends some data to the room.
 * @event MAF.Room#onData
 * @param {Object} event The event object.
 * @param {String} event.type Event type.
 * @param {Object} event.payload Payload object containing event data.
 * @param {String} event.payload.hash The room hash.
 * @param {String} event.payload.user The user id that joined the room.
 * @param {Mixed} event.payload.data Data send by a user in the room.
 */

/**
 * Fired when the room is destroyed.
 * @event MAF.Room#onDestroyed
 * @param {Object} event The event object.
 * @param {String} event.type Event type.
 * @param {Object} event.payload Payload object containing event data.
 * @param {String} event.payload.hash The room hash.
 * @param {String} event.payload.user The user id that joined the room.
 * @param {Mixed} event.payload.data Data that was send to the room when leaving the room.
 */

/**
 * Fired when you disconnect from the room.
 * @event MAF.Room#onDisconnected
 */

/**
 * Fired when there is a error.
 * @event MAF.Room#onError
 * @param {Object} event The event object.
 * @param {String} event.type Event type.
 * @param {Object} event.payload Payload object containing event data.
 * @param {String} event.payload.hash The room hash. Depending on the error this can be empty.
 * @param {String} event.payload.user The user id that triggered this error, this can be empty depending on the error.
 * @param {Mixed} event.payload.code The error code. Possible errors:
 * * 404 - Room doesn't exists.
 * * 405 - Not allowed to create Room.
 * * 429 - Too many connections.
 */

/**
 * Fired when someone left the room.
 * @event MAF.Room#onHasLeft
 * @param {Object} event The event object.
 * @param {String} event.type Event type.
 * @param {Object} event.payload Payload object containing event data.
 * @param {String} event.payload.hash The room hash.
 * @param {String} event.payload.user The user id that joined the room.
 * @param {Mixed} event.payload.data Data that was send to the room when leaving the room.
 * @example
 * //Handling things when users leave.
 * var room = new MAF.Room('MyUniqueIdentifier');
 * (function (event) {
 *    if (event.payload.user !== room.user) {
 *       console.log('A user has left the room:', event.payload.user, event.payload.data);
 *    } else {
 *       console.log('You have left the room.', event.payload.user, event.payload.data);
 *    }
 * }).subscribeTo(room, ['onHasLeft']);
 *
 * //After being connected.
 * room.leave('bye bye');
 */

/**
 * Fired when someone has joined the room. This also includes the user that creates the room.
 * @event MAF.Room#onJoined
 * @param {Object} event The event object.
 * @param {String} event.type Event type.
 * @param {Object} event.payload Payload object containing event data.
 * @param {String} event.payload.hash The room hash.
 * @param {String} event.payload.user The user id that joined the room.
 * @param {Mixed} event.payload.data Data send along when joining the room.
 * @example
 * //Handling things when users join.
 * var room = new MAF.Room('MyUniqueIdentifier');
 * (function (event) {
 *    if (event.payload.user !== room.user) {
 *    	console.log('A user has joined the room:', event.payload.user, event.payload.data);
 *    } else {
 *       console.log('You have joined the room.', event.payload.user, event.payload.data);
 *    }
 * }).subscribeTo(room, ['onJoined']);
 * room.join('Hello');
 */

/**
 * @class MAF.PrivateRoom
 * @extends MAF.Room
 * @classdesc > The private room is basically the same as the Room, with the exception that a complete household has access to it by default.
 * @param {String} id Identifier to be used to construct the unique room hash.
 * @eventdesc > The events on this Instance are subcribed through the [function.prototype.subscribeTo](function#function_subscribeTo) method.<br>
 * ```
 * var room = new MAF.PrivateRoom('MyUniqueIdentifier');
 * (function (event) {
 *    console.log(event.type, event.payload);
 * }).subscribeTo(room, ['onConnected', 'onDisconnected', 'onCreated', 'onDestroyed', 'onJoined', 'onHasLeft', 'onData', 'onError']);
 * room.join();
 * ```
 */
