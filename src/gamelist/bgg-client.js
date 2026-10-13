import {
	join,
	extname
} from 'node:path';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function getContent (element)
{
	if (!element)
	{
		return null;
	}

	return typeof element === 'string' ? element : element['#text'];
}

function getAttribute (element, attribute)
{
	return element ? element[`@${attribute}`] : null;
}

function getCollection (element, item)
{
	if (!element)
	{
		return null;
	}

	const items = element[item];

	if (!items)
	{
		return [];
	}

	return Array.isArray(items) ? items : [items];
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function downloadImage (url, path)
{
	const file = `${path}${ extname(new URL(url).pathname) }`;

	if (
		await Bun.file(file).exists()
	)
	{
		return file;
	}

	const response = await fetch(url);

	if (response.ok)
	{
		await Bun.write(file, response);

		return file;
	}
}

async function parseThingResponse (xml, imageDir)
{
	let data;

	try
	{
		data = Bun.XML.parse(xml);
	}
	catch (cause)
	{
		throw new Error('Could not parse BGG API thing response as valid XML.', {
			cause
		});
	}

	const games = [];

	const items = getCollection(data.items, 'item');

	if (!items)
	{
		return games;
	}

	for (const item of items)
	{
		const id    = getAttribute(item, 'id');
		const min   = parseInt(getAttribute(item.minplayers, 'value'), 10);
		const max   = parseInt(getAttribute(item.maxplayers, 'value'), 10);
		const names = getCollection(item, 'name');
		const image = getContent(item.thumbnail);

		// Isolate primary name.
		const name = getAttribute(names.find(n => getAttribute(n, 'type') === 'primary'), 'value');

		// Download thumbnail.
		const thumbnail = await downloadImage(
			image, join(imageDir, id)
		);

		games.push({
			id,
			name,
			thumbnail,
			players : {
				min,
				max
			},
			uri : `https://boardgamegeek.com/boardgame/${id}`
		});
	}

	return games;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class BggClient
{
	constructor ({
		bggApiUri,
		bggApiKey,
		cacheDir
	} = {})
	{
		this.bggApiUri     = bggApiUri;
		this.bggApiKey     = bggApiKey;
		this.imageCacheDir = join(cacheDir, 'thumbnails');
	}

	async getGamesAndExpansions (ids)
	{
		if (!ids.length)
		{
			return [];
		}

		if (ids.length > 20)
		{
			const results = [];

			for (
				const group of ids.values().chunks(20)
			)
			{
				const items = await this.getGamesAndExpansions(group);

				results.push(...items);
			}

			return results;
		}

		const response = await fetch(`${this.bggApiUri}/thing?id=${ ids.join(',') }`, {
			headers : {
				'Authorization' : `Bearer ${this.bggApiKey}`
			}
		});

		if (response.status !== 200)
		{
			throw new Error(`Unable to fetch games and expansions from Board Game Geeks. The API responded with status code ${response.status}.`);
		}

		return parseThingResponse(await response.text(), this.imageCacheDir);
	}
}
