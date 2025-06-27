// Fonctions utilitaires pour le jeu
class Utils {
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    static formatGold(amount) {
        return `${amount} or`;
    }
    
    static formatStats(stats) {
        return Object.entries(stats).map(([stat, value]) => `${stat}: +${value}`).join(', ');
    }
    
    static getDifficultyColor(difficulty) {
        const colors = {
            'Facile': '#27ae60',
            'Moyen': '#f39c12',
            'Difficile': '#e74c3c',
            'Très Difficile': '#8e44ad',
            'Épique': '#2c3e50',
            'Légendaire': '#000000',
            'Mythique': '#8B0000',
            'Cosmique': '#4B0082'
        };
        return colors[difficulty] || '#888';
    }
    
    static getRarityColor(rarity) {
        const colors = {
            'commun': '#888',
            'rare': '#4a90e2',
            'épique': '#9b59b6',
            'légendaire': '#f39c12'
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
            console.error(`Erreur lors du chargement de ${url}:`, error);
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
