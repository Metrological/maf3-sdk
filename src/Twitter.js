/**
 * @class Twitter
 * @classdesc > This is a layer that will handle communication with Twitter and secures the connection outside the Application.<br>
 * If the user has not yet done the authentication process this will start and handle the process automatically.
 * @singleton
 * @example
 * Twitter.api('statuses/user_timeline', { count: 30 }, function(result) {
 *    //Received a response from Twitter API.
 *    console.log('The result:', result);
 * });
 */

/**
 * This method will make calls to the Twitter API's. Look at the [twitter API](https://dev.twitter.com/docs/api) for what is possible.
 * @method Twitter#api
 * @param {String} path The API call path as defined by Twitter.
 * @param {String} [method] The HTTP method that you want to use for the API request. Default is **get**
 * @param {Object} params The parameter object to include in the API call.
 * @param {Function} callback The method that will be triggered when the API call returns a result.
 */

/**
 * This will reset the Twitter API. Subscribed function will also be removed.
 * @method Twitter#reset
 */

/**
 * The active profile has a twitter authentication and the user has connected by entering a password.
 * @event Twitter#onConnected
 */
/**
 * The active profile lost the connection with twitter.
 * @event Twitter#onDisconnected
 */
/**
 * The active profile has no twitter authentication done.
 * @event Twitter#onUnpairedProfile
 */
