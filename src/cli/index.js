import {
	parseArgs
} from 'node:util';
import Terminal from './terminal.js';
import {
	getConfig
} from './config.js';
import help from './commands/help.js';
import render from './commands/render.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function run (args, env, stdout, stderr, {
	name,
	version
})
{
	const terminal = new Terminal(env, stdout, stderr);

	const {
		values,
		positionals
	} = parseArgs({
		args,
		options : {
			help : {
				type : 'boolean',
				short : 'h',
				default : true
			},
			version : {
				type : 'boolean',
				short : 'v',
			}
		},
		strict : false
	});

	const [command] = positionals, [, ...argv] = args;

	if (command)
	{
		let config;

		try
		{
			config = await getConfig(terminal, {
				name
			});
		}
		catch (error)
		{
			terminal.err(error);

			return 2;
		}

		try
		{
			if (command === 'render')
			{
				return render(argv, config, terminal);
			}
		}
		catch (error)
		{
			terminal.err(error);

			return 1;
		}

		terminal.err(`Unknown command: ${command}`);

		return 2;
	}

	if (values.version)
	{
		terminal.out(version);

		return 0;
	}

	if (values.help)
	{
		return help(terminal);
	}
}
