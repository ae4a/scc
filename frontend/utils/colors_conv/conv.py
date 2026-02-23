import sys
import argparse
import colorsys


def color_sort_key(hex_color):
    """
    Sort colors in a visually pleasing way:
    1. Group blacks/grays/whites first (achromatic)
    2. Then chromatic colors in rainbow order (red->orange->yellow->green->cyan->blue->purple)
    3. Within each group, sort by saturation and lightness for smooth transitions
    """
    hex_color = hex_color.lstrip("#")
    r, g, b = tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))
    h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)

    # Low saturation colors (grays, near-whites, near-blacks)
    if s < 0.15:
        # Sort achromatic colors by lightness (dark to light)
        # Use group 0 to put them first
        return (0, v, 0, 0)

    # Low value colors (very dark, nearly black) even if slightly saturated
    if v < 0.15:
        return (0, v, 0, 0)

    # High value + low saturation (near-white pastels)
    if v > 0.90 and s < 0.25:
        return (0, v, 0, 0)

    # Chromatic colors - sort by hue in rainbow order
    # Adjust hue for better visual sorting:
    # - Red starts at 0
    # - We want smooth progression through rainbow
    # Secondary sort by saturation (more saturated first) then value
    return (1, h, -s, -v)


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
        colors.sort(key=lambda c: color_sort_key(c["color"]))

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
