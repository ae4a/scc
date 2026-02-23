import "./style.css";

import { language, setupLang, getLanguagePrefix } from "./config/lang";
import { MultiLangString } from "./config/scheme";

// @ts-ignore
window.mobileCheck = function () {
  let check = false;
  // @ts-ignore
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

type Config = {
  [key: string]: MultiLangString;
};

const config: Config = {
  "edward": {
    "en": "Edward",
    "ru": "Эдвард",
  },
  "sheep": {
    "en": "Sheep",
    "ru": "Овечка",
  },
  "horntail": {
    "en": "Bulgarian horntail",
    "ru": "Болгарская хвосторога"
  },
  "dragon2": {
    "en": "Dragon",
    "ru": "Дракон"
  }
};

async function main() {
  await setupLang();

  // Get available languages from gallery config (check what languages are defined)
  const availableLanguages = new Set<string>();
  Object.keys(config).forEach(key => {
    Object.keys(config[key]).forEach(lang => {
      availableLanguages.add(lang);
    });
  });
  const availableLangsArray = Array.from(availableLanguages);

  // Find best language match
  let validLang = language;
  if (!availableLanguages.has(language)) {
    // Fallback to en if available, otherwise first available
    validLang = availableLanguages.has("en") ? "en" : availableLangsArray[0];
    console.log("DEBUG: Gallery - language '" + language + "' not available, using '" + validLang + "'");
  }

  // If visiting root or just language, update URL to include language
  const pathParts = window.location.pathname.split("/").filter(p => p.length > 0);
  
  // Detect if a string looks like a language code
  const looksLikeLanguageCode = (str: string) => /^[a-z]{2,3}$/i.test(str);
  
  if (pathParts.length === 0) {
    // Root path: / -> /en (or detected language)
    const newPath = "/" + validLang;
    window.history.replaceState({}, "", newPath);
    console.log("DEBUG: Updated URL from / to " + newPath);
  } else if (pathParts.length === 1 && !looksLikeLanguageCode(pathParts[0])) {
    // Some other single segment that's not a language code
    // This shouldn't happen on gallery page, but handle it anyway
    const newPath = "/" + validLang;
    window.history.replaceState({}, "", newPath);
    console.log("DEBUG: Updated URL to " + newPath);
  } else if (pathParts.length === 1 && looksLikeLanguageCode(pathParts[0])) {
    // Validate the language in URL
    if (!availableLanguages.has(pathParts[0])) {
      const newPath = "/" + validLang;
      window.history.replaceState({}, "", newPath);
      console.log("DEBUG: Language '" + pathParts[0] + "' not available in gallery, using '" + validLang + "'");
    }
  }

  Object.keys(config).forEach(key => {
    let obj = $(`#${key}ItemOverlay`);

    obj.text(config[key][validLang] || config[key]["en"] || Object.values(config[key])[0] || key);
    obj.on("click", () => {
      // Navigate with language prefix
      window.location.pathname = "/" + validLang + "/" + key;
    });
  });
}


$(main);
