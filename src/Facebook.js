/**
 * @class Facebook
 * @classdesc > This is a layer that will handle communication with Facebook and secures the connection outside the Application.<br>
 * If the user has not yet done the authentication process this will start and handle the process automatically.
 * @singleton
 * @example
 * Facebook.api('me', function(result) {
 *    //Received a response from Facebook API.
 *    console.log('The result:', result);
 * });
 */

/**
 * This method will make calls to the Facebook API's. Look at the [facebook API](https://developers.facebook.com/docs/graph-api) for what is possible.
 * @method Facebook#api
 * @param {String} path The API call path as defined by Facebook.
 * @param {String} [method] The HTTP method that you want to use for the API request. Default is **get**
 * @param {Object} params The parameter object to include in the API call.
 * @param {Function} callback The method that will be triggered when the API call returns a result.
 */

/**
 * This will reset the facebook API. Subscribed function will also be removed.
 * @method Facebook#reset
 */
/**
 * @method Facebook#getImageById
 */
/**
 * The active profile has a facebook authentication and the user has connected by entering a password.
 * @event Facebook#onConnected
 */
/**
 * The active profile lost the connection with facebook.
 * @event Facebook#onDisconnected
 */
/**
 * The active profile has no facebook authentication done.
 * @event Facebook#onUnpairedProfile
 */
