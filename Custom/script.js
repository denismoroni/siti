document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#installationTable tbody');
    const addStepBtn = document.getElementById('addStepBtn');
    const localStorageToggle = document.getElementById('localStorageToggle');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const importJsonBtn = document.getElementById('importJsonBtn');
    const exportHtmlBtn = document.getElementById('exportHtmlBtn');
    const clearLocalStorageBtn = document.getElementById('clearLocalStorageBtn');

    // Elementi e modale per i titoli globali
    const editGlobalTitlesBtn = document.getElementById('editGlobalTitlesBtn');
    const editGlobalTitlesModal = document.getElementById('editGlobalTitlesModal');
    const modalGlobalTitle = document.getElementById('modalGlobalTitle');
    const modalGlobalHeading = document.getElementById('modalGlobalHeading');
    const modalGlobalTableHeading = document.getElementById('modalGlobalTableHeading');
    const saveGlobalTitlesBtn = document.getElementById('saveGlobalTitlesBtn');
    const closeGlobalTitlesBtn = document.getElementById('closeGlobalTitlesBtn');

    // Elementi e modale per i colori
    const editColorsBtn = document.getElementById('editColorsBtn');
    const editColorsModal = document.getElementById('editColorsModal');
    const colorsModalContent = document.getElementById('colorsModalContent');
    const colorsModalHeader = document.getElementById('colorsModalHeader');
    const colorsModalBody = document.getElementById('colorsModalBody');
    const colorsResizeHandles = {
        tl: document.getElementById('colorsResizeHandleTL'),
        tr: document.getElementById('colorsResizeHandleTR'),
        bl: document.getElementById('colorsResizeHandleBL'),
        br: document.getElementById('colorsResizeHandleBR')
    };
    const modalBodyBgColor = document.getElementById('modalBodyBgColor');
    const modalContainerBgColor = document.getElementById('modalContainerBgColor');
    const modalTableBgColor = document.getElementById('modalTableBgColor');
    const modalMainHeadingColor = document.getElementById('modalMainHeadingColor');
    const modalTableHeadingColor = document.getElementById('modalTableHeadingColor');
    const modalSectionTitleColor = document.getElementById('modalSectionTitleColor');
    const modalDescriptionColor = document.getElementById('modalDescriptionColor');
    const saveColorsBtn = document.getElementById('saveColorsBtn');
    const closeColorsBtn = document.getElementById('closeColorsBtn');

    // Elementi e modale per il testo
    const editTextBtn = document.getElementById('editTextBtn');
    const editTextModal = document.getElementById('editTextModal');
    const textModalContent = document.getElementById('textModalContent');
    const textModalHeader = document.getElementById('textModalHeader');
    const textModalBody = document.getElementById('textModalBody');
    const textResizeHandles = {
        tl: document.getElementById('textResizeHandleTL'),
        tr: document.getElementById('textResizeHandleTR'),
        bl: document.getElementById('textResizeHandleBL'),
        br: document.getElementById('textResizeHandleBR')
    };
    const headingFontSelect = document.getElementById('headingFont');
    const descriptionFontSelect = document.getElementById('descriptionFont');
    const mainHeadingSizeInput = document.getElementById('mainHeadingSize');
    const tableHeadingSizeInput = document.getElementById('tableHeadingSize');
    const sectionTitleSizeInput = document.getElementById('sectionTitleSize');
    const descriptionSizeInput = document.getElementById('descriptionSize');
    const decreaseMainHeadingSizeBtn = document.getElementById('decreaseMainHeadingSizeBtn');
    const increaseMainHeadingSizeBtn = document.getElementById('increaseMainHeadingSizeBtn');
    const decreaseTableHeadingSizeBtn = document.getElementById('decreaseTableHeadingSizeBtn');
    const increaseTableHeadingSizeBtn = document.getElementById('increaseTableHeadingSizeBtn');
    const decreaseSectionTitleSizeBtn = document.getElementById('decreaseSectionTitleSizeBtn');
    const increaseSectionTitleSizeBtn = document.getElementById('increaseSectionTitleSizeBtn');
    const decreaseDescriptionSizeBtn = document.getElementById('decreaseDescriptionSizeBtn');
    const increaseDescriptionSizeBtn = document.getElementById('increaseDescriptionSizeBtn');
    const headingBoldCheckbox = document.getElementById('headingBold');
    const headingItalicCheckbox = document.getElementById('headingItalic');
    const descriptionBoldCheckbox = document.getElementById('descriptionBold');
    const descriptionItalicCheckbox = document.getElementById('descriptionItalic');
    // Nuovi elementi per l'allineamento
    const titleAlignmentSelect = document.getElementById('titleAlignment');
    const descriptionAlignmentSelect = document.getElementById('descriptionAlignment');
    const imageAlignmentSelect = document.getElementById('imageAlignment');

    const saveTextBtn = document.getElementById('saveTextBtn');
    const closeTextBtn = document.getElementById('closeTextBtn');

    // Elementi e modale per le sezioni
    const editModal = document.getElementById('editModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalImage = document.getElementById('modalImage');
    const modalLink = document.getElementById('modalLink');
    const saveModalBtn = document.getElementById('saveModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const redirectModal = document.getElementById('redirectModal');
    const redirectText = document.getElementById('redirectText');
    const confirmRedirectBtn = document.getElementById('confirmRedirectBtn');
    const cancelRedirectBtn = document.getElementById('cancelRedirectBtn');

    // Elementi di visualizzazione dei titoli e colori
    const pageTitle = document.querySelector('title');
    const mainHeading = document.querySelector('h1');
    const tableHeading = document.querySelector('th');
    const body = document.body;
    const container = document.querySelector('.container');
    const table = document.querySelector('#installationTable');

    const FONT_OPTIONS = [
        "Arial, sans-serif",
        "Verdana, sans-serif",
        "Helvetica, sans-serif",
        "Tahoma, sans-serif",
        "Trebuchet MS, sans-serif",
        "Times New Roman, serif",
        "Georgia, serif",
        "Garamond, serif",
        "Courier New, monospace",
        "Brush Script MT, cursive"
    ];

    let currentStepIndex = -1;
    let configData = {
        globalTitle: "Sito Personalizzato",
        globalHeading: "Sito Personalizzato",
        globalTableHeading: "Come usarlo",
        bodyBgColor: "#A3A3A3",
        containerBgColor: "#D3D3D3",
        tableBgColor: "#9CA963",
        mainHeadingColor: "#000000",
        tableHeadingColor: "#000000",
        sectionTitleColor: "#000000",
        descriptionColor: "#000000",
        modalWidth: "400px",
        modalHeight: "600px",
        headingFontFamily: "Arial, sans-serif",
        descriptionFontFamily: "Arial, sans-serif",
        mainHeadingSize: 40,
        tableHeadingSize: 40,
        sectionTitleSize: 40,
        descriptionSize: 20,
        headingBold: true,
        headingItalic: false,
        descriptionBold: false,
        descriptionItalic: false,
        titleAlignment: 'center',
        descriptionAlignment: 'center',
        imageAlignment: 'center',
        availableImages: [
            "",
            "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg",
            "1.png", "2.png", "3.png", "4.png", "5.png"
        ],
        steps: [
            {
                title: "I bottoni presenti in cima",
                description: "serviranno a farti personalizzare come vorresti la pagina",
                image: "1.jpg",
                link: ""
            },
            {
                title: "La sezione 'Parole' ",
                description: "ti permetterà di decidere le parole contenute nel tuo testo",
                image: "2.jpg",
                link: ""
            },
            {
                title: "La sezione 'Colori' ",
                description: "ti consentirà invece di decidere i colori del testo e degli sfondi",
                image: "3.jpg",
                link: ""
            },
			{
                title: "La sezione 'Metrica'",
                description: "regola font, grandezze, allineamenti e stile dei testi",
                image: "4.jpg",
                link: ""
            },
            {
                title: " Potrai modificare ogni sezione ",
                description: "per testo, immagini e link",
                image: "5b.jpg",
                link: ""
            },
			{
                title: " Esporta, importa o resetta ",
                description: "salva la tua configurazione, ricaricala o riparti da zero",
                image: "5.jpg",
                link: ""
            },
			{
                title: " dal tuo file esportato ",
                description: "potrò creare una nuova pagina ( mi dovrai passare le tue immagini )",
                image: "9.png",
                link: "https://denismoroni.github.io/siti/Custom/website.html"
            },
            {
                title: " Contattami su Whatsapp ",
                description: "cliccando qui - solo messaggi di testo perfavore.",
                image: "6.png",
                link: "https://wa.me/393496887076?text=Ciao.%20mi%20interessa%20il%20sito%20personalizzato"
            }
        ]
    };

    let originalColors = {};
    let originalText = {};

    const renderGlobalTitles = () => {
        pageTitle.textContent = configData.globalTitle;
        mainHeading.textContent = configData.globalHeading;
        tableHeading.textContent = configData.globalTableHeading;
    };
    
    const renderColors = (tempColors = null) => {
        const colors = tempColors || configData;
        body.style.backgroundColor = colors.bodyBgColor;
        container.style.backgroundColor = colors.containerBgColor;
        table.style.backgroundColor = colors.tableBgColor;
        mainHeading.style.color = colors.mainHeadingColor;
        tableHeading.style.color = colors.tableHeadingColor;
        document.querySelectorAll('.image-title').forEach(el => el.style.color = colors.sectionTitleColor);
        document.querySelectorAll('.step-description').forEach(el => el.style.color = colors.descriptionColor);
    };

    const renderText = (tempText = null) => {
        const text = tempText || configData;
        mainHeading.style.fontFamily = text.headingFontFamily;
        mainHeading.style.fontSize = `${text.mainHeadingSize}px`;
        mainHeading.style.fontWeight = text.headingBold ? 'bold' : 'normal';
        mainHeading.style.fontStyle = text.headingItalic ? 'italic' : 'normal';
        tableHeading.style.fontFamily = text.headingFontFamily;
        tableHeading.style.fontSize = `${text.tableHeadingSize}px`;
        tableHeading.style.fontWeight = text.headingBold ? 'bold' : 'normal';
        tableHeading.style.fontStyle = text.headingItalic ? 'italic' : 'normal';
        document.querySelectorAll('.image-title').forEach(el => {
            el.style.fontFamily = text.headingFontFamily;
            el.style.fontSize = `${text.sectionTitleSize}px`;
            el.style.fontWeight = text.headingBold ? 'bold' : 'normal';
            el.style.fontStyle = text.headingItalic ? 'italic' : 'normal';
            el.style.textAlign = text.titleAlignment;
        });
        document.querySelectorAll('.step-description').forEach(el => {
            el.style.fontFamily = text.descriptionFontFamily;
            el.style.fontSize = `${text.descriptionSize}px`;
            el.style.fontWeight = text.descriptionBold ? 'bold' : 'normal';
            el.style.fontStyle = text.descriptionItalic ? 'italic' : 'normal';
            el.style.textAlign = text.descriptionAlignment;
        });
        document.querySelectorAll('#installationTable img').forEach(el => {
            el.style.float = 'none';
            if (text.imageAlignment === 'left') {
                el.style.margin = '1rem auto 0 0';
            } else if (text.imageAlignment === 'right') {
                el.style.margin = '1rem 0 0 auto';
            } else {
                el.style.margin = '1rem auto 0 auto';
            }
        });
    };

    const renderTable = () => {
        tableBody.innerHTML = '';
        configData.steps.forEach((step, index) => {
            const tr = document.createElement('tr');
            tr.className = 'clickable-row';
            tr.setAttribute('data-link', step.link);
            tr.setAttribute('data-index', index);

            const imageHtml = step.image ? `<img src="IMG/${step.image}" alt="${step.title}">` : '';

            tr.innerHTML = `
                <td>
                    <div class="image-title">${step.title}</div>
                    <div class="step-description">${step.description}</div>
                    ${imageHtml}
                    <div class="edit-buttons">
                        <button class="edit-btn bg-blue-500 text-white rounded px-2 py-1" data-index="${index}">Modifica</button>
                        <button class="delete-btn bg-red-500 text-white rounded px-2 py-1" data-index="${index}">Elimina</button>
                        <button class="move-up-btn bg-gray-500 text-white rounded px-2 py-1" data-index="${index}" ${index === 0 ? 'disabled' : ''}>▲</button>
                        <button class="move-down-btn bg-gray-500 text-white rounded px-2 py-1" data-index="${index}" ${index === configData.steps.length - 1 ? 'disabled' : ''}>▼</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
        attachEventListeners();
        renderText();
    };

    const attachEventListeners = () => {
        document.querySelectorAll('.clickable-row').forEach(row => {
            row.onclick = (e) => {
                if (e.target.tagName.toLowerCase() !== 'button') {
                    const link = row.getAttribute('data-link');
                    if (link) {
                        redirectText.textContent = `Stai per essere reindirizzato a: ${link}`;
                        document.getElementById('redirectModal').style.display = 'block';
                        confirmRedirectBtn.onclick = () => {
                            window.open(link, '_blank');
                            document.getElementById('redirectModal').style.display = 'none';
                        };
                        cancelRedirectBtn.onclick = () => {
                            document.getElementById('redirectModal').style.display = 'none';
                        };
                    }
                }
            };
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.onclick = (e) => {
                e.stopPropagation();
                currentStepIndex = parseInt(e.target.getAttribute('data-index'));
                const step = configData.steps[currentStepIndex];
                modalTitle.value = step.title;
                modalDescription.value = step.description.replace(/<br>/g, '\n');
                populateImageSelect();
                modalImage.value = step.image;
                modalLink.value = step.link || '';
                editModal.style.display = 'block';
            };
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.onclick = (e) => {
                e.stopPropagation();
                const index = parseInt(e.target.getAttribute('data-index'));
                if (confirm('Sei sicuro di voler eliminare questo passaggio?')) {
                    configData.steps.splice(index, 1);
                    saveData();
                    renderTable();
                }
            };
        });

        document.querySelectorAll('.move-up-btn').forEach(button => {
            button.onclick = (e) => {
                e.stopPropagation();
                const index = parseInt(e.target.getAttribute('data-index'));
                if (index > 0) {
                    const [step] = configData.steps.splice(index, 1);
                    configData.steps.splice(index - 1, 0, step);
                    saveData();
                    renderTable();
                }
            };
        });

        document.querySelectorAll('.move-down-btn').forEach(button => {
            button.onclick = (e) => {
                e.stopPropagation();
                const index = parseInt(e.target.getAttribute('data-index'));
                if (index < configData.steps.length - 1) {
                    const [step] = configData.steps.splice(index, 1);
                    configData.steps.splice(index + 1, 0, step);
                    saveData();
                    renderTable();
                }
            };
        });
    };

    const populateImageSelect = () => {
        modalImage.innerHTML = '';
        const emptyOption = document.createElement('option');
        emptyOption.value = "";
        emptyOption.textContent = "Nessuna immagine";
        modalImage.appendChild(emptyOption);

        configData.availableImages.slice(1).forEach(img => {
            const option = document.createElement('option');
            option.value = img;
            option.textContent = img;
            modalImage.appendChild(option);
        });
    };

    const populateFontSelects = () => {
        headingFontSelect.innerHTML = '';
        descriptionFontSelect.innerHTML = '';

        FONT_OPTIONS.forEach(font => {
            const option1 = document.createElement('option');
            option1.value = font;
            option1.textContent = font.split(',')[0];
            headingFontSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = font;
            option2.textContent = font.split(',')[0];
            descriptionFontSelect.appendChild(option2);
        });
    };

    const saveData = () => {
        if (localStorageToggle.checked) {
            localStorage.setItem('installationConfig', JSON.stringify(configData));
        }
    };

    const loadData = () => {
        localStorageToggle.checked = true;
        const savedData = localStorage.getItem('installationConfig');
        if (savedData) {
            configData = JSON.parse(savedData);
        }
        renderGlobalTitles();
        renderColors();
        renderTable();
        renderText();
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (importedData.steps && importedData.availableImages) {
                    configData = importedData;
                    saveData();
                    renderGlobalTitles();
                    renderColors();
                    renderTable();
                    alert('Dati importati con successo!');
                } else {
                    alert('File JSON non valido. Assicurati che contenga i campi "steps" e "availableImages".');
                }
            } catch (error) {
                alert('Errore nella lettura del file JSON.');
                console.error(error);
            }
        };
        reader.readAsText(file);
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(configData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'config.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // SOLO se il pulsante esiste, aggiungi l'event listener!
    if (exportHtmlBtn) {
        exportHtmlBtn.addEventListener('click', () => {
            const stepsHtml = configData.steps.map(step => {
                let imageHtml = step.image ? `<img src="IMG/${step.image}" alt="${step.title}" style="display: block; margin: 1rem auto 0 auto; text-align: ${configData.imageAlignment};">` : '';
                if (step.image && (configData.imageAlignment === 'left' || configData.imageAlignment === 'right')) {
                    imageHtml = `<img src="IMG/${step.image}" alt="${step.title}" style="display: block; float: ${configData.imageAlignment}; margin-top: 1rem;">`
                }
                const linkHtml = step.link ? `onclick="window.open('${step.link}', '_blank');"` : '';
                return `
                    <tr ${linkHtml}>
                        <td>
                            <div style="font-family: ${configData.headingFontFamily}; font-size: ${configData.sectionTitleSize}px; color: ${configData.sectionTitleColor}; font-weight: ${configData.headingBold ? 'bold' : 'normal'}; font-style: ${configData.headingItalic ? 'italic' : 'normal'}; text-align: ${configData.titleAlignment};">${step.title}</div>
                            <div style="font-family: ${configData.descriptionFontFamily}; font-size: ${configData.descriptionSize}px; color: ${configData.descriptionColor}; font-weight: ${configData.descriptionBold ? 'bold' : 'normal'}; font-style: ${configData.descriptionItalic ? 'italic' : 'normal'}; text-align: ${configData.descriptionAlignment};">${step.description}</div>
                            ${imageHtml}
                        </td>
                    </tr>
                `;
            }).join('');
            const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${configData.globalTitle}</title>
    <style>
        body { background-color: ${configData.bodyBgColor}; padding: 1.5rem; }
        .container { background-color: ${configData.containerBgColor}; margin-left: auto; margin-right: auto; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
        h1 { text-align: center; margin-bottom: 2rem; }
        #installationTable { width: 100%; border-collapse: collapse; background-color: ${configData.tableBgColor}; }
        #installationTable th, #installationTable td { border: none solid black; padding: 1rem; }
        #installationTable th { text-align: center; }
        .clickable-row { cursor: pointer; }
        .image-title { margin-bottom: 0.5rem; }
        .step-description { margin-top: 0.5rem; }
        @media print {
            #installationTable th, #installationTable td { border: none !important; }
        }
    </style>
    <style>
        h1 {
            font-family: ${configData.headingFontFamily};
            font-size: ${configData.mainHeadingSize}px;
            font-weight: ${configData.headingBold ? 'bold' : 'normal'};
            font-style: ${configData.headingItalic ? 'italic' : 'normal'};
            color: ${configData.mainHeadingColor};
        }
        #installationTable th {
            font-family: ${configData.headingFontFamily};
            font-size: ${configData.tableHeadingSize}px;
            font-weight: ${configData.headingBold ? 'bold' : 'normal'};
            font-style: ${configData.headingItalic ? 'italic' : 'normal'};
            color: ${configData.tableHeadingColor};
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${configData.globalHeading}</h1>
        <table id="installationTable">
            <thead>
                <tr>
                    <th>${configData.globalTableHeading}</th>
                </tr>
            </thead>
            <tbody>
                ${stepsHtml}
            </tbody>
        </table>
    </div>
</body>
</html>
`;
            const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(finalHtml);
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', 'website.html');
            linkElement.click();
        });
    }

    addStepBtn.addEventListener('click', () => {
        const newStep = {
            title: "Nuovo Titolo",
            description: "Nuova descrizione",
            image: "",
            link: ""
        };
        configData.steps.push(newStep);
        saveData();
        renderTable();
    });

    localStorageToggle.addEventListener('change', () => {
        if (localStorageToggle.checked) {
            saveData();
        } else {
            localStorage.removeItem('installationConfig');
        }
    });

    exportJsonBtn.addEventListener('click', handleExport);

    importJsonBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.onchange = handleImport;
        fileInput.click();
    });

    clearLocalStorageBtn.addEventListener('click', () => {
        if (confirm('Sei sicuro di voler cancellare i dati salvati su Local Storage?')) {
            localStorage.removeItem('installationConfig');
            location.reload();
        }
    });

    closeModalBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });
    
    editGlobalTitlesBtn.addEventListener('click', () => {
        modalGlobalTitle.value = configData.globalTitle;
        modalGlobalHeading.value = configData.globalHeading;
        modalGlobalTableHeading.value = configData.globalTableHeading;
        editGlobalTitlesModal.style.display = 'block';
    });

    closeGlobalTitlesBtn.addEventListener('click', () => {
        editGlobalTitlesModal.style.display = 'none';
    });

    saveGlobalTitlesBtn.addEventListener('click', () => {
        configData.globalTitle = modalGlobalTitle.value;
        configData.globalHeading = modalGlobalHeading.value;
        configData.globalTableHeading = modalGlobalTableHeading.value;
        saveData();
        renderGlobalTitles();
        editGlobalTitlesModal.style.display = 'none';
    });

    // Logica generale per trascinamento e ridimensionamento
    const setupDraggableResizableModal = (modalContent, modalHeader, resizeHandles, minWidth, minHeight) => {
        let isDragging = false;
        let isResizing = false;
        let initialX, initialY, initialWidth, initialHeight;
        let currentLeft, currentTop;
        let resizeDirection = '';

        const dragStart = (e) => {
            e.preventDefault();
            isDragging = true;
            initialX = e.clientX;
            initialY = e.clientY;
            const style = window.getComputedStyle(modalContent);
            currentLeft = parseFloat(style.left);
            currentTop = parseFloat(style.top);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        };

        const drag = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - initialX;
            const dy = e.clientY - initialY;
            modalContent.style.left = `${currentLeft + dx}px`;
            modalContent.style.top = `${currentTop + dy}px`;
        };

        const dragEnd = () => {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
        };

        const resizeStart = (e) => {
            e.preventDefault();
            isResizing = true;
            resizeDirection = e.target.dataset.direction;
            initialX = e.clientX;
            initialY = e.clientY;
            initialWidth = modalContent.offsetWidth;
            initialHeight = modalContent.offsetHeight;
            const style = window.getComputedStyle(modalContent);
            currentLeft = parseFloat(style.left);
            currentTop = parseFloat(style.top);
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', resizeEnd);
        };

        const resize = (e) => {
            if (!isResizing) return;
            const dx = e.clientX - initialX;
            const dy = e.clientY - initialY;
            
            let newWidth = initialWidth;
            let newHeight = initialHeight;
            let newLeft = currentLeft;
            let newTop = currentTop;

            switch (resizeDirection) {
                case 'br':
                    newWidth = initialWidth + dx;
                    newHeight = initialHeight + dy;
                    break;
                case 'bl':
                    newWidth = initialWidth - dx;
                    newHeight = initialHeight + dy;
                    newLeft = currentLeft + dx;
                    break;
                case 'tr':
                    newWidth = initialWidth + dx;
                    newHeight = initialHeight - dy;
                    newTop = currentTop + dy;
                    break;
                case 'tl':
                    newWidth = initialWidth - dx;
                    newHeight = initialHeight - dy;
                    newLeft = currentLeft + dx;
                    newTop = currentTop + dy;
                    break;
            }

            modalContent.style.width = `${Math.max(newWidth, minWidth)}px`;
            modalContent.style.height = `${Math.max(newHeight, minHeight)}px`;
            modalContent.style.left = `${newLeft}px`;
            modalContent.style.top = `${newTop}px`;
        };

        const resizeEnd = () => {
            isResizing = false;
            configData.modalWidth = modalContent.style.width;
            configData.modalHeight = modalContent.style.height;
            saveData();
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', resizeEnd);
        };

        modalHeader.addEventListener('mousedown', dragStart);
        for (const handle in resizeHandles) {
            resizeHandles[handle].addEventListener('mousedown', resizeStart);
        }
    };

    setupDraggableResizableModal(colorsModalContent, colorsModalHeader, colorsResizeHandles, 300, 400);

    editColorsBtn.addEventListener('click', () => {
        originalColors = { ...configData };
        modalBodyBgColor.value = configData.bodyBgColor;
        modalContainerBgColor.value = configData.containerBgColor;
        modalTableBgColor.value = configData.tableBgColor;
        modalMainHeadingColor.value = configData.mainHeadingColor;
        modalTableHeadingColor.value = configData.tableHeadingColor;
        modalSectionTitleColor.value = configData.sectionTitleColor;
        modalDescriptionColor.value = configData.descriptionColor;
        colorsModalContent.style.width = configData.modalWidth;
        colorsModalContent.style.height = configData.modalHeight;
        editColorsModal.style.display = 'block';
    });

    closeColorsBtn.addEventListener('click', () => {
        renderColors(originalColors);
        editColorsModal.style.display = 'none';
    });

    saveColorsBtn.addEventListener('click', () => {
        configData.bodyBgColor = modalBodyBgColor.value;
        configData.containerBgColor = modalContainerBgColor.value;
        configData.tableBgColor = modalTableBgColor.value;
        configData.mainHeadingColor = modalMainHeadingColor.value;
        configData.tableHeadingColor = modalTableHeadingColor.value;
        configData.sectionTitleColor = modalSectionTitleColor.value;
        configData.descriptionColor = modalDescriptionColor.value;
        saveData();
        renderColors();
        editColorsModal.style.display = 'none';
    });

    modalBodyBgColor.addEventListener('input', () => renderColors({ ...configData, bodyBgColor: modalBodyBgColor.value }));
    modalContainerBgColor.addEventListener('input', () => renderColors({ ...configData, containerBgColor: modalContainerBgColor.value }));
    modalTableBgColor.addEventListener('input', () => renderColors({ ...configData, tableBgColor: modalTableBgColor.value }));
    modalMainHeadingColor.addEventListener('input', () => renderColors({ ...configData, mainHeadingColor: modalMainHeadingColor.value }));
    modalTableHeadingColor.addEventListener('input', () => renderColors({ ...configData, tableHeadingColor: modalTableHeadingColor.value }));
    modalSectionTitleColor.addEventListener('input', () => renderColors({ ...configData, sectionTitleColor: modalSectionTitleColor.value }));
    modalDescriptionColor.addEventListener('input', () => renderColors({ ...configData, descriptionColor: modalDescriptionColor.value }));

    setupDraggableResizableModal(textModalContent, textModalHeader, textResizeHandles, 350, 400);

    editTextBtn.addEventListener('click', () => {
        originalText = { ...configData };
        populateFontSelects();
        headingFontSelect.value = configData.headingFontFamily;
        descriptionFontSelect.value = configData.descriptionFontFamily;
        mainHeadingSizeInput.value = configData.mainHeadingSize;
        tableHeadingSizeInput.value = configData.tableHeadingSize;
        sectionTitleSizeInput.value = configData.sectionTitleSize;
        descriptionSizeInput.value = configData.descriptionSize;
        headingBoldCheckbox.checked = configData.headingBold;
        headingItalicCheckbox.checked = configData.headingItalic;
        descriptionBoldCheckbox.checked = configData.descriptionBold;
        descriptionItalicCheckbox.checked = configData.descriptionItalic;
        titleAlignmentSelect.value = configData.titleAlignment;
        descriptionAlignmentSelect.value = configData.descriptionAlignment;
        imageAlignmentSelect.value = configData.imageAlignment;
        editTextModal.style.display = 'block';
    });

    closeTextBtn.addEventListener('click', () => {
        renderText(originalText);
        editTextModal.style.display = 'none';
    });

    saveTextBtn.addEventListener('click', () => {
        configData.headingFontFamily = headingFontSelect.value;
        configData.descriptionFontFamily = descriptionFontSelect.value;
        configData.mainHeadingSize = parseInt(mainHeadingSizeInput.value);
        configData.tableHeadingSize = parseInt(tableHeadingSizeInput.value);
        configData.sectionTitleSize = parseInt(sectionTitleSizeInput.value);
        configData.descriptionSize = parseInt(descriptionSizeInput.value);
        configData.headingBold = headingBoldCheckbox.checked;
        configData.headingItalic = headingItalicCheckbox.checked;
        configData.descriptionBold = descriptionBoldCheckbox.checked;
        configData.descriptionItalic = descriptionItalicCheckbox.checked;
        configData.titleAlignment = titleAlignmentSelect.value;
        configData.descriptionAlignment = descriptionAlignmentSelect.value;
        configData.imageAlignment = imageAlignmentSelect.value;
        saveData();
        renderText();
        editTextModal.style.display = 'none';
    });
    
    decreaseMainHeadingSizeBtn.addEventListener('click', () => { mainHeadingSizeInput.value = Math.max(parseInt(mainHeadingSizeInput.value) - 1, 8); renderText({ ...configData, mainHeadingSize: parseInt(mainHeadingSizeInput.value) }); });
    increaseMainHeadingSizeBtn.addEventListener('click', () => { mainHeadingSizeInput.value = Math.min(parseInt(mainHeadingSizeInput.value) + 1, 72); renderText({ ...configData, mainHeadingSize: parseInt(mainHeadingSizeInput.value) }); });
    decreaseTableHeadingSizeBtn.addEventListener('click', () => { tableHeadingSizeInput.value = Math.max(parseInt(tableHeadingSizeInput.value) - 1, 8); renderText({ ...configData, tableHeadingSize: parseInt(tableHeadingSizeInput.value) }); });
    increaseTableHeadingSizeBtn.addEventListener('click', () => { tableHeadingSizeInput.value = Math.min(parseInt(tableHeadingSizeInput.value) + 1, 72); renderText({ ...configData, tableHeadingSize: parseInt(tableHeadingSizeInput.value) }); });
    decreaseSectionTitleSizeBtn.addEventListener('click', () => { sectionTitleSizeInput.value = Math.max(parseInt(sectionTitleSizeInput.value) - 1, 8); renderText({ ...configData, sectionTitleSize: parseInt(sectionTitleSizeInput.value) }); });
    increaseSectionTitleSizeBtn.addEventListener('click', () => { sectionTitleSizeInput.value = Math.min(parseInt(sectionTitleSizeInput.value) + 1, 72); renderText({ ...configData, sectionTitleSize: parseInt(sectionTitleSizeInput.value) }); });
    decreaseDescriptionSizeBtn.addEventListener('click', () => { descriptionSizeInput.value = Math.max(parseInt(descriptionSizeInput.value) - 1, 8); renderText({ ...configData, descriptionSize: parseInt(descriptionSizeInput.value) }); });
    increaseDescriptionSizeBtn.addEventListener('click', () => { descriptionSizeInput.value = Math.min(parseInt(descriptionSizeInput.value) + 1, 72); renderText({ ...configData, descriptionSize: parseInt(descriptionSizeInput.value) }); });

    headingFontSelect.addEventListener('change', () => renderText({ ...configData, headingFontFamily: headingFontSelect.value }));
    descriptionFontSelect.addEventListener('change', () => renderText({ ...configData, descriptionFontFamily: descriptionFontSelect.value }));
    mainHeadingSizeInput.addEventListener('input', () => renderText({ ...configData, mainHeadingSize: parseInt(mainHeadingSizeInput.value) }));
    tableHeadingSizeInput.addEventListener('input', () => renderText({ ...configData, tableHeadingSize: parseInt(tableHeadingSizeInput.value) }));
    sectionTitleSizeInput.addEventListener('input', () => renderText({ ...configData, sectionTitleSize: parseInt(sectionTitleSizeInput.value) }));
    descriptionSizeInput.addEventListener('input', () => renderText({ ...configData, descriptionSize: parseInt(descriptionSizeInput.value) }));
    headingBoldCheckbox.addEventListener('change', () => renderText({ ...configData, headingBold: headingBoldCheckbox.checked }));
    headingItalicCheckbox.addEventListener('change', () => renderText({ ...configData, headingItalic: headingItalicCheckbox.checked }));
    descriptionBoldCheckbox.addEventListener('change', () => renderText({ ...configData, descriptionBold: descriptionBoldCheckbox.checked }));
    descriptionItalicCheckbox.addEventListener('change', () => renderText({ ...configData, descriptionItalic: descriptionItalicCheckbox.checked }));
    titleAlignmentSelect.addEventListener('change', () => renderText({ ...configData, titleAlignment: titleAlignmentSelect.value }));
    descriptionAlignmentSelect.addEventListener('change', () => renderText({ ...configData, descriptionAlignment: descriptionAlignmentSelect.value }));
    imageAlignmentSelect.addEventListener('change', () => renderText({ ...configData, imageAlignment: imageAlignmentSelect.value }));

    saveModalBtn.addEventListener('click', () => {
        if (currentStepIndex > -1) {
            configData.steps[currentStepIndex].title = modalTitle.value;
            configData.steps[currentStepIndex].description = modalDescription.value.replace(/\n/g, '<br>');
            configData.steps[currentStepIndex].image = modalImage.value;
            configData.steps[currentStepIndex].link = modalLink.value;
            saveData();
            renderTable();
            renderColors();
            renderText();
            editModal.style.display = 'none';
        }
    });

    loadData();

});
