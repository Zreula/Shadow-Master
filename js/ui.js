// Gestionnaire de l'interface utilisateur
class UI {
    constructor() {
        this.initialized = false;
        this.initLanguageListener();
    }
    
    initLanguageListener() {
        // Écouter les changements de langue
        window.addEventListener('languageChanged', (event) => {
            this.onLanguageChanged(event.detail.language);
        });
    }
    
    onLanguageChanged(language) {
        // Mettre à jour les messages vides en fonction de la langue
        this.updateEmptyMessages();
        
        // Si on a des stats, les mettre à jour pour les labels
        if (window.game && window.game.stats) {
            this.updateStats(window.game.stats);
        }
    }
    
    updateEmptyMessages() {
        if (!window.translation) return;
        
        const monstersEmpty = document.querySelector('.monsters-list .empty');
        if (monstersEmpty) {
            monstersEmpty.textContent = window.translation.t('noMonsters');
        }
        
        const inventoryEmpty = document.querySelector('.inventory .empty');
        if (inventoryEmpty) {
            inventoryEmpty.textContent = window.translation.t('emptyInventory');
        }
    }
    
    showLoading() {
        // Afficher un indicateur de chargement si nécessaire
        console.log('Chargement en cours...');
    }
    
    hideLoading() {
        console.log('Chargement terminé');
    }
    
    showError(message) {
        console.error('Erreur UI:', message);
        alert('Erreur: ' + message);
    }
    
    updateStats(stats) {
        const elements = {
            gold: document.getElementById('gold'),
            reputation: document.getElementById('reputation'),
            monsterCount: document.getElementById('monsterCount'),
            maxMonsters: document.getElementById('maxMonsters'),
            dungeonLevel: document.getElementById('dungeonLevel'),
            energy: document.getElementById('energy'),
            day: document.getElementById('day')
        };
        
        if (elements.gold) elements.gold.textContent = stats.gold;
        if (elements.reputation) elements.reputation.textContent = stats.reputation;
        if (elements.monsterCount) elements.monsterCount.textContent = stats.monsterCount;
        if (elements.maxMonsters) elements.maxMonsters.textContent = stats.maxMonsters;
        if (elements.dungeonLevel) elements.dungeonLevel.textContent = stats.dungeonLevel;
        if (elements.energy) elements.energy.textContent = `${stats.energy}/${stats.maxEnergy}`;
        if (elements.day) elements.day.textContent = stats.day;
    }
    
    updateMonstersList(monsters, equipment) {
        const container = document.getElementById('monstersList');
        if (!container) return;
        
        if (monsters.length === 0) {
            const emptyMessage = window.translation ? window.translation.t('noMonsters') : 'Aucun monstre recruté';
            container.innerHTML = `<p class="empty">${emptyMessage}</p>`;
            return;
        }
        
        container.innerHTML = monsters.map((monster, index) => {
            const totalStats = this.calculateMonsterStats(monster);
            return `
                <div class="monster-card">
                    <div class="monster-header">
                        <div class="monster-emoji">${monster.emoji}</div>
                        <div class="monster-info">
                            <div class="monster-name">${monster.name}</div>
                            <div class="monster-level">${window.translation ? window.translation.t('level') : 'Niveau'} ${monster.level}</div>
                        </div>
                    </div>
                    <div class="monster-stats">
                        <div class="stat-group">
                            <span class="stat-label">⚔️</span>
                            <span class="stat-value">${totalStats.force}</span>
                        </div>
                        <div class="stat-group">
                            <span class="stat-label">🛡️</span>
                            <span class="stat-value">${totalStats.defense}</span>
                        </div>
                        <div class="stat-group">
                            <span class="stat-label">⚡</span>
                            <span class="stat-value">${totalStats.vitesse}</span>
                        </div>
                        <div class="stat-group">
                            <span class="stat-label">🔮</span>
                            <span class="stat-value">${totalStats.magie}</span>
                        </div>
                    </div>
                    ${monster.equipment ? `<div class="monster-equipment">
                        ${Object.values(monster.equipment).filter(eq => eq).map(eq => `<span class="equipment-item">${eq.emoji} ${eq.name}</span>`).join('')}
                    </div>` : ''}
                    <div class="monster-actions">
                        <button class="choice-btn btn-small" onclick="game.actions.showMonsterDetails(${index})">
                            ${window.translation ? window.translation.t('manage') : 'Gérer'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    calculateMonsterStats(monster) {
        const baseStats = { ...monster.baseStats };
        const levelBonus = (monster.level - 1) * 2;
        
        // Bonus de niveau
        Object.keys(baseStats).forEach(stat => {
            baseStats[stat] += Math.floor(levelBonus / 4);
        });
        
        // Bonus d'équipement
        if (monster.equipment) {
            Object.values(monster.equipment).forEach(item => {
                if (item && item.stats) {
                    Object.entries(item.stats).forEach(([stat, value]) => {
                        baseStats[stat] = (baseStats[stat] || 0) + value;
                    });
                }
            });
        }
        
        return baseStats;
    }
    
    updateInventory(inventory, equipment) {
        const container = document.getElementById('inventory');
        if (!container) return;
        
        if (inventory.length === 0) {
            const emptyMessage = window.translation ? window.translation.t('emptyInventory') : 'Inventaire vide';
            container.innerHTML = `<p class="empty">${emptyMessage}</p>`;
            return;
        }
        
        const itemCounts = {};
        inventory.forEach(item => {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        });
        
        container.innerHTML = Object.entries(itemCounts).map(([itemKey, count]) => {
            const item = equipment[itemKey];
            if (!item) return '';
            
            return `
                <div class="inventory-item">
                    <div class="item-header">
                        <div class="item-emoji">${item.emoji}</div>
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            ${count > 1 ? `<div class="item-count">x${count}</div>` : ''}
                        </div>
                    </div>
                    <div class="item-stats">
                        ${Object.entries(item.stats).map(([stat, value]) => `<span class="stat-bonus">${stat}: +${value}</span>`).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    updateJournal(journal) {
        const journalEl = document.getElementById('journal');
        if (!journalEl) return;
        
        journalEl.innerHTML = journal.map(entry => `<p class="fade-in">${entry}</p>`).join('');
    }
    
    displayScene(text, choices) {
        const storyEl = document.getElementById('storyText');
        const choicesContainer = document.getElementById('choicesContainer');
        
        if (storyEl) {
            storyEl.innerHTML = text;
            storyEl.className = 'fade-in';
        }
        
        if (choicesContainer) {
            choicesContainer.innerHTML = '';
            
            choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.className = 'choice-btn slide-in';
                button.textContent = choice.text;
                button.onclick = choice.action;
                button.style.animationDelay = `${index * 0.1}s`;
                if (choice.disabled) button.disabled = true;
                choicesContainer.appendChild(button);
            });
        }
    }
      addMessage(message) {
        console.log('Message UI:', message);
        // Pourrait être étendu pour afficher des messages dans l'interface
    }
}
