function getHourTimestamp ()
{
	const now = new Date();

	now.setMinutes(0, 0, 0);

	return now.getTime();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function bust ()
{
	const url = new URL(window.location.href);

	if (
		!url.searchParams.has('v')
	)
	{
		url.searchParams.set(
			'v', getHourTimestamp()
		);

		window.location.replace(
			url.toString()
		);
	}
}
