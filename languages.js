const Languages = [
    { label: "Bulgarian", value: "bg" },
    { label: "Czech", value: "cs" },
    { label: "Danish", value: "da" },
    { label: "Dutch", value: "nl" },
    { label: "English (American)", value: "en-US" },
    { label: "English (British)", value: "en-GB" },
    { label: "Estonian", value: "et" },
    { label: "Finnish", value: "fi" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Greek", value: "el" },
    { label: "Hungarian", value: "hu" },
    { label: "Indonesian", value: "id" },
    { label: "Italian", value: "it" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Latvian", value: "lv" },
    { label: "Lithuanian", value: "lt" },
    { label: "Polish", value: "pl" },
    { label: "Portuguese (European)", value: "pt-PT" },
    { label: "Portuguese (Brazilian)", value: "pt-BR" },
    { label: "Romanian", value: "ro" },
    { label: "Russian", value: "ru" },
    { label: "Slovak", value: "sk" },
    { label: "Slovenian", value: "sl" },
    { label: "Spanish", value: "es" },
    { label: "Swedish", value: "sv" },
    { label: "Turkish", value: "tr" },
    { label: "Ukrainian", value: "uk" },
    { label: "Chinese (Simplified)", value: "zh" },
    { label: "Hindi", value: "hi" }, // Add Hindi manually
  ];
   // Create a mapping for language names
   const languageNames = Object.fromEntries(Languages.map(lang => [lang.value, lang.label]));

   module.exports = languageNames