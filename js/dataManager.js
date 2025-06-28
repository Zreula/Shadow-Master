// Gestionnaire de données pour charger les fichiers JSON
class DataManager {
    constructor() {
        this.monsters = null;
        this.equipment = null;
        this.missions = null;
        this.gameConfig = null;
        this.loaded = false;
    }
    
    async loadAllData() {
        try {
            console.log('Loading data...');
            
            // Chargement parallèle de tous les fichiers JSON
            const [monstersData, equipmentData, missionsData, gameConfigData] = await Promise.all([
                Utils.loadJSON('./data/monsters.json'),
                Utils.loadJSON('./data/equipment.json'),
                Utils.loadJSON('./data/missions.json'),
                Utils.loadJSON('./data/gameConfig.json')
            ]);
            
            this.monsters = monstersData;
            this.equipment = equipmentData;
            this.missions = missionsData;
            this.gameConfig = gameConfigData;
            
            if (this.monsters && this.equipment && this.missions && this.gameConfig) {
                this.loaded = true;
                console.log('All data loaded successfully');
                return true;
            } else {
                console.error('Error loading data');
                return false;
            }
        } catch (error) {
            console.error('Critical error loading data:', error);
            return false;
        }
    }
    
    async getMonsters() {
        if (!this.loaded) {
            await this.loadAllData();
        }
        return this.monsters || {};
    }
    
    async getEquipment() {
        if (!this.loaded) {
            await this.loadAllData();
        }
        return this.equipment || {};
    }
    
    async getMissions() {
        if (!this.loaded) {
            await this.loadAllData();
        }
        return this.missions || {};
    }
    
    async getGameConfig() {
        if (!this.loaded) {
            await this.loadAllData();
        }
        return this.gameConfig || {};
    }
    
    // Méthodes utilitaires pour accéder aux données spécifiques
    getDungeonUpgrades() {
        return this.gameConfig?.dungeonUpgrades || {};
    }
    
    getRandomEvents() {
        return this.gameConfig?.randomEvents || [];
    }
    
    getDiscoveries(type) {
        return this.gameConfig?.discoveries?.[type] || [];
    }
    
    getMeditations() {
        return this.gameConfig?.meditations || [];
    }
    
    getCombatScenarios() {
        return this.gameConfig?.combatScenarios || [];
    }
    
    getRestEvents() {
        return this.gameConfig?.restEvents || [];
    }
    
    isLoaded() {
        return this.loaded;
    }
}
