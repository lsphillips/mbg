#!/usr/bin/env bun

import {
	name,
	version
} from '../package.json' with { type : 'json' };
import {
	run
} from '../src/cli/index.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

process.exitCode = await run(process.argv.slice(2), process.env, process.stdout, process.stderr, {
	name,
	version
});
