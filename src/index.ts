import { Dropdown, DropdownOption } from "./dropdown";

// @ts-ignore
window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

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


