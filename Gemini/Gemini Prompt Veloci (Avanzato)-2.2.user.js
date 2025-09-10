// ==UserScript==
// @name         Gemini Prompt Veloci (Avanzato)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Aggiunge un menu a tendina con prompt personalizzati per Google Gemini, con gestione, localStorage e import/export.
// @author       Partner di programmazione
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// ==/UserScript==

(function() {
    'use strict';

    // --- COSTANTI E CONFIGURAZIONE ---
    const LOCALSTORAGE_KEY = 'geminiUserPrompts';
    const DEFAULT_PROMPTS = ["prendi il tempo che occorre per analizzare bene"];

    // --- STILE DEL MENU E DELLA FINESTRA MODALE (CSS) ---
    GM_addStyle(`
        /* Stili identici alla versione precedente... */
        #prompt-menu-container {
            position: fixed; top: 15px; left: 50%; transform: translateX(-50%);
            z-index: 9999; font-family: 'Google Sans', sans-serif; font-size: 14px;
        }
        #prompt-toggle-btn {
            background-color: #3c4043; color: white; padding: 8px 16px; border: none;
            border-radius: 8px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #prompt-toggle-btn:hover { background-color: #5f6368; }
        #prompt-dropdown-content {
            display: none; position: absolute; background-color: #202124;
            min-width: 300px; max-height: 400px; overflow-y: auto;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2); z-index: 1;
            border-radius: 8px; padding: 10px; margin-top: 5px; border: 1px solid #5f6368;
        }
        .prompt-item {
            padding: 8px 12px; color: #e8eaed; display: flex;
            justify-content: space-between; align-items: center; border-bottom: 1px solid #3c4043;
        }
        .prompt-item:last-child { border-bottom: none; }
        .prompt-text { flex-grow: 1; margin-right: 10px; }
        .insert-prompt-btn {
            background-color: #8ab4f8; color: #202124; border: none; padding: 5px 10px;
            cursor: pointer; border-radius: 4px; flex-shrink: 0;
        }
        .insert-prompt-btn:hover { opacity: 0.9; }
        #prompt-modal-overlay {
            display: none; position: fixed; z-index: 10000; left: 0; top: 0;
            width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6);
        }
        #prompt-modal-content {
            background-color: #2d2e30; margin: 10% auto; padding: 20px;
            border: 1px solid #888; width: 80%; max-width: 600px;
            border-radius: 12px; color: #e8eaed;
        }
        #prompt-modal-content h2 { margin-top: 0; }
        .prompt-modal-close {
            color: #aaa; float: right; font-size: 28px; font-weight: bold;
            cursor: pointer; line-height: 1;
        }
        .prompt-manage-item { display: flex; margin-bottom: 10px; }
        .prompt-manage-item input {
            flex-grow: 1; background: #3c4043; border: 1px solid #5f6368;
            color: white; padding: 8px; border-radius: 4px; margin-right: 10px;
        }
        .prompt-manage-item button {
             padding: 8px 12px; border-radius: 4px; border: none; cursor: pointer;
        }
        .delete-prompt-btn { background-color: #e57373; color: black; }
        .add-prompt-section, .json-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #5f6368; }
        .json-section button { margin-right: 10px; background-color: #5f6368; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; }
    `);

    // --- FUNZIONI DI GESTIONE DATI ---
    function getPrompts() {
        const prompts = localStorage.getItem(LOCALSTORAGE_KEY);
        try {
            const parsed = JSON.parse(prompts);
            return Array.isArray(parsed) ? parsed : DEFAULT_PROMPTS;
        } catch {
            return DEFAULT_PROMPTS;
        }
    }

    function savePrompts(promptsArray) {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(promptsArray));
        aggiornaDropdown();
    }

    // --- LOGICA DI CREAZIONE INTERFACCIA ---
    function creaInterfaccia() {
        const container = document.createElement('div');
        container.id = 'prompt-menu-container';
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'prompt-toggle-btn';
        toggleBtn.textContent = 'Prompt Veloci';
        container.appendChild(toggleBtn);
        const dropdownContent = document.createElement('div');
        dropdownContent.id = 'prompt-dropdown-content';
        container.appendChild(dropdownContent);
        document.body.appendChild(container);
        creaModaleGestione();
        toggleBtn.onclick = () => {
            const isHidden = dropdownContent.style.display === 'none' || dropdownContent.style.display === '';
            dropdownContent.style.display = isHidden ? 'block' : 'none';
        };
        aggiornaDropdown();
    }

    // *** INIZIO CODICE MODIFICATO ***
    function aggiornaDropdown() {
        const dropdownContent = document.getElementById('prompt-dropdown-content');
        if (!dropdownContent) return;

        // Metodo sicuro per svuotare il menu
        while (dropdownContent.firstChild) {
            dropdownContent.removeChild(dropdownContent.firstChild);
        }
        // *** FINE CODICE MODIFICATO ***

        const prompts = getPrompts();
        prompts.forEach(promptText => {
            const item = document.createElement('div');
            item.className = 'prompt-item';
            const textSpan = document.createElement('span');
            textSpan.className = 'prompt-text';
            textSpan.textContent = promptText;
            const insertBtn = document.createElement('button');
            insertBtn.className = 'insert-prompt-btn';
            insertBtn.textContent = 'inserisci';
            insertBtn.onclick = () => {
                const editor = document.querySelector('div.ql-editor > p');
                if (editor) {
                    const currentText = editor.textContent.trim();
                    editor.textContent = currentText ? `${currentText} ${promptText}` : promptText;
                    editor.focus();
                    document.getElementById('prompt-dropdown-content').style.display = 'none';
                }
            };
            item.appendChild(textSpan);
            item.appendChild(insertBtn);
            dropdownContent.appendChild(item);
        });
        const manageBtnItem = document.createElement('div');
        manageBtnItem.className = 'prompt-item';
        manageBtnItem.style.justifyContent = 'center';
        const manageBtn = document.createElement('button');
        manageBtn.textContent = 'Gestisci Prompt...';
        manageBtn.onclick = apriModale;
        manageBtnItem.appendChild(manageBtn);
        dropdownContent.appendChild(manageBtnItem);
    }

    function creaModaleGestione() {
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'prompt-modal-overlay';
        const modalContent = document.createElement('div');
        modalContent.id = 'prompt-modal-content';
        const closeButton = document.createElement('span');
        closeButton.className = 'prompt-modal-close';
        closeButton.textContent = '×';
        closeButton.onclick = chiudiModale;
        const title = document.createElement('h2');
        title.textContent = 'Gestione Prompt';
        const listContainer = document.createElement('div');
        listContainer.id = 'prompt-manage-list';
        const addSection = document.createElement('div');
        addSection.className = 'add-prompt-section';
        const addTitle = document.createElement('h3');
        addTitle.textContent = 'Aggiungi Nuovo Prompt';
        const addItemContainer = document.createElement('div');
        addItemContainer.className = 'prompt-manage-item';
        const addInput = document.createElement('input');
        addInput.type = 'text';
        addInput.id = 'new-prompt-input';
        addInput.placeholder = 'Scrivi qui il nuovo prompt...';
        const addButton = document.createElement('button');
        addButton.id = 'add-prompt-btn';
        addButton.className = 'insert-prompt-btn';
        addButton.textContent = 'Aggiungi';
        addButton.onclick = aggiungiPrompt;
        addItemContainer.appendChild(addInput);
        addItemContainer.appendChild(addButton);
        addSection.appendChild(addTitle);
        addSection.appendChild(addItemContainer);
        const jsonSection = document.createElement('div');
        jsonSection.className = 'json-section';
        const jsonTitle = document.createElement('h3');
        jsonTitle.textContent = 'Backup e Ripristino';
        const exportBtn = document.createElement('button');
        exportBtn.id = 'export-json-btn';
        exportBtn.textContent = 'Esporta JSON';
        exportBtn.onclick = esportaJSON;
        const importBtn = document.createElement('button');
        importBtn.id = 'import-json-btn';
        importBtn.textContent = 'Importa JSON';
        const importInput = document.createElement('input');
        importInput.type = 'file';
        importInput.id = 'import-json-input';
        importInput.accept = '.json';
        importInput.style.display = 'none';
        importBtn.onclick = () => importInput.click();
        importInput.onchange = importaJSON;
        jsonSection.appendChild(jsonTitle);
        jsonSection.appendChild(exportBtn);
        jsonSection.appendChild(importBtn);
        jsonSection.appendChild(importInput);
        modalContent.appendChild(closeButton);
        modalContent.appendChild(title);
        modalContent.appendChild(listContainer);
        modalContent.appendChild(addSection);
        modalContent.appendChild(jsonSection);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }

    // --- FUNZIONI DI GESTIONE DELLA MODALE ---
    function apriModale() {
        popolaListaGestione();
        document.getElementById('prompt-modal-overlay').style.display = 'block';
        document.getElementById('prompt-dropdown-content').style.display = 'none';
    }

    function chiudiModale() {
        document.getElementById('prompt-modal-overlay').style.display = 'none';
    }

    function popolaListaGestione() {
        const listContainer = document.getElementById('prompt-manage-list');
        // Metodo sicuro per svuotare la lista di gestione
        while (listContainer.firstChild) {
            listContainer.removeChild(listContainer.firstChild);
        }
        const prompts = getPrompts();
        prompts.forEach((promptText, index) => {
            const item = document.createElement('div');
            item.className = 'prompt-manage-item';
            const input = document.createElement('input');
            input.type = 'text';
            input.value = promptText;
            input.onblur = () => modificaPrompt(index, input.value);
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Elimina';
            deleteBtn.className = 'delete-prompt-btn';
            deleteBtn.onclick = () => eliminaPrompt(index);
            item.appendChild(input);
            item.appendChild(deleteBtn);
            listContainer.appendChild(item);
        });
    }

    function aggiungiPrompt() {
        const input = document.getElementById('new-prompt-input');
        const newPrompt = input.value.trim();
        if (newPrompt) {
            const prompts = getPrompts();
            prompts.push(newPrompt);
            savePrompts(prompts);
            input.value = '';
            popolaListaGestione();
        }
    }

    function modificaPrompt(index, newText) {
        const prompts = getPrompts();
        if (index >= 0 && index < prompts.length) {
            prompts[index] = newText.trim();
            savePrompts(prompts);
        }
    }

    function eliminaPrompt(index) {
        if (confirm('Sei sicuro di voler eliminare questo prompt?')) {
            const prompts = getPrompts();
            prompts.splice(index, 1);
            savePrompts(prompts);
            popolaListaGestione();
        }
    }

    // --- FUNZIONI DI IMPORT/EXPORT ---
    function esportaJSON() {
        const prompts = getPrompts();
        const jsonString = JSON.stringify(prompts, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gemini_prompts.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importaJSON(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedPrompts = JSON.parse(e.target.result);
                if (Array.isArray(importedPrompts) && importedPrompts.every(item => typeof item === 'string')) {
                    if (confirm('Questo sovrascriverà i tuoi prompt attuali. Continuare?')) {
                        savePrompts(importedPrompts);
                        popolaListaGestione();
                        alert('Prompt importati con successo!');
                    }
                } else {
                    alert('Errore: Il file JSON non è nel formato corretto (deve essere un array di stringhe).');
                }
            } catch (error) {
                alert('Errore nella lettura del file JSON.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    // --- AVVIO DELLO SCRIPT ---
    const checkPageLoad = setInterval(() => {
        if (document.querySelector('div.ql-editor > p')) {
            clearInterval(checkPageLoad);
            creaInterfaccia();
        }
    }, 500);
})();