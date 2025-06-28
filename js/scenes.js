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
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;">
                        <strong>💰 Treasure:</strong> ${this.game.player.gold} golds.
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;">
                        <strong>⭐ Reputation:</strong> ${this.game.player.reputation} points.
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;">
                        <strong>👹 Legions:</strong> ${this.game.player.monsters.length}/${this.game.player.maxMonsters} creatures.
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;">
                        <strong>🏰 Fortress:</strong> Level ${this.game.player.dungeonLevel}.
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;">
                        <strong style="color: ${energyColor};">⚡ Energy:</strong> <span style="color: ${energyColor};">${this.game.player.energy}/${this.game.player.maxEnergy}.</span>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px;">
                        <strong>📅 Day ${this.game.player.day}</strong> - ${timeOfDay}.
                    </div>
                </div>
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
        let monsterOptions = '<div style="display: grid; gap: 15px;">';
        
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
                unavailableReason = 'Not enough gold & barracks full';
            } else if (!canAfford) {
                unavailableReason = `Need ${monster.cost - this.game.player.gold} more gold`;
            } else if (!hasSpace) {
                unavailableReason = 'Barracks full - upgrade dungeon';
            }
            
            monsterOptions += `
                <div class="monster-item" style="opacity: ${available ? '1' : '0.5'}; border-left: 4px solid ${rarityColor[monster.rarity]}; display: flex; flex-direction: column; align-items: stretch;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <strong style="flex: 1;">${monster.emoji} ${monster.name}</strong>
                        <span style="color: ${rarityColor[monster.rarity]}; font-size: 0.8em; font-weight: bold; flex-shrink: 0;">${monster.rarity.toUpperCase()}</span>
                    </div>
                    <p style="font-style: italic; margin-bottom: 8px; color: #aaa; line-height: 1.3;">${monster.description}</p>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 8px; font-size: 0.9em;">
                        <span style="text-align: center;">⚔️ ${monster.baseStats.strength}</span>
                        <span style="text-align: center;">🛡️ ${monster.baseStats.defense}</span>
                        <span style="text-align: center;">⚡ ${monster.baseStats.speed}</span>
                        <span style="text-align: center;">🔮 ${monster.baseStats.magic}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                        <span style="font-weight: bold; color: #f1c40f; flex-shrink: 0;">💰 ${monster.cost} gold</span>
                        <div style="flex-shrink: 0; margin-left: 10px;">
                            ${available ? `<button class="choice-btn" onclick="game.actions.recruitMonster('${key}')" style="padding: 6px 12px; font-size: 0.9em; white-space: nowrap;">Recruit</button>` : `<span style="color: #e74c3c; font-size: 0.8em; text-align: right; display: block;">${unavailableReason}</span>`}
                        </div>
                    </div>
                </div>
            `;
        });
        
        monsterOptions += '</div>';
        
        return {
            text: `
                <h2>👹 Infernal Legions Barracks</h2>
                <p>Echoes of roars and growls resonate in these dark halls. Here, you can recruit creatures of darkness to serve your evil ambitions.</p>
                
                <div class="tutorial-info" style="background: rgba(52, 152, 219, 0.2); padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3498db;">
                    <h4>🎓 How Monster Recruitment Works:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>Gold Cost:</strong> Each monster requires gold to recruit</li>
                        <li><strong>Barracks Limit:</strong> You can only have ${this.game.player.maxMonsters} monsters at a time</li>
                        <li><strong>Monster Stats:</strong> Higher rarity = stronger base stats</li>
                        <li><strong>Level Growth:</strong> Monsters gain experience and level up through missions</li>
                        <li><strong>Equipment:</strong> Give your monsters weapons and armor to boost their power</li>
                    </ul>
                    <p><strong>💡 Tip:</strong> Upgrade your dungeon to increase barracks capacity!</p>
                </div>
                
                <div style="background: rgba(139,69,19,0.2); padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>💰 Available Gold:</strong> ${this.game.player.gold}</p>
                    <p><strong>🏠 Barracks:</strong> ${this.game.player.monsters.length}/${this.game.player.maxMonsters} places occupied</p>
                    ${this.game.player.monsters.length >= this.game.player.maxMonsters ? '<p class="warning">⚠️ Barracks are full! Upgrade your dungeon or dismiss a monster to recruit new ones.</p>' : ''}
                </div>
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
        let hiddenMissionsCount = 0;
        
        Object.entries(this.game.missions).forEach(([key, mission]) => {
            const canAttempt = totalPower >= mission.requiredPower && 
                              this.game.player.dungeonLevel >= mission.unlockLevel && 
                              this.game.player.energy >= mission.energyCost;
            
            // Compter les missions cachées
            if (!canAttempt) {
                hiddenMissionsCount++;
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
                            <button class="mission-btn" onclick="window.game.actions.startMission('${key}')">
                                Start Mission
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
                
                <div class="army-status">
                    <div class="status-item">
                        <span class="status-icon">💪</span>
                        <span class="status-label">Total Power:</span>
                        <span class="status-value">${totalPower}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-icon">⚡</span>
                        <span class="status-label">Available Energy:</span>
                        <span class="status-value">${this.game.player.energy}/${this.game.player.maxEnergy}</span>
                    </div>
                </div>
                
                ${hiddenMissionsCount > 0 ? `<p class="info" style="background: rgba(255, 193, 7, 0.2); padding: 10px; border-radius: 6px; margin: 10px 0;">📋 ${hiddenMissionsCount} more mission(s) available when you meet the requirements.</p>` : ''}
                
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
                        <span style="font-weight: bold; color: #f1c40f;">💰 ${item.cost} gold</span>
                        ${canAfford ? `<button class="choice-btn" onclick="game.actions.buyEquipment('${key}')" style="padding: 6px 12px; font-size: 0.9em;">Buy</button>` : '<span style="color: #e74c3c; font-size: 0.9em;">Too Expensive</span>'}
                    </div>
                </div>
            `;
        });
        
        equipmentOptions += '</div>';
        
        return {
            text: `
                <h2>🏪 Black Market</h2>
                <p>Shadowy merchants whisper in the dark corners, offering cursed equipment and forbidden artifacts. Their gold glimmers faintly in the light of black candles.</p>
                
                <div class="tutorial-info" style="background: rgba(52, 152, 219, 0.2); padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3498db;">
                    <h4>🎓 How Equipment Works:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>Equipment Slots:</strong> Each monster can equip weapon, armor, boots, and accessory</li>
                        <li><strong>Stat Bonuses:</strong> Equipment adds to your monster's base stats</li>
                        <li><strong>Power Boost:</strong> Better equipment = higher total power for missions</li>
                        <li><strong>Inventory System:</strong> Items go to your inventory first, then equip them to monsters</li>
                        <li><strong>Strategic Choice:</strong> Match equipment to monster strengths</li>
                    </ul>
                    <p><strong>💡 Tip:</strong> Equip your strongest monsters first for maximum mission power!</p>
                </div>
                
                <div style="background: rgba(75,0,130,0.2); padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>💰 Available Gold:</strong> ${this.game.player.gold}</p>
                    <p><strong>🎒 Inventory Items:</strong> ${this.game.player.inventory.length}</p>
                </div>
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
                <p>Your dungeon still holds many mysteries. Forgotten corridors, secret chambers and forbidden passages await your exploration.</p>
                <p>Each expedition into the depths can reveal treasures, ancient knowledge, or unexpected encounters...</p>
                
                <div class="tutorial-info" style="background: rgba(52, 152, 219, 0.2); padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3498db;">
                    <h4>🎓 How Exploration Works:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>Energy Cost:</strong> Each exploration action costs 1 energy</li>
                        <li><strong>Random Discoveries:</strong> You might find gold, reputation, or wild monsters</li>
                        <li><strong>Wild Monsters:</strong> Sometimes you'll encounter creatures that join you for free</li>
                        <li><strong>Risk vs Reward:</strong> Deeper exploration can yield better rewards</li>
                        <li><strong>Daily Activity:</strong> Great way to use remaining energy before resting</li>
                    </ul>
                    <p><strong>💡 Tip:</strong> Explore when you have energy left but can't afford missions!</p>
                </div>

                <div style="background: rgba(25,25,112,0.2); padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>⚡ Available Energy:</strong> ${this.game.player.energy}/${this.game.player.maxEnergy}</p>
                    <p><strong>🗺️ Exploration Points:</strong> ${this.game.player.explorationPoints}</p>
                    ${this.game.player.energy === 0 ? '<p class="warning">⚠️ You need energy to explore. Rest to restore energy!</p>' : ''}
                </div>
            `,
            choices: [
                { text: `🔍 Search ancient ruins`, action: () => this.game.actions.exploreRuins(), disabled: this.game.player.energy === 0 },
                { text: `👻 Follow spectral whispers`, action: () => this.game.actions.followWhispers(), disabled: this.game.player.energy === 0 },
                { text: `🕳️ Descend deeper`, action: () => this.game.actions.exploreDeeper(), disabled: this.game.player.energy === 0 },
                { text: `🏰 Return to Main Hall`, action: () => this.game.showScene('hub') }
            ]
        };
    }
}
