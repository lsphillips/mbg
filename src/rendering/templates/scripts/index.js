import * as cache    from './cache.js';
import * as images   from './images.js';
import * as finder   from './finder.js';
import * as gamelist from './gamelist.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Bust Cache.
//
// This is required due to Home Assistant's aggressive
// caching.
cache.bust();

// Images.
images.setup();

// Finder.
finder.setup();

// Game List.
gamelist.setup();
