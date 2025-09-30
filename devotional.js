// Devotional Module - Daily Devotionals and Spiritual Content
// Provides daily devotionals, reflections, prayers, and reading plans

class DevotionalManager {
    constructor() {
        this.currentDevotional = null;
        this.savedDevotionals = this.loadFromStorage('savedDevotionals') || [];
        this.devotionalHistory = this.loadFromStorage('devotionalHistory') || [];
        this.readingProgress = this.loadFromStorage('readingProgress') || { day: 1, completed: [] };
        this.currentLanguage = this.loadFromStorage('devotionalLanguage') || 'pt';
        
        // Missions tracking
        this.missions = this.loadFromStorage('devotionalMissions') || {
            days365: { completed: [], current: 0, unlocked: false },
            streak30: { current: 0, best: 0, unlocked: false },
            streak7: { current: 0, unlocked: false },
            shares: { count: 0, unlocked: false },
            saves: { count: 0, unlocked: false }
        };
        
        this.lastReadDate = this.loadFromStorage('lastReadDate') || null;
    }

    // Initialize Devotional Module
    init() {
        console.log('Initializing Devotional Manager...');
        this.loadTodayDevotional();
        this.renderDevotionalDate();
        this.renderCalendar();
        this.renderSavedDevotionals();
        this.updateMissions();
        this.renderMissions();
        this.updateReadingPlanCard();
    }
    
    // Update reading plan card
    updateReadingPlanCard() {
        if (typeof readingPlan === 'undefined') return;
        
        const stats = readingPlan.getStatistics();
        const todayReading = readingPlan.getTodayReading();
        
        // Update progress text
        const progressText = document.getElementById('planProgressText');
        if (progressText) {
            progressText.textContent = `${stats.percentage}% completo`;
        }
        
        // Update progress bar
        const progressBar = document.getElementById('planProgressBar');
        if (progressBar) {
            progressBar.style.width = `${stats.percentage}%`;
        }
        
        // Update today's reading list
        const readingList = document.getElementById('todayReadingList');
        if (readingList && todayReading) {
            readingList.innerHTML = todayReading.readings.map(r => `<li>${r}</li>`).join('');
        }
    }

    // Load today's devotional
    loadTodayDevotional() {
        const today = new Date();
        const dayOfYear = this.getDayOfYear(today);
        
        // Get devotional for today
        const devotional = this.getDevotionalByDay(dayOfYear);
        this.currentDevotional = devotional;
        
        // Render devotional
        this.renderDevotional(devotional);
        
        // Add to history
        this.addToHistory(devotional);
    }

    // Get day of year (1-365)
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    // Get devotional by day
    getDevotionalByDay(day) {
        // Use devotional-data.js if available
        if (typeof devotionalData !== 'undefined') {
            return devotionalData.getDevotionalByDay(day, this.currentLanguage);
        }
        
        // Fallback to local database
        const devotionals = this.getDevotionalsDatabase();
        const index = (day - 1) % devotionals.length;
        return devotionals[index];
    }
    
