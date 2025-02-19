import { Color } from "./color";

export class SheepHandler {
  sheepImg: JQuery<HTMLElement>;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  imgPrefix: string;

  originalPixels: ImageData | null = null;
  woolMask: ImageData | null = null;
  skinMask: ImageData | null = null;
  currentPixels: ImageData | null = null;
  woolColor: Color = { r: 255, g: 255, b: 255 };
  skinColor: Color = { r: 255, g: 255, b: 255 };

  loadImgs = () => {
    this.canvas.width = (this.sheepImg.get()[0] as HTMLImageElement).width;
    this.canvas.height = (this.sheepImg.get()[0] as HTMLImageElement).height;
    
    // Load sheep image
    const sheepImage = new Image();
    sheepImage.onload = () => {
      console.log("sheep start")
      const img = sheepImage;
    
      this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, this.canvas.width, this.canvas.height);
      this.currentPixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.originalPixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      console.log("sheep end")
    }
    sheepImage.src = `images/${this.imgPrefix}/sheep.jpg`;

    // Load wool mask
    const woolMaskImage = new Image();
    woolMaskImage.onload = () => {
      console.log("wool start");
      const img = woolMaskImage;

      this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, this.canvas.width, this.canvas.height);
      this.woolMask = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      console.log("wool end");
    }
    woolMaskImage.src = `images/${this.imgPrefix}/wool_mask.jpg`;

    // Load skin mask
    const skinMaskImage = new Image();
    skinMaskImage.onload = () => {
      console.log("skin start")
      const img = skinMaskImage;

      this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, this.canvas.width, this.canvas.height);
      this.skinMask = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      console.log("skin end");
    }
    skinMaskImage.src = `images/${this.imgPrefix}/skin_mask.jpg`;


    // Extra check
    setTimeout(() => {
      if(!this.originalPixels || !this.currentPixels || !this.woolMask || !this.skinMask) {
        console.log("!!!something did not loaded");
        console.log("EXTRA");
        this.loadImgs();         
      }
    }, 1000);
  }
   
  updateImg = () => {
    if(!this.originalPixels || !this.currentPixels || !this.woolMask || !this.skinMask) {
      alert("ERROR: images did not load correctly :( Try refresh the page.")
      return;
    }
    // console.log(this.originalPixels, this.woolMask, this.skinMask)
    //
    console.log("--- update image ---");
  
    for(var I = 0, L = this.originalPixels.data.length; I < L; I += 4) {
      const wm = this.woolMask.data[I] / 255;
      const sm = this.skinMask.data[I] / 255;

      this.currentPixels.data[I + 0] = this.originalPixels.data[I + 0] * (this.woolColor.r * wm + (this.skinColor.r * sm + 255 * (1 - sm)) * (1 - wm)) / 255;
      this.currentPixels.data[I + 1] = this.originalPixels.data[I + 1] * (this.woolColor.g * wm + (this.skinColor.g * sm + 255 * (1 - sm)) * (1 - wm)) / 255;
      this.currentPixels.data[I + 2] = this.originalPixels.data[I + 2] * (this.woolColor.b * wm + (this.skinColor.b * sm + 255 * (1 - sm)) * (1 - wm)) / 255;
    }

  
    this.ctx.putImageData(this.currentPixels, 0, 0);
    (this.sheepImg.get()[0] as HTMLImageElement).src = this.canvas.toDataURL("image/png");

    console.log(this.sheepImg.width());
    console.log(this.sheepImg.height());
    console.log(this.sheepImg.position());
  }

  setWoolColor( c: Color ) {
    this.woolColor = c;
  }

  setSkinColor( c: Color ) {
    this.skinColor = c;
  }

  constructor( newSheepImg: JQuery<HTMLElement>, imgPrefix: string ) {
    this.sheepImg = newSheepImg;
    this.imgPrefix = imgPrefix;

    // Render init
    this.canvas = document.createElement("canvas");
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      alert("Error creating context");
      return;
    }
    this.ctx = ctx;

    // Load sheep image
    this.loadImgs();
 }
}


