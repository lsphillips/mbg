import {
	renderReusableIcons
} from './icons.js';
import {
	renderHeader
} from './header.js';
import {
	renderFinder
} from './finder.js';
import {
	renderGames
} from './games.js';
import {
	renderFooter
} from './footer.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function renderIndex ({
	games,
	stats,
	timestamp,
	urls
})
{
	return `<!DOCTYPE html>

	<html>

		<head>

			<title>
				Board Games
			</title>

			<meta charset="utf-8" />

			<meta name="viewport" content="width=device-width,initial-scale=1" />

			<link href="${ urls.stylesheet() }" rel="stylesheet" />

		</head>

		<body class="app">

			${ renderReusableIcons() }

			${ renderHeader({
				className : 'app__header'
			}) }

			${ games.length ? renderGames(games, stats, urls, {
				className : 'app__collection'
			}) : '<p class="app__empty"> I don\'t seem to have any board games! </p>' }

			${ renderFooter({
				timestamp,
				className : 'app__footer'
			}) }

			${ renderFinder(stats, {
				className : 'app__finder'
			}) }

			<script type="text/javascript" src="${ urls.javascript() }"></script>

		</body>

	</html>`;
}
