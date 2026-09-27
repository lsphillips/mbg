function toBggIds (games)
{
	return games.reduce((ids, { id, expansions = [] }) => [...ids, id, ...expansions.map(e => e.id)], []);
}

function toExpansionModel ({
	id,
	name,
	location
}, game, locations, metadata)
{
	if (
		location && !locations[location]
	)
	{
		throw new Error(`Game expansion "${name}" is in an unrecognized location.`);
	}

	const data = metadata.find(m => m.id === id);

	if (!data)
	{
		throw new Error(`Game expansion \`${name}\` (with ID ${id}) could not be found on BGG.`);
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
		location : locations[location] ?? { ...game.location, name : 'In Game Box' }
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
	if (
		!locations[location]
	)
	{
		throw new Error(`Game \`${name}\` is in an unrecognized location.`);
	}

	const data = metadata.find(m => m.id === id);

	if (!data)
	{
		throw new Error(`Game \`${name}\` (with ID ${id}) could not be found on BGG.`);
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
		location : locations[location],
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
			throw new Error(`Could not read file \`${file}\` as a valid YAML file.`, {
				cause
			});
		}

		let metadata;

		try
		{
			metadata = await this.#bggClient.getGamesAndExpansions(
				toBggIds(gamelist.games)
			);
		}
		catch (cause)
		{
			throw new Error('Could not fetch supporting metadata for games and expansions.', {
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
