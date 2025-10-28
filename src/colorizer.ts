import { contains, map } from "jquery";
import { Color } from "./color";
import { config } from "./config";

export class Colorizer {
  backgroundImg: JQuery<HTMLElement>;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  originalPixels: ImageData | null = null;
  currentPixels: ImageData | null = null;
  masks: { [key: string]: { data: ImageData, compesation: number } }; // Mask from mask name
  colors: { [key: string]: Color }; // Color for mask
  
  startX: number;
  startY: number;
  endX: number;
  endY: number;

  loadImgs = () => {
    this.canvas.width = (this.backgroundImg.get()[0] as HTMLImageElement).width;
    this.canvas.height = (this.backgroundImg.get()[0] as HTMLImageElement).height;
    
    // Load sheep image
    const backgroundImg = new Image();
    backgroundImg.onload = () => {
      console.log("sheep start")
      const img = backgroundImg;
    
      this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, this.canvas.width, this.canvas.height);
      this.currentPixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.originalPixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

      this.startX = Math.floor(config.computeFrame.start.x * this.originalPixels.width)
      this.startY = Math.floor(config.computeFrame.start.y * this.originalPixels.height)
      this.endX = Math.floor(Math.max(config.computeFrame.end.x * this.originalPixels.width, this.startX))
      this.endY = Math.floor(Math.max(config.computeFrame.end.y * this.originalPixels.height, this.startY))

      console.log("sheep end")
    }
    backgroundImg.src = config.background;

    // Load masks
    for (const maskName in config.masks) {
      const maskImage = new Image();
      maskImage.onload = () => {
        console.log(`${maskName} start`);
        this.ctx.drawImage(maskImage, 0, 0, maskImage.naturalWidth, maskImage.naturalHeight, 0, 0, this.canvas.width, this.canvas.height);
        this.masks[maskName] = { data: this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height), compesation: config.masks[maskName].compensation };
        console.log(`${maskName} end`);
      }
      maskImage.src = config.masks[maskName].file;
    }


    // Extra check
    setTimeout(() => {
      // TODO add check for masks to be loaded
      if(!this.originalPixels || !this.currentPixels) {
        console.log("!!!something did not loaded");
        console.log("EXTRA");
        this.loadImgs();         
      }
    }, 1000);
  }
   
  updateImg = () => {
    if(!this.originalPixels || !this.currentPixels) {
      alert("ERROR: images did not load correctly :( Try refresh the page.")
      return;
    }

    // console.log(this.originalPixels, this.woolMask, this.skinMask)
    // wconsole.log("--- update image ---");

    this.currentPixels.data.set(this.originalPixels.data);

    for (const maskName in config.masks) {
      var mask = this.masks[maskName];
      var color = this.colors[maskName];
      if (!mask) {
        console.log("failed to get color or mask");
        continue;
      }
      if (!color) {
        continue;
      }

      const w = this.originalPixels.width
      for (var y = this.startY; y < this.endY; y++) {
        for (var x = this.startX; x < this.endX; x++) {
          const i = (y * w + x) * 4;
          const coef = mask.data.data[i] / 255;
          const compensation = 1 + mask.compesation * coef;

          this.currentPixels.data[i + 0] = compensation * this.currentPixels.data[i + 0] * ((color.r / 255.0 - 1) * coef + 1);
          this.currentPixels.data[i + 1] = compensation * this.currentPixels.data[i + 1] * ((color.g / 255.0 - 1) * coef + 1);
          this.currentPixels.data[i + 2] = compensation * this.currentPixels.data[i + 2] * ((color.b / 255.0 - 1) * coef + 1);
        }
      }
    }
  
    this.ctx.putImageData(this.currentPixels, 0, 0);
    (this.backgroundImg.get()[0] as HTMLImageElement).src = this.canvas.toDataURL("image/png");

    console.log(this.backgroundImg.width());
    console.log(this.backgroundImg.height());
    console.log(this.backgroundImg.position());
    console.log(this.originalPixels.width)
    console.log(this.originalPixels.height)
  }

  setColor( name: string, c: Color ) {
    this.colors[name] = c;
  }

  constructor( newBackgroundImg: JQuery<HTMLElement>) {
    this.backgroundImg = newBackgroundImg;
    this.masks = {};
    this.colors = {};

    // Render init
    this.canvas = document.createElement("canvas");
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      alert("Error creating context");
      return;
    }
    this.ctx = ctx;

    this.loadImgs();
 }
}


