// =================================================================================
// FILE: main.js - Il Direttore d'Orchestra
// Gestisce eventi, import/export, salvataggi e l'inizializzazione dell'app.
// =================================================================================

// ***** BLOCCO MANCANTE AGGIUNTO QUI *****
// =================================================================================
// --- GESTIONE DATI (LocalStorage) ---
// =================================================================================

const saveData = () => {
    if (document.getElementById('localStorageToggle').checked) {
        localStorage.setItem('heroWarsHelperConfig', JSON.stringify(configData));
    }
};

const loadData = () => {
    const savedData = localStorage.getItem('heroWarsHelperConfig');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            const defaultConfig = createDefaultConfig();
            configData = { ...defaultConfig, ...parsedData };
            configData.languages = { ...defaultConfig.languages, ...parsedData.languages };
            configData.colors = { ...defaultConfig.colors, ...parsedData.colors };
            configData.text = { ...defaultConfig.text, ...parsedData.text };
        } catch (e) {
            console.error("Errore nel parsing del LocalStorage, resetto.", e);
            configData = createDefaultConfig();
        }
    }
    const autosave = localStorage.getItem('autosaveEnabled') === 'true';
    document.getElementById('localStorageToggle').checked = autosave;
};

// =================================================================================
// --- EVENT LISTENERS E LOGICA ASSOCIATA ---
// =================================================================================

