import {
	join
} from 'node:path';
import {
	readFile
} from 'node:fs/promises';
import {
	load
} from 'js-yaml';
import {
	buildBggGameUri,
	buildBgaGameUri,
	buildTabletopiaGameUri
} from './vendor-helpers.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function buildExpansionModel ({
	name,
	thumbnail,
	bggId,
	players = null,
	location = null
}, game, locations)
{
	if (
		location && !locations[location]
	)
	{
		throw new Error(`Game expansion "${name}" is in an unknown location.`);
	}

	const expansion = {
		name, thumbnail
	};

	// Board Game Geek.
	expansion.bggUri = buildBggGameUri(bggId);

	// Player count.
	expansion.players = players || game.players;

	// Location.
	expansion.location   = locations[location]?.name ?? 'In Game Box';
	expansion.accessible = locations[location]?.accessible || (!location && game.accessible);

	return expansion;
}

function buildGameModel ({
	name,
	thumbnail,
	players,
	location,
	bggId,
	bgaId = null,
	tabletopiaId = null,
	favourite = false,
	quick = false,
	expansions = []
}, locations)
{
	if (
		!locations[location]
	)
	{
		throw new Error(`Game "${name}" is in an unknown location.`);
	}

	const game = {
		name, thumbnail, players, favourite, quick
	};

	// Board Game Geek.
	game.bggUri = buildBggGameUri(bggId);

	// Board Game Arena.
	game.bgaUri = bgaId ? buildBgaGameUri(bgaId) : null;

	// Tabletopia.
	game.tabletopiaUri = tabletopiaId ? buildTabletopiaGameUri(tabletopiaId) : null;

	// Location.
	game.location   = locations[location].name;
	game.accessible = locations[location].accessible;

	// Expansions.
	game.expansions = expansions.map(expansion => buildExpansionModel(expansion, game, locations));

	return game;
}

function getGamelistStatistics (games)
{
	let gameCount      = games.length,
		expansionCount = 0,
		minPlayers     = 1,
		maxPlayers     = 1;

	for (const { players, expansions = [] } of games)
	{
		minPlayers = Math.min(players.min, minPlayers);
		maxPlayers = Math.max(players.max, maxPlayers);

		for (const expansion of expansions)
		{
			minPlayers = Math.min(expansion.players.min, minPlayers);
			maxPlayers = Math.max(expansion.players.max, maxPlayers);
		}

		expansionCount += expansions.length;
	}

	return {
		gameCount,
		expansionCount,
		minPlayers,
		maxPlayers
	};
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function readGamelist (datadir)
{
	const gamelist = load(
		await readFile(
			join(datadir, 'gamelist.yml'), 'utf8'
		)
	);

	const games = gamelist.games
		.map(
			game => buildGameModel(game, gamelist.locations)
		)
		.sort((a, b) => a.name.localeCompare(b.name));

	const list = {
		games, stats : getGamelistStatistics(games)
	};

	return {
		list, images : join(datadir, 'images')
	};
}
