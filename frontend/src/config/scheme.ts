export type MultiLangString = Record<string, string>;

export interface Config {
  name: string; // For internal use
  lang?: string;
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
