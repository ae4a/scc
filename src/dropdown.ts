export class DropdownOption {
  text: string;
  color: string;
  value: string;
}

export class Dropdown {
  container: JQuery<HTMLElement>;
  options: DropdownOption[] = [];
  optionsElements: JQuery<HTMLElement>[] = [];
  public onchange: ( value: string ) => void;

  constructor( container: JQuery<HTMLElement>, options: DropdownOption[], defaultOption: number ) {
    this.container = container;
    this.options = options;

    const buttonE = $('<button class="dropbtn">Dropdown</button>')
    buttonE.appendTo(this.container);

    const contentE = $('<div class="dropdown-content"></div>');

    options.map( ( o: DropdownOption ) => {
      const optionE = $(`<li class="dropdown-option" style="background-color: ${o.color};" value="${o.value}">${o.text}</li>`);
      optionE.on("click", () => {
        if (!this.onchange) {
          alert("onchage is null");
          return;
        }
        this.onchange(o.value);
      });

      this.optionsElements.push(optionE);
      optionE.appendTo(contentE);
    });
    
    contentE.appendTo(this.container);
  }
}
