import manual from './manuals/help.txt' with { type: 'text' };

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default async function help (terminal)
{
	terminal.out(manual);

	return 0;
}
