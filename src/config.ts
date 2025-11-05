import configData from '../configs/bat-en.json';

// Some preloaded colors
import woolColors from '../dist/colors/wool.json'
// import skinColors from '../dist/colors/skin.json'

import { DropdownOption } from './dropdown';

export const config: Config = configData;

export interface Config {
  name: string;
  title: string;
  link: string;
  background: string;
  masks: {
    [key: string]: {
      file: string;
      compensation: number;
    };
  };
  dropdowns: Array<{
    mask: string;
    label: string;
    buttonText: string;
    colorsUrl: string;
  }>;
  grayCompensation: number;
  computeFrame: { // In
    start: { x: number, y: number },
    end: { x: number, y: number },
  }
}

// Validating
if (!config || config.background == "")
  console.error("no background image in config")

export async function GetColors(filename: string): Promise<DropdownOption[]> {
  if (filename == "colors/wool.json") { return woolColors }
  //if (filename == "colors/skin.json") { return woolColors }
  return await $.getJSON(filename)
}
