import {
	posix
} from 'node:path';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class UrlBuilder
{
	constructor (base, {
		styles,
		scripts
	})
	{
		this.base    = base;
		this.styles  = styles;
		this.scripts = scripts;
	}

	stylesheet ()
	{
		return posix.join(this.base, this.styles);
	}

	javascript ()
	{
		return posix.join(this.base, this.scripts);
	}

	asset (path)
	{
		return posix.join(this.base, path);
	}
}
