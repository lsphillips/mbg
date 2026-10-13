import {
	join
} from 'node:path';
import {
	name
} from './package.json' with { type : 'json' };

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const targets = [
	'bun-linux-arm64',
	'bun-linux-x64',
	'bun-linux-arm64-musl',
	'bun-linux-x64-musl'
];

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

for (const target of targets)
{
	const filename = target.replace('bun-', `${name}-`);

	await Bun.build({
		entrypoints : ['./bin/mbg.js'],
		compile : {
			target,
			outfile: join('./build', filename)
		},
		format: 'esm',
		minify : true,
		bytecode : true
	});
}
