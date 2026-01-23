// Sistema de internacionalización (i18n) para BÄLORA
(function() {
    'use strict';
    
    // Obtener idioma guardado o detectar del navegador
    function getInitialLanguage() {
        const saved = localStorage.getItem('balora-language');
        if (saved) return saved;
        
        // Detectar idioma del navegador
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('en')) return 'en';
        return 'es'; // Por defecto español
    }
    
    // Idioma actual
    let currentLang = getInitialLanguage();
    
    // Cambiar idioma
    function changeLanguage(lang) {
        if (!translations[lang]) {
            console.warn(`Idioma ${lang} no disponible`);
            return;
        }
        
        currentLang = lang;
        localStorage.setItem('balora-language', lang);
        
        // Cambiar atributo lang del HTML
        document.documentElement.lang = lang === 'en' ? 'en' : 'es-AR';
        
        // Actualizar meta tags
        updateMetaTags(lang);
        
        // Actualizar todos los textos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translations[lang][key];
            
            if (translation !== undefined) {
                // Si es un input, textarea o tiene atributo placeholder
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.type === 'submit' || element.type === 'button') {
                        element.value = translation;
                    } else {
                        element.placeholder = translation;
                    }
                } else if (element.hasAttribute('data-i18n-placeholder')) {
                    element.placeholder = translation;
                } else if (element.hasAttribute('data-i18n-title')) {
                    element.title = translation;
                } else if (element.hasAttribute('data-i18n-alt')) {
                    element.alt = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Actualizar botón de idioma
        updateLanguageButton(lang);
        
        // Actualizar Schema.org
        updateSchemaOrg(lang);
    }
    
    // Actualizar meta tags
    function updateMetaTags(lang) {
        const metaTitle = document.querySelector('title');
        const metaDescription = document.querySelector('meta[name="description"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        
        if (lang === 'en') {
            if (metaTitle) metaTitle.textContent = 'BÄLORA - Integral Aesthetic Medicine Clinic in Pilar';
            if (metaDescription) metaDescription.setAttribute('content', 'BÄLORA is an integral aesthetic medicine clinic in Pilar, Buenos Aires. Facial, body and hair treatments with advanced technology like Exilis Ultra 360. Professional medical care and natural results.');
            if (ogTitle) ogTitle.setAttribute('content', 'BÄLORA | Integral Aesthetic Medicine in Pilar, Buenos Aires.');
            if (ogDescription) ogDescription.setAttribute('content', 'Integral aesthetic medicine clinic in Pilar. Advanced technology, natural results and personalized medical care.');
            if (twitterTitle) twitterTitle.setAttribute('content', 'BÄLORA | Integral Aesthetic Medicine in Pilar');
            if (twitterDescription) twitterDescription.setAttribute('content', 'Integral aesthetic medicine clinic in Pilar. Advanced technology, natural results and personalized medical care.');
        } else {
            if (metaTitle) metaTitle.textContent = 'BÄLORA - Clínica de medicina estética integral en Pilar';
            if (metaDescription) metaDescription.setAttribute('content', 'BÄLORA es una clínica de medicina estética integral en Pilar, Buenos Aires. Tratamientos faciales, corporales y capilares con tecnología avanzada como Exilis Ultra 360. Atención médica profesional y resultados naturales.');
            if (ogTitle) ogTitle.setAttribute('content', 'BÄLORA | Medicina Estética Integral en Pilar , Buenos Aires.');
            if (ogDescription) ogDescription.setAttribute('content', 'Clínica de medicina estética integral en Pilar. Tecnología avanzada, resultados naturales y atención médica personalizada.');
            if (twitterTitle) twitterTitle.setAttribute('content', 'BÄLORA | Medicina Estética Integral en Pilar');
            if (twitterDescription) twitterDescription.setAttribute('content', 'Clínica de medicina estética integral en Pilar. Tecnología avanzada, resultados naturales y atención médica personalizada.');
        }
    }
    
    // Actualizar Schema.org
    function updateSchemaOrg(lang) {
        const schemaScript = document.querySelector('script[type="application/ld+json"]');
        if (!schemaScript) return;
        
        try {
            const schema = JSON.parse(schemaScript.textContent);
            
            if (lang === 'en') {
                schema.description = 'Integral aesthetic medicine clinic in Pilar, Buenos Aires. Facial, body and hair treatments with advanced technology like Exilis Ultra 360. Professional medical care and natural results.';
            } else {
                schema.description = 'Clínica de medicina estética integral en Pilar, Buenos Aires. Tratamientos faciales, corporales y capilares con tecnología avanzada como Exilis Ultra 360. Atención médica profesional y resultados naturales.';
            }
            
            schemaScript.textContent = JSON.stringify(schema, null, 2);
        } catch (e) {
            console.warn('Error actualizando Schema.org:', e);
        }
    }
    
    // Actualizar botón de idioma
    function updateLanguageButton(lang) {
        const langButton = document.getElementById('lang-toggle');
        const langFlag = document.getElementById('lang-flag');
        if (langButton && langFlag) {
            // Mostrar bandera del idioma AL QUE SE CAMBIARÁ (lógica invertida)
            if (lang === 'es') {
                // Si está en español, mostrar bandera de EEUU (para cambiar a inglés)
                langFlag.src = './imagenes/banderas/bandera-us.webp';
                langFlag.alt = 'Cambiar a Inglés';
                langButton.setAttribute('aria-label', 'Cambiar a Inglés');
            } else {
                // Si está en inglés, mostrar bandera de Argentina (para cambiar a español)
                langFlag.src = './imagenes/banderas/bandera-ar.webp';
                langFlag.alt = 'Switch to Spanish';
                langButton.setAttribute('aria-label', 'Switch to Spanish');
            }
        }
    }
    
    // Toggle idioma
    function toggleLanguage() {
        const newLang = currentLang === 'es' ? 'en' : 'es';
        changeLanguage(newLang);
    }
    
    // Inicializar cuando el DOM esté listo
    function init() {
        // Aplicar idioma inicial
        changeLanguage(currentLang);
        
        // Agregar event listener al botón
        const langButton = document.getElementById('lang-toggle');
        if (langButton) {
            langButton.addEventListener('click', toggleLanguage);
        }
    }
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Exponer función globalmente (opcional, para uso externo)
    window.changeLanguage = changeLanguage;
    window.getCurrentLanguage = () => currentLang;
    
})();
