function isDebugMode (vars)
{
	return ['1', 'true', 'yes', 'on'].includes(
		vars.DEBUG?.toLowerCase().trim()
	);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class Terminal
{
	constructor (vars, stdout, stderr)
	{
		this.vars   = vars;
		this.stdout = stdout;
		this.stderr = stderr;
		this.debug  = isDebugMode(vars);
	}

	env (key, fallback = null)
	{
		return this.vars[key] ?? fallback;
	}

	out (message)
	{
		this.stdout.write(message + '\n');
	}

	err (error)
	{
		this.stderr.write(`Error: ${error instanceof Error ? error.message : error}\n`);
	}

	log (message)
	{
		if (this.debug)
		{
			this.stderr.write(message + '\n');
		}
	}
}
