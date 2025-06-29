// Classe principale du jeu Maître des Ombres
class Game {
    constructor() {
        this.dataManager = new DataManager();
        this.ui = new UI();
        this.actions = new Actions(this);
        this.scenes = new Scenes(this);
        this.combat = new Combat(this);
        
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
        
        this.initLanguageListener();
    }
    
    initLanguageListener() {
        // Écouter les changements de langue
        window.addEventListener('languageChanged', (event) => {
            this.onLanguageChanged(event.detail.language);
        });
    }
    
    onLanguageChanged(language) {
        // Mettre à jour toute l'interface après un changement de langue
        if (this.initialized) {
            this.updateUI();
            // Forcer le rafraîchissement de la scène actuelle
            if (this.currentScene) {
                this.showScene(this.currentScene);
            }
        }
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
            
            // Initialiser le système de combat
            await this.combat.initialize();
            
            this.initialized = true;
            
            // Initialisation de l'interface utilisateur
            this.loadGame();
            this.updateUI();
            this.showScene('start');
            const journalMessage = 'Your reign begins in the darkness...';
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
            Object.values(monster.equipment).forEach(equipId => {
                if (equipId && this.equipment[equipId]) {
                    const equipment = this.equipment[equipId];
                    if (equipment.stats) {
                        Object.entries(equipment.stats).forEach(([stat, value]) => {
                            baseStats[stat] = (baseStats[stat] || 0) + value;
                        });
                    }
                }
            });
        }
        
        return baseStats;
    }
    
    // Calcul de la puissance totale de l'armée
    calculateTotalPower() {
        return this.player.monsters.reduce((total, monster) => {
            return total + this.combat.calculateMonsterPower(monster);
        }, 0);
    }
    
    // Système d'énergie
    consumeEnergy(amount) {
        this.player.energy = Math.max(0, this.player.energy - amount);
        this.player.actionsToday++;
        
        if (this.player.energy === 0) {
            const exhaustedMessage = 'You are exhausted! You must rest.';
            this.addToJournal(`⚡ ${exhaustedMessage}`);
        }
    }
    
    // Repos pour passer au jour suivant
    rest() {
        // Traiter toutes les missions actives avant de commencer le nouveau jour
        const missionResults = this.combat.processMissions();
        
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

        // Afficher les résultats des missions s'il y en a
        let missionSummary = '';
        if (missionResults.length > 0) {
            // Utiliser le nouveau format de récapitulatif du système de combat
            const summary = this.combat.generateDayEndSummary(missionResults);
            missionSummary = summary.text.replace('<h2>🌙 End of Day Summary</h2>', '<h3>📋 Mission Reports</h3>');
        }
        
        this.ui.displayScene(`
            <h2>💤 New Day</h2>
            <p>You wake up after a restful sleep in the darkness of your dungeon.</p>
            <p class="success">🌅 Day ${this.player.day} begins! Your energy is restored (${this.player.maxEnergy}/${this.player.maxEnergy}).</p>
            ${missionSummary}
            <p>The shadows whisper to you that new challenges await...</p>
        `, [
            { text: `🏰 Start the Day`, action: () => this.showScene('hub') }
        ]);
        
        const journalMessage = `🌅 Day ${this.player.day}: Rest complete, energy restored!`;
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
                const saveMessage = 'Game saved!';
                this.addToJournal(`💾 ${saveMessage}`);
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            if (!isAuto) {
                const errorMessage = 'Save error!';
                this.addToJournal(`❌ ${errorMessage}`);
            }
        }
    }
    
    deleteSave() {
        try {
            localStorage.removeItem('masterOfShadowsSave');
            const deleteMessage = 'Save deleted!';
            this.addToJournal(`🗑️ ${deleteMessage}`);
            
            // Réinitialiser le jeu
            this.player = {
                gold: 50,
                reputation: 0,
                monsters: [],
                maxMonsters: 5,
                dungeonLevel: 1,
                inventory: [],
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
            const errorMessage = 'Delete error!';
            this.addToJournal(`❌ ${errorMessage}`);
        }
    }
    
    newGame() {
        const confirmMessage = 'Are you sure you want to start a new game? All progress will be lost!';
        const confirmReset = confirm(confirmMessage);
        if (confirmReset) {
            this.deleteSave();
            const newGameMessage = 'New game started!';
            this.addToJournal(`🎮 ${newGameMessage}`);
        }
    }
    
    // Utilitaires
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
