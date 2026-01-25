import {
	posix
} from 'node:path';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function join (base, ...paths)
{
	let url = posix.join(...paths);

	if (
		!url.startsWith('/')
	)
	{
		url = posix.join(base, url);
	}

	return url;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function createUrlBuilder ({
	base,
	js,
	css,
	images
}, hash)
{
	return {
		script     : path => join(base, js, path)     + '?' + hash,
		stylesheet : path => join(base, css, path)    + '?' + hash,
		image      : path => join(base, images, path) + '?' + hash
	};
}
