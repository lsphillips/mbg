import {
	join
} from 'node:path';
import {
	homedir
} from 'node:os';
import {
	mkdir
} from 'node:fs/promises';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function getConfig (terminal, {
	name
})
{
	const bggApiKey = terminal.env('BGG_API_KEY');

	if (
		!bggApiKey || bggApiKey.trim().length === 0
	)
	{
		throw new Error('A Board Game Geek API Key is required.');
	}

	const cacheDir = join(
		homedir(), '.cache', name
	);

	await mkdir(cacheDir, {
		recursive : true
	});

	return {
		cacheDir,
		bggApiKey
	};
}
