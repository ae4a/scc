import configData from '../configs/bat.json';

export const config: Config = configData;

export interface Config {
  name: string;
  title: string;
  link: string;
  background: string;
  masks: {
    [key: string]: string;
  };
  dropdowns: Array<{
    mask: string;
    label: string;
    buttonText: string;
    colorsUrl: string;
  }>;
}

// Validating
if (!config || config.background == "")
  console.error("no background image in config")
