/**
 * DramaBox UI Components
 * Reusable component rendering functions
 */

// SVG Icons
const Icons = {
    play: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    home: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    trending: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
};

/**
 * Create drama card HTML
 * @param {Object} drama - Drama data
 * @param {number} index - Card index for animation delay
 * @returns {string} HTML string
 */
function createDramaCard(drama, index = 0) {
    const coverUrl = drama.coverWap || drama.cover || '';
    const tags = drama.tags || drama.tagNames || [];
    const lang = getCurrentLanguage();
    
    return `
        <a href="detail.html?id=${drama.bookId}" class="drama-card" style="animation-delay: ${index * 50}ms">
            <div class="drama-card-image">
                <img src="${coverUrl}" alt="${drama.bookName}" loading="${index < 6 ? 'eager' : 'lazy'}">
                <div class="drama-card-overlay"></div>
                ${drama.corner ? `<div class="drama-card-badge" style="background-color: ${drama.corner.color}">${drama.corner.name}</div>` : ''}
                <div class="drama-card-episodes">
                    ${Icons.play}
                    <span>${drama.chapterCount || 0} ${t('detail.episodes')}</span>
                </div>
                <div class="drama-card-play">
                    <div class="play-button">${Icons.play}</div>
                </div>
            </div>
            <div class="drama-card-content">
                <h3 class="drama-card-title">${drama.bookName}</h3>
                ${drama.protagonist ? `<p class="drama-card-meta">${drama.protagonist}</p>` : ''}
                ${tags.length > 0 ? `
                    <div class="drama-card-tags">
                        ${tags.slice(0, 2).map(tag => `<span class="tag-pill">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </a>
    `;
}

/**
 * Create skeleton loading card
 * @param {number} count - Number of skeletons
 * @returns {string} HTML string
 */
function createSkeletonCards(count = 12) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="skeleton" style="animation-delay: ${i * 50}ms">
                <div class="skeleton-image"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text skeleton-text-sm"></div>
            </div>
        `;
    }
    return html;
}

/**
 * Create episode card HTML
 * @param {Object} episode - Episode data
 * @param {number} index - Episode index
 * @param {boolean} isActive - Whether this episode is currently playing
 * @returns {string} HTML string
 */
function createEpisodeCard(episode, index, isActive = false) {
    return `
        <div class="episode-card ${isActive ? 'active' : ''}" data-index="${index}">
            <div class="episode-number">${index + 1}</div>
            <div class="episode-title">${t('detail.episode')} ${index + 1}</div>
        </div>
    `;
}

/**
 * Render drama grid
 * @param {string} containerId - Container element ID
 * @param {Array} dramas - Array of drama data
 */
function renderDramaGrid(containerId, dramas) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!dramas || dramas.length === 0) {
        container.innerHTML = `<p class="no-results">${t('common.noData')}</p>`;
        return;
    }
    
    container.innerHTML = dramas
        .filter(drama => drama.bookId)
        .map((drama, index) => createDramaCard(drama, index))
        .join('');
}

/**
 * Show loading state in container
 * @param {string} containerId - Container element ID
 * @param {number} count - Number of skeleton items
 */
function showLoading(containerId, count = 12) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = createSkeletonCards(count);
}

/**
 * Show error message
 * @param {string} containerId - Container element ID
 * @param {string} message - Error message
 */
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">😔</div>
            <p>${message || t('common.error')}</p>
        </div>
    `;
}

/**
 * Show/hide global loading overlay
 * @param {boolean} show - Whether to show loading
 */
function toggleLoading(show) {
    let overlay = document.getElementById('loading-overlay');
    
    if (show) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = '<div class="loading-spinner"></div>';
            document.body.appendChild(overlay);
        }
        overlay.classList.remove('hidden');
    } else if (overlay) {
        overlay.classList.add('hidden');
    }
}

/**
 * Get URL parameter
 * @param {string} name - Parameter name
 * @returns {string|null}
 */
function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

/**
 * Format number with K/M suffix
 * @param {number} num - Number to format
 * @returns {string}
 */
function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export
window.Components = {
    Icons,
    createDramaCard,
    createSkeletonCards,
    createEpisodeCard,
    renderDramaGrid,
    showLoading,
    showError,
    toggleLoading,
    getUrlParam,
    formatNumber,
    debounce
};

// Also expose common utilities globally
window.getUrlParam = getUrlParam;
window.formatNumber = formatNumber;
window.debounce = debounce;
window.Icons = Icons;
