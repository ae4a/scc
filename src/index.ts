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
  currentPixels: ImageData | null = null;
  newColor: Color = { r: 0, g: 0, b: 0 };
   
  updateSheep = () => {
    if(!this.originalPixels || !this.currentPixels) {
      console.log("original or current pixels are null");
      return;
    }
  
    for(var I = 0, L = this.originalPixels.data.length; I < L; I += 4) {
      if(this.currentPixels.data[I + 3] > 0) {
        this.currentPixels.data[I + 0] = this.originalPixels.data[I + 0] / 255.0 * this.newColor.r;
        this.currentPixels.data[I + 1] = this.originalPixels.data[I + 1] / 255.0 * this.newColor.g;
        this.currentPixels.data[I + 2] = this.originalPixels.data[I + 2] / 255.0 * this.newColor.b;
      }
    }

    console.log("originalPixels")
  
    this.ctx.putImageData(this.currentPixels, 0, 0);
    (this.sheepImg.get()[0] as HTMLImageElement).src = this.canvas.toDataURL("image/png");

  }

  updateColors = () => {
    const colorHex = parseInt(String($("#colorPicker").val()).replace(/^#/, ""), 16);
    console.log(colorHex)
    this.newColor.r = (colorHex >> 16) & 0xFF;
    this.newColor.g = (colorHex >> 8) & 0xFF;
    this.newColor.b = colorHex & 0xFF; 
    console.log(this.newColor);
  }

  constructor( newSheepImg: JQuery<HTMLElement>, newCanvas: HTMLCanvasElement, newCtx: CanvasRenderingContext2D ) {
    this.sheepImg = newSheepImg;
    this.canvas = newCanvas;
    this.ctx = newCtx;

    this.sheepImg.on("load", ( imgEvent ) => {
      const img = imgEvent.target as HTMLImageElement;
      this.canvas.width = img.width;
      this.canvas.height = img.height;
    
      this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
      this.currentPixels = this.ctx.getImageData(0, 0, img.width, img.height);
      this.originalPixels = this.ctx.getImageData(0, 0, img.width, img.height);
      console.log(this.currentPixels)
    
      this.sheepImg.off("load");
    });

    $("#changeColorButton").on("click", this.updateSheep);
    $("#colorPicker").on("change", this.updateColors);
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
