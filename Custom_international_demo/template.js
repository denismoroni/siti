// =================================================================================
// FILE: template.js - Il Modello
// Contiene la funzione per generare l'HTML finale del progetto esportato.
// =================================================================================

const generateFinalHtml = (enabledLangs) => {
    const defaultLang = enabledLangs.includes('en') ? 'en' : enabledLangs[0];
    
    let langSwitcherHtml = enabledLangs.map(code => {
        const lang = SUPPORTED_LANGUAGES[code];
        return `<a href="#" data-lang="${code}" title="${lang.name}" class="lang-switch-btn">${lang.flag} <span class="lang-switch-name" data-i18n-key="lang_${code}">${lang.name}</span></a>`;
    }).join('\n            ');

    const { colors, text } = configData;
    const dynamicStyles = `
        body { background-color: ${colors.modalBodyBgColor}; font-family: ${text.descriptionFont}; }
        .content-wrapper { background-color: ${colors.modalContainerBgColor}; }
        h1 { color: ${colors.modalMainHeadingColor}; font-family: ${text.headingFont}; font-size: ${text.mainHeadingSize}px; font-weight: ${text.headingBold ? 'bold' : 'normal'}; font-style: ${text.headingItalic ? 'italic' : 'normal'}; text-align: ${text.titleAlignment}; }
        th { color: ${colors.modalTableHeadingColor}; font-family: ${text.headingFont}; font-size: ${text.tableHeadingSize}px; font-weight: ${text.headingBold ? 'bold' : 'normal'}; font-style: ${text.headingItalic ? 'italic' : 'normal'}; text-align: ${text.titleAlignment}; }
        table { background-color: ${colors.modalTableBgColor}; }
        .image-title { color: ${colors.modalSectionTitleColor}; font-family: ${text.headingFont}; font-size: ${text.sectionTitleSize}px; text-align: ${text.titleAlignment}; font-weight: ${text.headingBold ? 'bold' : 'normal'}; font-style: ${text.headingItalic ? 'italic' : 'normal'}; }
        .step-description { color: ${colors.modalDescriptionColor}; font-size: ${text.descriptionSize}px; text-align: ${text.descriptionAlignment}; font-weight: ${text.descriptionBold ? 'bold' : 'normal'}; font-style: ${text.descriptionItalic ? 'italic' : 'normal'};}
        img { display: block; margin: ${text.imageAlignment === 'center' ? 'auto' : '0'}; margin-left: ${text.imageAlignment === 'left' ? '0' : 'auto'}; margin-right: ${text.imageAlignment === 'right' ? '0' : 'auto'};}
        tr[data-link] { cursor: pointer; }
        tr[data-link]:hover { background-color: rgba(0,0,0,0.1); }
    `;

    return `<!DOCTYPE html>
<html lang="${defaultLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n-key="globalTitle">Page Title</title>
    <style>
        body { font-family: sans-serif; margin: 0; }
        .content-wrapper { max-width: 800px; margin: auto; padding: 20px; }
        img { max-width: 100%; height: auto; border-radius: 1rem; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 1rem; text-align: center; }
        .image-title { font-weight: bold; font-size: 1.5em; margin-bottom: 0.5rem; }
        #lang-switcher { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; padding: 1rem; background-color: #f0f0f0; }
        .lang-switch-btn { text-decoration: none; color: black; font-size: 1.2rem; }
        .modal-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); display: none; justify-content: center; align-items: center; z-index: 100; }
        .modal-content { background: white; padding: 2rem; border-radius: 8px; text-align: center; max-width: 90%; color: black; }
        ${dynamicStyles}
    </style>
</head>
<body>
    <div id="lang-switcher">${langSwitcherHtml}</div>
    <div class="content-wrapper">
        <h1 data-i18n-key="globalHeading"></h1>
        <table>
            <thead><tr><th data-i18n-key="globalTableHeading"></th></tr></thead>
            <tbody>
                ${configData.steps.map((step, index) => `
                    <tr ${step.link ? `data-link="${step.link}" data-link-confirm="${step.linkConfirm !== false}"` : ''}>
                        <td>
                            <div class="image-title" data-i18n-key="step_${index}_title"></div>
                            ${step.image ? `<img src="IMG/${step.image}" alt="">` : ''}
                            <div class="step-description" data-i18n-key="step_${index}_description"></div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    <div id="redirectModal" class="modal-overlay">
        <div class="modal-content">
            <p id="redirectText" style="white-space: pre-wrap; margin-bottom: 1rem;"></p>
            <div>
                <button id="confirmRedirectBtn" style="margin-right: 1rem; padding: 0.5rem 1rem; border: none; border-radius: 5px; background-color: #2563eb; color: white; cursor: pointer;"></button>
                <button id="cancelRedirectBtn" style="padding: 0.5rem 1rem; border: none; border-radius: 5px; background-color: #dc2626; color: white; cursor: pointer;"></button>
            </div>
        </div>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            let translations = {};
            const defaultLang = '${defaultLang}';
            const redirectModal = document.getElementById('redirectModal');
            let currentLink = '';

            const applyTranslations = () => {
                document.querySelectorAll('[data-i18n-key]').forEach(el => {
                    const key = el.dataset.i18nKey;
                    if (translations[key] !== undefined) el.textContent = translations[key];
                });
                document.querySelectorAll('.lang-switch-name').forEach(span => {
                     const key = span.dataset.i18nKey;
                     if(translations.lang_names && translations.lang_names[key]) {
                        span.textContent = translations.lang_names[key];
                     }
                });
                document.getElementById('confirmRedirectBtn').textContent = translations.redirect_confirm || 'Continue';
                document.getElementById('cancelRedirectBtn').textContent = translations.redirect_cancel || 'Cancel';
            };

            const switchLanguage = async (lang) => {
                try {
                    const response = await fetch(\`locales/\${lang}.json\`);
                    translations = await response.json();
                    document.documentElement.lang = lang;
                    applyTranslations();
                } catch (e) { console.error('Failed to load language: ' + lang, e); }
            };

            document.getElementById('lang-switcher').addEventListener('click', e => {
                e.preventDefault();
                const target = e.target.closest('.lang-switch-btn');
                if (target && target.dataset.lang) switchLanguage(target.dataset.lang);
            });

            document.querySelector('table tbody').addEventListener('click', e => {
                const row = e.target.closest('tr[data-link]');
                if (!row) return;
                
                const link = row.dataset.link;
                const confirm = row.dataset.linkConfirm === 'true';

                if (confirm) {
                    currentLink = link;
                    document.getElementById('redirectText').textContent = (translations.redirect_confirmMessage || '').replace('%s', link);
                    redirectModal.style.display = 'flex';
                } else {
                    window.open(link, '_blank');
                }
            });
            
            document.getElementById('confirmRedirectBtn').addEventListener('click', () => {
                if (currentLink) window.open(currentLink, '_blank');
                redirectModal.style.display = 'none';
            });
            document.getElementById('cancelRedirectBtn').addEventListener('click', () => {
                redirectModal.style.display = 'none';
            });
            redirectModal.addEventListener('click', (e) => { if(e.target === redirectModal) redirectModal.style.display = 'none'; });

            switchLanguage(defaultLang);
        });
    <\/script>
</body>
</html>`;
};