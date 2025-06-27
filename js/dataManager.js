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
            console.log('Chargement des données...');
            
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
                console.log('Toutes les données chargées avec succès');
                return true;
            } else {
                console.error('Erreur lors du chargement des données');
                return false;
            }
        } catch (error) {
            console.error('Erreur critique lors du chargement des données:', error);
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
