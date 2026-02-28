#!/usr/bin/env bash
set -euo pipefail

DEFAULT_DEVICE="iPhone 16e"
DEFAULT_URL="https://stage.intelycare.com/jobs/"

usage() {
  cat <<EOF
Usage: ./start_ios.sh [options] [device_name]

Options:
  --list         List available simulators
  --shutdown     Shutdown all running simulators
  --url [url]    Open URL in Safari after boot (default: $DEFAULT_URL)
  --help -h      Show this help message

Arguments:
  device_name    Simulator to launch (default: $DEFAULT_DEVICE)
EOF
}

URL=""
POSITIONAL=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h) usage; exit 0 ;;
    --list)    xcrun simctl list devices available; exit 0 ;;
    --shutdown)
      echo "Shutting down all simulators..."
      xcrun simctl shutdown all
      echo "All simulators shut down."
      exit 0 ;;
    --url)
      if [[ -n "${2:-}" && ! "$2" == --* ]]; then
        URL="$2"; shift
      else
        URL="$DEFAULT_URL"
      fi
      shift ;;
    *)
      POSITIONAL+=("$1"); shift ;;
  esac
done

DEVICE_NAME="${POSITIONAL[0]:-$DEFAULT_DEVICE}"

echo "Booting simulator: $DEVICE_NAME"
xcrun simctl boot "$DEVICE_NAME" 2>/dev/null || echo "Simulator already booted or booting..."

open -a Simulator

echo "Waiting for simulator to be ready..."
while [[ "$(xcrun simctl list devices booted | grep -c "$DEVICE_NAME")" -lt 1 ]]; do
  sleep 2
done

echo "Simulator '$DEVICE_NAME' is running."

if [[ -n "$URL" ]]; then
  echo "Opening $URL in Safari..."
  xcrun simctl openurl booted "$URL"
fi

echo "Close the Simulator app to stop."
