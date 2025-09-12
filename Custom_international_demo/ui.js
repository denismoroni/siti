// =================================================================================
// FILE: ui.js - Le Braccia e gli Occhi (Interfaccia Utente)
// Contiene tutte le funzioni che manipolano il DOM, renderizzano elementi
// e gestiscono l'apertura e l'aggiornamento dei modali.
// =================================================================================

const modals = {
    edit: document.getElementById('editModal'),
    globalTitles: document.getElementById('editGlobalTitlesModal'),
    colors: document.getElementById('editColorsModal'),
    text: document.getElementById('editTextModal'),
    redirect: document.getElementById('redirectModal')
};

// =================================================================================
// --- LOGICA DI TRADUZIONE (i18n) PER L'EDITOR ---
// =================================================================================

async function setEditorLanguage(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) throw new Error("File di traduzione non trovato per l'editor: " + lang);
        const translations = await response.json();
        editorTranslations = translations;
        editorTranslationsByLang[lang] = translations;

        document.querySelectorAll('[data-i18n-key]').forEach(el => {
            const key = el.dataset.i18nKey;
            if (editorTranslations[key]) {
                const isOption = el.tagName === 'OPTION';
                if (isOption && el.textContent.trim() === '') {
                   el.textContent = editorTranslations[key];
                } else if (!isOption) {
                   el.textContent = editorTranslations[key];
                }
            }
        });
        document.documentElement.lang = lang;
        renderAll();
    } catch (error) {
        console.error(error);
    }
}

// =================================================================================
// --- FUNZIONI DI RENDERING E APPLICAZIONE STILI ---
// =================================================================================

const renderAll = () => {
    applyStylesFromConfig();
    renderGlobalTitles();
    renderTable();
    renderLanguageSelector();
};

const applyStylesFromConfig = () => {
    const { colors, text } = configData;

    // Applica stili direttamente agli elementi per massima priorità
    document.body.style.backgroundColor = colors.modalBodyBgColor;
    document.querySelector('.container').style.backgroundColor = colors.modalContainerBgColor;
    
    const mainHeading = document.querySelector('h1');
    if (mainHeading) {
        mainHeading.style.color = colors.modalMainHeadingColor;
        mainHeading.style.fontFamily = text.headingFont;
        mainHeading.style.fontSize = `${text.mainHeadingSize}px`;
        mainHeading.style.fontWeight = text.headingBold ? 'bold' : 'normal';
        mainHeading.style.fontStyle = text.headingItalic ? 'italic' : 'normal';
        mainHeading.style.textAlign = text.titleAlignment;
    }

    const tableHeading = document.querySelector('#installationTable th');
    if (tableHeading) {
        tableHeading.style.color = colors.modalTableHeadingColor;
        tableHeading.style.fontFamily = text.headingFont;
        tableHeading.style.fontSize = `${text.tableHeadingSize}px`;
        tableHeading.style.fontWeight = text.headingBold ? 'bold' : 'normal';
        tableHeading.style.fontStyle = text.headingItalic ? 'italic' : 'normal';
        tableHeading.style.textAlign = text.titleAlignment;
    }

    const table = document.querySelector('#installationTable');
    if (table) {
        table.style.backgroundColor = colors.modalTableBgColor;
    }

    // Applica stili agli elementi dinamici nella tabella
    document.querySelectorAll('.image-title').forEach(el => {
        el.style.color = colors.modalSectionTitleColor;
        el.style.fontFamily = text.headingFont;
        el.style.fontSize = `${text.sectionTitleSize}px`;
        el.style.textAlign = text.titleAlignment;
        el.style.fontWeight = text.headingBold ? 'bold' : 'normal';
        el.style.fontStyle = text.headingItalic ? 'italic' : 'normal';
    });

    document.querySelectorAll('.step-description').forEach(el => {
        el.style.color = colors.modalDescriptionColor;
        el.style.fontFamily = text.descriptionFont;
        el.style.fontSize = `${text.descriptionSize}px`;
        el.style.textAlign = text.descriptionAlignment;
        el.style.fontWeight = text.descriptionBold ? 'bold' : 'normal';
        el.style.fontStyle = text.descriptionItalic ? 'italic' : 'normal';
    });
    
    document.querySelectorAll('#installationTable img').forEach(el => {
        el.style.display = 'block';
        if (text.imageAlignment === 'center') {
            el.style.marginLeft = 'auto';
            el.style.marginRight = 'auto';
        } else if (text.imageAlignment === 'left') {
            el.style.marginLeft = '0';
            el.style.marginRight = 'auto';
        } else { // right
            el.style.marginLeft = 'auto';
            el.style.marginRight = '0';
        }
    });
};

