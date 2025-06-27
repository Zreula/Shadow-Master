// Gestionnaire des scènes de jeu
class Scenes {
    constructor(game) {
        this.game = game;
    }
    
    getScene(sceneId) {
        switch (sceneId) {
            case 'start': return this.getStartScene();
            case 'hub': return this.getHubScene();
            case 'recruit': return this.getRecruitScene();
            case 'missions': return this.getMissionsScene();
            case 'market': return this.getMarketScene();
            case 'upgrade': return this.getUpgradeScene();
            case 'explore': return this.getExploreScene();
            default: return this.getHubScene();
        }
    }
    
    getStartScene() {
        return {
            text: `
                <h2>🌙 L'Éveil des Ténèbres</h2>
                <p>Les brumes matinales se dissipent, révélant votre nouveau domaine. Cette forteresse oubliée, nichée dans les montagnes maudites, sera le berceau de votre empire des ombres.</p>
                <p>Les murs suintent d'une magie ancienne, et l'air vibre de promesses de pouvoir. Votre destin vous attend dans les profondeurs...</p>
                <p class="warning">Votre première mission : établir votre domination sur ces terres abandonnées par les dieux.</p>
                <p class="warning">Préparez-vous à plonger dans l'inconnu...</p>
            `,
            choices: [
                { text: '🏰 Entrer dans le donjon', action: () => this.game.showScene('hub') }
            ]
        };
    }
    
    getHubScene() {
        const upgradeAvailable = this.game.actions.canUpgradeDungeon();
        const newFeaturesText = this.game.player.dungeonLevel > 1 ? 
            `<p class="success">✨ Nouvelles fonctionnalités débloquées grâce à votre donjon niveau ${this.game.player.dungeonLevel} !</p>` : '';
        
        const timeOfDay = this.game.player.energy > 0 ? '🌙 Nuit' : '🌅 Aube (Repos nécessaire)';
        const energyColor = this.game.player.energy <= 1 ? '#e74c3c' : (this.game.player.energy <= 2 ? '#f39c12' : '#27ae60');
        
        return {
            text: `
                <h2>🏰 Hall des Ombres Éternelles</h2>
                <p>Vous dominez votre domaine depuis votre trône d'obsidienne. Les torches noires projettent des ombres dansantes sur les murs gravés de runes anciennes.</p>
                ${newFeaturesText}
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;">
                        <strong>💰 Trésor :</strong> ${this.game.player.gold} pièces d'or
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;">
                        <strong>⭐ Terreur :</strong> ${this.game.player.reputation} points
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;">
                        <strong>👹 Légions :</strong> ${this.game.player.monsters.length}/${this.game.player.maxMonsters} créatures
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;">
                        <strong>🏰 Forteresse :</strong> Niveau ${this.game.player.dungeonLevel}
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;">
                        <strong style="color: ${energyColor};">⚡ Énergie :</strong> <span style="color: ${energyColor};">${this.game.player.energy}/${this.game.player.maxEnergy}</span>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;">
                        <strong>📅 Jour ${this.game.player.day}</strong> - ${timeOfDay}
                    </div>
                </div>
                ${this.game.player.energy === 0 ? '<p class="warning">⚠️ Vous êtes épuisé ! Vous devez vous reposer pour passer au jour suivant.</p>' : ''}
            `,
            choices: [
                { text: '👹 Casernes (Recruter des monstres)', action: () => this.game.showScene('recruit'), disabled: this.game.player.energy === 0 },
                { text: '⚔️ Table de Guerre (Missions)', action: () => this.game.showScene('missions'), disabled: this.game.player.energy === 0 },
                { text: '🏪 Marché Noir (Équipements)', action: () => this.game.showScene('market'), disabled: this.game.player.dungeonLevel < 2 || this.game.player.energy === 0 },
                { text: '🔨 Améliorer le Donjon', action: () => this.game.showScene('upgrade'), disabled: !upgradeAvailable || this.game.player.energy === 0 },
                { text: '🌙 Explorer les Ténèbres', action: () => this.game.showScene('explore'), disabled: this.game.player.energy === 0 },
                { text: '🔮 Méditer dans les Ombres', action: () => this.game.actions.meditate(), disabled: this.game.player.energy === 0 },
                { text: '💤 Se reposer (Passer au jour suivant)', action: () => this.game.rest(), disabled: this.game.player.energy > 0 }
            ]
        };
    }
    
