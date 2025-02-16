export class DropdownOption {
  text: string;
  color: string;
  textColor?: string;
  value: string;
}

export class Dropdown {
  // Global data
  // options: DropdownOption[] = [];

  // JQuery elements
  container: JQuery<HTMLElement>;
  buttonElement: JQuery<HTMLInputElement>;
  optionsElements: HTMLElement[] = [];
  activeOptionElement: JQuery<HTMLElement>;
  contentContainer: JQuery<HTMLElement>;

  // Callbacks
  public onchange: ( value: string ) => void;

  change( o: DropdownOption ) {
    this.buttonElement.html(o.text);
    this.buttonElement.css("background-color", o.color);
    this.buttonElement.css("color", o.textColor ? o.textColor : "var(--light)");
    if (!this.onchange) {
      alert("onchage is null");
      return;
    }
    this.onchange(o.value);
  }

  constructor( container: JQuery<HTMLElement>, options: DropdownOption[], name: string ) {
    this.container = container;
    // this.options = options;

    // Create button
    this.buttonElement = $(`<button class="dropdown-button">${name}</button>`)
    this.buttonElement.on("click", () => {
      this.contentContainer.toggleClass("hidden");
    });
    this.buttonElement.appendTo(this.container);

    // Create options container
    this.contentContainer = $('<div class="dropdown-content hidden"></div>');
    this.contentContainer.appendTo(this.container);

    // Create options
    options.map( ( o: DropdownOption ) => {
      o.textColor = "var(--light)";
      const color = parseInt(o.color.replace(/^#/, ""), 16); 
      const c = ((color >> 16) & 0xFF) ^ 2 + ((color >> 8) & 0xFF) ^ 2 + ((color >> 0) & 0xFF) ^ 2;
      if (c > 150)
        o.textColor = "var(--dark)";
      const optionE = $(`<div class="dropdown-option" style="background-color: ${o.color}; color: ${o.textColor}" value="${o.value}">${o.text}</div>`);
      optionE.on("click", () => {
        console.log(o);
        this.change(o);
        this.contentContainer.addClass("hidden");
        if (this.activeOptionElement) {
          this.activeOptionElement.removeClass("active");
        }
        optionE.addClass("active");
        this.activeOptionElement = optionE;
     });

      this.optionsElements.push(optionE.get()[0]);
      optionE.appendTo(this.contentContainer);
    });

    document.addEventListener("click", ( e ) => {
      console.log(e.target);
      console.log(!e.target, !this.optionsElements.includes(e.target as HTMLElement), (e.target as HTMLElement) != this.buttonElement.get()[0]);
      if (!e.target)
        return;
      if (!this.optionsElements.includes(e.target as HTMLElement) && (e.target as HTMLElement) != this.buttonElement.get()[0])
        this.contentContainer.addClass("hidden");
    });
  }
}