const renderGlobalTitles = () => {
    const editorLang = document.documentElement.lang || 'en';
    const fallbackLang = 'en';
    document.title = configData.globalTitle[editorLang] || configData.globalTitle[fallbackLang] || 'Editor';
    document.querySelector('h1').textContent = configData.globalHeading[editorLang] || configData.globalHeading[fallbackLang] || 'Editor';
    document.querySelector('#installationTable th').textContent = configData.globalTableHeading[editorLang] || configData.globalTableHeading[fallbackLang] || 'Sections';
};

const renderLanguageSelector = () => {
    const container = document.getElementById('languageConfigurator');
    if (!container) return;
    const currentEditorLang = document.documentElement.lang || 'en';
    const nameDictionary = LANG_NAMES_DICTIONARY[currentEditorLang] || LANG_NAMES_DICTIONARY.en;

    container.innerHTML = '';
    for (const code in SUPPORTED_LANGUAGES) {
        const lang = SUPPORTED_LANGUAGES[code];
        if (!configData.languages || !configData.languages[code]) continue;
        const config = configData.languages[code];
        const translatedName = nameDictionary[code] || lang.name;

        const controlDiv = document.createElement('div');
        controlDiv.className = 'lang-control';
        
        controlDiv.innerHTML = `
            <div class="lang-flag">${lang.flag}</div>
            <div class="lang-name">${translatedName}</div>
            <div class="lang-checkboxes">
                <label title="${editorTranslations.lang_checkbox_show || ''}"><input type="checkbox" class="lang-visible-toggle" data-lang="${code}" ${config.editorVisible ? 'checked' : ''}>👁️</label>
                <label title="${editorTranslations.lang_checkbox_export || ''}"><input type="checkbox" class="lang-export-toggle" data-lang="${code}" ${config.exportEnabled ? 'checked' : ''}>📦</label>
            </div>
        `;
        container.appendChild(controlDiv);
    }
};

