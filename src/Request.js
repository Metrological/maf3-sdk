/**
 * @class Request
 * @classdesc > The Request class facilitates communication with remote HTTP servers via the browser's XMLHttpRequest object or via JSONP.
 * Its prefered to use this instead of XMLHttpRequest, this class will make sure there are no crossbrowser issues. In addition it also 
 * goes through a proxy to prevent Cross Domain issues.
 */

/**
 * @cfg {Object} headers Can be used to define the headers to use with the request.
 * @memberof Request
 */

/**
 * @cfg {String} method Define which request method to use (GET, POST, DELETE, PUT). Default it will use GET.
 * @memberof Request
 */

/**
 * @cfg {Object} data Object containing data you want to send with the request.
 * @example
 *  //When method is 'GET' or you did not define a method, then the data will be appended to the url.
 *  new Request({
 *     url: 'myurl.com', //Will be: 'myurl.com?id=1'
 *     data: { id: 1 }
 *  }).send();
 *
 *  //Sending as json
 *  new Request({
 *     url: 'myurl.com',
 *     method: 'POST', //Anything but GET
 *     headers: {
 *        'Content-Type': 'application/json'
 *     },
 *     data: { id: 1 }
 *  }).send();
 *
 *  //Sending in body
 *  new Request({
 *     url: 'myurl.com',
 *     method: 'POST', //Anything but GET
 *     data: { id: 1 }
 *  }).send();
 * @memberof Request
 */

/**
 * @cfg {Boolean} jsonp Use true if you want to send the request as JSONP
 * @memberof Request
 */

/**
 * @cfg {Method} onComplete Callback method always triggered when request is done.
 * @param {Class} request The XMLHttpRequest
 * @example
 *  new Request({
 *     url: 'myurl.com',
 *     onComplete: function (request) {
 *        if (request.status === 200)
 *           JSON.parse(json.response);
 *     }
 *  }).send({ id: 1 });
 * @memberof Request
 */

/**
 * @cfg {Method} onSuccess Callback method triggered when the request was successful.
 * @param {Mixed} result The parsed data returned from the server depending on content-type.
 * @param {Class} request The XMLHttpRequest
 * @memberof Request
 */

/**
 * @cfg {Method} onError Callback method triggered when the request was successful but the result failed to parse.
 * @param {Class} error Contains the error that occured.
 * @memberof Request
 */

/**
 * @cfg {Method} onFailure Callback method triggered when the request failed.
 * @param {Class} request The XMLHttpRequest
 * @memberof Request
 */

/**
 * @cfg {Method} onTimeout When a timeout config is used and the request takes to long, this callback will trigger.
 * @param {Class} request The XMLHttpRequest
 * @memberOf Request
 */

/**
 * @cfg {String} user Authentication with username
 * @memberOf Request
 */

/**
 * @cfg {String} password Authentication with password
 * @memberOf Request
 */

/**
 * @cfg {Number} timeout Maximum time the request is allowed to take, in miliseconds.
 */

/**
 * @cfg {Boolean|Object} proxy Default true, use false to not use the proxy. 
 * @memberOf Request
 */

/**
 * @method Request#abort
 * This will abort the request if it is pending.
 */

/**
 * @method Request#send
 * @param {Object} data Data you want to send with the request. You can also define it in the config and not use it here.
 * @example
 *  new Request({
 *     url: 'myurl.com'
 *  }).send({ id: 1 });
 *
 *  var myRequest = new Request({
 *     url: 'myurl.com',
 *     data: { id: 1 }
 *  }).send();
 *  myRequest.send();
 */