    getRecruitScene() {
        let monsterOptions = '<div style="display: grid; gap: 15px;">';
        
        Object.entries(this.game.monsterTypes).forEach(([key, monster]) => {
            const canAfford = this.game.player.gold >= monster.cost;
            const hasSpace = this.game.player.monsters.length < this.game.player.maxMonsters;
            const available = canAfford && hasSpace;
            
            const rarityColor = {
                'commun': '#888',
                'rare': '#4a90e2',
                'épique': '#9b59b6',
                'légendaire': '#f39c12'
            };
            
            monsterOptions += `
                <div class="monster-item" style="opacity: ${available ? '1' : '0.5'}; border-left-color: ${rarityColor[monster.rarity]};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <strong>${monster.emoji} ${monster.name}</strong>
                        <span style="color: ${rarityColor[monster.rarity]}; font-size: 0.8em; font-weight: bold;">${monster.rarity.toUpperCase()}</span>
                    </div>
                    <p style="font-style: italic; margin-bottom: 8px; color: #aaa;">${monster.description}</p>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 8px; font-size: 0.9em;">
                        <span>⚔️ ${monster.baseStats.force}</span>
                        <span>🛡️ ${monster.baseStats.defense}</span>
                        <span>⚡ ${monster.baseStats.vitesse}</span>
                        <span>🔮 ${monster.baseStats.magie}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: #f1c40f;">💰 ${monster.cost} or</span>
                        ${available ? `<button class="choice-btn" onclick="game.actions.recruitMonster('${key}')" style="padding: 6px 12px; font-size: 0.9em;">Recruter</button>` : '<span style="color: #e74c3c; font-size: 0.9em;">Indisponible</span>'}
                    </div>
                </div>
            `;
        });
        
        monsterOptions += '</div>';
        
        return {
            text: `
                <h2>👹 Casernes des Légions Infernales</h2>
                <p>Les échos de rugissements et de grognements résonnent dans ces halls sombres. Ici, vous pouvez recruter des créatures des ténèbres pour servir vos ambitions maléfiques.</p>
                <div style="background: rgba(139,69,19,0.2); padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>💰 Or disponible :</strong> ${this.game.player.gold}</p>
                    <p><strong>🏠 Casernes :</strong> ${this.game.player.monsters.length}/${this.game.player.maxMonsters} places occupées</p>
                </div>
                ${monsterOptions}
            `,
            choices: [
                { text: '🏰 Retourner au Hall Principal', action: () => this.game.showScene('hub') }
            ]
        };
    }
    