    // Switch language
    switchLanguage(lang) {
        this.currentLanguage = lang;
        this.saveToStorage('devotionalLanguage', lang);
        
        // Update button states
        document.querySelectorAll('.language-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Reload devotional
        this.loadTodayDevotional();
        this.renderCalendar();
        
        this.showMessage(lang === 'pt' ? 'Idioma alterado para Português' : 'Language changed to English', 'success');
    }

    // Devotionals Database (Fallback)
    getDevotionalsDatabase() {
        return [
            {
                id: 1,
                theme: "A Fé que Move Montanhas",
                verse: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
                reference: "João 3:16",
                reflection: "A fé é o fundamento da nossa relação com Deus. Não é apenas acreditar que Ele existe, mas confiar completamente em Seu amor e provisão. Quando enfrentamos montanhas em nossa vida - sejam problemas, desafios ou impossibilidades - é a fé que nos capacita a ver além das circunstâncias. Deus não nos pede para ter fé em nós mesmos, mas fé Nele, que é Todo-Poderoso. Hoje, entregue suas montanhas a Deus e veja Seu poder agir.",
                prayer: "Senhor, aumenta minha fé. Ajuda-me a confiar em Ti mesmo quando não vejo o caminho. Que minha fé não se baseie nas circunstâncias, mas em Tua fidelidade. Move as montanhas da minha vida e glorifica Teu nome. Em nome de Jesus, amém.",
                category: "fe",
                date: new Date().toISOString()
            },
            {
                id: 2,
                theme: "O Amor que Transforma",
                verse: "Nós amamos porque ele nos amou primeiro.",
                reference: "1 João 4:19",
                reflection: "O amor de Deus não é condicional nem limitado. Ele nos amou primeiro, antes mesmo de conhecê-Lo. Este amor transformador tem o poder de mudar corações, restaurar relacionamentos e trazer cura. Quando experimentamos o amor de Deus, somos capacitados a amar os outros da mesma forma - sem julgamento, sem condições, sem limites. Hoje, permita que o amor de Deus flua através de você para alcançar aqueles ao seu redor.",
                prayer: "Pai celestial, obrigado por Teu amor incondicional. Ajuda-me a amar como Tu amas. Que meu coração seja um canal do Teu amor para todos que encontrar hoje. Remove todo julgamento e crítica, e enche-me com Tua compaixão. Amém.",
                category: "amor",
                date: new Date().toISOString()
            },
            {
                id: 3,
                theme: "Esperança que Não Falha",
                verse: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o SENHOR; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
                reference: "Jeremias 29:11",
                reflection: "Em meio às incertezas da vida, temos uma âncora segura: a esperança em Deus. Ele tem planos para nós, planos de bem e não de mal. Mesmo quando não entendemos o que está acontecendo, podemos confiar que Deus está trabalhando para o nosso bem. A esperança cristã não é um otimismo vazio, mas uma confiança sólida no caráter e nas promessas de Deus. Hoje, renove sua esperança Nele.",
                prayer: "Senhor, quando as circunstâncias tentam roubar minha esperança, lembra-me de Tuas promessas. Tu tens planos de bem para mim. Ajuda-me a manter meus olhos fixos em Ti e não nas tempestades ao redor. Renova minha esperança hoje. Amém.",
                category: "esperanca",
                date: new Date().toISOString()
            },
            {
                id: 4,
                theme: "Gratidão em Todas as Coisas",
                verse: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.",
                reference: "1 Tessalonicenses 5:18",
                reflection: "A gratidão transforma nossa perspectiva. Quando escolhemos agradecer em todas as circunstâncias, não estamos negando as dificuldades, mas reconhecendo que Deus é maior que elas. Um coração grato é um coração feliz, porque vê as bênçãos de Deus mesmo nos momentos difíceis. Hoje, faça uma lista de pelo menos 10 coisas pelas quais você é grato e veja como isso muda seu dia.",
                prayer: "Pai, obrigado por todas as Tuas bênçãos. Perdoa-me quando reclamo ao invés de agradecer. Abre meus olhos para ver Tua bondade em cada situação. Que meu coração transborde de gratidão hoje e sempre. Amém.",
                category: "gratidao",
                date: new Date().toISOString()
            },
            {
                id: 5,
                theme: "A Paz que Excede Todo Entendimento",
                verse: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.",
                reference: "Filipenses 4:7",
                reflection: "A paz de Deus não depende das circunstâncias externas. É uma paz sobrenatural que guarda nosso coração mesmo em meio às tempestades. Quando entregamos nossas ansiedades a Deus através da oração, Ele nos dá uma paz que o mundo não pode dar nem tirar. Esta paz não faz sentido lógico - por isso excede todo entendimento. Hoje, entregue suas preocupações a Deus e receba Sua paz.",
                prayer: "Príncipe da Paz, acalma meu coração ansioso. Tomo posse da Tua paz que excede todo entendimento. Guarda meu coração e minha mente em Cristo Jesus. Que Tua paz reine em mim hoje. Amém.",
                category: "paz",
                date: new Date().toISOString()
            }
        ];
    }

    // Render devotional
    renderDevotional(devotional) {
        document.getElementById('todayTheme').textContent = devotional.theme;
        document.getElementById('todayVerse').textContent = devotional.verse;
        document.getElementById('todayReference').textContent = devotional.reference;
        document.getElementById('todayReflection').textContent = devotional.reflection;
        document.getElementById('todayPrayer').textContent = devotional.prayer;
    }

    // Render date
    renderDevotionalDate() {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = today.toLocaleDateString('pt-BR', options);
        document.getElementById('devotionalDate').textContent = dateString;
    }

    // Render calendar
    renderCalendar() {
        const container = document.getElementById('devotionalCalendar');
        if (!container) return;

        const today = new Date();
        let html = '';

        // Show last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const dayOfYear = this.getDayOfYear(date);
            const devotional = this.getDevotionalByDay(dayOfYear);
            const isToday = i === 0;
            
            html += `
                <div class="calendar-day ${isToday ? 'today' : ''}" onclick="devotionalManager.loadDevotionalByDate(${dayOfYear})">
                    <div class="day-number">${date.getDate()}</div>
                    <div class="day-name">${date.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                    <div class="day-theme">${devotional.theme.substring(0, 30)}...</div>
                </div>`;
        }

        container.innerHTML = html;
    }

