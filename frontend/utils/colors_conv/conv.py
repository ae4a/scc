import sys
import argparse
import colorsys


def color_sort_key(hex_color):
    """
    Sort colors using a balanced spectrum approach:
    1. Separate neutrals (low saturation) and place them at the end
    2. Primary Sort: By Hue (0-360°) for visible rainbow progression
    3. Secondary Sort: By Lightness for smooth transitions within each hue
    4. Balanced weighting for smooth yet colorful gradients
    """
    hex_color = hex_color.lstrip("#")
    r, g, b = tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))

    # Convert to HSL (Hue, Saturation, Lightness) for better perceptual sorting
    h, l, s = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)

    # Calculate perceived luminosity for more professional sorting
    # Using relative luminance formula (ITU-R BT.709)
    luminosity = 0.2126 * r / 255.0 + 0.7152 * g / 255.0 + 0.0722 * b / 255.0

    # Identify neutrals (low saturation colors: blacks, grays, whites)
    # Place them at the end with very high group number
    if s < 0.15:
        # Sort neutrals by lightness (dark to light)
        # Group 2 ensures they come after chromatic colors
        return (2, l, 0, 0)

    # Very dark colors (nearly black) even if slightly saturated
    if l < 0.1:
        return (2, l, 0, 0)

    # Very light colors (nearly white) with low saturation
    if l > 0.95 and s < 0.2:
        return (2, l, 0, 0)

    # Chromatic colors - balanced approach for visible hue changes with smooth gradients
    # Group 1: Main chromatic colors
    # Convert hue from 0-1 to 0-360 degrees for clarity (colorsys uses 0-1 range)
    hue_degrees = h * 360

    # Quantize hue into broader bands (every ~10 degrees) to allow lightness to matter
    # This creates visible hue progression while allowing smooth lightness transitions
    hue_band = hue_degrees // 10

    # Within each hue band, sort by lightness (light to dark)
    # Then by exact hue for fine-tuning
    return (1, hue_band, -l, hue_degrees)


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
