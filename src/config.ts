import configData from '../configs/sheep.json';

export const config: Config = configData;

export interface Config {
  name: string;
  title: string;
  link: string;
  images: {
    [key: string]: string;
  };
  dropdowns: Array<{
    mask: string;
    label: string;
    buttonText: string;
    colorsUrl: string;
  }>;
}

console.log(config)