    // Load devotional by date
    loadDevotionalByDate(dayOfYear) {
        const devotional = this.getDevotionalByDay(dayOfYear);
        this.currentDevotional = devotional;
        this.renderDevotional(devotional);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    // Save devotional
    saveDevotional() {
        if (!this.currentDevotional) return;

        // Check if already saved
        const exists = this.savedDevotionals.some(d => d.id === this.currentDevotional.id);
        
        if (exists) {
            this.showMessage('Este devocional já está salvo', 'info');
            return;
        }

        this.savedDevotionals.push({
            ...this.currentDevotional,
            savedAt: new Date().toISOString()
        });

        this.saveToStorage('savedDevotionals', this.savedDevotionals);
        this.renderSavedDevotionals();
        
        // Update missions
        this.missions.saves.count = this.savedDevotionals.length;
        this.updateMissions();
        this.renderMissions();
        
        this.showMessage('Devocional salvo com sucesso!', 'success');
    }

    // Render saved devotionals
    renderSavedDevotionals() {
        const container = document.getElementById('savedDevotionals');
        if (!container) return;

        if (this.savedDevotionals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bookmark"></i>
                    <p>Nenhum devocional salvo</p>
                    <small>Clique em "Salvar" para guardar seus favoritos</small>
                </div>`;
            return;
        }

        let html = '<div class="saved-devotionals-list">';
        this.savedDevotionals.forEach((dev, index) => {
            html += `
                <div class="saved-devotional-item" onclick="devotionalManager.loadSavedDevotional(${index})">
                    <div class="saved-header">
                        <strong>${dev.theme}</strong>
                        <button class="btn-icon" onclick="event.stopPropagation(); devotionalManager.removeSaved(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <p class="saved-reference">${dev.reference}</p>
                    <small>${new Date(dev.savedAt).toLocaleDateString('pt-BR')}</small>
                </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    // Load saved devotional
    loadSavedDevotional(index) {
        const devotional = this.savedDevotionals[index];
        this.currentDevotional = devotional;
        this.renderDevotional(devotional);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Remove saved
    removeSaved(index) {
        this.savedDevotionals.splice(index, 1);
        this.saveToStorage('savedDevotionals', this.savedDevotionals);
        this.renderSavedDevotionals();
        this.showMessage('Devocional removido', 'info');
    }

    // Share devotional
    shareDevotional() {
        if (!this.currentDevotional) return;

        const text = `${this.currentDevotional.theme}\n\n"${this.currentDevotional.verse}"\n${this.currentDevotional.reference}`;

        if (navigator.share) {
            navigator.share({
                title: 'Devocional Diário',
                text: text
            });
        } else {
            navigator.clipboard.writeText(text);
            this.showMessage('Devocional copiado para área de transferência', 'success');
        }
        
        // Update missions
        this.missions.shares.count++;
        this.updateMissions();
        this.renderMissions();
    }

    // Print devotional
    printDevotional() {
        window.print();
    }

    // Add to history
    addToHistory(devotional) {
        const today = new Date().toDateString();
        const exists = this.devotionalHistory.some(h => h.date === today);
        
        if (!exists) {
            this.devotionalHistory.unshift({
                ...devotional,
                date: today,
                readAt: new Date().toISOString()
            });

            // Keep only last 30 days
            if (this.devotionalHistory.length > 30) {
                this.devotionalHistory = this.devotionalHistory.slice(0, 30);
            }

            this.saveToStorage('devotionalHistory', this.devotionalHistory);
            
            // Update missions
            this.trackDailyRead();
            this.updateMissions();
            this.renderMissions();
        }
    }

    // Track daily read for missions
    trackDailyRead() {
        const today = new Date().toDateString();
        const dayOfYear = this.getDayOfYear(new Date());
        
        // Update 365 days mission
        if (!this.missions.days365.completed.includes(dayOfYear)) {
            this.missions.days365.completed.push(dayOfYear);
            this.missions.days365.current = this.missions.days365.completed.length;
        }
        
        // Update streak missions
        if (this.lastReadDate) {
            const lastDate = new Date(this.lastReadDate);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // Consecutive day
                this.missions.streak7.current++;
                this.missions.streak30.current++;
                
                if (this.missions.streak30.current > this.missions.streak30.best) {
                    this.missions.streak30.best = this.missions.streak30.current;
                }
            } else if (diffDays > 1) {
                // Streak broken
                this.missions.streak7.current = 1;
                this.missions.streak30.current = 1;
            }
        } else {
            this.missions.streak7.current = 1;
            this.missions.streak30.current = 1;
        }
        
        this.lastReadDate = today;
        this.saveToStorage('lastReadDate', this.lastReadDate);
        this.saveToStorage('devotionalMissions', this.missions);
    }

    // Update missions status
    updateMissions() {
        // Check 365 days
        if (this.missions.days365.current >= 365 && !this.missions.days365.unlocked) {
            this.missions.days365.unlocked = true;
            this.showMessage('🏆 Missão Completa: Devocional 365 Dias!', 'success');
        }
        
        // Check 30 days streak
        if (this.missions.streak30.current >= 30 && !this.missions.streak30.unlocked) {
            this.missions.streak30.unlocked = true;
            this.showMessage('🔥 Missão Completa: Sequência de 30 Dias!', 'success');
        }
        
        // Check 7 days streak
        if (this.missions.streak7.current >= 7 && !this.missions.streak7.unlocked) {
            this.missions.streak7.unlocked = true;
            this.showMessage('⭐ Missão Completa: Semana Devocional!', 'success');
        }
        
        // Check shares
        if (this.missions.shares.count >= 10 && !this.missions.shares.unlocked) {
            this.missions.shares.unlocked = true;
            this.showMessage('📤 Missão Completa: Compartilhador!', 'success');
        }
        
        // Check saves
        if (this.missions.saves.count >= 20 && !this.missions.saves.unlocked) {
            this.missions.saves.unlocked = true;
            this.showMessage('💾 Missão Completa: Colecionador!', 'success');
        }
        
        this.saveToStorage('devotionalMissions', this.missions);
    }

    // Render missions
    renderMissions() {
        // Mission 365
        this.updateMissionCard('365', this.missions.days365.current, 365, this.missions.days365.unlocked);
        
        // Mission 30
        this.updateMissionCard('30', this.missions.streak30.current, 30, this.missions.streak30.unlocked);
        
        // Mission 7
        this.updateMissionCard('7', this.missions.streak7.current, 7, this.missions.streak7.unlocked);
        
        // Mission Share
        this.updateMissionCard('Share', this.missions.shares.count, 10, this.missions.shares.unlocked);
        
        // Mission Save
        this.updateMissionCard('Save', this.savedDevotionals.length, 20, this.missions.saves.unlocked);
    }

    // Update mission card
    updateMissionCard(missionId, current, total, unlocked) {
        const progress = Math.min((current / total) * 100, 100);
        
        const progressBar = document.getElementById(`progress${missionId}`);
        const progressText = document.getElementById(`progressText${missionId}`);
        const badge = document.getElementById(`badge${missionId}`);
        const card = document.getElementById(`mission${missionId}`);
        
        if (progressBar) progressBar.style.width = progress + '%';
        if (progressText) {
            const label = missionId === 'Share' ? 'compartilhamentos' : 
                         missionId === 'Save' ? 'salvos' : 'dias';
            progressText.textContent = `${current}/${total} ${label}`;
        }
        
        if (unlocked) {
            if (badge) {
                badge.innerHTML = '<i class="fas fa-trophy"></i>';
                badge.classList.add('unlocked');
            }
            if (card) card.classList.add('completed');
        }
    }

    // Open reading plan
    openReadingPlan() {
        if (typeof readingPlan !== 'undefined') {
            this.showReadingPlanModal();
        } else {
            alert('Plano de Leitura Completo\n\nCarregando...');
        }
    }
    
    // Show reading plan modal
    showReadingPlanModal() {
        const stats = readingPlan.getStatistics();
        const todayReading = readingPlan.getTodayReading();
        
        const modal = document.createElement('div');
        modal.className = 'reading-plan-modal';
        modal.innerHTML = `
            <div class="reading-plan-modal-content">
                <div class="reading-plan-header">
                    <h2><i class="fas fa-book-reader"></i> Plano de Leitura Anual</h2>
                    <button class="close-modal" onclick="this.closest('.reading-plan-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="reading-plan-stats">
                    <div class="stat-card">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <strong>${stats.completed}</strong>
                            <span>Dias Completos</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-percentage"></i>
                        <div>
                            <strong>${stats.percentage}%</strong>
                            <span>Progresso</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-fire"></i>
                        <div>
                            <strong>${stats.currentStreak}</strong>
                            <span>Sequência Atual</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-trophy"></i>
                        <div>
                            <strong>${stats.longestStreak}</strong>
                            <span>Melhor Sequência</span>
                        </div>
                    </div>
                </div>
                
                <div class="reading-plan-progress-bar">
                    <div class="progress-fill" style="width: ${stats.percentage}%"></div>
                    <span class="progress-label">${stats.completed} de 365 dias</span>
                </div>
                
                <div class="today-reading-section">
                    <h3><i class="fas fa-calendar-day"></i> Leitura de Hoje (Dia ${todayReading.day})</h3>
                    <div class="today-readings">
                        ${todayReading.readings.map(r => `
                            <div class="reading-item">
                                <i class="fas fa-book"></i>
                                <span>${r}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-primary" onclick="devotionalManager.markTodayComplete()">
                        <i class="fas fa-check"></i> Marcar como Completo
                    </button>
                </div>
                
                <div class="reading-plan-actions">
                    <button class="btn btn-secondary" onclick="devotionalManager.viewFullPlan()">
                        <i class="fas fa-list"></i> Ver Plano Completo
                    </button>
                    <button class="btn btn-secondary" onclick="devotionalManager.resetReadingPlan()">
                        <i class="fas fa-redo"></i> Resetar Progresso
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Mark today as complete
    markTodayComplete() {
        const today = new Date();
        const start = new Date(today.getFullYear(), 0, 0);
        const diff = today - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        const progress = readingPlan.markDayComplete(dayOfYear);
        this.showMessage(`✅ Dia ${dayOfYear} marcado como completo! ${progress.percentage}% concluído`, 'success');
        
        // Close modal and reopen to update
        const modal = document.querySelector('.reading-plan-modal');
        if (modal) {
            modal.remove();
            this.showReadingPlanModal();
        }
    }
    
    // View full plan
    viewFullPlan() {
        const completedDays = readingPlan.loadCompletedDays();
        const plan = readingPlan.generateCompletePlan();
        
        const modal = document.createElement('div');
        modal.className = 'reading-plan-modal full-plan';
        modal.innerHTML = `
            <div class="reading-plan-modal-content large">
                <div class="reading-plan-header">
                    <h2><i class="fas fa-calendar-alt"></i> Plano Completo - 365 Dias</h2>
                    <button class="close-modal" onclick="this.closest('.reading-plan-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="full-plan-grid">
                    ${plan.map(day => `
                        <div class="plan-day-card ${completedDays.includes(day.day) ? 'completed' : ''}">
                            <div class="day-number">Dia ${day.day}</div>
                            <div class="day-readings">
                                ${day.readings.map(r => `<div>${r}</div>`).join('')}
                            </div>
                            ${completedDays.includes(day.day) ? '<i class="fas fa-check-circle"></i>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Close current modal
        document.querySelector('.reading-plan-modal')?.remove();
        document.body.appendChild(modal);
    }
    
    // Reset reading plan
    resetReadingPlan() {
        if (confirm('Tem certeza que deseja resetar todo o progresso do plano de leitura?')) {
            readingPlan.resetProgress();
            this.showMessage('Progresso resetado com sucesso', 'info');
            
            // Close modal and reopen
            const modal = document.querySelector('.reading-plan-modal');
            if (modal) {
                modal.remove();
                this.showReadingPlanModal();
            }
        }
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
        if (window.authSystem && window.authSystem.showMessage) {
            window.authSystem.showMessage(message, type);
        } else {
            alert(message);
        }
    }
}

// Global instance
let devotionalManager = null;

// Initialize devotional
function initDevotional() {
    devotionalManager = new DevotionalManager();
    devotionalManager.init();
}

// Global functions
function saveDevotional() {
    if (devotionalManager) {
        devotionalManager.saveDevotional();
    }
}

function shareDevotional() {
    if (devotionalManager) {
        devotionalManager.shareDevotional();
    }
}

function printDevotional() {
    if (devotionalManager) {
        devotionalManager.printDevotional();
    }
}

function switchDevotionalLanguage(lang) {
    if (devotionalManager) {
        devotionalManager.switchLanguage(lang);
    }
}

function openReadingPlan() {
    if (devotionalManager) {
        devotionalManager.openReadingPlan();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Devotional module loaded');
});
