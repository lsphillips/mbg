export function renderHeader ({
	className = ''
} = {})
{
	return `<header class="header ${className}">
		<h1 class="header__title">
			My Board Games
		</h1>
		<button type="button" class="header__find">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="header__find-icon">
				<title>
					Find Board Games
				</title>
				<path fill-rule="evenodd" d="M15 10.5A3.502 3.502 0 0 0 18.355 8H21a1 1 0 1 0 0-2h-2.645a3.502 3.502 0 0 0-6.71 0H3a1 1 0 0 0 0 2h8.645A3.502 3.502 0 0 0 15 10.5zM3 16a1 1 0 1 0 0 2h2.145a3.502 3.502 0 0 0 6.71 0H21a1 1 0 1 0 0-2h-9.145a3.502 3.502 0 0 0-6.71 0H3z" clip-rule="evenodd" />
			</svg>
		</button>
	</header>`;
}
