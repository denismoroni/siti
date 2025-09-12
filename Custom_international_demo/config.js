// =================================================================================
// FILE: config.js - Il Cervello (Dati e Configurazione)
// Contiene lo stato iniziale, le costanti e la struttura dati del progetto.
// =================================================================================

const SUPPORTED_LANGUAGES = {
    en: { name: "English", flag: "🇬🇧" },
    it: { name: "Italiano", flag: "🇮🇹" },
    de: { name: "Tedesco", flag: "🇩🇪" },
    fr: { name: "Francese", flag: "🇫🇷" },
    es: { name: "Spagnolo", flag: "🇪🇸" },
    pt: { name: "Portoghese", flag: "🇵🇹" },
    pl: { name: "Polacco", flag: "🇵🇱" },
    ru: { name: "Russo", flag: "🇷🇺" },
    th: { name: "Thailandese", flag: "🇹🇭" },
    'zh-CN': { name: "Cinese (S)", flag: "🇨🇳" }
};

const LANG_NAMES_DICTIONARY = {
    it: { en: "Inglese", it: "Italiano", de: "Tedesco", fr: "Francese", es: "Spagnolo", pt: "Portoghese", pl: "Polacco", ru: "Russo", th: "Thailandese", 'zh-CN': "Cinese (S)" },
    en: { en: "English", it: "Italian", de: "German", fr: "French", es: "Spanish", pt: "Portuguese", pl: "Polish", ru: "Russian", th: "Thai", 'zh-CN': "Chinese (S)" },
};

// Lista delle immagini disponibili, come da tuo file originale.
const availableImages = [
    "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg",
    "1.png", "2.png", "3.png", "4.png", "5.png"
];

// Contiene le traduzioni caricate per l'interfaccia dell'editor
let editorTranslations = {};

// Contiene le traduzioni caricate per ogni lingua per l'esportazione
const editorTranslationsByLang = {};

const createDefaultMultiLangText = (defaultText = '', lang = 'en') => {
    const multiLangText = {};
    for (const code in SUPPORTED_LANGUAGES) {
        multiLangText[code] = '';
    }
    if (multiLangText[lang] !== undefined) {
        multiLangText[lang] = defaultText;
    }
    return multiLangText;
};

const createDefaultConfig = () => {
    const langConfig = {};
    for (const code in SUPPORTED_LANGUAGES) {
        langConfig[code] = {
            editorVisible: code === 'en',
            exportEnabled: true
        };
    }
    
    return {
        globalTitle: createDefaultMultiLangText("Page Title"),
        globalHeading: createDefaultMultiLangText("Main Heading"),
        globalTableHeading: createDefaultMultiLangText("Installation Steps"),
        colors: {
            modalBodyBgColor: "#A3A3A3",
            modalContainerBgColor: "#D3D3D3",
            modalTableBgColor: "#AA7742",
            modalMainHeadingColor: "#000000",
            modalTableHeadingColor: "#0000FF",
            modalSectionTitleColor: "#000000",
            modalDescriptionColor: "#000000"
        },
        text: {
            headingFont: "Arial",
            descriptionFont: "Arial",
            mainHeadingSize: 40,
            tableHeadingSize: 28,
            sectionTitleSize: 32,
            descriptionSize: 20,
            headingBold: true,
            headingItalic: false,
            descriptionBold: false,
            descriptionItalic: false,
            titleAlignment: "center",
            descriptionAlignment: "center",
            imageAlignment: "center"
        },
        languages: langConfig,
        steps: []
    };
};

// La dichiarazione della struttura dati principale che verrà usata in tutti i file --- è piu corto di una riga
let configData = createDefaultConfig();