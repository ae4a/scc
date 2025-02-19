
export class Color {
  r: number;
  g: number;
  b: number;

  constructor( r: number, g: number, b: number ) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

export function toRGB( hex: number ): Color {
  return {
    r:  (hex >> 16) & 0xFF,
    g:  (hex >> 8) & 0xFF,
    b:  hex & 0xFF,
  }
}


