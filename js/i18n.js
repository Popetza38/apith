/**
 * DramaBox Internationalization (i18n)
 * Thai and English translations
 */

const translations = {
    th: {
        // Navigation
        'nav.home': 'หน้าแรก',
        'nav.latest': 'ล่าสุด',
        'nav.popular': 'ยอดนิยม',
        'nav.dubbed': 'พากย์ไทย',
        'nav.search': 'ค้นหาซีรีส์...',
        
        // Home
        'home.forYou': 'สำหรับคุณ',
        'home.forYouDesc': 'ซีรีส์ที่เลือกมาเฉพาะสำหรับคุณ ค้นพบเรื่องราวที่น่าสนใจ!',
        'home.trending': 'กำลังเป็นที่นิยม',
        'home.trendingDesc': 'ซีรีส์ที่ได้รับความนิยมมากที่สุด',
        'home.latest': 'ล่าสุด',
        'home.latestDesc': 'ซีรีส์ที่เพิ่งเปิดตัวใหม่ อย่าพลาด!',
        
        // Detail
        'detail.episodes': 'ตอน',
        'detail.episode': 'ตอนที่',
        'detail.synopsis': 'เรื่องย่อ',
        'detail.watchNow': 'รับชมตอนนี้',
        'detail.views': 'ผู้ชม',
        'detail.episodeList': 'รายการตอน',
        
        // Watch
        'watch.prevEp': 'ตอนก่อนหน้า',
        'watch.nextEp': 'ตอนถัดไป',
        'watch.episodes': 'เลือกตอน',
        
        // Search
        'search.title': 'ค้นหาซีรีส์',
        'search.placeholder': 'พิมพ์ชื่อซีรีส์...',
        'search.results': 'ผลลัพธ์',
        'search.noResults': 'ไม่พบซีรีส์ที่คุณต้องการ',
        
        // Common
        'common.loading': 'กำลังโหลด...',
        'common.error': 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง',
        'common.noData': 'ไม่พบข้อมูล',
        
        // Footer
        'footer.rights': 'สงวนลิขสิทธิ์',
        'footer.about': 'เกี่ยวกับ',
        'footer.privacy': 'นโยบายความเป็นส่วนตัว',
        'footer.terms': 'เงื่อนไขการใช้งาน'
    },
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.latest': 'Latest',
        'nav.popular': 'Popular',
        'nav.dubbed': 'Dubbed',
        'nav.search': 'Search dramas...',
        
        // Home
        'home.forYou': 'For You',
        'home.forYouDesc': 'Dramas specially selected for you. Discover interesting stories!',
        'home.trending': 'Trending Now',
        'home.trendingDesc': 'Most popular dramas right now',
        'home.latest': 'Latest',
        'home.latestDesc': 'Newly released dramas. Don\'t miss out!',
        
        // Detail
        'detail.episodes': 'Ep',
        'detail.episode': 'Episode',
        'detail.synopsis': 'Synopsis',
        'detail.watchNow': 'Watch Now',
        'detail.views': 'views',
        'detail.episodeList': 'Episode List',
        
        // Watch
        'watch.prevEp': 'Previous',
        'watch.nextEp': 'Next',
        'watch.episodes': 'Episodes',
        
        // Search
        'search.title': 'Search Dramas',
        'search.placeholder': 'Type drama name...',
        'search.results': 'results',
        'search.noResults': 'No dramas found',
        
        // Common
        'common.loading': 'Loading...',
        'common.error': 'An error occurred. Please try again.',
        'common.noData': 'No data found',
        
        // Footer
        'footer.rights': 'All rights reserved',
        'footer.about': 'About',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms of Service'
    }
};

// Default language
let currentLanguage = localStorage.getItem('language') || 'th';

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @returns {string}
 */
function t(key) {
    return translations[currentLanguage]?.[key] || translations['th']?.[key] || key;
}

/**
 * Get current language
 * @returns {string}
 */
function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Set language
 * @param {string} lang - Language code ('th' or 'en')
 */
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        // Reload page to apply translations
        location.reload();
    }
}

/**
 * Initialize language selector
 */
function initLanguageSelector() {
    const selector = document.getElementById('lang-select');
    if (selector) {
        selector.value = currentLanguage;
        selector.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
}

/**
 * Apply translations to elements with data-i18n attribute
 */
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT') {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });
}

// Export
window.i18n = {
    t,
    getCurrentLanguage,
    setLanguage,
    initLanguageSelector,
    applyTranslations
};

// Also expose t globally for convenience
window.t = t;
