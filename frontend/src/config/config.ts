// Some preloaded colors
//import woolColors from '../../public/colors/wool.json'
// import skinColors from '../dist/colors/skin.json'

import { DropdownOption } from '../dropdown/dropdown';
import { Config } from './scheme';

export var config: Config; // TODO change to some other default config

export interface ColorConfig {
  palette: DropdownOption[],
}

export async function getColors(filename: string): Promise<ColorConfig> {
  //if (filename == "/colors/wool.json") { return woolColors; }
  return $.getJSON(filename) // BUG wrong promise
}

async function getConfig(name: string): Promise<Config | undefined> {
  if (!name) {
    return undefined;
  }

  return $.getJSON(`/configs/${name}.json`);
}

export async function setupConfig(): Promise<void> {
  // Look for config name
  let name = window.location.pathname.split("/")[1];
  var cfg = await getConfig(name);
  if (cfg == undefined) {
    console.error("ERROR: no config found")
    return;
  }
  config = cfg as Config;

  // Validating
  if (!config || config.backgroundImgURL == "")
    console.error("ERROR: no background image in config")
}

