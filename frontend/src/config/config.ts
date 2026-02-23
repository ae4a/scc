// Some preloaded colors
//import woolColors from '../../public/colors/wool.json'
// import skinColors from '../dist/colors/skin.json'

import { DropdownOption } from '../dropdown/dropdown';
import { Config } from './scheme';
import { language, getLanguagePrefix } from './lang';

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

// Detect if a string looks like a language code (2-3 letter codes)
function looksLikeLanguageCode(str: string): boolean {
  return /^[a-z]{2,3}$/i.test(str);
}

export async function setupConfig(): Promise<void> {
  // Look for config name - handle both /page and /lang/page formats
  const pathParts = window.location.pathname.split("/").filter(p => p.length > 0);
  let name: string;
  let hasLanguageInURL = false;
  
  // Check if first segment looks like a language code
  if (pathParts.length >= 2 && looksLikeLanguageCode(pathParts[0])) {
    // Format: /lang/page
    name = pathParts[1];
    hasLanguageInURL = true;
  } else if (pathParts.length >= 1) {
    // Format: /page (no language prefix)
    name = pathParts[0];
    hasLanguageInURL = false;
  } else {
    console.error("ERROR: no config name in URL");
    return;
  }
  
  var cfg = await getConfig(name);
  if (cfg == undefined) {
    console.error("ERROR: no config found for '" + name + "'")
    return;
  }
  config = cfg as Config;

  // If URL doesn't have language, add it without redirect
  if (!hasLanguageInURL) {
    const detectedLang = getLanguagePrefix();
    const newPath = "/" + detectedLang + "/" + name;
    window.history.replaceState({}, "", newPath);
    console.log("DEBUG: Updated URL from /" + name + " to " + newPath);
  }

  // Validating
  if (!config || config.backgroundImgURL == "")
    console.error("ERROR: no background image in config")
}

