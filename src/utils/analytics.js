// Analytics utilities per tracciare eventi custom

/**
 * Invia un evento custom a Google Analytics
 * @param {string} eventName - Nome dell'evento
 * @param {Object} parameters - Parametri addizionali
 */
export const trackEvent = (eventName, parameters = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, parameters);
    }
};

/**
 * Traccia submit di un form
 * @param {string} formName - Nome del form (es: 'preventivo', 'contatto')
 */
export const trackFormSubmit = (formName) => {
    trackEvent('form_submit', {
        form_name: formName,
        page_location: window.location.href,
        page_path: window.location.pathname
    });
};

/**
 * Traccia click su numero di telefono
 * @param {string} phoneNumber - Numero cliccato (opzionale)
 */
export const trackPhoneClick = (phoneNumber = '') => {
    trackEvent('phone_click', {
        phone_number: phoneNumber,
        page_location: window.location.href
    });
};

/**
 * Traccia click su email
 * @param {string} email - Email cliccata (opzionale)
 */
export const trackEmailClick = (email = '') => {
    trackEvent('email_click', {
        email_address: email,
        page_location: window.location.href
    });
};

/**
 * Traccia click su CTA (Call To Action)
 * @param {string} ctaName - Nome del CTA
 * @param {string} ctaLocation - Posizione del CTA (es: 'hero', 'footer')
 */
export const trackCTAClick = (ctaName, ctaLocation = '') => {
    trackEvent('cta_click', {
        cta_name: ctaName,
        cta_location: ctaLocation,
        page_location: window.location.href
    });
};

/**
 * Traccia visualizzazione di un servizio
 * @param {string} serviceName - Nome del servizio
 */
export const trackServiceView = (serviceName) => {
    trackEvent('service_view', {
        service_name: serviceName,
        page_location: window.location.href
    });
};

/**
 * Traccia scroll profondità della pagina
 * @param {number} percentage - Percentuale di scroll (25, 50, 75, 100)
 */
export const trackScrollDepth = (percentage) => {
    trackEvent('scroll_depth', {
        scroll_percentage: percentage,
        page_location: window.location.href
    });
};

/**
 * Traccia tempo di permanenza sulla pagina
 * @param {number} seconds - Secondi di permanenza
 */
export const trackTimeOnPage = (seconds) => {
    trackEvent('time_on_page', {
        time_seconds: seconds,
        page_location: window.location.href
    });
};

/**
 * Traccia download di file
 * @param {string} fileName - Nome del file scaricato
 * @param {string} fileType - Tipo di file (pdf, jpg, etc)
 */
export const trackFileDownload = (fileName, fileType = '') => {
    trackEvent('file_download', {
        file_name: fileName,
        file_type: fileType,
        page_location: window.location.href
    });
};

/**
 * Traccia click su social media
 * @param {string} platform - Piattaforma social (facebook, instagram, etc)
 */
export const trackSocialClick = (platform) => {
    trackEvent('social_click', {
        platform: platform,
        page_location: window.location.href
    });
};

/**
 * Traccia errori JavaScript
 * @param {string} errorMessage - Messaggio di errore
 * @param {string} errorSource - Sorgente dell'errore
 */
export const trackError = (errorMessage, errorSource = '') => {
    trackEvent('javascript_error', {
        error_message: errorMessage,
        error_source: errorSource,
        page_location: window.location.href
    });
};

/**
 * Traccia ricerca sul sito (se implementata)
 * @param {string} searchTerm - Termine cercato
 */
export const trackSearch = (searchTerm) => {
    trackEvent('search', {
        search_term: searchTerm,
        page_location: window.location.href
    });
};

/**
 * Traccia visualizzazione video (se implementato)
 * @param {string} videoTitle - Titolo del video
 * @param {number} percentageWatched - Percentuale guardata
 */
export const trackVideoView = (videoTitle, percentageWatched = 0) => {
    trackEvent('video_view', {
        video_title: videoTitle,
        percentage_watched: percentageWatched,
        page_location: window.location.href
    });
};

// Setup automatico scroll tracking
export const setupScrollTracking = () => {
    if (typeof window === 'undefined') return;

    const scrollThresholds = [25, 50, 75, 100];
    const triggeredThresholds = new Set();

    const handleScroll = () => {
        const scrollPercentage = Math.round(
            ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
        );

        scrollThresholds.forEach((threshold) => {
            if (scrollPercentage >= threshold && !triggeredThresholds.has(threshold)) {
                trackScrollDepth(threshold);
                triggeredThresholds.add(threshold);
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
};

// Setup automatico time on page tracking
export const setupTimeOnPageTracking = () => {
    if (typeof window === 'undefined') return;

    const startTime = Date.now();
    const timeThresholds = [30, 60, 120, 300]; // 30s, 1min, 2min, 5min
    const triggeredThresholds = new Set();

    const interval = setInterval(() => {
        const secondsOnPage = Math.floor((Date.now() - startTime) / 1000);

        timeThresholds.forEach((threshold) => {
            if (secondsOnPage >= threshold && !triggeredThresholds.has(threshold)) {
                trackTimeOnPage(threshold);
                triggeredThresholds.add(threshold);
            }
        });
    }, 10000); // Check ogni 10 secondi

    // Cleanup
    return () => {
        clearInterval(interval);
    };
};

export default {
    trackEvent,
    trackFormSubmit,
    trackPhoneClick,
    trackEmailClick,
    trackCTAClick,
    trackServiceView,
    trackScrollDepth,
    trackTimeOnPage,
    trackFileDownload,
    trackSocialClick,
    trackError,
    trackSearch,
    trackVideoView,
    setupScrollTracking,
    setupTimeOnPageTracking
};
