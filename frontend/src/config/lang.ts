export var language: string = "en";

// Detect if a string looks like a language code (2-3 letter codes)
function looksLikeLanguageCode(str: string): boolean {
  return /^[a-z]{2,3}$/i.test(str);
}

// Parse language from URL path
function getLanguageFromURL(): string | null {
  const pathParts = window.location.pathname.split("/").filter(p => p.length > 0);
  if (pathParts.length > 0) {
    const potentialLang = pathParts[0];
    // Check if first segment looks like a language code (2-3 letters)
    if (looksLikeLanguageCode(potentialLang)) {
      return potentialLang.toLowerCase();
    }
  }
  return null;
}

// Normalize browser language to 2-letter code
function normalizeBrowserLanguage(lang: string): string {
  return lang.toLowerCase().split('-')[0];
}

export async function setupLang(): Promise<void> {
  // Priority: 1. URL, 2. localStorage, 3. Browser language, 4. Default (en)
  let urlLang = getLanguageFromURL();
  
  if (urlLang) {
    // Language is in URL, use it
    language = urlLang;
    console.log("DEBUG: language from URL: '" + language + "'");
    return;
  }

  // Try localStorage
  const storedLang = localStorage.getItem('preferredLang');
  if (storedLang) {
    language = storedLang;
    console.log("DEBUG: language from localStorage: '" + language + "'");
    return;
  }

  // Try browser language
  const browserLang = navigator.language || (navigator.languages && navigator.languages[0]);
  language = normalizeBrowserLanguage(browserLang);
  console.log("DEBUG: language from browser: '" + language + "'");
}

export function setLang(lang: string) {
  language = lang;
  localStorage.setItem('preferredLang', lang);
  
  // Update URL without reload using history.pushState
  const pathParts = window.location.pathname.split("/").filter(p => p.length > 0);
  
  // Check if first part looks like a language code
  let newPath: string;
  if (pathParts.length > 0 && looksLikeLanguageCode(pathParts[0])) {
    // Replace existing language
    pathParts[0] = lang;
    newPath = "/" + pathParts.join("/");
  } else if (pathParts.length > 0) {
    // Add language before page name
    newPath = "/" + lang + "/" + pathParts.join("/");
  } else {
    // Root path, just add language
    newPath = "/" + lang;
  }
  
  window.history.pushState({}, "", newPath);
  console.log("DEBUG: language changed to '" + lang + "', URL updated to: " + newPath);
}

// Export function to get the current language path prefix
export function getLanguagePrefix(): string {
  return language;
}
