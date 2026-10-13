function hasValue (value)
{
	return typeof value === 'string' && value.trim().length > 0;
}

function isBoolean (value)
{
	return value === undefined || typeof value === 'boolean';
}

function isValidLocation ({
	id,
	name,
	accessible
})
{
	if (
		!hasValue(id)
	)
	{
		return [false, `Location does not have an ID`];
	}

	if (
		!hasValue(name)
	)
	{
		return [false, `Location with ID ${id} does not have a name`];
	}

	if (
		!isBoolean(accessible)
	)
	{
		return [false, `Location with ID ${id} is not correctly flagged as accessible`];
	}

	return [true, null];
}

function isValidGame ({
	id,
	bgaUri,
	tabletopiaUri,
	name,
	location,
	favourite,
	quick,
	expansions = []
}, locations)
{
	if (
		!hasValue(id)
	)
	{
		return [false, `Game does not have an ID`];
	}

	if (
		!hasValue(name)
	)
	{
		return [false, `Game with ID ${id} does not have a name`];
	}

	if (
		bgaUri && !URL.canParse(bgaUri)
	)
	{
		return [false, `Game with ID ${id} has an invalid BGA URI`];
	}

	if (
		tabletopiaUri && !URL.canParse(tabletopiaUri)
	)
	{
		return [false, `Game with ID ${id} has an invalid Tabletopia URI`];
	}

	if (
		!isBoolean(favourite)
	)
	{
		return [false, `Game with ID ${id} is not correctly flagged as a favourite game`];
	}

	if (
		!isBoolean(quick)
	)
	{
		return [false, `Game with ID ${id} is not correctly flagged as quick to play`];
	}

	if (
		!hasValue(location) || !locations.find(l => l.id === location)
	)
	{
		return [false, `Game with ID ${id} is not in a recognized location`];
	}

	for (const expansion of expansions)
	{
		if (
			!hasValue(expansion.id)
		)
		{
			return [false, `Game with ID ${id} contains an expansion without an ID.`];
		}

		if (
			!hasValue(expansion.name)
		)
		{
			return [false, `Expansion with ID ${id} does not have a name`];
		}

		if (
			hasValue(expansion.location) && !locations.find(l => l.id === expansion.location)
		)
		{
			return [false, `Expansion with ID ${id} is not in a recognized location`];
		}
	}

	return [true, null];
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function isValidGamelist ({
	locations,
	games
})
{
	if (
		!Array.isArray(locations) || locations.length === 0
	)
	{
		return [false, 'No locations are defined.'];
	}

	for (const location of locations)
	{
		const [valid, error] = isValidLocation(location);

		if (!valid)
		{
			return [valid, error];
		}
	}

	if (
		!Array.isArray(games) || games.length === 0
	)
	{
		return [false, 'No games are defined.'];
	}

	for (const game of games)
	{
		const [valid, error] = isValidGame(game, locations);

		if (!valid)
		{
			return [valid, error];
		}
	}

	return [true, null];
}
