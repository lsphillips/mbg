export function getGameCount (games)
{
	return games.length;
}

export function getExpansionCount (games)
{
	return games.reduce((expansions, game) => expansions + game.expansions.length, 0);
}

export function getMinimumPlayers (games)
{
	return games.reduce((minimum, game) => Math.min(game.players.min, ...game.expansions.map(e => e.players.min), minimum), 1);
}

export function getMaximumPlayers (games)
{
	return games.reduce((maximum, game) => Math.max(game.players.max, ...game.expansions.map(e => e.players.max), maximum), 1);
}
