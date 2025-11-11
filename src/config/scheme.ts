export type SupportedLang = "en" | "ru";

export type MultiLangString = { [key in SupportedLang]: string; };

export interface Config {
  name: string; // For internal use
  titleText: MultiLangString;
  titleURL: string;
  backgroundImgURL: string;
  masks: {
    [key: string]: {
      imgURL: string;
      compensation: number;
    };
  };
  dropdowns: Array<{
    mask: string;
    labelText: MultiLangString;
    buttonText: MultiLangString;
    colorsUrl: MultiLangString;
  }>;
  computeFrame: {
    start: { x: number, y: number },
    end: { x: number, y: number },
  }
}
