import configData from '../../configs/bat.json';

// Some preloaded colors
import woolColors from '../../public/colors/wool.json'
// import skinColors from '../dist/colors/skin.json'

import { DropdownOption } from '../dropdown/dropdown';
import { Config } from './scheme';

export const config: Config = configData;

export async function getColors(filename: string): Promise<DropdownOption[]> {
  if (filename == "colors/wool.json") { return woolColors }
  //if (filename == "colors/skin.json") { return woolColors }
  return await $.getJSON(filename) // BUG wrong promise
}

// Validating
if (!config || config.backgroundImgURL == "")
  console.error("ERROR: no background image in config")
