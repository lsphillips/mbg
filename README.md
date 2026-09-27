# `mbg`

[![Main Build](https://github.com/lsphillips/my-board-games/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/lsphillips/my-board-games/actions)

A CLI application designed to act as an emissary for Home Assistant scripts to manage and render a local board game list.

## Installation

On Linux, the typical OS for running Home Assistant, you can install by running the following commands (replacing `{platform}` with `arm64` or `x64` depending on your host platform):

``` bash
# Download.
curl -fL https://github.com/lsphillips/my-board-games/releases/latest/download/mbg-linux-{platform} -o "$HOME/.local/bin/mbg"

# Make Executable.
chmod +x "$HOME/.local/bin/mbg"

# Test.
mbg --help
```

> [!IMPORTANT]
> Make sure that the `$HOME/.local/bin` directory exists and that it's added to your `PATH`.

## The Game List

A game list is a YAML file that has two top level properties: [games](#games) and [locations](#locations); You can view the [gamelist.example.yml](./gamelist.example.yml) file for an example.

### Games

The games property is a required array that defines the games collection. Each item in an array is an object that represents a single board game that has the following properties:

| Property        | Required | Type      | Default | Description                                                                                     |
| --------------- | :------: | :-------: | :-----: | ----------------------------------------------------------------------------------------------- |
| `id`            | Yes      | `string`  |         | The Board Game Geek ID for the board game.                                                      |
| `name`          | Yes      | `string`  |         | The name of the board game.                                                                     |
| `bgaUri`        | No       | `string`  |         | The Board Game Arena URI for the board game.                                                    |
| `tabletopiaUri` | No       | `string`  |         | The Tabletopia URI for the board game.                                                          |
| `favourite`     | No       | `boolean` | `false` | Indicates whether the board game is a favourite or not.                                         |
| `location`      | Yes      | `string`  |         | The key corresponding to a location, defined [here](#locations), that the board game is stored. |
| `expansions`    | No       | `array`   |         | The expansions owned for the board game. This is an array of [expansion objects](#expansions).  |
| `quick`         | No       | `boolean` | `false` | Indicates if the board game is quick to play or not.                                            |

### Expansions

| Property   | Required | Type      | Default | Description                                                                                                                                                                             |
| ---------- | :------: | :-------: | :-----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`       | Yes      | `string`  |         | The Board Game Geek ID for the board game expansion.                                                                                                                                    |
| `name`     | Yes      | `string`  |         | The name of the board game expansion.                                                                                                                                                   |
| `location` | No       | `string`  |         | The key corresponding to a location, defined [here](#locations), that the board game expansion is stored. If this is omitted then it's assumed that it is located in the base game box. |

### Locations

The locations property is a required key-value map defining the locations where board games are stored. Each location object has the following properties:

| Property     | Required | Type      | Default | Description                                              |
| ------------ | :------: | :-------: | :-----: | -------------------------------------------------------- |
| `name`       | Yes      | `string`  |         | The name of the location.                                |
| `accessible` | Yes      | `boolean` |         | Indicates whether the location is easy to access or not. |

## Development

> [!NOTE]
> You will need [Bun](https://bun.com/) v1.4.2 (or higher) installed.

### Building

To compile the application for Mac (Apple Silicon), Linux (ARM & x64) and Windows (x64) in the `build` directory, run this command:

``` bash
bun run build
```

### Code Quality

To perform code quality checks, powered by [Oxlint](https://oxc.rs/docs/guide/usage/linter), run this command:

``` bash
bun run lint
```

To fix code quality quality issues, run this command:

``` bash
bun run lint:fix
```

### Running Locally

You can run locally by running the entrypoint, for example:

``` bash
bun ./bin/mbg.js --version
```

To perform a local render, you can run the application with this input:

``` bash
bun ./bin/mbg.js render ./gamelist.example.yml ./website
```
