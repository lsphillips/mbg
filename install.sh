#!/usr/bin/env bash

set -euo pipefail

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

platform=""

while [[ $# -gt 0 ]]; do
	case "$1" in
		--platform)
	  		[[ $# -ge 2 ]] || {
				echo "Error: --platform requires a value" >&2
				exit 1
	  		}
			case "$2" in
				arm64|arm64-musl|x64|x64-musl)
		  			platform="$2"
		  			;;
				*)
		  			echo "Error: invalid platform '$2'" >&2
		  			exit 1
		  			;;
	  		esac
	 		shift 2
	  	;;
		*)
	  		echo "Error: unknown option: $1" >&2
	  		exit 1
	  		;;
  	esac
done

[[ -n "$platform" ]] || {
	echo "Error: --platform is required" >&2
	exit 1
}

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Ensure installation directory exists.
mkdir -p /config/bin

# Download to a temporary file so a failed install leaves the existing binary intact.
tmp=$(mktemp /config/bin/.mbg.XXXXXX)
trap 'rm -f -- "$tmp"' EXIT
curl -fL "https://github.com/lsphillips/mbg/releases/latest/download/mbg-linux-${platform}" -o "$tmp"

# Ensure binary is executable.
chmod +x "$tmp"

# Print Version.
"$tmp" --version

# Install the verified binary.
mv -f -- "$tmp" /config/bin/mbg
