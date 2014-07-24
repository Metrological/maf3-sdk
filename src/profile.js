/**
 * @class profile
 * @classdesc > User profile
 * @singleton
 */

/**
 * Indicates what ageRating the profile has.
 * @name {Number} ageRating
 * @memberof profile
 * @readonly
 */
/**
 * Contains the full length city name where the application is running.
 * @name {String} city
 * @memberof profile
 * @readonly
 */
/**
 * Contains the full length country name in english. For example 'Netherlands'
 * @name {String} country
 * @memberof profile
 * @readonly
 */
/**
 * Contains a lowercase iso code of the country. For example (nl, en, uk, fr, us)
 * @name {String} countryCode
 * @memberof profile
 * @readonly
 */
/**
 * Unique household operator id.
 * @name {String} household
 * @memberof profile
 * @readonly
 */
/**
 * Unique profile id.
 * @name {String} id
 * @memberof profile
 * @readonly
 */
/**
 * IP address of the device the framework is running on.
 * @name {String} ip
 * @memberof profile
 * @readonly
 */
/**
 * Contains the full length language name. For example 'English'.
 * @name {String} language
 * @memberof profile
 * @readonly
 */
/**
 * Contains the ISO 639-1 language code. For example 'en'.
 * @name {String} languageCode
 * @memberof profile
 * @readonly
 */
/**
 * Contains the latitude and longitude coordinates of the device location.
 * @name {Array} latlon
 * @memberof profile
 * @readonly
 */
/**
 * Contains the combination of language and country iso codes. For example 'en-NL'
 * @name {String} locale
 * @memberof profile
 * @readonly
 */
/**
 * Indicates if the profile is locked after for example to many incorrect pin entries.
 * @name {Boolean} locked
 * @memberof profile
 * @readonly
 */
/**
 * Contains the mac address of the device.
 * @name {String} mac
 * @memberof profile
 * @readonly
 */
/**
 * Contains the name of the profile.
 * @name {String} name
 * @memberof profile
 * @readonly
 */
/**
 * Contains the operator name.
 * @name {String} operator
 * @memberof profile
 * @readonly
 */
/**
 * @name {Array} packages
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
