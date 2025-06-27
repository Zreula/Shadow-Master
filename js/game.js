// Classe principale du jeu Maître des Ombres
class Game {
    constructor() {
        this.dataManager = new DataManager();
        this.ui = new UI();
        this.actions = new Actions(this);
        this.scenes = new Scenes(this);
        
        // État du jeu
        this.currentScene = 'start';
        this.journal = [];
        
        // Données du joueur
        this.player = {
            gold: 50,
            reputation: 0,
            monsters: [],
            maxMonsters: 5,
            dungeonLevel: 1,
            inventory: [],
            explorationPoints: 0,
            energy: 5,
            maxEnergy: 5,
            day: 1,
            actionsToday: 0
        };
        
        // Données du jeu chargées depuis JSON
        this.monsterTypes = {};
        this.equipment = {};
        this.missions = {};
        this.gameConfig = {};
        
        this.initialized = false;
    }
    
    async init() {
        try {
            console.log('Initialisation du jeu...');
            
            // Chargement des données depuis les fichiers JSON
            const success = await this.dataManager.loadAllData();
            if (!success) {
                console.error('Erreur lors du chargement des données de jeu');
                return false;
            }
            
            // Récupération des données
            this.monsterTypes = await this.dataManager.getMonsters();
            this.equipment = await this.dataManager.getEquipment();
            this.missions = await this.dataManager.getMissions();
            this.gameConfig = await this.dataManager.getGameConfig();
            
            this.initialized = true;
            
            // Initialisation de l'interface utilisateur
            this.loadGame();
            this.updateUI();
            this.showScene('start');
            const journalMessage = window.translation ? window.translation.t('reignBeginsDetailed') : 'Votre règne commence dans les ténèbres...';
            this.addToJournal(`📖 ${journalMessage}`);
            this.startAutoSave();
            
            console.log('Jeu initialisé avec succès');
            return true;
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du jeu:', error);
            return false;
        }
    }
    
    startAutoSave() {
        setInterval(() => {
            this.saveGame(true);
        }, 30000); // Sauvegarde automatique toutes les 30 secondes
    }
    
    updateUI() {
        if (!this.ui) return;
        
        this.ui.updateStats({
            gold: this.player.gold,
            reputation: this.player.reputation,
            monsterCount: this.player.monsters.length,
            maxMonsters: this.player.maxMonsters,
            dungeonLevel: this.player.dungeonLevel,
            energy: this.player.energy,
            maxEnergy: this.player.maxEnergy,
            day: this.player.day
        });
        
        this.ui.updateMonstersList(this.player.monsters, this.equipment);
        this.ui.updateInventory(this.player.inventory, this.equipment);
        this.ui.updateJournal(this.journal);
    }
    
    addToJournal(message) {
        const timestamp = new Date().toLocaleTimeString();
        this.journal.unshift(`[${timestamp}] ${message}`);
        if (this.journal.length > 15) this.journal.pop();
        
        if (this.ui) {
            this.ui.updateJournal(this.journal);
        }
    }
    
    showScene(sceneId) {
        if (!this.scenes) return;
        
        this.currentScene = sceneId;
        const scene = this.scenes.getScene(sceneId);
        
        if (scene) {
            this.ui.displayScene(scene.text, scene.choices);
        }
    }
    
    // Calcul des statistiques d'un monstre
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
    
    // Calcul de la puissance totale de l'armée
    calculateTotalPower() {
        return this.player.monsters.reduce((total, monster) => {
            const stats = this.calculateMonsterStats(monster);
            return total + stats.force + stats.defense + stats.vitesse + stats.magie;
        }, 0);
    }
    
    // Système d'énergie
    consumeEnergy(amount) {
        this.player.energy = Math.max(0, this.player.energy - amount);
        this.player.actionsToday++;
        
        if (this.player.energy === 0) {
            const exhaustedMessage = window.translation ? window.translation.t('exhausted') : 'Vous êtes épuisé ! Vous devez vous reposer.';
            this.addToJournal(`⚡ ${exhaustedMessage}`);
        }
    }
    
