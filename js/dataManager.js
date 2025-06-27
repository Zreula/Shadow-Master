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
        const monsters = this.monsters || {};
        
        // Appliquer les traductions si nécessaire
        if (window.translation && window.translation.getCurrentLanguage() !== 'fr') {
            const translatedMonsters = {};
            Object.entries(monsters).forEach(([key, monster]) => {
                translatedMonsters[key] = {
                    ...monster,
                    name: window.translation.getMonsterName(key, monster.name),
                    description: window.translation.getMonsterDescription(key, monster.description)
                };
            });
            return translatedMonsters;
        }
        
        return monsters;
    }
    
    async getEquipment() {
        if (!this.loaded) {
            await this.loadAllData();
        }
        const equipment = this.equipment || {};
        
        // Appliquer les traductions si nécessaire
        if (window.translation && window.translation.getCurrentLanguage() !== 'fr') {
            const translatedEquipment = {};
            Object.entries(equipment).forEach(([key, item]) => {
                translatedEquipment[key] = {
                    ...item,
                    name: window.translation.getEquipmentName(key, item.name)
                };
            });
            return translatedEquipment;
        }
        
        return equipment;
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
        const config = this.gameConfig || {};
        return window.translation ? window.translation.getGameData('gameConfig', config) : config;
    }
    
    // Méthodes utilitaires pour accéder aux données spécifiques
    getDungeonUpgrades() {
        const data = this.gameConfig?.dungeonUpgrades || {};
        return window.translation ? window.translation.getGameData('dungeonUpgrades', data) : data;
    }
    
    getRandomEvents() {
        const data = this.gameConfig?.randomEvents || [];
        return window.translation ? window.translation.getGameData('randomEvents', data) : data;
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
