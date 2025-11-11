import batConfig from '../../public/configs/bat.json';

// Some preloaded colors
//import woolColors from '../../public/colors/wool.json'
// import skinColors from '../dist/colors/skin.json'

import { DropdownOption } from '../dropdown/dropdown';
import { Config } from './scheme';

export var config: Config = batConfig; // TODO change to some other default config

export interface ColorConfig {
  palette: DropdownOption[],
}

export async function getColors(filename: string): Promise<ColorConfig> {
  //if (filename == "/colors/wool.json") { return woolColors; }
  return $.getJSON(filename) // BUG wrong promise
}

const SupportedConfigs = ["bat", "sheep", "horntail"];

async function getConfig(name:string): Promise<Config | undefined> {
  if (!SupportedConfigs.includes(name)) {
    return undefined;
  }

  if (name == "bat") { return batConfig; }

  return $.getJSON(`/configs/${name}.json`);
}

export async function setupConfig(): Promise<void> {
  // Look for config name
  let name = window.location.pathname.split("/")[1];
  var cfg =  await getConfig(name);
  if (cfg == undefined) {
    console.error("ERROR: no config found")
    return;
  }
  config = cfg as Config;
  
  // Validating
  if (!config || config.backgroundImgURL == "")
    console.error("ERROR: no background image in config")
}

