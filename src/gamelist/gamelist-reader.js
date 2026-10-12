import {
	isValidGamelist
} from './gamelist-validator.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function getBggIds (gamelist)
{
	return gamelist.games.reduce((ids, { id, expansions = [] }) => [...ids, id, ...expansions.map(e => e.id)], []);
}

function toGameBoxLocation ({
	accessible
})
{
	return { accessible, id : 'gamebox', name : 'In Game Box' };
}

function toExpansionModel ({
	id,
	name,
	location
}, game, locations, metadata)
{
	const data = metadata.find(m => m.id === id);

	if (!data)
	{
		throw new Error(`Expansion with ${id} could not be found on BGG.`);
	}

	const {
		thumbnail,
		players,
		url
	} = data;

	const expansion = {
		id,
		name,
		players,
		thumbnail,
		url,
		location : locations.find(l => l.id === location) ?? toGameBoxLocation(game.location)
	};

	return expansion;
}

function toGameModel ({
	id,
	bgaUri,
	tabletopiaUri,
	name,
	location,
	favourite,
	quick,
	expansions = []
}, locations, metadata)
{
	const data = metadata.find(m => m.id === id);

	if (!data)
	{
		throw new Error(`Game with ID ${id} could not be found on BGG.`);
	}

	const {
		thumbnail,
		players,
		url
	} = data;

	const game = {
		id,
		bgaUri,
		tabletopiaUri,
		name,
		location : locations.find(l => l.id === location),
		thumbnail,
		players,
		url,
		favourite,
		quick,
		expansions : []
	};

	// Expansions.
	game.expansions = expansions.map(expansion => toExpansionModel(expansion, game, locations, metadata));

	return game;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class GamelistReader
{
	#bggClient = null;

	constructor (bggClient)
	{
		this.#bggClient = bggClient;
	}

	async read (file)
	{
		let gamelist;

		try
		{
			gamelist = Bun.YAML.parse(
				await Bun.file(file).text()
			);
		}
		catch (cause)
		{
			throw new Error(`Could not read game list ${file} as a valid YAML file.`, {
				cause
			});
		}

		const [valid, error] = await isValidGamelist(gamelist);

		if (!valid)
		{
			throw new Error(`Gamelist is invalid: ${error}`);
		}

		let metadata;

		try
		{
			metadata = await this.#bggClient.getGamesAndExpansions(
				getBggIds(gamelist)
			);
		}
		catch (cause)
		{
			throw new Error('Could not fetch supporting metadata for games and expansions from BGG.', {
				cause
			});
		}

		return gamelist.games
			.map(
				game => toGameModel(game, gamelist.locations, metadata)
			)
			.sort((a, b) => a.name.localeCompare(b.name));
	}
}
