/**
 * @classdesc > Timer objects allow you to perform a task at a periodic interval or can be used to simply fire once at a later time.</br>
 * They allow you to create multiple timers all running on different frequencies.
 * <p>They can also be started and stopped without having to delete them.</p>
 * @class Timer
 * @param {Number} interval Time in seconds.
 * @param {Function} callback Method to execute when the timer triggers.
 * @property {Boolean} ticking <p>This allows you to turn a timer on and off by setting it to true and false, respectively. </p>
 * <p>If you want to disable a timer for a while, just set ticking to false. </br>Later, set it to true, and it starts firing again.</p>
 */
/**
 * This allows you to start running the timer.
 * @method Timer#start
 */
/**
 * This allows you to stop running the timer.
 * @method Timer#stop
 */
/**
 * Resets the interval of the timer.
 * @method Timer#reset
 */