const renderTable = () => {
    const tableBody = document.querySelector('#installationTable tbody');
    tableBody.innerHTML = '';
    const editorLang = document.documentElement.lang || 'en';
    const fallbackLang = 'en';
    
    configData.steps.forEach((step, index) => {
        const tr = document.createElement('tr');
        tr.className = 'clickable-row';
        if (step.link) {
            tr.dataset.link = step.link;
            tr.dataset.linkConfirm = step.linkConfirm !== false;
        }

        const title = step.title[editorLang] || step.title[fallbackLang] || (editorTranslations.placeholder_noTitle || '[No Title]');
        const description = step.description[editorLang] || step.description[fallbackLang] || (editorTranslations.placeholder_noDescription || '[No Description]');

        tr.innerHTML = `
            <td>
                <div class="image-title">${title}</div>
                ${step.image ? `<img src="IMG/${step.image}" alt="${title}">` : ''}
                <div class="step-description">${description}</div>
                <div class="edit-buttons">
                    <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded" data-index="${index}">${editorTranslations.btn_edit || 'Edit'}</button>
                    <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded" data-index="${index}">${editorTranslations.btn_delete || 'Delete'}</button>
                    <button class="move-up-btn bg-gray-500 text-white px-2 py-1 rounded" ${index === 0 ? 'disabled' : ''} data-index="${index}">▲</button>
                    <button class="move-down-btn bg-gray-500 text-white px-2 py-1 rounded" ${index === configData.steps.length - 1 ? 'disabled' : ''} data-index="${index}">▼</button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    applyStylesFromConfig();
};

// =================================================================================
// --- GESTIONE MODALI ---
// =================================================================================

const openColorsModal = () => {
    for (const key in configData.colors) {
        const input = document.getElementById(key);
        if (input) input.value = configData.colors[key];
    }
    if (modals.colors) modals.colors.style.display = 'block';
};

const saveColorsFromModal = () => {
    for (const key in configData.colors) {
        const input = document.getElementById(key);
        if (input) configData.colors[key] = input.value;
    }
    applyStylesFromConfig();
    saveData();
    if (modals.colors) modals.colors.style.display = 'none';
};

const openTextModal = () => {
    for (const key in configData.text) {
        const input = document.getElementById(key);
        if (input) {
            if (input.type === 'checkbox') input.checked = configData.text[key];
            else input.value = configData.text[key];
        }
    }
    if (modals.text) modals.text.style.display = 'block';
};

const saveTextFromModal = (closeModal = true) => {
    for (const key in configData.text) {
        const input = document.getElementById(key);
        if (input) {
            if (input.type === 'checkbox') configData.text[key] = input.checked;
            else if (input.type === 'number') configData.text[key] = parseInt(input.value, 10) || 0;
            else configData.text[key] = input.value;
        }
    }
    applyStylesFromConfig();
    saveData();
    if (closeModal && modals.text) modals.text.style.display = 'none';
};

const createMultiLanguageFields = (fieldName, dataObject, isTextarea = false) => {
    let fieldsHtml = '';
    const visibleLangs = Object.keys(configData.languages).filter(code => configData.languages[code].editorVisible);

    if (visibleLangs.length === 0) {
        return `<p class="text-red-500">${editorTranslations.error_noLangSelected || 'Please select a language to display.'}</p>`;
    }

    for (const code of visibleLangs) {
        const lang = SUPPORTED_LANGUAGES[code];
        const value = dataObject[code] || '';
        const key = `field_${fieldName}`;
        const labelText = `${editorTranslations[key] || fieldName} (${lang.name})`;
        
        if (isTextarea) {
            fieldsHtml += `<div class="mb-4"><label class="block text-gray-700">${lang.flag} ${labelText}</label><textarea data-lang="${code}" data-field="${fieldName}" class="w-full p-2 border rounded">${value}</textarea></div>`;
        } else {
            fieldsHtml += `<div class="mb-4"><label class="block text-gray-700">${lang.flag} ${labelText}</label><input type="text" data-lang="${code}" data-field="${fieldName}" class="w-full p-2 border rounded" value="${value}"></div>`;
        }
    }
    return fieldsHtml;
};

const openEditModal = (index) => {
    currentStepIndex = index;
    const step = configData.steps[index];
    const container = document.getElementById('editModal-fields');

    container.innerHTML = `
        ${createMultiLanguageFields('title', step.title)}
        ${createMultiLanguageFields('description', step.description, true)}
        <div class="mb-4">
            <label class="block text-gray-700">${editorTranslations.field_imageName || 'Image Name'}</label>
            <select id="modalImage" class="w-full p-2 border rounded"></select>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700">${editorTranslations.field_link || 'Link'}</label>
            <input type="text" id="modalLink" class="w-full p-2 border rounded" value="${step.link || ''}">
        </div>
         <div class="mb-4">
            <label class="flex items-center">
                <input type="checkbox" id="modalLinkConfirm" class="form-checkbox h-5 w-5 text-gray-600" ${step.linkConfirm !== false ? 'checked' : ''}>
                <span class="ml-2 text-gray-700">${editorTranslations.field_linkConfirm || 'Ask confirmation'}</span>
            </label>
        </div>`;
    
    const modalImageSelect = document.getElementById('modalImage');
    modalImageSelect.innerHTML = `<option value="">${editorTranslations.option_noImage || 'No image'}</option>`;
    availableImages.forEach(img => {
        const selected = img === step.image ? 'selected' : '';
        modalImageSelect.innerHTML += `<option value="${img}" ${selected}>${img}</option>`;
    });

    if (modals.edit) modals.edit.style.display = 'block';
};

const openGlobalTitlesModal = () => {
    const container = document.getElementById('globalTitlesModal-fields');
    const mapping = {
        browserTabTitle: 'globalTitle',
        mainHeading: 'globalHeading',
        sectionsTitle: 'globalTableHeading'
    };
    container.innerHTML = Object.keys(mapping).map(field => createMultiLanguageFields(field, configData[mapping[field]])).join('');
    if (modals.globalTitles) modals.globalTitles.style.display = 'block';
};

const saveGlobalTitlesFromModal = () => {
    const mapping = {
        browserTabTitle: 'globalTitle',
        mainHeading: 'globalHeading',
        sectionsTitle: 'globalTableHeading'
    };
    document.querySelectorAll('#globalTitlesModal-fields [data-lang]').forEach(input => {
        const fieldKey = input.dataset.field;
        const configKey = mapping[fieldKey];
        if (configKey) {
            configData[configKey][input.dataset.lang] = input.value;
        }
    });
    renderGlobalTitles();
    saveData();
};

const populateFontSelectors = () => {
    const fonts = ["Arial", "Verdana", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Courier New", "Lucida Console"];
    const headingSelect = document.getElementById('headingFont');
    const descriptionSelect = document.getElementById('descriptionFont');
    if (!headingSelect || !descriptionSelect) return;

    let optionsHtml = '';
    fonts.forEach(font => {
        optionsHtml += `<option value="${font}">${font}</option>`;
    });

    headingSelect.innerHTML = optionsHtml;
    descriptionSelect.innerHTML = optionsHtml;
};