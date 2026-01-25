export function buildBggGameUri (id)
{
	return `https://boardgamegeek.com/boardgame/${id}`;
}

export function buildBgaGameUri (id, language = 'en')
{
	return `https://${language}.boardgamearena.com/gamepanel?game=${id}`;
}

export function buildTabletopiaGameUri (id)
{
	return `https://tabletopia.com/games/${id}`;
}
