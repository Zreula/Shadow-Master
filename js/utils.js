// Fonctions utilitaires pour le jeu
class Utils {
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    static formatGold(amount) {
        return `${amount} gold`;
    }
    
    static formatStats(stats) {
        return Object.entries(stats).map(([stat, value]) => `${stat}: +${value}`).join(', ');
    }
    
    static getDifficultyColor(difficulty) {
        const colors = {
            'Easy': '#27ae60',
            'Medium': '#f39c12',
            'Hard': '#e74c3c',
            'Very Hard': '#8e44ad',
            'Epic': '#2c3e50',
            'Legendary': '#000000',
            'Mythic': '#8B0000',
            'Cosmic': '#4B0082'
        };
        return colors[difficulty] || '#888';
    }
    
    static getRarityColor(rarity) {
        const colors = {
            'common': '#888',
            'rare': '#4a90e2',
            'epic': '#9b59b6',
            'legendary': '#f39c12'
        };
        return colors[rarity] || '#888';
    }
    
    static async loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
            return null;
        }
    }
    
    static formatTime() {
        return new Date().toLocaleTimeString();
    }
    
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}

// Export pour ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
