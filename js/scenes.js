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
            case 'missionPrep': return this.game.combat.getMissionPrepScene();
            default: return this.getHubScene();
        }
    }
    
    getStartScene() {
        return {
            text: `
                <h2>🌙 The Awakening of Darkness</h2>
                <p>The morning mists dissipate, revealing your new domain. This forgotten fortress, nestled in the cursed mountains, will be the cradle of your shadow empire.</p>
                <p>The walls ooze with ancient magic, and the air vibrates with promises of power. Your destiny awaits you in the depths...</p>
                <p class="warning">Your first mission: establish your dominance over these lands abandoned by the gods.</p>
                <p class="warning">Prepare to dive into the unknown...</p>
            `,
            choices: [
                { text: `🏰 Enter the dungeon`, action: () => this.game.showScene('hub') }
            ]
        };
    }
    
    getHubScene() {
        const upgradeAvailable = this.game.actions.canUpgradeDungeon();
        const newFeaturesText = this.game.player.dungeonLevel > 1 ? 
            `<p class="success">✨ New features unlocked thanks to your dungeon level ${this.game.player.dungeonLevel}!</p>` : '';
        
        const timeOfDay = this.game.player.energy > 0 ? 
            `🌙 Eternal Night` : 
            `🌅 Bloody Dawn (Rest needed)`;
        const energyColor = this.game.player.energy <= 1 ? '#e74c3c' : (this.game.player.energy <= 2 ? '#f39c12' : '#27ae60');
        
        // Calcul des informations d'upgrade pour le bouton
        const nextLevel = this.game.player.dungeonLevel + 1;
        const upgrades = this.game.gameConfig.dungeonUpgrades || {};
        const upgrade = upgrades[nextLevel];
        let upgradeButtonText = `🔨 Upgrade Dungeon`;
        
        if (upgrade) {
            const goldNeeded = upgrade.cost - this.game.player.gold;
            if (upgradeAvailable) {
                upgradeButtonText = `🔨 Upgrade Dungeon (${upgrade.cost} gold ✅)`;
            } else {
                upgradeButtonText = `🔨 Upgrade Dungeon (Need ${goldNeeded} more gold)`;
            }
        } else {
            upgradeButtonText = `🔨 Upgrade Dungeon (Max Level)`;
        }
        
        // Tutorial pour les nouveaux joueurs
        const isNewPlayer = this.game.player.day <= 2 && this.game.player.monsters.length === 0;
        const tutorialText = isNewPlayer ? `
            <div class="tutorial-info" style="background: rgba(52, 152, 219, 0.2); padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3498db;">
                <h4>🎓 Getting Started - Your First Steps:</h4>
                <ol style="margin: 10px 0; padding-left: 20px;">
                    <li><strong>Recruit Monsters:</strong> Visit the Barracks to recruit your first creatures</li>
                    <li><strong>Complete Missions:</strong> Use the War Table to earn gold and reputation</li>
                    <li><strong>Manage Energy:</strong> Each action costs energy - rest when depleted</li>
                    <li><strong>Upgrade Your Dungeon:</strong> Unlock new features and increase capacity</li>
                    <li><strong>Explore:</strong> Use remaining energy to explore for bonus rewards</li>
                </ol>
                <p><strong>💡 Tip:</strong> Start by recruiting a few monsters, then attempt your first mission!</p>
            </div>
        ` : '';
        
        return {
            text: `
                <h2>🏰 Hall of Eternal Shadows</h2>
                <p>You dominate your domain from your obsidian throne. Black torches cast dancing shadows on the walls engraved with ancient runes.</p>
                ${newFeaturesText}
                ${tutorialText}
                ${this.game.player.energy === 0 ? `<p class="warning">⚠️ You are exhausted! You must rest to go to the next day.</p>` : ''}
            `,
            choices: [
                { text: `👹 Barracks`, action: () => this.game.showScene('recruit'), disabled: this.game.player.energy === 0 },
                { text: `⚔️ War Table`, action: () => this.game.showScene('missions'), disabled: this.game.player.energy === 0 },
                { text: `🏪 Black Market`, action: () => this.game.showScene('market'), disabled: this.game.player.dungeonLevel < 2 || this.game.player.energy === 0 },
                { text: upgradeButtonText, action: () => this.game.showScene('upgrade'), disabled: !upgradeAvailable || this.game.player.energy === 0 },
                { text: `🌙 Explore Darkness`, action: () => this.game.showScene('explore'), disabled: this.game.player.energy === 0 },
                { text: `🔮 Meditate in Shadows`, action: () => this.game.actions.meditate(), disabled: this.game.player.energy === 0 },
                { text: `💤 Rest`, action: () => this.game.rest(), disabled: this.game.player.energy > 0 }
            ]
        };
    }
    
    getRecruitScene() {
        let monsterOptions = '<div class="recruit-monsters-list">';
        
        Object.entries(this.game.monsterTypes).forEach(([key, monster]) => {
            const canAfford = this.game.player.gold >= monster.cost;
            const hasSpace = this.game.player.monsters.length < this.game.player.maxMonsters;
            const available = canAfford && hasSpace;
            
            const rarityColor = {
                'common': '#888',
                'rare': '#4a90e2',
                'epic': '#9b59b6',
                'legendary': '#f39c12'
            };
            
            let unavailableReason = '';
            if (!canAfford && !hasSpace) {
                unavailableReason = 'No gold & full';
            } else if (!canAfford) {
                unavailableReason = `Need ${monster.cost - this.game.player.gold} gold`;
            } else if (!hasSpace) {
                unavailableReason = 'Barracks full';
            }
            
            monsterOptions += `
                <div class="recruit-monster-item" style="opacity: ${available ? '1' : '0.5'}; border-left: 3px solid ${rarityColor[monster.rarity]};">
                    <div class="recruit-monster-info">
                        <div class="recruit-monster-emoji">${monster.emoji}</div>
                        <div class="recruit-monster-name">${monster.name}</div>
                        <div class="recruit-monster-rarity" style="color: ${rarityColor[monster.rarity]};">${monster.rarity}</div>
                        <div class="recruit-monster-cost">�${monster.cost}</div>
                    </div>
                    <div class="recruit-monster-actions">
                        ${available ? `<button class="recruit-btn" onclick="game.actions.recruitMonster('${key}')">Recruit</button>` : `<div class="recruit-unavailable">${unavailableReason}</div>`}
                    </div>
                </div>
            `;
        });
        
        monsterOptions += '</div>';
        
        return {
            text: `
                <h2>👹 Infernal Legions Barracks</h2>
                <p>Here, you can recruit creatures of darkness to serve your evil ambitions.</p>
                
                ${this.game.player.monsters.length >= this.game.player.maxMonsters ? '<p class="warning">⚠️ Barracks are full! Upgrade your dungeon or dismiss a monster to recruit new ones.</p>' : ''}
                ${monsterOptions}
            `,
            choices: [
                { text: '🏰 Return to Main Hall', action: () => this.game.showScene('hub') }
            ]
        };
    }
    
    getMissionsScene() {
        const totalPower = this.game.calculateTotalPower();
        let missionOptions = '<div class="missions-list">';
        
        // Analyser les missions pour déterminer ce qui bloque le joueur
        let nextMissionPowerNeeded = null;
        let nextMissionName = null;
        let nextLevelRequired = null;
        let nextLevelMissionName = null;
        let hasAvailableMissions = false;
        
        Object.entries(this.game.missions).forEach(([key, mission]) => {
            const canAttempt = totalPower >= mission.requiredPower && 
                              this.game.player.dungeonLevel >= mission.unlockLevel && 
                              this.game.player.energy >= mission.energyCost;
            
            // Si la mission n'est pas accessible à cause de la puissance seulement (mais niveau OK)
            if (!canAttempt && 
                totalPower < mission.requiredPower && 
                this.game.player.dungeonLevel >= mission.unlockLevel) {
                
                const powerNeeded = mission.requiredPower - totalPower;
                
                // Si c'est la première mission trouvée ou si elle nécessite moins de puissance
                if (nextMissionPowerNeeded === null || powerNeeded < nextMissionPowerNeeded) {
                    nextMissionPowerNeeded = powerNeeded;
                    nextMissionName = mission.name;
                }
            }
            
            // Si la mission n'est pas accessible à cause du niveau de donjon
            if (!canAttempt && 
                this.game.player.dungeonLevel < mission.unlockLevel) {
                
                // Trouver la mission du niveau suivant le plus proche
                if (nextLevelRequired === null || mission.unlockLevel < nextLevelRequired) {
                    nextLevelRequired = mission.unlockLevel;
                    nextLevelMissionName = mission.name;
                }
            }
            
            // Compter les missions accessibles
            if (canAttempt) {
                hasAvailableMissions = true;
            }
            
            // Afficher seulement les missions accessibles
            if (!canAttempt) {
                return;
            }
            
            const difficultyClass = {
                'Easy': 'easy',
                'Medium': 'medium',
                'Hard': 'hard',
                'Very Hard': 'hard',
                'Epic': 'hard',
                'Legendary': 'hard',
                'Mythical': 'hard',
                'Cosmic': 'hard'
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
                                    <span class="requirement-text">Energy: ${mission.energyCost}</span>
                                </div>
                                <div class="requirement">
                                    <span class="requirement-icon">💪</span>
                                    <span class="requirement-text">Power: ${mission.requiredPower}</span>
                                </div>
                                <div class="requirement">
                                    <span class="requirement-icon">🏰</span>
                                    <span class="requirement-text">Level: ${mission.unlockLevel}</span>
                                </div>
                            </div>
                            <div class="mission-rewards">
                                <div class="reward-gold">💰 +${mission.reward.gold}</div>
                                <div class="reward-reputation">⭐ +${mission.reward.reputation}</div>
                            </div>
                        </div>
                        <div class="mission-actions">
                            <button class="mission-btn" onclick="window.game.combat.prepareMission('${key}'); window.game.showScene('missionPrep');">
                                Prepare Mission
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        missionOptions += '</div>';
        
        return {
            text: `
                <h2>⚔️ War Table</h2>
                <p>Maps of the kingdom spread before you, marked with potential targets. Each mission is an opportunity to extend your terror over the world.</p>
                
                <div class="tutorial-info" style="background: rgba(52, 152, 219, 0.2); padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3498db;">
                    <h4>🎓 How Missions Work:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>Power Requirement:</strong> Your total monster power must meet the minimum</li>
                        <li><strong>Energy Cost:</strong> Each mission consumes energy (rest to restore)</li>
                        <li><strong>Dungeon Level:</strong> Higher level missions require dungeon upgrades</li>
                        <li><strong>Rewards:</strong> Successful missions give gold and reputation</li>
                        <li><strong>Monster Growth:</strong> Your monsters gain experience from missions</li>
                    </ul>
                    <p><strong>💡 Tip:</strong> Recruit more monsters and equip them to increase your total power!</p>
                </div>
                
                ${this.generateMissionStatusMessage(hasAvailableMissions, nextMissionPowerNeeded, nextMissionName, totalPower, nextLevelRequired, nextLevelMissionName)}
                
                ${missionOptions}
            `,
            choices: [
                { text: '🏰 Return to Main Hall', action: () => this.game.showScene('hub') }
            ]
        };
    }
    
    getMarketScene() {
        if (this.game.player.dungeonLevel < 2) {
            return {
                text: `
                    <h2>🏪 Black Market</h2>
                    <p class="error">The black market is not yet available. Upgrade your dungeon to level 2 to unlock this feature.</p>
                    
                    <div class="tutorial-info" style="background: rgba(231, 76, 60, 0.2); padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #e74c3c;">
                        <h4>🔒 Locked Feature: Black Market</h4>
                        <p><strong>Requirement:</strong> Dungeon Level 2 or higher</p>
                        <p><strong>What you'll unlock:</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Purchase weapons, armor, and accessories</li>
                            <li>Equip your monsters to boost their stats</li>
                            <li>Access to powerful legendary equipment</li>
                        </ul>
                        <p><strong>💡 Tip:</strong> Save gold to upgrade your dungeon first!</p>
                    </div>
                `,
                choices: [
                    { text: '🏰 Return to Main Hall', action: () => this.game.showScene('hub') }
                ]
            };
        }
        
        let equipmentOptions = '<div class="market-equipment-list">';
        
        Object.entries(this.game.equipment).forEach(([key, item]) => {
            const canAfford = this.game.player.gold >= item.cost;
            
            // Créer un string compact des stats
            const statsString = Object.entries(item.stats).map(([stat, value]) => `${stat}:+${value}`).join(' ');
            
            equipmentOptions += `
                <div class="market-equipment-item" style="opacity: ${canAfford ? '1' : '0.6'};">
                    <div class="market-equipment-info">
                        <div class="market-equipment-emoji">${item.emoji}</div>
                        <div class="market-equipment-name">${item.name}</div>
                        <div class="market-equipment-slot">${item.slot}</div>
                        <div class="market-equipment-stats">${statsString}</div>
                        <div class="market-equipment-cost">💰${item.cost}</div>
                    </div>
                    <div class="market-equipment-actions">
                        ${canAfford ? `<button class="market-btn" onclick="game.actions.buyEquipment('${key}')">Buy</button>` : `<div class="market-unavailable">Too expensive</div>`}
                    </div>
                </div>
            `;
        });
        
        equipmentOptions += '</div>';
        
        return {
            text: `
                <h2>🏪 Black Market</h2>
                <p>Shadowy merchants offer cursed equipment and forbidden artifacts.</p>
                ${equipmentOptions}
            `,
            choices: [
                { text: '🏰 Return to Main Hall', action: () => this.game.showScene('hub') }
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
                    <h2>🔨 Master Architect</h2>
                    <p class="success">🎊 Congratulations! Your dungeon has reached its maximum level!</p>
                    <p>Your cursed fortress is now the most formidable of all dark lands. No further upgrades are possible.</p>
                `,
                choices: [
                    { text: '🏰 Return to Main Hall', action: () => this.game.showScene('hub') }
                ]
            };
        }
        
        const canAfford = this.game.player.gold >= upgrade.cost;
        const goldNeeded = upgrade.cost - this.game.player.gold;
        
        return {
            text: `
                <h2>🔨 Master Architect</h2>
                <p>Mystical plans float before you, revealing the secrets to transform your fortress into an even more terrifying bastion.</p>
                
                <div class="tutorial-info" style="background: rgba(52, 152, 219, 0.2); padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3498db;">
                    <h4>🎓 How Dungeon Upgrades Work:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>Gold Cost:</strong> You need enough gold to purchase the upgrade</li>
                        <li><strong>Monster Capacity:</strong> Higher levels allow more monsters in your army</li>
                        <li><strong>Energy Boost:</strong> Increased maximum energy for more daily actions</li>
                        <li><strong>New Features:</strong> Unlocks new areas and gameplay mechanics</li>
                    </ul>
                    <p><strong>💡 Tip:</strong> Complete missions and explore to earn more gold!</p>
                </div>
                
                <div style="background: rgba(0,0,0,0.4); padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>🏗️ Available Upgrade:</h3>
                    <h4 style="color: #f39c12;">${upgrade.name}</h4>
                    <p><strong>💰 Cost:</strong> ${upgrade.cost} gold ${canAfford ? '✅' : `❌ (${goldNeeded} more needed)`}</p>
                    <p><strong>👹 New Barracks:</strong> ${upgrade.maxMonsters} slots (currently ${this.game.player.maxMonsters})</p>
                    <p><strong>⚡ Max Energy:</strong> ${upgrade.maxEnergy} (currently ${this.game.player.maxEnergy})</p>
                    <p><strong>✨ New Features:</strong> ${upgrade.newFeatures.join(', ')}</p>
                </div>
                
                <div style="background: rgba(139,69,19,0.2); padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>💰 Available Gold:</strong> ${this.game.player.gold}</p>
                    <p><strong>🏰 Current Level:</strong> ${this.game.player.dungeonLevel}</p>
                </div>
                
                ${!canAfford ? `<p class="warning">⚠️ You need ${goldNeeded} more gold to afford this upgrade. Try completing missions or exploring!</p>` : ''}
            `,
            choices: [
                { text: '🔨 Start Upgrade', action: () => this.game.actions.upgradeDungeon(), disabled: !canAfford },
                { text: '🏰 Return to Main Hall', action: () => this.game.showScene('hub') }
            ]
        };
    }
    
    getExploreScene() {
        return {
            text: `
                <h2>🌙 Darkness Exploration</h2>
                <p>The shadows beckon you to explore the unknown depths of your domain. What secrets will you uncover?</p>
                
                ${this.game.player.energy === 0 ? '<p class="warning">⚠️ You need energy to explore. Rest to restore energy!</p>' : ''}
            `,
            choices: [
                { text: `🔍 Search ancient ruins`, action: () => this.game.actions.exploreRuins(), disabled: this.game.player.energy === 0 },
                { text: `👻 Follow spectral whispers`, action: () => this.game.actions.followWhispers(), disabled: this.game.player.energy === 0 },
                { text: `🕳️ Descend deeper`, action: () => this.game.actions.exploreDeeper(), disabled: this.game.player.energy === 0 },
                { text: `🏰 Return to Main Hall`, action: () => this.game.showScene('hub') }
            ]
        };
    }
    
    // Méthode pour générer le message de statut des missions
    generateMissionStatusMessage(hasAvailableMissions, nextMissionPowerNeeded, nextMissionName, totalPower, nextLevelRequired, nextLevelMissionName) {
        // Si le joueur a déjà toutes les missions disponibles pour son niveau
        if (hasAvailableMissions && nextMissionPowerNeeded === null && nextLevelRequired !== null) {
            return `<p class="info" style="background: rgba(52, 152, 219, 0.1); padding: 10px; border-radius: 6px; margin: 10px 0; border-left: 3px solid #3498db;">🏰 You've completed all missions available at your current dungeon level! <strong>Upgrade your fortress to level ${nextLevelRequired}</strong> to unlock "${nextLevelMissionName}" and more missions.</p>`;
        }
        
        // Si le joueur n'a pas assez de puissance pour la prochaine mission
        if (nextMissionPowerNeeded !== null) {
            return `<p class="info" style="background: rgba(255, 193, 7, 0.1); padding: 10px; border-radius: 6px; margin: 10px 0; border-left: 3px solid #f39c12;">💪 You need <strong>${nextMissionPowerNeeded} more power</strong> to unlock "${nextMissionName}" (Current power: ${totalPower})</p>`;
        }
        
        // Si toutes les missions du niveau actuel sont disponibles mais le joueur doit upgrader pour plus
        if (!hasAvailableMissions && nextLevelRequired !== null) {
            return `<p class="info" style="background: rgba(52, 152, 219, 0.1); padding: 10px; border-radius: 6px; margin: 10px 0; border-left: 3px solid #3498db;">🏰 <strong>Upgrade your fortress to level ${nextLevelRequired}</strong> to unlock "${nextLevelMissionName}" and start your conquest!</p>`;
        }
        
        return '';
    }
}
