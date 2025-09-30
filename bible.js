// Bible Module - Interactive Bible Reader
// Handles all Bible functionality including reading, search, notes, and favorites

class BibleReader {
    constructor() {
        this.currentLanguage = 'pt';
        this.currentBook = null;
        this.currentChapter = null;
        this.fontSize = 16;
        this.favorites = this.loadFromStorage('bibleFavorites') || [];
        this.notes = this.loadFromStorage('bibleNotes') || [];
        this.history = this.loadFromStorage('bibleHistory') || [];
        this.currentVerses = [];
        
        // Initialize API Service
        this.apiService = new BibleAPIService();
        this.isLoading = false;
    }

    // Initialize Bible Module
    init() {
        console.log('Initializing Bible Reader...');
        this.loadBibleBooksList();
        this.loadDailyVerse();
        this.renderFavorites();
        this.renderNotes();
        this.renderHistory();
        
        // Prefetch popular chapters in background
        setTimeout(() => {
            this.apiService.prefetchPopularChapters();
        }, 2000);
        
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.apiService.disableOfflineMode();
            this.showMessage('Conexão restaurada', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.apiService.enableOfflineMode();
            this.showMessage('Modo offline - usando cache local', 'info');
        });
    }

    // Load books list in sidebar
    loadBibleBooksList() {
        const container = document.getElementById('bibleBooksList');
        if (!container) return;

        const lang = this.currentLanguage;
        const oldTestament = bibleData.books[lang].old;
        const newTestament = bibleData.books[lang].new;

        let html = '<div class="testament-section">';
        html += `<h4>${lang === 'pt' ? 'Antigo Testamento' : 'Old Testament'}</h4>`;
        html += '<div class="books-grid">';
        
        oldTestament.forEach(book => {
            html += `<button class="book-btn" onclick="bibleReader.loadBook('${book.id}', 'old')" title="${book.name}">
                ${book.abbr}
            </button>`;
        });
        
        html += '</div></div>';
        html += '<div class="testament-section">';
        html += `<h4>${lang === 'pt' ? 'Novo Testamento' : 'New Testament'}</h4>`;
        html += '<div class="books-grid">';
        
        newTestament.forEach(book => {
            html += `<button class="book-btn" onclick="bibleReader.loadBook('${book.id}', 'new')" title="${book.name}">
                ${book.abbr}
            </button>`;
        });
        
        html += '</div></div>';
        container.innerHTML = html;
    }

    // Load a specific book
    loadBook(bookId, testament) {
        const lang = this.currentLanguage;
        const books = bibleData.books[lang][testament];
        const book = books.find(b => b.id === bookId);
        
        if (!book) return;

        this.currentBook = { ...book, testament };
        
        // Update chapter selector
        const chapterSelect = document.getElementById('bibleChapter');
        if (chapterSelect) {
            chapterSelect.innerHTML = '<option value="">Selecione o Capítulo</option>';
            for (let i = 1; i <= book.chapters; i++) {
                chapterSelect.innerHTML += `<option value="${i}">Capítulo ${i}</option>`;
            }
        }

        // Load first chapter by default
        this.loadChapter(1);
    }

    // Load a specific chapter
    async loadChapter(chapterNum) {
        if (!this.currentBook) return;

        this.currentChapter = chapterNum;
        const bookId = this.currentBook.id;
        const key = `${bookId}-${chapterNum}`;
        
        // Show loading state
        this.showLoadingState();
        
        // Get verses from hybrid source (cache + API)
        const verses = await this.getVerses(key);
        this.currentVerses = verses;

        // Update UI
        this.renderVerses(verses);
        this.updatePassageTitle();
        this.updateNavigationButtons();
        this.addToHistory(this.currentBook.name, chapterNum);
        
        // Hide loading state
        this.hideLoadingState();
    }

    // Get verses (from cache or API) - HYBRID STRATEGY
    async getVerses(key) {
        const lang = this.currentLanguage;
        
        // 1. Check local data first (fastest)
        if (bibleData.verses[lang][key]) {
            console.log('✅ Versículos encontrados no cache local');
            return bibleData.verses[lang][key];
        }

        // 2. Try to fetch from API
        const [bookId, chapter] = key.split('-');
        
        try {
            const verses = await this.apiService.fetchChapter(bookId, parseInt(chapter), lang);
            
            if (verses && verses.length > 0) {
                // Save to local cache for future use
                if (!bibleData.verses[lang]) {
                    bibleData.verses[lang] = {};
                }
                bibleData.verses[lang][key] = verses;
                
                console.log('✅ Versículos carregados da API');
                return verses;
            }
        } catch (error) {
            console.error('Erro ao buscar versículos da API:', error);
        }

        // 3. Fallback to placeholder if API fails
        console.log('⚠️ Usando versículos placeholder');
        return this.generatePlaceholderVerses(key);
    }

    // Generate placeholder verses for demonstration
    generatePlaceholderVerses(key) {
        const numVerses = Math.floor(Math.random() * 20) + 10; // 10-30 verses
        const verses = [];
        
        for (let i = 1; i <= numVerses; i++) {
            verses.push({
                verse: i,
                text: this.currentLanguage === 'pt' 
                    ? `Este é o versículo ${i} do capítulo ${this.currentChapter}. O conteúdo completo seria carregado de uma API da Bíblia.`
                    : `This is verse ${i} of chapter ${this.currentChapter}. The full content would be loaded from a Bible API.`
            });
        }
        
        return verses;
    }

    // Render verses in the reading area
    renderVerses(verses) {
        const container = document.getElementById('bibleVersesContainer');
        if (!container) return;

        let html = '<div class="verses-list">';
        
        verses.forEach(v => {
            const isFavorite = this.isVerseFavorite(this.currentBook.id, this.currentChapter, v.verse);
            const hasNote = this.verseHasNote(this.currentBook.id, this.currentChapter, v.verse);
            
            html += `<div class="verse-item" data-verse="${v.verse}" onclick="bibleReader.selectVerse(${v.verse})">
                <span class="verse-number">${v.verse}</span>
                <span class="verse-text">${v.text}</span>
                <div class="verse-actions">
                    ${isFavorite ? '<i class="fas fa-heart favorite-icon"></i>' : ''}
                    ${hasNote ? '<i class="fas fa-sticky-note note-icon"></i>' : ''}
                </div>
            </div>`;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    // Update passage title
    updatePassageTitle() {
        const titleEl = document.getElementById('biblePassageTitle');
        if (titleEl && this.currentBook) {
            titleEl.textContent = `${this.currentBook.name} ${this.currentChapter}`;
        }
    }

    // Update navigation buttons
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevChapterBtn');
        const nextBtn = document.getElementById('nextChapterBtn');

        if (prevBtn) {
            prevBtn.disabled = this.currentChapter <= 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentChapter >= this.currentBook.chapters;
        }
    }

    // Navigate to previous chapter
    previousChapter() {
        if (this.currentChapter > 1) {
            this.loadChapter(this.currentChapter - 1);
        }
    }

    // Navigate to next chapter
    nextChapter() {
        if (this.currentChapter < this.currentBook.chapters) {
            this.loadChapter(this.currentChapter + 1);
        }
    }

    // Switch language
    switchLanguage(lang) {
        this.currentLanguage = lang;
        
        // Update button states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Reload current content
        this.loadBibleBooksList();
        this.loadDailyVerse();
        
        if (this.currentBook && this.currentChapter) {
            this.loadChapter(this.currentChapter);
        }
    }

    // Load daily verse
    loadDailyVerse() {
        const container = document.getElementById('dailyVerseContent');
        if (!container) return;

        const verses = bibleData.dailyVerses[this.currentLanguage];
        const today = new Date().getDate();
        const verse = verses[today % verses.length];

        container.innerHTML = `
            <p class="verse-text">"${verse.text}"</p>
            <p class="verse-reference">${verse.reference}</p>
        `;
    }

    // Search Bible - NOW WITH REAL API
    async searchBible() {
        const searchInput = document.getElementById('bibleSearch');
        if (!searchInput) return;

        const query = searchInput.value.trim();
        if (!query) {
            this.showMessage('Digite algo para buscar', 'info');
            return;
        }

        this.showLoadingState();
        
        try {
            const results = await this.apiService.searchVerses(query, this.currentLanguage);
            
            if (results && results.length > 0) {
                this.displaySearchResults(results);
                this.showMessage(`${results.length} resultado(s) encontrado(s)`, 'success');
            } else {
                this.showMessage('Nenhum resultado encontrado', 'info');
            }
        } catch (error) {
            console.error('Erro na busca:', error);
            this.showMessage('Erro ao buscar. Tente novamente.', 'error');
        }
        
        this.hideLoadingState();
    }
    
    // Display search results
    displaySearchResults(results) {
        const container = document.getElementById('bibleVersesContainer');
        if (!container) return;

        let html = '<div class="search-results">';
        html += `<h3>Resultados da Busca (${results.length})</h3>`;
        html += '<div class="results-list">';
        
        results.forEach((result, index) => {
            html += `
                <div class="search-result-item" onclick="bibleReader.loadSearchResult(${index})">
                    <div class="result-reference">${result.reference}</div>
                    <div class="result-text">${result.text}</div>
                </div>`;
        });
        
        html += '</div></div>';
        container.innerHTML = html;
    }
    
    // Load search result
    loadSearchResult(index) {
        // Parse reference and load that passage
        // This would need more implementation
        this.showMessage('Carregando passagem...', 'info');
    }
    
    // Show loading state
    showLoadingState() {
        this.isLoading = true;
        const container = document.getElementById('bibleVersesContainer');
        if (container) {
            container.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Carregando versículos...</p>
                </div>`;
        }
    }
    
    // Hide loading state
    hideLoadingState() {
        this.isLoading = false;
    }

    // Toggle favorite verse
    toggleFavoritePassage() {
        if (!this.currentBook || !this.currentChapter) return;

        const favorite = {
            book: this.currentBook.name,
            bookId: this.currentBook.id,
            chapter: this.currentChapter,
            verses: this.currentVerses.map(v => v.verse),
            text: this.currentVerses.map(v => v.text).join(' '),
            date: new Date().toISOString()
        };

        const existingIndex = this.favorites.findIndex(f => 
            f.bookId === favorite.bookId && f.chapter === favorite.chapter
        );

        if (existingIndex >= 0) {
            this.favorites.splice(existingIndex, 1);
            this.showMessage('Removido dos favoritos', 'info');
        } else {
            this.favorites.push(favorite);
            this.showMessage('Adicionado aos favoritos', 'success');
        }

        this.saveToStorage('bibleFavorites', this.favorites);
        this.renderFavorites();
    }

    // Check if verse is favorite
    isVerseFavorite(bookId, chapter, verse) {
        return this.favorites.some(f => 
            f.bookId === bookId && f.chapter === chapter && f.verses.includes(verse)
        );
    }

    // Add note to verse
    addBibleNote() {
        if (!this.currentBook || !this.currentChapter) return;

        const noteText = prompt(this.currentLanguage === 'pt' 
            ? 'Digite sua nota:' 
            : 'Enter your note:');
        
        if (!noteText) return;

        const note = {
            book: this.currentBook.name,
            bookId: this.currentBook.id,
            chapter: this.currentChapter,
            note: noteText,
            date: new Date().toISOString()
        };

        this.notes.push(note);
        this.saveToStorage('bibleNotes', this.notes);
        this.renderNotes();
        this.showMessage('Nota adicionada', 'success');
    }

    // Check if verse has note
    verseHasNote(bookId, chapter, verse) {
        return this.notes.some(n => 
            n.bookId === bookId && n.chapter === chapter
        );
    }

    // Add to reading history
    addToHistory(book, chapter) {
        const historyItem = {
            book,
            chapter,
            date: new Date().toISOString()
        };

        // Remove duplicates
        this.history = this.history.filter(h => 
            !(h.book === book && h.chapter === chapter)
        );

        this.history.unshift(historyItem);
        
        // Keep only last 50 items
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }

        this.saveToStorage('bibleHistory', this.history);
        this.renderHistory();
    }

    // Render favorites
    renderFavorites() {
        const container = document.getElementById('favoritesTab');
        if (!container) return;

        if (this.favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <p>${this.currentLanguage === 'pt' ? 'Nenhum versículo favorito ainda' : 'No favorite verses yet'}</p>
                    <small>${this.currentLanguage === 'pt' ? 'Clique no ❤️ para adicionar favoritos' : 'Click ❤️ to add favorites'}</small>
                </div>`;
            return;
        }

        let html = '<div class="favorites-list">';
        this.favorites.forEach((fav, index) => {
            html += `
                <div class="favorite-item">
                    <div class="favorite-header">
                        <strong>${fav.book} ${fav.chapter}</strong>
                        <button class="btn-icon" onclick="bibleReader.removeFavorite(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <p class="favorite-text">${fav.text.substring(0, 100)}...</p>
                    <small>${new Date(fav.date).toLocaleDateString()}</small>
                </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    // Render notes
    renderNotes() {
        const container = document.getElementById('notesTab');
        if (!container) return;

        if (this.notes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-sticky-note"></i>
                    <p>${this.currentLanguage === 'pt' ? 'Nenhuma nota ainda' : 'No notes yet'}</p>
                    <small>${this.currentLanguage === 'pt' ? 'Clique no 📝 para adicionar notas' : 'Click 📝 to add notes'}</small>
                </div>`;
            return;
        }

        let html = '<div class="notes-list">';
        this.notes.forEach((note, index) => {
            html += `
                <div class="note-item">
                    <div class="note-header">
                        <strong>${note.book} ${note.chapter}</strong>
                        <button class="btn-icon" onclick="bibleReader.removeNote(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <p class="note-text">${note.note}</p>
                    <small>${new Date(note.date).toLocaleDateString()}</small>
                </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    // Render history
    renderHistory() {
        const container = document.getElementById('historyTab');
        if (!container) return;

        if (this.history.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>${this.currentLanguage === 'pt' ? 'Nenhum histórico ainda' : 'No history yet'}</p>
                    <small>${this.currentLanguage === 'pt' ? 'Comece a ler para ver seu histórico' : 'Start reading to see your history'}</small>
                </div>`;
            return;
        }

        let html = '<div class="history-list">';
        this.history.forEach(item => {
            html += `
                <div class="history-item" onclick="bibleReader.loadBiblePassage('${item.book}', ${item.chapter})">
                    <strong>${item.book} ${item.chapter}</strong>
                    <small>${new Date(item.date).toLocaleDateString()}</small>
                </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    // Remove favorite
    removeFavorite(index) {
        this.favorites.splice(index, 1);
        this.saveToStorage('bibleFavorites', this.favorites);
        this.renderFavorites();
    }

    // Remove note
    removeNote(index) {
        this.notes.splice(index, 1);
        this.saveToStorage('bibleNotes', this.notes);
        this.renderNotes();
    }

    // Font size controls
    increaseFontSize() {
        this.fontSize = Math.min(this.fontSize + 2, 24);
        this.applyFontSize();
    }

    decreaseFontSize() {
        this.fontSize = Math.max(this.fontSize - 2, 12);
        this.applyFontSize();
    }

    applyFontSize() {
        const container = document.getElementById('bibleVersesContainer');
        if (container) {
            container.style.fontSize = this.fontSize + 'px';
        }
    }

    // Share passage
    shareBiblePassage() {
        if (!this.currentBook || !this.currentChapter) return;

        const text = `${this.currentBook.name} ${this.currentChapter}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Bíblia Sagrada',
                text: text
            });
        } else {
            navigator.clipboard.writeText(text);
            this.showMessage('Copiado para área de transferência', 'success');
        }
    }

    // Print passage
    printBiblePassage() {
        window.print();
    }

    // Load specific passage
    loadBiblePassage(bookName, chapter) {
        // Find book by name
        const lang = this.currentLanguage;
        let book = null;
        let testament = null;

        bibleData.books[lang].old.forEach(b => {
            if (b.name === bookName || b.id === bookName.toLowerCase()) {
                book = b;
                testament = 'old';
            }
        });

        if (!book) {
            bibleData.books[lang].new.forEach(b => {
                if (b.name === bookName || b.id === bookName.toLowerCase()) {
                    book = b;
                    testament = 'new';
                }
            });
        }

        if (book) {
            this.loadBook(book.id, testament);
            this.loadChapter(chapter);
        }
    }

    // Switch tabs
    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        event.target.classList.add('active');
        document.getElementById(tabName + 'Tab').classList.add('active');
    }

    // Toggle sidebar
    toggleSidebar() {
        const sidebar = document.querySelector('.bible-books-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
    }

    // Select verse
    selectVerse(verseNum) {
        document.querySelectorAll('.verse-item').forEach(item => {
            item.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
    }

    // Storage helpers
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to storage:', e);
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading from storage:', e);
            return null;
        }
    }

    // Show message
    showMessage(message, type) {
        // Reuse existing notification system
        if (window.authSystem && window.authSystem.showMessage) {
            window.authSystem.showMessage(message, type);
        } else {
            alert(message);
        }
    }
}

// Global functions for onclick handlers
let bibleReader = null;

function initBible() {
    bibleReader = new BibleReader();
    bibleReader.init();
}

function switchBibleLanguage(lang) {
    if (bibleReader) {
        bibleReader.switchLanguage(lang);
    }
}

function loadBibleBooks() {
    // Called when testament is selected
    const testament = document.getElementById('bibleTestament').value;
    const bookSelect = document.getElementById('bibleBook');
    
    if (!testament || !bibleReader) return;

    const lang = bibleReader.currentLanguage;
    const books = bibleData.books[lang][testament];
    
    bookSelect.innerHTML = '<option value="">Selecione o Livro</option>';
    books.forEach(book => {
        bookSelect.innerHTML += `<option value="${book.id}">${book.name}</option>`;
    });
}

function loadBibleChapters() {
    const bookId = document.getElementById('bibleBook').value;
    if (!bookId || !bibleReader) return;

    const testament = document.getElementById('bibleTestament').value;
    bibleReader.loadBook(bookId, testament);
}

function loadBibleVerses() {
    const chapter = parseInt(document.getElementById('bibleChapter').value);
    if (!chapter || !bibleReader) return;

    bibleReader.loadChapter(chapter);
}

function searchBible() {
    if (bibleReader) {
        bibleReader.searchBible();
    }
}

function toggleFavoritePassage() {
    if (bibleReader) {
        bibleReader.toggleFavoritePassage();
    }
}

function addBibleNote() {
    if (bibleReader) {
        bibleReader.addBibleNote();
    }
}

function shareBiblePassage() {
    if (bibleReader) {
        bibleReader.shareBiblePassage();
    }
}

function printBiblePassage() {
    if (bibleReader) {
        bibleReader.printBiblePassage();
    }
}

function increaseFontSize() {
    if (bibleReader) {
        bibleReader.increaseFontSize();
    }
}

function decreaseFontSize() {
    if (bibleReader) {
        bibleReader.decreaseFontSize();
    }
}

function previousChapter() {
    if (bibleReader) {
        bibleReader.previousChapter();
    }
}

function nextChapter() {
    if (bibleReader) {
        bibleReader.nextChapter();
    }
}

function switchBibleTab(tabName) {
    if (bibleReader) {
        bibleReader.switchTab(tabName);
    }
}

function toggleBibleSidebar() {
    if (bibleReader) {
        bibleReader.toggleSidebar();
    }
}

function loadBiblePassage(book, chapter) {
    if (bibleReader) {
        bibleReader.loadBiblePassage(book, chapter);
    }
}

// Initialize when section is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Will be initialized when Bible section is opened
    console.log('Bible module loaded');
});
