import imagesloaded from "imagesloaded";

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
    imagesloaded.makeJQueryPlugin($);

    // Load sheep image
    const sheepImage = new Image();
    sheepImage.onload = () => {
      console.log("sheep start")
      const img = sheepImage;
      this.canvas.width = img.width;
      this.canvas.height = img.height;
    
      this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
      this.currentPixels = this.ctx.getImageData(0, 0, img.width, img.height);
      this.originalPixels = this.ctx.getImageData(0, 0, img.width, img.height);
      console.log(this.originalPixels)
      console.log("sheep end")
    }
    sheepImage.src = "images/sheep.jpg";

    // Load wool mask
    const woolMaskImage = new Image();
    woolMaskImage.onload = () => {
      console.log("wool start");
      const img = woolMaskImage;
      this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
      this.woolMask = this.ctx.getImageData(0, 0, img.width, img.height);
      console.log(this.woolMask)
      console.log("wool end");
    }
    woolMaskImage.src = "images/sheep_wool_mask.jpg";

    // Load skin mask
    const skinMaskImage = new Image();
    skinMaskImage.onload = () => {
      console.log("skin start")
      const img = skinMaskImage;
      this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
      this.skinMask = this.ctx.getImageData(0, 0, img.width, img.height);
      console.log(this.skinMask)
      console.log("skin end");
    }
    skinMaskImage.src = "images/sheep_skin_mask.jpg";
  }
   
  updateSheep = () => {
    if(!this.originalPixels || !this.currentPixels || !this.woolMask || !this.skinMask) {
      alert("ERROR: images did not load correctly :( Try refresh the page.")
      return;
    }
    // console.log(this.originalPixels, this.woolMask, this.skinMask)
  
    for(var I = 0, L = this.originalPixels.data.length; I < L; I += 4) {
      const wm = this.woolMask.data[I] / 255;
      const sm = this.skinMask.data[I] / 255;

      this.currentPixels.data[I + 0] = this.originalPixels.data[I + 0] * (this.woolColor.r * wm + (this.skinColor.r * sm + 255 * (1 - sm)) * (1 - wm)) / 255;
      this.currentPixels.data[I + 1] = this.originalPixels.data[I + 1] * (this.woolColor.g * wm + (this.skinColor.g * sm + 255 * (1 - sm)) * (1 - wm)) / 255;
      this.currentPixels.data[I + 2] = this.originalPixels.data[I + 2] * (this.woolColor.b * wm + (this.skinColor.b * sm + 255 * (1 - sm)) * (1 - wm)) / 255;
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
    this.loadImgs();
  
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
