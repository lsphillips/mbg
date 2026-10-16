import {
	posix
} from 'node:path';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class UrlBuilder
{
	constructor (base, {
		version,
		styles,
		scripts
	})
	{
		this.base    = base;
		this.version = version;
		this.styles  = styles;
		this.scripts = scripts;
	}

	stylesheet ()
	{
		return posix.join(this.base, this.styles) + `?${this.version}`;
	}

	javascript ()
	{
		return posix.join(this.base, this.scripts) + `?${this.version}`;
	}

	asset (path)
	{
		return posix.join(this.base, path) + `?${this.version}`;
	}
}