    // Repos pour passer au jour suivant
    rest() {
        this.player.day++;
        this.player.energy = this.player.maxEnergy;
        this.player.actionsToday = 0;
        
        // Événements aléatoires pendant le repos
        if (Math.random() < 0.2 && this.gameConfig.restEvents) {
            const event = this.gameConfig.restEvents[Math.floor(Math.random() * this.gameConfig.restEvents.length)];
            if (event.gold) this.player.gold += event.gold;
            if (event.reputation) this.player.reputation += event.reputation;
            this.addToJournal(`🌙 ${event.text}`);
        }
        
        this.ui.displayScene(`
            <h2>💤 ${window.translation ? window.translation.t('newDay') : 'Nouveau Jour'}</h2>
            <p>${window.translation ? window.translation.t('restfulWakeup') : 'Vous vous réveillez après un repos réparateur dans les ténèbres de votre donjon.'}</p>
            <p class="success">🌅 ${window.translation ? window.translation.t('day') : 'Jour'} ${this.player.day} ${window.translation ? window.translation.t('dayBegins') : 'commence ! Votre énergie est restaurée'} (${this.player.maxEnergy}/${this.player.maxEnergy}).</p>
            <p>${window.translation ? window.translation.t('shadowsWhisper') : 'Les ombres vous murmurent que de nouveaux défis vous attendent...'}</p>
        `, [
            { text: `🏰 ${window.translation ? window.translation.t('startDay') : 'Commencer la journée'}`, action: () => this.showScene('hub') }
        ]);
        
        const journalMessage = window.translation ? `🌅 ${window.translation.t('day')} ${this.player.day} : ${window.translation.t('restComplete')}` : `🌅 Jour ${this.player.day} : Repos terminé, énergie restaurée !`;
        this.addToJournal(journalMessage);
        this.updateUI();
    }
    
    // Sauvegarde et chargement
    loadGame() {
        try {
            const saveData = localStorage.getItem('masterOfShadowsSave');
            if (saveData) {
                const parsed = JSON.parse(saveData);
                this.player = { ...this.player, ...parsed.player };
                this.currentScene = parsed.currentScene || 'start';
                this.journal = parsed.journal || [];
                
                console.log('Partie chargée avec succès');
                return true;
            }
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        }
        return false;
    }
    
    saveGame(isAuto = false) {
        try {
            const saveData = {
                player: this.player,
                currentScene: this.currentScene,
                journal: this.journal,
                timestamp: Date.now()
            };
            
            localStorage.setItem('masterOfShadowsSave', JSON.stringify(saveData));
            
            if (!isAuto) {
                const saveMessage = window.translation ? window.translation.t('gameSaved') : 'Partie sauvegardée !';
                this.addToJournal(`💾 ${saveMessage}`);
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            if (!isAuto) {
                const errorMessage = window.translation ? window.translation.t('saveError') : 'Erreur lors de la sauvegarde !';
                this.addToJournal(`❌ ${errorMessage}`);
            }
        }
    }
    
    deleteSave() {
        try {
            localStorage.removeItem('masterOfShadowsSave');
            const deleteMessage = window.translation ? window.translation.t('saveDeleted') : 'Sauvegarde supprimée !';
            this.addToJournal(`🗑️ ${deleteMessage}`);
            
            // Réinitialiser le jeu
            this.player = {
                gold: 50,
                reputation: 0,
                monsters: [],
                maxMonsters: 5,
                dungeonLevel: 1,
                inventory: [],
                explorationPoints: 0,
                energy: 5,
                maxEnergy: 5,
                day: 1,
                actionsToday: 0
            };
            this.currentScene = 'start';
            this.journal = [];
            
            this.updateUI();
            this.showScene('start');
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            const errorMessage = window.translation ? window.translation.t('deleteError') : 'Erreur lors de la suppression !';
            this.addToJournal(`❌ ${errorMessage}`);
        }
    }
    
    newGame() {
        const confirmMessage = window.translation ? window.translation.t('confirmNewGameLong') : 'Êtes-vous sûr de vouloir commencer un nouveau jeu ? Toute progression sera perdue !';
        const confirmReset = confirm(confirmMessage);
        if (confirmReset) {
            this.deleteSave();
            const newGameMessage = window.translation ? window.translation.t('newGameStarted') : 'Nouveau jeu commencé !';
            this.addToJournal(`🎮 ${newGameMessage}`);
        }
    }
    
    // Utilitaires
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
