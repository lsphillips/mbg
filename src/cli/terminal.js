export default class Terminal
{
	constructor (vars, stdout, stderr)
	{
		this.vars   = vars;
		this.stdout = stdout;
		this.stderr = stderr;
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
		this.stderr.write(message + '\n');
	}
}
