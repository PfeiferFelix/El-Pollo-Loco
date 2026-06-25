/**
 * Tracks the current pressed state of all relevant keyboard keys.
 * Each property is set to `true` while the corresponding key is held down
 * and reset to `false` on key release.
 */
class Keyboard {
    /** @type {boolean} Whether the Left arrow key is currently pressed. */
    LEFT = false;

    /** @type {boolean} Whether the Right arrow key is currently pressed. */
    RIGHT = false;

    /** @type {boolean} Whether the Up arrow key is currently pressed. */
    UP = false;

    /** @type {boolean} Whether the Down arrow key is currently pressed. */
    DOWN = false;

    /** @type {boolean} Whether the Space bar is currently pressed (used for jumping). */
    SPACE = false;

    /** @type {boolean} Whether the D key is currently pressed (used for throwing bottles). */
    D = false;
}
