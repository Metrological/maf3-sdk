/**
 * @class profile
 * @classdesc > User profile
 * @singleton
 */

/**
 * Indicates what ageRating the profile has.
 * @name ageRating
 * @type {Number}
 * @memberof profile
 * @readonly
 */
/**
 * Contains the full length city name where the application is running.
 * @name {String} city
 * @type {String}
 * @memberof profile
 * @readonly
 */
/**
 * Contains the full length country name in english. For example 'Netherlands'
 * @name country
 * @type {String}
 * @memberof profile
 * @readonly
 */
/**
 * Contains a lowercase iso code of the country. For example (nl, en, uk, fr, us)
 * @name countryCode
 * @type {String}
 * @memberof profile
 * @readonly
 */
/**
 * Unique household operator id.
 * @name household
 * @type {String}
 * @memberof profile
 * @readonly
 */
/**
 * Unique profile id.
 * @name id
 * @type {String}
 * @memberof profile
 * @readonly
 */
/**
 * IP address of the device the framework is running on.
 * @name ip
 * @type {String}
 * @memberof profile
 * @readonly
 */
/**
 * Contains the full length language name. For example 'English'.
 * @name language
 * @type {String}
 * @memberof profile
 * @readonly
 */
/**
 * Contains the ISO 639-1 language code. For example 'en'.
 * @name languageCode
 * @type {String}
 * @memberof profile
 * @readonly
 */
/**
 * Contains the latitude and longitude coordinates of the device location.
 * @name latlon
 * @type {Array}
 * @memberof profile
 * @readonly
 */
/**
 * Contains the combination of language and country iso codes. For example 'en-NL'
 * @name locale
 * @type {String}
 * @memberof profile
 * @readonly
 */
/**
 * Indicates if the profile is locked after for example to many incorrect pin entries.
 * @name locked
 * @type {Boolean}
 * @memberof profile
 * @readonly
 */
/**
 * Contains the mac address of the device.
 * @name mac
 * @type {String}
 * @memberof profile
 * @readonly
 */
/**
 * Contains the name of the profile.
 * @name name
 * @type {String}
 * @memberof profile
 * @readonly
 */
/**
 * Contains the operator name.
 * @name operator
 * @type {String}
 * @memberof profile
 * @readonly
 */
/**
 * @name packages
 * @type {Array}
 * @memberof profile
 * @readonly
 */

/**
 * Ask the system if a certain section is password protected.
 * @method profile#hasPin
 * @param {String} type Indicates what section to check if it has a password. Possible options: master, adult, youth, purchase and passport
 * @return {Boolean} True if a password is set.
 */


/**
 * @method profile#getCountry
 * @deprecated Use profile.countryCode instead. This will no longer be available in the next major version.
 */
/**
 * @method profile#getLanguage
 * @deprecated Use profile.languageCode instead. This will no longer be available in the next major version.
 */
