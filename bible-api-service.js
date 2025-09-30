// Bible API Service - Hybrid Strategy
// Combines local cache with external API for complete Bible access

class BibleAPIService {
    constructor() {
        // Multiple API endpoints for redundancy
        this.apis = {
            primary: 'https://bible-api.com',
            secondary: 'https://www.abibliadigital.com.br/api',
            fallback: 'https://api.scripture.api.bible/v1'
        };
        
        this.currentAPI = 'primary';
        this.requestCache = new Map();
        this.offlineMode = false;
    }

    // Fetch chapter from API
    async fetchChapter(bookId, chapter, language = 'pt') {
        const cacheKey = `${bookId}-${chapter}-${language}`;
        
        // Check memory cache first
        if (this.requestCache.has(cacheKey)) {
            console.log('📦 Retornando do cache de memória:', cacheKey);
            return this.requestCache.get(cacheKey);
        }

        // Check localStorage cache
        const localData = this.getFromLocalStorage(cacheKey);
        if (localData) {
            console.log('💾 Retornando do localStorage:', cacheKey);
            this.requestCache.set(cacheKey, localData);
            return localData;
        }

        // Fetch from API
        try {
            const verses = await this.fetchFromAPI(bookId, chapter, language);
            
            if (verses && verses.length > 0) {
                // Save to caches
                this.requestCache.set(cacheKey, verses);
                this.saveToLocalStorage(cacheKey, verses);
                console.log('🌐 Dados carregados da API:', cacheKey);
                return verses;
            }
        } catch (error) {
            console.error('❌ Erro ao buscar da API:', error);
        }

        return null;
    }

