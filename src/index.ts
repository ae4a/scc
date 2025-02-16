import { Dropdown, DropdownOption } from "./dropdown";

class Color {
  r: number;
  g: number;
  b: number;

  constructor( r: number, g: number, b: number ) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

class SheepHandler {
  sheepImg: JQuery<HTMLElement>;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

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
      console.log(this.originalPixels)
      console.log("sheep end")
    }
    sheepImage.src = "images/sheep.jpg";

    // Load wool mask
    const woolMaskImage = new Image();
    woolMaskImage.onload = () => {
      console.log("wool start");
      const img = woolMaskImage;

      this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, this.canvas.width, this.canvas.height);
      this.woolMask = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      console.log(this.woolMask)
      console.log("wool end");
    }
    woolMaskImage.src = "images/sheep_wool_mask.jpg";

    // Load skin mask
    const skinMaskImage = new Image();
    skinMaskImage.onload = () => {
      console.log("skin start")
      const img = skinMaskImage;

      this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, this.canvas.width, this.canvas.height);
      this.skinMask = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      console.log(this.skinMask)
      console.log("skin end");
    }
    skinMaskImage.src = "images/sheep_skin_mask.jpg";
  }
   
  updateImg = () => {
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

  setWoolColor( c: Color ) {
    this.woolColor = c;
  }

  setSkinColor( c: Color ) {
    this.skinColor = c;
  }

  constructor( newSheepImg: JQuery<HTMLElement>, newCanvas: HTMLCanvasElement, newCtx: CanvasRenderingContext2D ) {
    this.sheepImg = newSheepImg;
    this.canvas = newCanvas;
    this.ctx = newCtx;

    // Load sheep image
    this.loadImgs();
  
 }
}

function toRGB( hex: number ): Color {
  return {
    r:  (hex >> 16) & 0xFF,
    g:  (hex >> 8) & 0xFF,
    b:  hex & 0xFF,
  }
}

async function main() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    alert("Error creating context");
    return;
  }
  
  const sheep = new SheepHandler($("#sheepImg"), canvas, ctx);
 
  // Dropdown menus
  
  // Wool
  const woolColors: DropdownOption[] = await $.getJSON("configs/wool.json");
  const wool = new Dropdown($("#woolSelect"), woolColors, "Select wool color");
  wool.onchange = ( v: string ) => {
    sheep.setWoolColor(toRGB(parseInt(v.replace(/^#/, ""), 16)));
    sheep.updateImg();
  } 

  // Skin
  const skinColors: DropdownOption[] = await $.getJSON("configs/skin.json");
  const skin = new Dropdown($("#skinSelect"), skinColors, "Select skin color");
  skin.onchange = ( v: string ) => {
    sheep.setSkinColor(toRGB(parseInt(v.replace(/^#/, ""), 16)));
    sheep.updateImg();
  } 


  $("#changeColorButton").on("click", sheep.updateImg);
}

main();


