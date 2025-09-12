// =================================================================================
// FILE: io.js - Le Azioni di Input/Output
// Contiene le funzioni attive per importare ed esportare file (JSON, ZIP).
// =================================================================================

const importConfig = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target.result);
            configData = { ...createDefaultConfig(), ...importedData };
            renderAll();
            saveData();
            alert("Configurazione importata con successo!");
        } catch (e) {
            alert("Errore: il file di configurazione non è un JSON valido.");
        }
    };
    reader.readAsText(file);
};

const importTranslations = (files) => {
    let filePromises = Array.from(files).map(file => {
        return new Promise((resolve, reject) => {
            const langCode = file.name.replace('.json', '');
            if (SUPPORTED_LANGUAGES[langCode]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const newTrans = JSON.parse(event.target.result);
                        Object.keys(newTrans).forEach(key => {
                            if (key.startsWith('step_')) {
                                const [, index, field] = key.split('_');
                                if (configData.steps[index] && configData.steps[index][field]) {
                                    configData.steps[index][field][langCode] = newTrans[key];
                                }
                            } else if (key !== 'lang_names' && configData[key]) {
                                configData[key][langCode] = newTrans[key];
                            }
                        });
                        resolve(true);
                    } catch (e) {
                        reject(file.name);
                    }
                };
                reader.onerror = () => reject(file.name);
                reader.readAsText(file);
            } else {
                resolve(false);
            }
        });
    });
    
    Promise.all(filePromises).then(results => {
        const importedCount = results.filter(Boolean).length;
        if (importedCount > 0) {
             alert(`Importazione completata per ${importedCount} file.`);
            saveData();
            renderAll();
        }
    }).catch(fileName => {
        alert(`Errore nella lettura del file ${fileName}`);
    });
};

const exportProjectAsZip = () => {
    if (typeof JSZip === 'undefined') {
        alert("Errore: la libreria JSZip non è stata caricata.");
        return;
    }
    const zip = new JSZip();
    
    const localesFolder = zip.folder("locales");
    const exportableLangs = Object.keys(configData.languages).filter(code => configData.languages[code].exportEnabled);
    
    if (exportableLangs.length === 0) {
        alert(editorTranslations.error_noLangExport || "Nessuna lingua selezionata per l'esportazione.");
        return;
    }

    for (const code of exportableLangs) {
        const langData = { lang_names: {} };
        const langDict = LANG_NAMES_DICTIONARY[code] || LANG_NAMES_DICTIONARY.en;
        for (const langCode of exportableLangs) {
            langData.lang_names['lang_' + langCode] = langDict[langCode] || SUPPORTED_LANGUAGES[langCode].name;
        }

        langData.globalTitle = configData.globalTitle[code] || '';
        langData.globalHeading = configData.globalHeading[code] || '';
        langData.globalTableHeading = configData.globalTableHeading[code] || '';
        
        configData.steps.forEach((step, index) => {
            langData[`step_${index}_title`] = step.title[code] || '';
            langData[`step_${index}_description`] = step.description[code] || '';
        });
        
        const editorLangForExport = LANG_NAMES_DICTIONARY[code] ? code : 'en';
        const currentEditorTranslations = editorTranslationsByLang[editorLangForExport] || {};
        langData.redirect_confirmMessage = (currentEditorTranslations.redirect_confirmMessage || 'You are about to be redirected to:\n%s\nDo you want to continue?');
        langData.redirect_confirm = currentEditorTranslations.redirect_confirm || 'Go to link';
        langData.redirect_cancel = currentEditorTranslations.redirect_cancel || 'Cancel';

        localesFolder.file(`${code}.json`, JSON.stringify(langData, null, 2));
    }

    const finalHtml = generateFinalHtml(exportableLangs);
    zip.file("index.html", finalHtml);
    
    zip.generateAsync({ type:"blob" }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "website_project.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
};