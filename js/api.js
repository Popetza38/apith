/**
 * DramaBox API Service
 * Handles all API calls to the backend
 */

// Use CORS proxy for browser requests
const CORS_PROXY = 'https://corsproxy.io/?';
const API_BASE_RAW = 'https://api.megawe.net/api/dramabox';

/**
 * Fetch data from API
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<any>}
 */
async function fetchApi(endpoint, params = {}) {
    // Build the raw URL first
    let rawUrl = `${API_BASE_RAW}/${endpoint}`;
    
    // Add default language
    if (!params.lang) {
        params.lang = getCurrentLanguage();
    }
    
    // Build query string
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
        }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
        rawUrl += '?' + queryString;
    }
    
    // Wrap with CORS proxy
    const url = CORS_PROXY + encodeURIComponent(rawUrl);
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const result = await response.json();
        return result.data || result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Get For You dramas
 * @param {string} lang - Language code
 * @returns {Promise<Array>}
 */
async function getForYouDramas(lang) {
    return fetchApi('foryou', { lang });
}

/**
 * Get Trending dramas
 * @param {string} lang - Language code
 * @returns {Promise<Array>}
 */
async function getTrendingDramas(lang) {
    return fetchApi('trending', { lang });
}

/**
 * Get Latest dramas
 * @param {string} lang - Language code
 * @returns {Promise<Array>}
 */
async function getLatestDramas(lang) {
    return fetchApi('latest', { lang });
}

/**
 * Get drama details
 * @param {string} bookId - Drama ID
 * @param {string} lang - Language code
 * @returns {Promise<Object>}
 */
async function getDramaDetail(bookId, lang) {
    return fetchApi(`detail/${bookId}`, { lang });
}

/**
 * Get all episodes for a drama
 * @param {string} bookId - Drama ID
 * @param {string} lang - Language code
 * @returns {Promise<Array>}
 */
async function getEpisodes(bookId, lang) {
    return fetchApi(`allepisode/${bookId}`, { lang });
}

/**
 * Get video player URL
 * @param {string} bookId - Drama ID
 * @param {number} index - Episode index
 * @param {string} lang - Language code
 * @returns {Promise<Object>}
 */
async function getVideoPlayer(bookId, index, lang) {
    return fetchApi('player', { bookId, index, lang });
}

/**
 * Search dramas
 * @param {string} query - Search query
 * @param {string} lang - Language code
 * @returns {Promise<Array>}
 */
async function searchDramas(query, lang) {
    if (!query || query.trim().length === 0) {
        return [];
    }
    return fetchApi(`search`, { query: query.trim(), lang });
}

/**
 * Get dubbed dramas
 * @param {string} classify - 'latest' or 'popular'
 * @param {number} page - Page number
 * @param {string} lang - Language code
 * @returns {Promise<Array>}
 */
async function getDubbedDramas(classify = 'latest', page = 1, lang) {
    return fetchApi('dubbed', { classify, page, lang });
}

// Export for use in other modules
window.DramaAPI = {
    getForYouDramas,
    getTrendingDramas,
    getLatestDramas,
    getDramaDetail,
    getEpisodes,
    getVideoPlayer,
    searchDramas,
    getDubbedDramas
};
