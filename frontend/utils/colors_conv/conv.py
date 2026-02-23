import sys
import argparse
import colorsys


def hex_to_hue(hex_color):
    """Convert hex color to HSV hue value for sorting"""
    hex_color = hex_color.lstrip("#")
    r, g, b = tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))
    h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
    return h


def parse_args():
    parser = argparse.ArgumentParser(
        description="Convert color text files to JSON palette format"
    )
    parser.add_argument(
        "--sort-hue", action="store_true", help="Sort colors by hue (rainbow order)"
    )
    return parser.parse_args()


def main():
    args = parse_args()

    # Read from stdin
    lines = sys.stdin.read().split("\n")

    # Parse color entries
    colors = []
    for line in lines:
        line = line.strip()
        if len(line) == 0 or line[0] != "#":
            continue

        words = line.split(" ", 1)
        if len(words) < 2:
            continue

        color = words[0]
        text = words[1]

        colors.append({"text": text, "color": color, "value": color})

    # Sort by hue if requested
    if args.sort_hue:
        colors.sort(key=lambda c: hex_to_hue(c["color"]))

    # Build JSON output
    palette_items = []
    for c in colors:
        palette_items.append(
            f'{{"text": "{c["text"]}", "color": "{c["color"]}", "value": "{c["value"]}"}}'
        )

    output = '{"palette": [' + ",".join(palette_items) + "]}"
    print(output)


if __name__ == "__main__":
    main()
