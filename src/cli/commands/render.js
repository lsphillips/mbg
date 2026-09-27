import {
	resolve
} from 'node:path';
import {
	mkdir
} from 'node:fs/promises';
import {
	parseArgs
} from 'node:util';
import manual from './manuals/render.txt' with { type: 'text' };
import BggClient from '../../gamelist/bgg-client.js';
import GamelistReader from '../../gamelist/gamelist-reader.js';
import {
	getGameCount,
	getExpansionCount,
	getMinimumPlayers,
	getMaximumPlayers
} from '../../gamelist/gamelist-stats.js';
import GamelistRenderer from '../../rendering/gamelist-renderer.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function getGamelist (value)
{
	if (!value)
	{
		throw new Error('A gamelist file was not provided.');
	}

	const path = resolve(value);

	if (
		await Bun.file(path).exists()
	)
	{
		return path;
	}

	throw new Error(`The gamelist at \`${path}\` does not exist or is not readable.`);
}

async function getOutput (value)
{
	if (!value)
	{
		throw new Error('An output directory was not provided.');
	}

	const path = resolve(value);

	await mkdir(path, {
		recursive : true
	});

	return path;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default async function render (args, { bggApiKey, cacheDir }, terminal)
{
	const {
		values,
		positionals
	} = parseArgs({
		args,
		options : {
			help : {
				type : 'boolean',
				short : 'h',
			}
		},
		strict : true,
		allowPositionals : true
	});

	if (values.help)
	{
		terminal.out(manual);

		return 0;
	}

	let gamelist, output;

	try
	{
		[gamelist, output] = await Promise.all([
			getGamelist(positionals[0]),
			getOutput(positionals[1])
		]);
	}
	catch (error)
	{
		terminal.error(error);

		return 2;
	}

	const client = new BggClient({
		bggApiKey,
		cacheDir,
		bggApiUri : 'https://boardgamegeek.com/xmlapi2'
	});

	terminal.log(`Reading the gamelist at \`${gamelist}\`...`);

	const games = await new GamelistReader(client)
		.read(gamelist);

	terminal.log('Calculating gamelist stats...');

	const stats = {
		gameCount      : getGameCount(games),
		expansionCount : getExpansionCount(games),
		minimumPlayers : getMinimumPlayers(games),
		maximumPlayers : getMaximumPlayers(games)
	};

	terminal.log(`Rendering gamelist in directory \`${output}\`...`);

	await new GamelistRenderer()
		.render(output, {
			games,
			stats,
			timestamp : new Date()
		});

	terminal.log('Render completed successfully!');

	return 0;
}
