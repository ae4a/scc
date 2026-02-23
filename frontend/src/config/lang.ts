export var language: string = "en";

export async function setupLang(): Promise<void> {
  const lang = localStorage.getItem('preferredLang') || navigator.language || navigator.languages[0];
  switch (lang) {
    case "en":
    case "en-US":
    case "en-UK":
      language = "en";
      break;
    case "ru":
    case "ru-RU":
      language = "ru";
      break;
    default:
      console.log("Users language '" + lang + "' is unsupported. Using '" + language + "'");
      return;
  }
  console.log("DEBUG: language set to '" + language + "'")
  $("#languageSelect").val(language);
}

export function setLang(lang: string) {
  language = lang
}

$("#languageSelect").on("change", function () {
  localStorage.setItem('preferredLang', (this as HTMLSelectElement).value);
  window.location.reload();
});