    // Fetch from primary API (bible-api.com)
    async fetchFromAPI(bookId, chapter, language) {
        const translation = this.getTranslation(language);
        const bookName = this.getBookName(bookId, language);
        
        if (!bookName) {
            console.error('Livro não encontrado:', bookId);
            return null;
        }

        try {
            // Try primary API with timeout
            const url = `${this.apis.primary}/${bookName}+${chapter}?translation=${translation}`;
            console.log('🔄 Buscando da API:', url);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(url, { 
                signal: controller.signal,
                mode: 'cors'
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Convert to our format
            if (data.verses && Array.isArray(data.verses)) {
                return data.verses.map(v => ({
                    verse: v.verse,
                    text: v.text
                }));
            } else if (data.text) {
                // Single verse response
                return [{
                    verse: 1,
                    text: data.text
                }];
            }
            
            return null;
        } catch (error) {
            console.error('Erro na API primária:', error.message);
            
            // Try fallback for Portuguese
            if (language === 'pt') {
                console.log('🔄 Tentando API secundária (Bíblia Digital)...');
                return await this.fetchFromBibliaDigital(bookId, chapter);
            }
            
            // For English, try alternative method
            console.log('⚠️ API indisponível, usando dados locais');
            return null;
        }
    }

    // Fallback API for Portuguese (Bíblia Digital)
    async fetchFromBibliaDigital(bookId, chapter) {
        try {
            const bookName = this.getPortugueseBookName(bookId);
            if (!bookName) {
                console.log('⚠️ Nome do livro não encontrado para API secundária');
                return null;
            }

            const url = `${this.apis.secondary}/verses/nvi/${bookName}/${chapter}`;
            console.log('🔄 Tentando API secundária:', url);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch(url, {
                signal: controller.signal,
                mode: 'cors'
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.verses && Array.isArray(data.verses)) {
                console.log('✅ Dados carregados da API secundária');
                return data.verses.map(v => ({
                    verse: v.number,
                    text: v.text
                }));
            }
            
            return null;
        } catch (error) {
            console.error('❌ Erro na API secundária:', error.message);
            console.log('⚠️ Todas as APIs falharam, usando dados de exemplo');
            return null;
        }
    }

    // Get translation code
    getTranslation(language) {
        const translations = {
            'pt': 'almeida',
            'en': 'kjv'
        };
        return translations[language] || 'kjv';
    }

    // Get book name for API
    getBookName(bookId, language) {
        const bookNames = {
            'pt': {
                'genesis': 'genesis',
                'exodus': 'exodus',
                'leviticus': 'leviticus',
                'numbers': 'numbers',
                'deuteronomy': 'deuteronomy',
                'joshua': 'joshua',
                'judges': 'judges',
                'ruth': 'ruth',
                '1samuel': '1samuel',
                '2samuel': '2samuel',
                '1kings': '1kings',
                '2kings': '2kings',
                '1chronicles': '1chronicles',
                '2chronicles': '2chronicles',
                'ezra': 'ezra',
                'nehemiah': 'nehemiah',
                'esther': 'esther',
                'job': 'job',
                'psalms': 'psalms',
                'proverbs': 'proverbs',
                'ecclesiastes': 'ecclesiastes',
                'song': 'song',
                'isaiah': 'isaiah',
                'jeremiah': 'jeremiah',
                'lamentations': 'lamentations',
                'ezekiel': 'ezekiel',
                'daniel': 'daniel',
                'hosea': 'hosea',
                'joel': 'joel',
                'amos': 'amos',
                'obadiah': 'obadiah',
                'jonah': 'jonah',
                'micah': 'micah',
                'nahum': 'nahum',
                'habakkuk': 'habakkuk',
                'zephaniah': 'zephaniah',
                'haggai': 'haggai',
                'zechariah': 'zechariah',
                'malachi': 'malachi',
                'matthew': 'matthew',
                'mark': 'mark',
                'luke': 'luke',
                'john': 'john',
                'acts': 'acts',
                'romans': 'romans',
                '1corinthians': '1corinthians',
                '2corinthians': '2corinthians',
                'galatians': 'galatians',
                'ephesians': 'ephesians',
                'philippians': 'philippians',
                'colossians': 'colossians',
                '1thessalonians': '1thessalonians',
                '2thessalonians': '2thessalonians',
                '1timothy': '1timothy',
                '2timothy': '2timothy',
                'titus': 'titus',
                'philemon': 'philemon',
                'hebrews': 'hebrews',
                'james': 'james',
                '1peter': '1peter',
                '2peter': '2peter',
                '1john': '1john',
                '2john': '2john',
                '3john': '3john',
                'jude': 'jude',
                'revelation': 'revelation'
            },
            'en': {
                'genesis': 'genesis',
                'exodus': 'exodus',
                'leviticus': 'leviticus',
                'numbers': 'numbers',
                'deuteronomy': 'deuteronomy',
                'joshua': 'joshua',
                'judges': 'judges',
                'ruth': 'ruth',
                '1samuel': '1samuel',
                '2samuel': '2samuel',
                '1kings': '1kings',
                '2kings': '2kings',
                '1chronicles': '1chronicles',
                '2chronicles': '2chronicles',
                'ezra': 'ezra',
                'nehemiah': 'nehemiah',
                'esther': 'esther',
                'job': 'job',
                'psalms': 'psalms',
                'proverbs': 'proverbs',
                'ecclesiastes': 'ecclesiastes',
                'song': 'song of solomon',
                'isaiah': 'isaiah',
                'jeremiah': 'jeremiah',
                'lamentations': 'lamentations',
                'ezekiel': 'ezekiel',
                'daniel': 'daniel',
                'hosea': 'hosea',
                'joel': 'joel',
                'amos': 'amos',
                'obadiah': 'obadiah',
                'jonah': 'jonah',
                'micah': 'micah',
                'nahum': 'nahum',
                'habakkuk': 'habakkuk',
                'zephaniah': 'zephaniah',
                'haggai': 'haggai',
                'zechariah': 'zechariah',
                'malachi': 'malachi',
                'matthew': 'matthew',
                'mark': 'mark',
                'luke': 'luke',
                'john': 'john',
                'acts': 'acts',
                'romans': 'romans',
                '1corinthians': '1corinthians',
                '2corinthians': '2corinthians',
                'galatians': 'galatians',
                'ephesians': 'ephesians',
                'philippians': 'philippians',
                'colossians': 'colossians',
                '1thessalonians': '1thessalonians',
                '2thessalonians': '2thessalonians',
                '1timothy': '1timothy',
                '2timothy': '2timothy',
                'titus': 'titus',
                'philemon': 'philemon',
                'hebrews': 'hebrews',
                'james': 'james',
                '1peter': '1peter',
                '2peter': '2peter',
                '1john': '1john',
                '2john': '2john',
                '3john': '3john',
                'jude': 'jude',
                'revelation': 'revelation'
            }
        };
        
        return bookNames[language][bookId] || bookId;
    }

    // Get Portuguese book name for Bíblia Digital API
    getPortugueseBookName(bookId) {
        const ptNames = {
            'genesis': 'gn',
            'exodus': 'ex',
            'leviticus': 'lv',
            'numbers': 'nm',
            'deuteronomy': 'dt',
            'joshua': 'js',
            'judges': 'jz',
            'ruth': 'rt',
            '1samuel': '1sm',
            '2samuel': '2sm',
            '1kings': '1rs',
            '2kings': '2rs',
            '1chronicles': '1cr',
            '2chronicles': '2cr',
            'ezra': 'ed',
            'nehemiah': 'ne',
            'esther': 'et',
            'job': 'job',
            'psalms': 'sl',
            'proverbs': 'pv',
            'ecclesiastes': 'ec',
            'song': 'ct',
            'isaiah': 'is',
            'jeremiah': 'jr',
            'lamentations': 'lm',
            'ezekiel': 'ez',
            'daniel': 'dn',
            'hosea': 'os',
            'joel': 'jl',
            'amos': 'am',
            'obadiah': 'ob',
            'jonah': 'jn',
            'micah': 'mq',
            'nahum': 'na',
            'habakkuk': 'hc',
            'zephaniah': 'sf',
            'haggai': 'ag',
            'zechariah': 'zc',
            'malachi': 'ml',
            'matthew': 'mt',
            'mark': 'mc',
            'luke': 'lc',
            'john': 'jo',
            'acts': 'at',
            'romans': 'rm',
            '1corinthians': '1co',
            '2corinthians': '2co',
            'galatians': 'gl',
            'ephesians': 'ef',
            'philippians': 'fp',
            'colossians': 'cl',
            '1thessalonians': '1ts',
            '2thessalonians': '2ts',
            '1timothy': '1tm',
            '2timothy': '2tm',
            'titus': 'tt',
            'philemon': 'fm',
            'hebrews': 'hb',
            'james': 'tg',
            '1peter': '1pe',
            '2peter': '2pe',
            '1john': '1jo',
            '2john': '2jo',
            '3john': '3jo',
            'jude': 'jd',
            'revelation': 'ap'
        };
        
        return ptNames[bookId];
    }

    // Search verses by text
    async searchVerses(query, language = 'pt') {
        try {
            const translation = this.getTranslation(language);
            const url = `${this.apis.primary}/search?q=${encodeURIComponent(query)}&translation=${translation}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('Erro na busca:', error);
            return [];
        }
    }

    // LocalStorage management
    saveToLocalStorage(key, data) {
        try {
            const storageKey = `bible_cache_${key}`;
            const cacheData = {
                data: data,
                timestamp: Date.now(),
                version: '1.0'
            };
            localStorage.setItem(storageKey, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }

    getFromLocalStorage(key) {
        try {
            const storageKey = `bible_cache_${key}`;
            const cached = localStorage.getItem(storageKey);
            
            if (!cached) return null;
            
            const cacheData = JSON.parse(cached);
            
            // Check if cache is still valid (30 days)
            const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
            if (Date.now() - cacheData.timestamp > maxAge) {
                localStorage.removeItem(storageKey);
                return null;
            }
            
            return cacheData.data;
        } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
            return null;
        }
    }

    // Clear cache
    clearCache() {
        this.requestCache.clear();
        
        // Clear localStorage cache
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('bible_cache_')) {
                localStorage.removeItem(key);
            }
        });
        
        console.log('✅ Cache limpo com sucesso');
    }

    // Get cache statistics
    getCacheStats() {
        const memorySize = this.requestCache.size;
        const localStorageKeys = Object.keys(localStorage).filter(k => k.startsWith('bible_cache_'));
        
        return {
            memoryCache: memorySize,
            localStorageCache: localStorageKeys.length,
            totalCached: memorySize + localStorageKeys.length
        };
    }

    // Prefetch popular chapters
    async prefetchPopularChapters() {
        const popular = [
            { book: 'genesis', chapter: 1 },
            { book: 'psalms', chapter: 23 },
            { book: 'psalms', chapter: 91 },
            { book: 'proverbs', chapter: 3 },
            { book: 'john', chapter: 3 },
            { book: 'john', chapter: 14 },
            { book: 'romans', chapter: 8 },
            { book: 'romans', chapter: 12 },
            { book: '1corinthians', chapter: 13 },
            { book: 'philippians', chapter: 4 }
        ];

        console.log('🔄 Pré-carregando capítulos populares...');
        
        for (const item of popular) {
            await this.fetchChapter(item.book, item.chapter, 'pt');
            await this.fetchChapter(item.book, item.chapter, 'en');
        }
        
        console.log('✅ Capítulos populares carregados');
    }

    // Check online status
    checkOnlineStatus() {
        return navigator.onLine;
    }

    // Enable offline mode
    enableOfflineMode() {
        this.offlineMode = true;
        console.log('📴 Modo offline ativado');
    }

    // Disable offline mode
    disableOfflineMode() {
        this.offlineMode = false;
        console.log('🌐 Modo online ativado');
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BibleAPIService;
}
