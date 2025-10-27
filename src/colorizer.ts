import { map } from "jquery";
import { Color } from "./color";
import { config } from "./config";

export class Colorizer {
  backgroundImg: JQuery<HTMLElement>;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  originalPixels: ImageData | null = null;
  currentPixels: ImageData | null = null;
  masks: { [key: string]: ImageData }; // Mask from mask name
  colors: { [key: string]: Color }; // Color for mask

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
      console.log("sheep end")
    }
    backgroundImg.src = config.background;
  


    // Load masks
    for (const maskName in config.masks) {
      if (maskName === "base") continue; // Skip the base image
      const maskImage = new Image();
      maskImage.onload = () => {
        console.log(`${maskName} start`);
        this.ctx.drawImage(maskImage, 0, 0, maskImage.naturalWidth, maskImage.naturalHeight, 0, 0, this.canvas.width, this.canvas.height);
        this.masks[maskName] = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.colors[maskName] = new Color(255, 255, 255);
        console.log(`${maskName} end`);
      }
      maskImage.src = config.masks[maskName];
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
    //
    console.log("--- update image ---");

    for(var i = 0; i < this.originalPixels.data.length; i++) {
      this.currentPixels.data[i] = this.originalPixels.data[i]
    }

    for (const maskName in config.masks) {
      var mask = this.masks[maskName];
      var color = this.colors[maskName];
      if (!color || !mask) {
        console.log("failed to get color or mask");
        continue;
      }

      for(var i = 0; i < this.originalPixels.data.length; i += 4) {
        const coef = mask.data[i] / 255;

        this.currentPixels.data[i + 0] = this.currentPixels.data[i + 0] * ((color.r / 255.0 - 1) * coef + 1);
        this.currentPixels.data[i + 1] = this.currentPixels.data[i + 1] * ((color.g / 255.0 - 1) * coef + 1);
        this.currentPixels.data[i + 2] = this.currentPixels.data[i + 2] * ((color.b / 255.0 - 1) * coef + 1);
      }
    }
  
    this.ctx.putImageData(this.currentPixels, 0, 0);
    (this.backgroundImg.get()[0] as HTMLImageElement).src = this.canvas.toDataURL("image/png");

    console.log(this.backgroundImg.width());
    console.log(this.backgroundImg.height());
    console.log(this.backgroundImg.position());
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


