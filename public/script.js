// Configuration
const API_BASE_URL = '/api';
let currentMangaId = null;
let currentChapterId = null;
let currentPages = [];
let currentPageIndex = 0;
let zoomLevel = 100;

// DOM Elements
const mangaGrid = document.getElementById('mangaGrid');
const readerModal = document.getElementById('readerModal');
const closeReader = document.getElementById('closeReader');
const readerContent = document.getElementById('readerContent');
const chapterSelect = document.getElementById('chapterSelect');
const pageSelect = document.getElementById('pageSelect');
const prevChapterBtn = document.getElementById('prevChapter');
const nextChapterBtn = document.getElementById('nextChapter');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomLevelSpan = document.getElementById('zoomLevel');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPopularManga();
    loadRecentUpdates();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    closeReader.addEventListener('click', () => {
        readerModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    readerModal.addEventListener('click', (e) => {
        if (e.target === readerModal) {
            readerModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    prevChapterBtn.addEventListener('click', loadPreviousChapter);
    nextChapterBtn.addEventListener('click', loadNextChapter);
    zoomInBtn.addEventListener('click', () => changeZoom(10));
    zoomOutBtn.addEventListener('click', () => changeZoom(-10));
    
    chapterSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            loadChapter(e.target.value);
        }
    });
    
    pageSelect.addEventListener('change', (e) => {
        goToPage(parseInt(e.target.value) - 1);
    });
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// API Functions
async function fetchPopularManga() {
    try {
        const response = await fetch(`${API_BASE_URL}/manga/popular`);
        if (!response.ok) throw new Error('Failed to fetch manga');
        return await response.json();
    } catch (error) {
        console.error('Error fetching popular manga:', error);
        showError('Failed to load manga. Please try again.');
        return [];
    }
}

async function fetchMangaChapters(mangaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/manga/${mangaId}/chapters`);
        if (!response.ok) throw new Error('Failed to fetch chapters');
        return await response.json();
    } catch (error) {
        console.error('Error fetching chapters:', error);
        return [];
    }
}

async function fetchChapterPages(chapterId) {
    try {
        const response = await fetch(`${API_BASE_URL}/chapter/${chapterId}/pages`);
        if (!response.ok) throw new Error('Failed to fetch pages');
        return await response.json();
    } catch (error) {
        console.error('Error fetching pages:', error);
        return [];
    }
}

async function searchManga(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        return await response.json();
    } catch (error) {
        console.error('Error searching manga:', error);
        return [];
    }
}

// UI Functions
async function loadPopularManga() {
    const mangaList = await fetchPopularManga();
    displayMangaGrid(mangaList);
}

async function loadRecentUpdates() {
    // For now, we'll use the same data
    // In a real app, you'd fetch recently updated manga
    const updatesGrid = document.getElementById('updatesGrid');
    updatesGrid.innerHTML = '<p>Recent updates will appear here</p>';
}

function displayMangaGrid(mangaList) {
    mangaGrid.innerHTML = '';
    
    if (mangaList.length === 0) {
        mangaGrid.innerHTML = '<p class="no-results">No manga found.</p>';
        return;
    }
    
    mangaList.forEach(manga => {
        const card = document.createElement('div');
        card.className = 'manga-card';
        card.innerHTML = `
            <img src="${manga.coverUrl || 'https://via.placeholder.com/200x280/667eea/ffffff?text=No+Cover'}" 
                 alt="${manga.title}" 
                 class="manga-cover"
                 onerror="this.src='https://via.placeholder.com/200x280/667eea/ffffff?text=No+Cover'">
            <div class="manga-info">
                <h3 class="manga-title">${manga.title}</h3>
                <div class="manga-meta">
                    <span>${manga.genres?.slice(0, 2).join(', ') || 'Manga'}</span>
                    <span>⭐ ${manga.rating || 'N/A'}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => openMangaReader(manga));
        mangaGrid.appendChild(card);
    });
}

async function openMangaReader(manga) {
    currentMangaId = manga.id;
    const readerTitle = document.getElementById('readerTitle');
    readerTitle.textContent = manga.title;
    
    // Load chapters
    const chapters = await fetchMangaChapters(manga.id);
    populateChapterSelect(chapters);
    
    // Open first chapter if available
    if (chapters.length > 0) {
        await loadChapter(chapters[0].id);
    }
    
    // Show reader
    readerModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function populateChapterSelect(chapters) {
    chapterSelect.innerHTML = '';
    chapters.forEach((chapter, index) => {
        const option = document.createElement('option');
        option.value = chapter.id;
        option.textContent = `Chapter ${chapter.chapterNumber || index + 1}: ${chapter.title || ''}`;
        chapterSelect.appendChild(option);
    });
}

async function loadChapter(chapterId) {
    currentChapterId = chapterId;
    currentPageIndex = 0;
    
    // Load pages for this chapter
    const pages = await fetchChapterPages(chapterId);
    currentPages = pages;
    
    if (pages.length > 0) {
        displayPage(currentPageIndex);
        populatePageSelect(pages.length);
        updatePageInfo();
    }
}

function displayPage(pageIndex) {
    if (pageIndex < 0 || pageIndex >= currentPages.length) return;
    
    const page = currentPages[pageIndex];
    readerContent.innerHTML = `
        <div class="page-container">
            <img src="${page.url}" 
                 alt="Page ${pageIndex + 1}" 
                 style="transform: scale(${zoomLevel / 100})"
                 onerror="this.src='https://via.placeholder.com/800x1200/333/666?text=Page+${pageIndex + 1}'">
        </div>
    `;
    
    currentPageIndex = pageIndex;
    pageSelect.value = pageIndex + 1;
    updatePageInfo();
}

function populatePageSelect(totalPages) {
    pageSelect.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Page ${i}`;
        pageSelect.appendChild(option);
    }
}

function updatePageInfo() {
    currentPageSpan.textContent = currentPageIndex + 1;
    totalPagesSpan.textContent = currentPages.length;
}

function goToPage(pageIndex) {
    if (pageIndex >= 0 && pageIndex < currentPages.length) {
        displayPage(pageIndex);
    }
}

async function loadPreviousChapter() {
    const currentIndex = Array.from(chapterSelect.options).findIndex(
        option => option.value === currentChapterId
    );
    
    if (currentIndex > 0) {
        const prevChapterId = chapterSelect.options[currentIndex - 1].value;
        chapterSelect.value = prevChapterId;
        await loadChapter(prevChapterId);
    }
}

async function loadNextChapter() {
    const currentIndex = Array.from(chapterSelect.options).findIndex(
        option => option.value === currentChapterId
    );
    
    if (currentIndex < chapterSelect.options.length - 1) {
        const nextChapterId = chapterSelect.options[currentIndex + 1].value;
        chapterSelect.value = nextChapterId;
        await loadChapter(nextChapterId);
    }
}

function changeZoom(delta) {
    zoomLevel = Math.max(50, Math.min(200, zoomLevel + delta));
    zoomLevelSpan.textContent = `${zoomLevel}%`;
    
    const img = readerContent.querySelector('img');
    if (img) {
        img.style.transform = `scale(${zoomLevel / 100})`;
    }
}

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    const results = await searchManga(query);
    displayMangaGrid(results);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (readerModal.style.display === 'block') {
        switch(e.key) {
            case 'ArrowLeft':
                if (currentPageIndex > 0) {
                    goToPage(currentPageIndex - 1);
                }
                break;
            case 'ArrowRight':
                if (currentPageIndex < currentPages.length - 1) {
                    goToPage(currentPageIndex + 1);
                }
                break;
            case 'Escape':
                readerModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                break;
        }
    }
}); 