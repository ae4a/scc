class Color {
  r: number;
  g: number;
  b: number;
}

class SheepHandler {
  sheepImg: JQuery<HTMLElement>;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  originalPixels: ImageData | null = null;
  woolMask: ImageData | null = null;
  skinMask: ImageData | null = null;
  currentPixels: ImageData | null = null;
  woolColor: Color = { r: 0, g: 0, b: 0 };
  skinColor: Color = { r: 0, g: 0, b: 0 };

  loadImgs = () => {
    var img = this.sheepImg.get()[0] as HTMLImageElement;
    this.canvas.width = img.width;
    this.canvas.height = img.height;
  
    this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
    this.currentPixels = this.ctx.getImageData(0, 0, img.width, img.height);
    this.originalPixels = this.ctx.getImageData(0, 0, img.width, img.height);
    console.log(this.currentPixels)

    // Load wool mask
    img = $("#sheepWoolMask").get()[0] as HTMLImageElement;

    this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
    this.woolMask = this.ctx.getImageData(0, 0, img.width, img.height);
 
    // Load skin mask
    img = $("#sheepSkinMask").get()[0] as HTMLImageElement;

    this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
    this.skinMask = this.ctx.getImageData(0, 0, img.width, img.height);
 
  }
   
  updateSheep = () => {
    if(!this.originalPixels || !this.currentPixels || !this.woolMask || !this.skinMask) {
      console.log("original or current pixels are null");
      return;
    }
    console.log(this.originalPixels, this.woolMask)
  
    for(var I = 0, L = this.originalPixels.data.length; I < L; I += 4) {
      const wm = this.woolMask.data[I];
      const sm = this.skinMask.data[I];
      const om = 255 * Math.max(255 - wm - sm, 0);

      this.currentPixels.data[I + 0] = this.originalPixels.data[I + 0] * (om + this.woolColor.r * wm + this.skinColor.r * sm) / (255 * 255);
      this.currentPixels.data[I + 1] = this.originalPixels.data[I + 1] * (om + this.woolColor.g * wm + this.skinColor.g * sm) / (255 * 255);
      this.currentPixels.data[I + 2] = this.originalPixels.data[I + 2] * (om + this.woolColor.b * wm + this.skinColor.b * sm) / (255 * 255);
    }

    console.log("originalPixels")
  
    this.ctx.putImageData(this.currentPixels, 0, 0);
    (this.sheepImg.get()[0] as HTMLImageElement).src = this.canvas.toDataURL("image/png");

  }

  parseRGB( hex: number ): Color {
    return {
      r:  (hex >> 16) & 0xFF,
      g:  (hex >> 8) & 0xFF,
      b:  hex & 0xFF,
    }
  }

  updateColors = () => {
    this.woolColor = this.parseRGB(parseInt(String($("#woolColorPicker").val()).replace(/^#/, ""), 16));
    this.skinColor = this.parseRGB(parseInt(String($("#skinColorPicker").val()).replace(/^#/, ""), 16));
  }

  constructor( newSheepImg: JQuery<HTMLElement>, newCanvas: HTMLCanvasElement, newCtx: CanvasRenderingContext2D ) {
    this.sheepImg = newSheepImg;
    this.canvas = newCanvas;
    this.ctx = newCtx;

    // Load sheep image
    $("window").ready(this.loadImgs);
  
    $("#changeColorButton").on("click", this.updateSheep);
    $("#woolColorPicker").on("change", this.updateColors);
    $("#skinColorPicker").on("change", this.updateColors);
  }
}

function main() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    alert("Error creating context");
    return;
  }
  
  const sheepHandler = new SheepHandler($("#sheepImg"), canvas, ctx);
  sheepHandler.updateColors();
}

main();
