import {
	join,
	basename
} from 'node:path';
import * as nano from 'htmlnano';
import {
	compileAssets
} from './template-macros.js' with { type : 'macro' };
import UrlBuilder from './url-builder.js';
import {
	renderIndex
} from './templates/index.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const {
	js,
	css
} = compileAssets();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function copyStyles (outdir)
{
	const file = await import(css, {
		with : { type: 'file' }
	});

	const path = 'styles.css';

	await Bun.write(join(outdir, path), Bun.file(file.default));

	return path;
}

async function copyScripts (outdir)
{
	const file = await import(js, {
		with : { type: 'file' }
	});

	const path = 'scripts.js';

	await Bun.write(join(outdir, path), Bun.file(file.default));

	return path;
}

async function copyThumbnail (outdir, thumbnail)
{
	const path = `images/${ basename(thumbnail) }`;

	await Bun.write(
		join(outdir, path), Bun.file(thumbnail)
	);

	return path;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function createGamelistModel (games, outdir)
{
	const list = [];

	for (const game of games)
	{
		const expansions = [];

		for (const expansion of game.expansions)
		{
			expansions.push({
				...expansion, thumbnail : await copyThumbnail(outdir, expansion.thumbnail)
			});
		}

		list.push({
			...game, expansions, thumbnail :  await copyThumbnail(outdir, game.thumbnail)
		});
	}

	return list;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class GamelistRenderer
{
	async render (outdir, {
		games,
		stats,
		timestamp,
	})
	{
		// Copy styles.
		const styles = await copyStyles(outdir);

		// Copy scripts.
		const scripts = await copyScripts(outdir);

		// Create URI builder.
		const urls = new UrlBuilder('', {
			styles,
			scripts
		});

		// Render HTML.
		const page = await nano.process(
			renderIndex({
				stats,
				timestamp,
				urls,
				games : await createGamelistModel(games, outdir)
			}),
			{
				collapseAttributeWhitespace : true,
				collapseWhitespace          : 'aggressive',
				deduplicateAttributeValues  : true,
				removeComments              : 'all',
				removeEmptyAttributes       : true,
				removeAttributeQuotes       : false,
				removeUnusedCss             : true,
				minifyCss                   : false,
				minifyJs                    : false,
				minifyJson                  : true,
				minifySvg                   : false,
				minifyConditionalComments   : true,
				removeRedundantAttributes   : true,
				collapseBooleanAttributes   : true,
				mergeStyles                 : false,
				mergeScripts                : false,
				sortAttributesWithLists     : false,
				sortAttributes              : true,
				minifyUrls                  : false,
				removeOptionalTags          : false,
				normalizeAttributeValues    : false
			}
		);

		await Bun.write(join(outdir, 'index.html'), page.html);
	}
}