const addEventListeners = () => {
    document.getElementById('addStepBtn').addEventListener('click', () => {
        configData.steps.push({
            title: createDefaultMultiLangText(),
            description: createDefaultMultiLangText(),
            image: '', link: '', linkConfirm: true
        });
        renderTable();
        saveData();
    });

    document.getElementById('exportProjectBtn').addEventListener('click', exportProjectAsZip);
    document.getElementById('exportJsonBtn').addEventListener('click', () => {
        const dataStr = JSON.stringify(configData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'config.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });

    document.getElementById('clearLocalStorageBtn').addEventListener('click', () => {
        if (confirm(editorTranslations.confirm_reset || "Sei sicuro di voler resettare tutto?")) {
            localStorage.removeItem('heroWarsHelperConfig');
            localStorage.removeItem('autosaveEnabled');
            configData = createDefaultConfig();
            document.getElementById('localStorageToggle').checked = false;
            renderAll();
        }
    });

    document.getElementById('importJsonBtn').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => { if(e.target.files.length) importConfig(e.target.files[0]) };
        input.click();
    });

    document.getElementById('importTranslationsBtn').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.multiple = true;
        input.onchange = e => { if(e.target.files.length) importTranslations(e.target.files) };
        input.click();
    });

    document.querySelector('#installationTable tbody').addEventListener('click', e => {
        const button = e.target.closest('button.edit-btn, button.delete-btn, button.move-up-btn, button.move-down-btn');
        const row = e.target.closest('tr');
        
        if (button) {
            e.stopPropagation();
            const index = parseInt(button.dataset.index);
            if (isNaN(index)) return;

            if (button.classList.contains('edit-btn')) openEditModal(index);
            else if (button.classList.contains('delete-btn')) {
                const editorLang = document.documentElement.lang || 'en';
                const title = configData.steps[index].title[editorLang] || configData.steps[index].title.en;
                const confirm_message = (editorTranslations.confirm_delete || 'Delete section "%s"?').replace('%s', title);
                if (confirm(confirm_message)) {
                    configData.steps.splice(index, 1);
                    renderTable();
                    saveData();
                }
            } else if (button.classList.contains('move-up-btn')) {
                if (index > 0) {
                    [configData.steps[index], configData.steps[index - 1]] = [configData.steps[index - 1], configData.steps[index]];
                    renderTable();
                    saveData();
                }
            } else if (button.classList.contains('move-down-btn')) {
                if (index < configData.steps.length - 1) {
                    [configData.steps[index], configData.steps[index + 1]] = [configData.steps[index + 1], configData.steps[index]];
                    renderTable();
                    saveData();
                }
            }
        } else if (row && row.dataset.link) {
             const link = row.dataset.link;
             const confirm = row.dataset.linkConfirm === 'true';
             if (confirm) {
                 const redirectTextEl = modals.redirect.querySelector('#redirectText');
                 const confirmBtn = modals.redirect.querySelector('#confirmRedirectBtn');
                 redirectTextEl.textContent = (editorTranslations.redirect_confirmMessage || 'Redirect to:\n%s').replace('%s', link);
                 confirmBtn.textContent = editorTranslations.redirect_confirm || 'Go';
                 modals.redirect.querySelector('#cancelRedirectBtn').textContent = editorTranslations.redirect_cancel || 'Cancel';
                 
                 confirmBtn.onclick = () => { window.open(link, '_blank'); modals.redirect.style.display = 'none'; };
                 modals.redirect.style.display = 'flex';
             } else {
                 window.open(link, '_blank');
             }
        }
    });

    document.getElementById('editorLanguageSwitcher').addEventListener('click', e => {
        e.preventDefault();
        const langLink = e.target.closest('a');
        if(langLink && langLink.dataset.lang) setEditorLanguage(langLink.dataset.lang);
    });
    
    document.getElementById('localStorageToggle').addEventListener('change', (e) => {
        localStorage.setItem('autosaveEnabled', e.target.checked);
        if(e.target.checked) saveData();
    });
    
    document.getElementById('editGlobalTitlesBtn').addEventListener('click', openGlobalTitlesModal);
    document.getElementById('editColorsBtn').addEventListener('click', openColorsModal);
    document.getElementById('editTextBtn').addEventListener('click', openTextModal);

    document.getElementById('saveColorsBtn').addEventListener('click', saveColorsFromModal);
    document.getElementById('saveTextBtn').addEventListener('click', () => saveTextFromModal(true));
    
    if (modals.colors) {
        modals.colors.addEventListener('input', () => {
            for (const key in configData.colors) {
                const input = document.getElementById(key);
                if (input) configData.colors[key] = input.value;
            }
            applyStylesFromConfig();
            saveData();
        });
    }

    if (modals.text) {
        modals.text.addEventListener('input', () => {
            saveTextFromModal(false);
        });
        
        modals.text.addEventListener('click', e => {
            const button = e.target;
            if (button.tagName !== 'BUTTON' || (button.textContent !== '+' && button.textContent !== '-')) return;

            const input = button.parentElement.querySelector('input[type="number"]');
            if (!input) return;
            
            let value = parseInt(input.value, 10);
            const step = parseInt(input.step) || 1;
            
            if (button.textContent === '+') value += step;
            else if (button.textContent === '-') value -= step;

            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }

    // Listener generico per chiudere i modali
    document.body.addEventListener('click', e => {
        if (e.target.id.startsWith('close')) {
            const modal = e.target.closest('.fixed');
            if (modal) modal.style.display = 'none';
        }
    });

    if(modals.redirect) {
        modals.redirect.querySelector('#cancelRedirectBtn').addEventListener('click', () => modals.redirect.style.display = 'none');
    }

    document.getElementById('saveModalBtn').addEventListener('click', () => {
        if (currentStepIndex === null) return;
        const step = configData.steps[currentStepIndex];
        document.querySelectorAll('#editModal-fields [data-lang]').forEach(input => {
            step[input.dataset.field][input.dataset.lang] = input.value;
        });
        step.image = document.getElementById('modalImage').value;
        step.link = document.getElementById('modalLink').value;
        step.linkConfirm = document.getElementById('modalLinkConfirm').checked;
        
        modals.edit.style.display = 'none';
        renderTable();
        saveData();
    });
    
    document.getElementById('saveGlobalTitlesBtn').addEventListener('click', () => {
        saveGlobalTitlesFromModal();
        if (modals.globalTitles) modals.globalTitles.style.display = 'none';
    });
    
    if (modals.globalTitles) {
        modals.globalTitles.addEventListener('input', saveGlobalTitlesFromModal);
    }
    
    document.getElementById('languageConfigurator').addEventListener('change', (e) => {
        const target = e.target;
        const lang = target.dataset.lang;
        if (!lang || !target.classList.contains('lang-visible-toggle') && !target.classList.contains('lang-export-toggle')) return;

        if (target.classList.contains('lang-visible-toggle')) {
            configData.languages[lang].editorVisible = target.checked;
        } else if (target.classList.contains('lang-export-toggle')) {
            configData.languages[lang].exportEnabled = target.checked;
        }
        saveData();
    });
};

// =================================================================================
// --- INIZIALIZZAZIONE ---
// =================================================================================

const init = () => {
    loadData();
    populateFontSelectors(); 
    addEventListeners();
    setEditorLanguage('en');
};

init();