    getMissionsScene() {
        const totalPower = this.game.calculateTotalPower();
        let missionOptions = '<div class="missions-list">';
        
        Object.entries(this.game.missions).forEach(([key, mission]) => {
            const canAttempt = totalPower >= mission.requiredPower && 
                              this.game.player.dungeonLevel >= mission.unlockLevel && 
                              this.game.player.energy >= mission.energyCost;
            
            // Cacher les missions non disponibles
            if (!canAttempt) return;
            
            const difficultyClass = {
                'Facile': 'easy',
                'Moyen': 'medium',
                'Difficile': 'hard',
                'Très Difficile': 'hard',
                'Épique': 'hard',
                'Légendaire': 'hard',
                'Mythique': 'hard',
                'Cosmique': 'hard'
            };
            
            missionOptions += `
                <div class="mission-card">
                    <div class="mission-header">
                        <h3 class="mission-title">${mission.name}</h3>
                        <span class="mission-difficulty ${difficultyClass[mission.difficulty]}">${mission.difficulty}</span>
                    </div>
                    <p class="mission-description">${mission.description}</p>
                    <div class="mission-details">
                        <div class="mission-info">
                            <div class="mission-requirements">
                                <div class="requirement">
                                    <span class="requirement-icon">⚡</span>
                                    <span class="requirement-text">Énergie: ${mission.energyCost}</span>
                                </div>
                                <div class="requirement">
                                    <span class="requirement-icon">💪</span>
                                    <span class="requirement-text">Puissance: ${mission.requiredPower}</span>
                                </div>
                                <div class="requirement">
                                    <span class="requirement-icon">🏰</span>
                                    <span class="requirement-text">Niveau: ${mission.unlockLevel}</span>
                                </div>
                            </div>
                            <div class="mission-rewards">
                                <div class="reward-gold">💰 +${mission.reward.gold}</div>
                                <div class="reward-reputation">⭐ +${mission.reward.reputation}</div>
                            </div>
                        </div>
                        <div class="mission-actions">
                            <button class="mission-btn" onclick="window.game.actions.startMission('${key}')">
                                Lancer Mission
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        missionOptions += '</div>';
        
        return {
            text: `
                <h2>⚔️ Table de Guerre</h2>
                <p>Des cartes du royaume s'étalent devant vous, marquées de cibles potentielles. Chaque mission est une opportunité d'étendre votre terreur sur le monde.</p>
                <div class="army-status">
                    <div class="status-item">
                        <span class="status-icon">💪</span>
                        <span class="status-label">Puissance totale:</span>
                        <span class="status-value">${totalPower}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-icon">⚡</span>
                        <span class="status-label">Énergie disponible:</span>
                        <span class="status-value">${this.game.player.energy}/${this.game.player.maxEnergy}</span>
                    </div>
                </div>
                ${missionOptions}
            `,
            choices: [
                { text: '🏰 Retourner au Hall Principal', action: () => this.game.showScene('hub') }
            ]
        };
    }
    
    getMarketScene() {
        if (this.game.player.dungeonLevel < 2) {
            return {
                text: `
                    <h2>🏪 Marché Noir</h2>
                    <p class="error">Le marché noir n'est pas encore disponible. Améliorez votre donjon au niveau 2 pour débloquer cette fonctionnalité.</p>
                `,
                choices: [
                    { text: '🏰 Retourner au Hall Principal', action: () => this.game.showScene('hub') }
                ]
            };
        }
        
        let equipmentOptions = '<div style="display: grid; gap: 12px;">';
        
        Object.entries(this.game.equipment).forEach(([key, item]) => {
            const canAfford = this.game.player.gold >= item.cost;
            
            equipmentOptions += `
                <div class="equipment-item" style="opacity: ${canAfford ? '1' : '0.6'};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <strong>${item.emoji} ${item.name}</strong>
                        <span style="color: #888; font-size: 0.8em;">${item.slot}</span>
                    </div>
                    <div style="margin-bottom: 8px; font-size: 0.9em;">
                        ${Object.entries(item.stats).map(([stat, value]) => `<span style="color: #27ae60;">${stat}: +${value}</span>`).join(' ')}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: #f1c40f;">💰 ${item.cost} or</span>
                        ${canAfford ? `<button class="choice-btn" onclick="game.actions.buyEquipment('${key}')" style="padding: 6px 12px; font-size: 0.9em;">Acheter</button>` : '<span style="color: #e74c3c; font-size: 0.9em;">Trop cher</span>'}
                    </div>
                </div>
            `;
        });
        
        equipmentOptions += '</div>';
        
        return {
            text: `
                <h2>🏪 Marché Noir des Ombres</h2>
                <p>Des marchands encagoulés murmurent dans les recoins sombres, proposant des équipements maudits et des artefacts interdits. Leur or brille faiblement à la lueur des chandelles noires.</p>
                <div style="background: rgba(75,0,130,0.2); padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>💰 Or disponible :</strong> ${this.game.player.gold}</p>
                    <p><strong>🎒 Objets en inventaire :</strong> ${this.game.player.inventory.length}</p>
                </div>
                ${equipmentOptions}
            `,
            choices: [
                { text: '🏰 Retourner au Hall Principal', action: () => this.game.showScene('hub') }
            ]
        };
    }
    
    getUpgradeScene() {
        const nextLevel = this.game.player.dungeonLevel + 1;
        const upgrades = this.game.gameConfig.dungeonUpgrades || {};
        const upgrade = upgrades[nextLevel];
        
        if (!upgrade) {
            return {
                text: `
                    <h2>🔨 Maître Architecte</h2>
                    <p class="success">🎊 Félicitations ! Votre donjon a atteint son niveau maximum !</p>
                    <p>Votre forteresse maudite est maintenant la plus redoutable de toutes les terres sombres. Aucune amélioration supplémentaire n'est possible.</p>
                `,
                choices: [
                    { text: '🏰 Retourner au Hall Principal', action: () => this.game.showScene('hub') }
                ]
            };
        }
        
        const canAfford = this.game.player.gold >= upgrade.cost;
        
        return {
            text: `
                <h2>🔨 Architecte des Ténèbres</h2>
                <p>Les plans mystiques flottent devant vous, révélant les secrets pour transformer votre forteresse en un bastion encore plus terrifiant.</p>
                
                <div style="background: rgba(0,0,0,0.4); padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>🏗️ Amélioration disponible :</h3>
                    <h4 style="color: #f39c12;">${upgrade.name}</h4>
                    <p><strong>💰 Coût :</strong> ${upgrade.cost} or</p>
                    <p><strong>👹 Nouvelles casernes :</strong> ${upgrade.maxMonsters} places (actuellement ${this.game.player.maxMonsters})</p>
                    <p><strong>⚡ Énergie maximale :</strong> ${upgrade.maxEnergy} (actuellement ${this.game.player.maxEnergy})</p>
                    <p><strong>✨ Nouvelles fonctionnalités :</strong> ${upgrade.newFeatures.join(', ')}</p>
                </div>
                
                <div style="background: rgba(139,69,19,0.2); padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>💰 Or disponible :</strong> ${this.game.player.gold}</p>
                    <p><strong>🏰 Niveau actuel :</strong> ${this.game.player.dungeonLevel}</p>
                </div>
            `,
            choices: [
                { text: '🔨 Commencer les travaux', action: () => this.game.actions.upgradeDungeon(), disabled: !canAfford },
                { text: '🏰 Retourner au Hall Principal', action: () => this.game.showScene('hub') }
            ]
        };
    }
    
    getExploreScene() {
        return {
            text: `
                <h2>🌙 Exploration des Ténèbres</h2>
                <p>Votre donjon recèle encore de nombreux mystères. Des couloirs oubliés, des chambres secrètes et des passages interdits attendent votre exploration.</p>
                <p>Chaque expédition dans les profondeurs peut révéler des trésors, des connaissances anciennes, ou des rencontres inattendues...</p>
                
                <div style="background: rgba(25,25,112,0.2); padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>⚡ Énergie disponible :</strong> ${this.game.player.energy}/${this.game.player.maxEnergy}</p>
                    <p><strong>🗺️ Points d'exploration :</strong> ${this.game.player.explorationPoints}</p>
                </div>
            `,
            choices: [
                { text: '🔍 Fouiller les ruines anciennes', action: () => this.game.actions.exploreRuins(), disabled: this.game.player.energy === 0 },
                { text: '👻 Suivre les murmures spectraux', action: () => this.game.actions.followWhispers(), disabled: this.game.player.energy === 0 },
                { text: '🕳️ Descendre plus profondément', action: () => this.game.actions.exploreDeeper(), disabled: this.game.player.energy === 0 },
                { text: '🏰 Retourner au Hall Principal', action: () => this.game.showScene('hub') }
            ]
        };
    }
}
