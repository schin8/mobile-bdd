#!/usr/bin/env bash
set -euo pipefail

DEFAULT_AVD="Pixel_8_API_36"
DEFAULT_PROXY="http://127.0.0.1:8080"

usage() {
  cat <<EOF
Usage: ./startemulator.sh [options] [avd_name]

Options:
  --list              List available AVDs
  --reset             Kill and restart ADB server
  --proxy [host:port] Launch with HTTP proxy (default: $DEFAULT_PROXY)
  --help -h           Show this help message

Arguments:
  avd_name   AVD to launch (default: $DEFAULT_AVD)
EOF
}

PROXY=""
POSITIONAL=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h) usage; exit 0 ;;
    --list)    echo "Available AVDs:"; emulator -list-avds; exit 0 ;;
    --reset)   echo "Resetting ADB..."; adb kill-server && adb start-server && adb devices; exit 0 ;;
    --proxy)
      if [[ -n "${2:-}" && ! "$2" == --* ]]; then
        PROXY="$2"; shift
      else
        PROXY="$DEFAULT_PROXY"
      fi
      shift ;;
    *)
      POSITIONAL+=("$1"); shift ;;
  esac
done

AVD_NAME="${POSITIONAL[0]:-$DEFAULT_AVD}"

EMU_ARGS=(-avd "$AVD_NAME")
if [[ -n "$PROXY" ]]; then
  EMU_ARGS+=(-http-proxy "$PROXY")
  echo "Starting emulator with proxy: $PROXY"
fi

emulator "${EMU_ARGS[@]}" &
EMU_PID=$!

echo "Waiting for emulator to be ready..."
adb wait-for-device

DEVICE=$(adb devices | grep emulator | awk '{print $1}')
echo "Emulator detected as $DEVICE"

echo "Waiting for boot to complete..."
while [[ "$(adb -s "$DEVICE" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" != "1" ]]; do
  sleep 2
done

echo "Boot complete. Emulator running (PID $EMU_PID). Close the emulator to exit."
wait "$EMU_PID"
echo "Emulator stopped."
