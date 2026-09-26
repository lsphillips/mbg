import {
	resolve
} from "node:path";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function compileAssets ()
{
	// Build JS.
	const js = resolve(import.meta.dir, "./assets/script.js");

	const jsProcess = Bun.spawn([
		"bun",
		"build",
		resolve(import.meta.dir, "./templates/scripts/index.js"),
		"--target",
		"browser",
		"--format",
		"esm",
		"--outfile",
		js,
		"--minify"
	]);

	if (await jsProcess.exited !== 0)
	{
		throw new Error(`Building template scripts failed.`);
	}

	// Build CSS.
	const css = resolve(import.meta.dir, "./assets/styles.css");

	const cssProcess = Bun.spawn([
		"bun",
		"build",
		resolve(import.meta.dir, "./templates/styles/index.css"),
		"--outfile",
		css,
		"--minify"
	]);

	if (await cssProcess.exited !== 0)
	{
		throw new Error(`Building template Stylesheets failed.`);
	}

	return { js, css };
}
