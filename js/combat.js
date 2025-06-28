// Système de combat tactique
class Combat {
    constructor(game) {
        this.game = game;
        this.currentMission = null;
        this.selectedMonsters = [];
        this.combatData = null;
    }

    // Initialiser le système de combat
    async initialize() {
        try {
            // Charger les ennemis
            const enemiesResponse = await fetch('./data/enemies.json');
            this.enemies = await enemiesResponse.json();
            
            // Charger les capacités
            const abilitiesResponse = await fetch('./data/abilities.json');
            this.abilities = await abilitiesResponse.json();
            
            console.log('Combat system initialized with realistic enemies and abilities');
        } catch (error) {
            console.error('Failed to load combat data:', error);
            // Données de fallback
            this.enemies = this.getDefaultEnemies();
            this.abilities = this.getDefaultAbilities();
        }
    }

    // Données d'ennemis par défaut
    getDefaultEnemies() {
        return {
            "village_guard": {
                "name": "Village Guard",
                "emoji": "🛡️",
                "hp": 25,
                "attack": 8,
                "defense": 6,
                "speed": 5,
                "abilities": ["shield_bash"]
            }
        };
    }

    // Données de capacités par défaut
    getDefaultAbilities() {
        return {
            "abilities": {
                "shield_bash": {
                    "name": "Shield Bash",
                    "damage_multiplier": 0.8,
                    "effect": "stun"
                }
            },
            "monster_abilities": {
                "shadow_strike": {
                    "name": "Shadow Strike",
                    "damage_multiplier": 1.4,
                    "effect": "critical"
                }
            }
        };
    }

    // Démarrer la préparation d'une mission
    prepareMission(missionKey) {
        this.currentMission = this.game.missions[missionKey];
        this.selectedMonsters = [];
        
        // Vérifier que le joueur a assez d'énergie
        if (this.game.player.energy < this.currentMission.energyCost) {
            this.game.addToJournal(`❌ Not enough energy! You need ${this.currentMission.energyCost} energy for this mission.`);
            return this.game.scenes.getMissionsScene();
        }
        
        // Retourner la scène de préparation
        return this.getMissionPrepScene();
    }

    // Scène de préparation de mission
    getMissionPrepScene() {
        if (!this.currentMission) {
            return this.game.scenes.getMissionsScene();
        }

        let monsterSelection = '<div class="combat-monster-selection">';
        monsterSelection += '<h4>🎯 Select your monsters for this mission:</h4>';
        monsterSelection += '<div class="available-monsters">';

        this.game.player.monsters.forEach((monster, index) => {
            const isSelected = this.selectedMonsters.includes(index);
            const monsterType = this.game.monsterTypes[monster.type];
            
            // Calculer la puissance du monstre (power de base + level + équipement)
            const monsterPower = this.calculateMonsterPower(monster);
            
            monsterSelection += `
                <div class="combat-monster-item ${isSelected ? 'selected' : ''}" onclick="game.combat.toggleMonster(${index})">
                    <div class="monster-info">
                        <span class="monster-emoji">${monster.emoji || (monsterType ? monsterType.emoji : '👹')}</span>
                        <span class="monster-name">${monster.name}</span>
                        <span class="monster-level">Lv.${monster.level || 1}</span>
                        <span class="monster-power">💪${monsterPower}</span>
                    </div>
                    ${isSelected ? '<span class="selected-indicator">✅</span>' : '<span class="select-indicator">➕</span>'}
                </div>
            `;
        });

        monsterSelection += '</div>';
        
        const selectedPower = this.calculateSelectedPower();
        const powerNeeded = this.currentMission.requiredPower;
        const hasEnoughEnergy = this.game.player.energy >= this.currentMission.energyCost;
        const canStart = selectedPower >= powerNeeded && this.selectedMonsters.length > 0 && hasEnoughEnergy;

        monsterSelection += `
            <div class="mission-prep-summary">
                <p><strong>Selected Power:</strong> ${selectedPower} / ${powerNeeded} required</p>
                <p><strong>Monsters Selected:</strong> ${this.selectedMonsters.length}</p>
                <p><strong>Energy Available:</strong> ${this.game.player.energy} / ${this.currentMission.energyCost} required</p>
                ${selectedPower < powerNeeded ? '<p class="warning">⚠️ Select enough monsters to meet the power requirement!</p>' : ''}
                ${!hasEnoughEnergy ? '<p class="warning">⚠️ Not enough energy for this mission!</p>' : ''}
            </div>
        `;

        monsterSelection += '</div>';

        return {
            text: `
                <h2>⚔️ Mission Preparation: ${this.currentMission.name}</h2>
                <p>Choose your monsters wisely. Different enemies have different weaknesses, and your formation matters!</p>
                
                <div class="mission-brief">
                    <h4>📋 Mission Brief:</h4>
                    <p>${this.currentMission.description}</p>
                    <p><strong>Difficulty:</strong> ${this.currentMission.difficulty}</p>
                    <p><strong>Power Required:</strong> ${this.currentMission.requiredPower}</p>
                </div>

                ${monsterSelection}
            `,
            choices: this.getMissionPrepChoices(canStart, hasEnoughEnergy)
        };
    }

    // Calculer la puissance d'un monstre individuel
    calculateMonsterPower(monster) {
        if (!monster) return 0;
        
        // Puissance de base calculée à partir des stats
        const baseStats = monster.baseStats || { strength: 1, defense: 1, speed: 1, magic: 1 };
        const basePower = (baseStats.strength || 1) + (baseStats.defense || 1) + 
                         (baseStats.speed || 1) + (baseStats.magic || 1);
        
        // Bonus de niveau
        const levelBonus = ((monster.level || 1) - 1) * 2;
        
        // Bonus d'équipement (si présent)
        let equipmentBonus = 0;
        if (monster.equipment) {
            Object.values(monster.equipment).forEach(equipId => {
                if (equipId && this.game.equipment[equipId]) {
                    const equipment = this.game.equipment[equipId];
                    if (equipment.stats) {
                        // Additionner toutes les stats de l'équipement
                        equipmentBonus += Object.values(equipment.stats).reduce((sum, stat) => sum + (stat || 0), 0);
                    }
                }
            });
        }
        
        const totalPower = basePower + levelBonus + equipmentBonus;
        
        return totalPower;
    }

    // Basculer la sélection d'un monstre
    toggleMonster(index) {
        const selectedIndex = this.selectedMonsters.indexOf(index);
        
        if (selectedIndex === -1) {
            // Ajouter le monstre
            this.selectedMonsters.push(index);
        } else {
            // Retirer le monstre
            this.selectedMonsters.splice(selectedIndex, 1);
        }

        // Mettre à jour l'interface et rafraîchir la scène
        this.game.updateUI();
        this.game.showScene('missionPrep');
    }

    // Calculer la puissance des monstres sélectionnés
    calculateSelectedPower() {
        return this.selectedMonsters.reduce((total, index) => {
            const monster = this.game.player.monsters[index];
            if (!monster) return total;
            return total + this.calculateMonsterPower(monster);
        }, 0);
    }

    // Démarrer le combat avec simulation en temps réel
    startCombat() {
        if (this.selectedMonsters.length === 0) {
            return this.getMissionPrepScene();
        }

        // Vérifier que le joueur a encore assez d'énergie
        if (this.game.player.energy < this.currentMission.energyCost) {
            this.game.addToJournal(`❌ Not enough energy! You need ${this.currentMission.energyCost} energy for this mission.`);
            // Forcer le rafraîchissement de la scène de préparation
            this.game.showScene('missionPrep');
            return;
        }

        // Consommer l'énergie
        this.game.player.energy -= this.currentMission.energyCost;
        
        // Mettre à jour l'interface utilisateur immédiatement
        this.game.updateUI();

        // Démarrer la simulation de combat en temps réel
        this.startRealTimeCombat();
    }

    // Nouvelle méthode pour démarrer le combat en temps réel
    startRealTimeCombat() {
        // Afficher l'écran de combat initial
        this.showCombatScreen();
        
        // Préparer les données de combat
        const combatData = this.prepareCombatData();
        
        // Démarrer la simulation progressive
        this.runProgressiveCombat(combatData);
    }

    // Afficher l'écran de combat initial
    showCombatScreen() {
        const playerTeam = this.selectedMonsters.map(index => {
            const monster = this.game.player.monsters[index];
            return this.getMonsterCombatStats(monster);
        });
        
        const enemyTeam = this.createEnemiesForMission(Object.keys(this.game.missions).find(key => 
            this.game.missions[key] === this.currentMission
        ));
        
        const combatScreenHtml = `
            <div class="combat-arena">
                <h2>⚔️ ${this.currentMission.name}</h2>
                <p>${this.currentMission.description}</p>
                
                <div class="combat-forces">
                    <div class="player-forces">
                        <h3>👹 Your Army</h3>
                        <div class="monster-list">
                            ${playerTeam.map(unit => 
                                `<div class="monster-card">
                                    ${unit.emoji} ${unit.name} 
                                    <span class="hp">❤️${unit.hp}</span>
                                    <span class="attack">⚔️${unit.attack}</span>
                                    <span class="defense">🛡️${unit.defense}</span>
                                    <span class="speed">⚡${unit.speed}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="vs-divider">⚔️ VS ⚔️</div>
                    
                    <div class="enemy-forces">
                        <h3>💀 Enemy Forces</h3>
                        <div class="enemy-list">
                            ${enemyTeam.map(unit => 
                                `<div class="enemy-card">
                                    ${unit.emoji} ${unit.name}
                                    <span class="hp">❤️${unit.hp}</span>
                                    <span class="attack">⚔️${unit.attack}</span>
                                    <span class="defense">🛡️${unit.defense}</span>
                                    <span class="speed">⚡${unit.speed}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="combat-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="combatProgress" style="width: 0%"></div>
                    </div>
                    <p class="progress-text">🔥 Battle is about to begin...</p>
                </div>
                
                <div class="combat-log" id="combatLog" style="max-height: 400px; overflow-y: auto; background: rgba(0,0,0,0.4); padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="color: #888; font-style: italic;">📜 Combat journal will appear here...</p>
                </div>
                
                <div class="combat-actions" id="combatActions" style="display: none;">
                    <!-- Les boutons d'action apparaîtront ici après le combat -->
                </div>
            </div>
        `;
        
        this.game.ui.displayScene(combatScreenHtml, []);
    }

    // Préparer toutes les données nécessaires pour le combat
    prepareCombatData() {
        // Utiliser le nouveau système de combat réaliste
        const combatResult = this.simulateRealisticCombat();
        
        return {
            victory: combatResult.victory,
            outcome: combatResult.outcome,
            combatLog: combatResult.combatLog,
            totalSteps: combatResult.combatLog.length,
            playerTeam: combatResult.playerTeam,
            enemyTeam: combatResult.enemyTeam,
            casualties: combatResult.casualties
        };
    }

    // Exécuter le combat progressivement
    async runProgressiveCombat(combatData) {
        const logElement = document.getElementById('combatLog');
        const progressElement = document.getElementById('combatProgress');
        const progressText = document.querySelector('.progress-text');
        
        // Vider le journal
        logElement.innerHTML = '';
        
        // Afficher chaque ligne du journal progressivement
        for (let i = 0; i < combatData.combatLog.length; i++) {
            const line = combatData.combatLog[i];
            const progress = ((i + 1) / combatData.totalSteps) * 100;
            
            // Mettre à jour la barre de progression
            progressElement.style.width = `${progress}%`;
            
            // Mettre à jour le texte de progression
            if (i < 5) {
                progressText.textContent = '🎯 Preparing for battle...';
            } else if (i < combatData.totalSteps - 5) {
                progressText.textContent = '⚔️ Battle raging...';
            } else {
                progressText.textContent = '🏁 Battle concluding...';
            }
            
            // Ajouter la ligne au journal
            if (line === '---') {
                logElement.innerHTML += '<hr style="border: 1px solid #555; margin: 10px 0;">';
            } else {
                const lineElement = document.createElement('p');
                lineElement.style.cssText = 'margin: 5px 0; line-height: 1.4; opacity: 0; transition: opacity 0.3s ease;';
                lineElement.innerHTML = line;
                logElement.appendChild(lineElement);
                
                // Animation d'apparition
                setTimeout(() => {
                    lineElement.style.opacity = '1';
                }, 50);
            }
            
            // Faire défiler vers le bas
            logElement.scrollTop = logElement.scrollHeight;
            
            // Délai entre chaque ligne (plus court pour les séparateurs)
            const delay = line === '---' ? 200 : 
                         line.includes('<strong>') ? 800 : 
                         line.startsWith('   ') ? 400 : 600;
            
            await this.delay(delay);
        }
        
        // Combat terminé
        progressText.textContent = combatData.victory ? '🎉 Victory!' : '💀 Defeat...';
        progressElement.style.width = '100%';
        progressElement.style.backgroundColor = combatData.victory ? '#27ae60' : '#e74c3c';
        
        // Traiter les résultats
        this.processCombatResults(combatData);
        
        // Attendre un peu avant d'afficher les actions
        await this.delay(1500);
        
        // Afficher les boutons d'action
        this.showCombatResults(combatData);
    }

    // Fonction utilitaire pour créer des délais
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Afficher les résultats finaux du combat
    showCombatResults(result) {
        const actionsElement = document.getElementById('combatActions');
        
        let resultHtml = `
            <div class="combat-result ${result.victory ? 'victory' : 'defeat'}">
                <h3>${result.victory ? '🎉 Victory!' : '💀 Defeat...'}</h3>
        `;
        
        if (result.victory) {
            let equipmentRewardsHtml = '';
            if (result.equipmentRewards && result.equipmentRewards.length > 0) {
                equipmentRewardsHtml = `
                    <div class="equipment-rewards">
                        <h5>📦 Equipment Found:</h5>
                        ${result.equipmentRewards.map(item => 
                            `<p class="equipment-reward">${item.emoji} ${item.name}</p>`
                        ).join('')}
                    </div>
                `;
            }
            
            resultHtml += `
                <div class="mission-rewards">
                    <h4>🎁 Mission Rewards:</h4>
                    <p>💰 Gold: +${result.goldReward}</p>
                    <p>⭐ Reputation: +${result.repReward}</p>
                    <p>📈 Experience: +${result.experienceGain} for all participants</p>
                    ${equipmentRewardsHtml}
                    ${result.outcome === 'crushing_victory' ? '<p class="bonus">🔥 Crushing victory bonus applied!</p>' : ''}
                </div>
            `;
        } else {
            resultHtml += `
                <div class="mission-failure">
                    <h4>💔 No rewards from this defeat</h4>
                    <p>📈 Experience: +${result.experienceGain} (learning from failure)</p>
                    <p>💪 Your monsters gained valuable battle experience!</p>
                </div>
            `;
        }
        
        resultHtml += '</div>';
        
        // Boutons d'action
        const choices = this.getCombatResultChoices();
        const buttonsHtml = choices.map((choice, index) => 
            `<button class="choice-btn combat-result-btn-${index}" ${choice.disabled ? 'disabled' : ''}>${choice.text}</button>`
        ).join('');
        
        resultHtml += `<div class="combat-choices">${buttonsHtml}</div>`;
        
        actionsElement.innerHTML = resultHtml;
        actionsElement.style.display = 'block';
        
        // Configurer les événements des boutons
        choices.forEach((choice, index) => {
            const button = actionsElement.querySelector(`.combat-result-btn-${index}`);
            if (button && !button.disabled) {
                button.onclick = () => choice.action();
            }
        });
        
        // Mettre à jour l'interface utilisateur
        this.game.updateUI();
    }

    // Simuler le combat avec journal détaillé
    simulateCombat() {
        const playerPower = this.calculateSelectedPower();
        const enemyPower = this.currentMission.requiredPower;
        
        // Créer le journal de combat
        const combatLog = [];
        
        // Introduction du combat
        combatLog.push(`🎯 <strong>Mission: ${this.currentMission.name}</strong>`);
        combatLog.push(`📍 ${this.currentMission.description}`);
        combatLog.push(`⚔️ <em>Your forces approach the battlefield...</em>`);
        combatLog.push(`---`);
        
        // Présentation des forces
        combatLog.push(`👹 <strong>Your Army (Power: ${playerPower})</strong>`);
        this.selectedMonsters.forEach(index => {
            const monster = this.game.player.monsters[index];
            const power = this.calculateMonsterPower(monster);
            combatLog.push(`   ${monster.emoji} ${monster.name} (Lv.${monster.level}) - Power: ${power}`);
        });
        
        combatLog.push(`💀 <strong>Enemy Forces (Power: ${enemyPower})</strong>`);
        combatLog.push(`   ${this.getEnemyDescription()}`);
        combatLog.push(`---`);
        
        // Simulation du combat tour par tour
        const combatTurns = this.simulateCombatTurns(playerPower, enemyPower);
        combatLog.push(...combatTurns.log);
        
        return {
            victory: combatTurns.victory,
            outcome: combatTurns.outcome,
            playerPower: playerPower,
            enemyPower: enemyPower,
            powerDifference: Math.abs(playerPower - enemyPower),
            combatLog: combatLog
        };
    }

    // Générer une description des ennemis selon la mission
    getEnemyDescription() {
        const descriptions = {
            'Village Guards': '🛡️ Village Guards with rusty swords and wooden shields',
            'Bandits': '🏹 Ruthless bandits with daggers and crossbows',
            'Royal Soldiers': '⚔️ Well-armed royal soldiers in gleaming armor',
            'Elite Guards': '🛡️ Elite palace guards with enchanted weapons',
            'Holy Knights': '✨ Holy knights blessed with divine protection'
        };
        
        // Utiliser la difficulté de la mission pour déterminer le type d'ennemi
        const difficulty = this.currentMission.difficulty;
        if (difficulty === 'Easy') return descriptions['Village Guards'];
        if (difficulty === 'Medium') return descriptions['Bandits'];
        if (difficulty === 'Hard') return descriptions['Royal Soldiers'];
        if (difficulty === 'Very Hard') return descriptions['Elite Guards'];
        return descriptions['Holy Knights'];
    }

    // Simuler le combat tour par tour
    simulateCombatTurns(playerPower, enemyPower) {
        const log = [];
        
        // Facteur de chance pour la variabilité
        const playerRoll = playerPower * (0.8 + Math.random() * 0.4);
        const enemyRoll = enemyPower * (0.8 + Math.random() * 0.4);
        
        log.push(`⚡ <strong>Battle Begins!</strong>`);
        log.push(`🎲 Your forces roll: ${Math.round(playerRoll)} effective power`);
        log.push(`🎲 Enemy forces roll: ${Math.round(enemyRoll)} effective power`);
        log.push(`---`);
        
        // Simuler quelques tours de combat
        const turns = Math.min(3 + Math.floor(Math.random() * 3), this.selectedMonsters.length);
        
        for (let turn = 1; turn <= turns; turn++) {
            const monsterIndex = this.selectedMonsters[Math.floor(Math.random() * this.selectedMonsters.length)];
            const monster = this.game.player.monsters[monsterIndex];
            
            // Actions variées selon le tour
            if (turn === 1) {
                log.push(`🥊 Turn ${turn}: ${monster.emoji} ${monster.name} charges into battle!`);
                if (playerRoll > enemyRoll) {
                    log.push(`   💥 ${monster.name} lands a devastating blow on the enemy ranks!`);
                } else {
                    log.push(`   🛡️ The enemies block ${monster.name}'s attack skillfully!`);
                }
            } else if (turn === 2) {
                log.push(`⚔️ Turn ${turn}: ${monster.emoji} ${monster.name} unleashes a special attack!`);
                if (Math.random() > 0.5) {
                    log.push(`   ✨ ${monster.name}'s attack finds its mark - critical hit!`);
                } else {
                    log.push(`   ⚡ ${monster.name} is countered by enemy magic!`);
                }
            } else {
                log.push(`🔥 Turn ${turn}: ${monster.emoji} ${monster.name} fights with determination!`);
                const outcomes = [
                    `   💫 ${monster.name} overwhelms multiple enemies!`,
                    `   🎯 ${monster.name} strikes with precision!`,
                    `   💀 ${monster.name} shows no mercy!`,
                    `   ⚡ ${monster.name} dodges and counters!`
                ];
                log.push(outcomes[Math.floor(Math.random() * outcomes.length)]);
            }
        }
        
        log.push(`---`);
        
        // Déterminer le résultat final
        const victory = playerRoll > enemyRoll;
        const powerDifference = Math.abs(playerRoll - enemyRoll);
        
        let outcome;
        if (victory) {
            if (powerDifference > enemyPower * 0.5) {
                outcome = 'crushing_victory';
                log.push(`🎊 <strong>CRUSHING VICTORY!</strong>`);
                log.push(`💥 Your forces completely overwhelm the enemy!`);
                log.push(`🏃 The survivors flee in terror!`);
            } else if (powerDifference > enemyPower * 0.2) {
                outcome = 'victory';
                log.push(`🎉 <strong>VICTORY!</strong>`);
                log.push(`⚔️ Your forces emerge triumphant after fierce fighting!`);
                log.push(`👑 The battlefield is yours!`);
            } else {
                outcome = 'narrow_victory';
                log.push(`😤 <strong>Narrow Victory</strong>`);
                log.push(`🩸 Victory comes at a cost - the battle was close!`);
                log.push(`💪 Your forces barely secure the win!`);
            }
        } else {
            if (powerDifference > playerPower * 0.3) {
                outcome = 'crushing_defeat';
                log.push(`💀 <strong>CRUSHING DEFEAT!</strong>`);
                log.push(`😱 Your forces are completely routed!`);
                log.push(`🏃 You must retreat immediately!`);
            } else if (powerDifference > playerPower * 0.1) {
                outcome = 'defeat';
                log.push(`😞 <strong>Defeat</strong>`);
                log.push(`⚔️ Despite brave efforts, your forces are overwhelmed!`);
                log.push(`🛡️ A tactical retreat is necessary!`);
            } else {
                outcome = 'narrow_defeat';
                log.push(`😔 <strong>Narrow Defeat</strong>`);
                log.push(`💥 So close! Your forces fought valiantly but fell just short!`);
                log.push(`💪 This defeat will make you stronger!`);
            }
        }
        
        return {
            victory,
            outcome,
            log
        };
    }

    // Scène de résultat de combat
    getCombatResultScene(result) {
        let goldReward = 0;
        let repReward = 0;
        let experienceGain = 1;

        if (result.victory) {
            // Calculer les récompenses selon la qualité de la victoire
            const baseGold = this.currentMission.reward.gold;
            const baseRep = this.currentMission.reward.reputation;

            switch (result.outcome) {
                case 'crushing_victory':
                    goldReward = Math.round(baseGold * 1.5);
                    repReward = Math.round(baseRep * 1.5);
                    experienceGain = 3;
                    break;
                case 'victory':
                    goldReward = baseGold;
                    repReward = baseRep;
                    experienceGain = 2;
                    break;
                case 'narrow_victory':
                    goldReward = Math.round(baseGold * 0.8);
                    repReward = Math.round(baseRep * 0.8);
                    experienceGain = 1;
                    break;
            }

            // Appliquer les récompenses
            this.game.player.gold += goldReward;
            this.game.player.reputation += repReward;

            // Donner de l'expérience aux monstres participants
            this.selectedMonsters.forEach(index => {
                this.game.actions.giveExperience(index, experienceGain);
            });
            
            // Mettre à jour l'interface utilisateur
            this.game.updateUI();
        }

        const outcomeMessages = {
            'crushing_victory': {
                title: '🎊 Crushing Victory!',
                message: 'Your monsters dominate the battlefield with overwhelming force! The enemy flees in terror.',
                class: 'success'
            },
            'victory': {
                title: '✅ Victory!',
                message: 'Your dark legion emerges victorious. The mission is a success!',
                class: 'success'
            },
            'narrow_victory': {
                title: '⚖️ Narrow Victory',
                message: 'A hard-fought battle, but your monsters prevail. Some are wounded but alive.',
                class: 'warning'
            },
            'narrow_defeat': {
                title: '💥 Narrow Defeat',
                message: 'Your monsters fought bravely but were overwhelmed. They retreat to fight another day.',
                class: 'error'
            },
            'defeat': {
                title: '💀 Defeat',
                message: 'The mission failed. Your monsters return battered and demoralized.',
                class: 'error'
            }
        };

        const outcome = outcomeMessages[result.outcome];

        return {
            text: `
                <h2>⚔️ Combat Journal</h2>
                
                <div class="combat-log" style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0; max-height: 400px; overflow-y: auto; border-left: 4px solid #8b4513;">
                    ${result.combatLog.map(line => {
                        if (line === '---') return '<hr style="border: 1px solid #555; margin: 10px 0;">';
                        return `<p style="margin: 5px 0; line-height: 1.4;">${line}</p>`;
                    }).join('')}
                </div>

                ${result.victory ? `
                    <div class="mission-rewards" style="background: rgba(46, 125, 50, 0.2); padding: 15px; border-radius: 6px; margin: 15px 0;">
                        <h4>🎁 Mission Rewards:</h4>
                        <p>💰 Gold: +${goldReward}</p>
                        <p>⭐ Reputation: +${repReward}</p>
                        <p>📈 Experience: +${experienceGain} for all participants</p>
                    </div>
                ` : `
                    <div class="mission-failure" style="background: rgba(183, 28, 28, 0.2); padding: 15px; border-radius: 6px; margin: 15px 0;">
                        <h4>💔 No rewards from this defeat</h4>
                        <p>💪 But your monsters gained experience from the battle!</p>
                    </div>
                `}
            `,
            choices: this.getCombatResultChoices()
        };
    }

    // Traiter les résultats du combat (récompenses, XP, etc.)
    processCombatResults(result) {
        let goldReward = 0;
        let repReward = 0;
        let experienceGain = 0;
        let equipmentRewards = [];

        if (result.victory) {
            const baseGold = this.currentMission.reward.gold;
            const baseRep = this.currentMission.reward.reputation;

            // Calculer les récompenses selon le type de victoire
            switch (result.outcome) {
                case 'crushing_victory':
                    goldReward = Math.round(baseGold * 1.5);
                    repReward = Math.round(baseRep * 1.5);
                    experienceGain = 5;
                    break;
                case 'victory':
                    goldReward = baseGold;
                    repReward = baseRep;
                    experienceGain = 2;
                    break;
                case 'narrow_victory':
                    goldReward = Math.round(baseGold * 0.8);
                    repReward = Math.round(baseRep * 0.8);
                    experienceGain = 1;
                    break;
            }

            // Traiter les récompenses d'équipement
            if (this.currentMission.reward.items && this.currentMission.reward.items.length > 0) {
                // Chance d'obtenir de l'équipement selon le type de victoire
                let equipmentChance = 0.4; // 40% de base
                
                switch (result.outcome) {
                    case 'crushing_victory':
                        equipmentChance = 0.8; // 80% de chance
                        break;
                    case 'victory':
                        equipmentChance = 0.5; // 50% de chance
                        break;
                    case 'narrow_victory':
                        equipmentChance = 0.3; // 30% de chance
                        break;
                }

                if (Math.random() < equipmentChance) {
                    const randomItem = this.currentMission.reward.items[Math.floor(Math.random() * this.currentMission.reward.items.length)];
                    
                    // Vérifier que l'item existe dans l'équipement
                    if (this.game.equipment[randomItem]) {
                        this.game.player.inventory.push(randomItem);
                        equipmentRewards.push({
                            id: randomItem,
                            name: this.game.equipment[randomItem].name,
                            emoji: this.game.equipment[randomItem].emoji
                        });
                        this.game.addToJournal(`📦 You find ${this.game.equipment[randomItem].emoji} ${this.game.equipment[randomItem].name}!`);
                    } else {
                        // Si l'item n'existe pas, donner de l'or supplémentaire à la place
                        const bonusGold = Math.floor(Math.random() * 50) + 25; // 25-75 gold bonus
                        goldReward += bonusGold;
                        this.game.addToJournal(`💰 You find ancient treasures worth ${bonusGold} gold!`);
                    }
                }
            }

            // Appliquer les récompenses
            this.game.player.gold += goldReward;
            this.game.player.reputation += repReward;
            
            // Ajouter au storage des récompenses pour l'affichage
            result.goldReward = goldReward;
            result.repReward = repReward;
            result.equipmentRewards = equipmentRewards;
        } else {
            // Même en cas de défaite, un peu d'XP pour l'apprentissage
            experienceGain = 1;
            result.goldReward = 0;
            result.repReward = 0;
            result.equipmentRewards = [];
        }

        // Donner de l'expérience aux monstres participants
        this.selectedMonsters.forEach(index => {
            this.game.actions.giveExperience(index, experienceGain);
        });
        
        result.experienceGain = experienceGain;
    }

    // Générer les choix pour la scène de préparation de mission
    getMissionPrepChoices(canStart, hasEnoughEnergy) {
        const choices = [];

        // Si le joueur n'a pas d'énergie, proposer de se reposer
        if (!hasEnoughEnergy || this.game.player.energy < this.currentMission.energyCost) {
            choices.push({
                text: '💤 Rest (Restore Energy)', 
                action: () => {
                    this.game.rest();
                    this.game.showScene('hub');
                }
            });
        } else {
            // Sinon, proposer de démarrer la mission
            choices.push({
                text: '⚔️ Start Mission', 
                action: () => this.startCombat(), 
                disabled: !canStart 
            });
        }

        // Toujours permettre de retourner à la table de guerre
        choices.push({
            text: '🏰 Return to War Table', 
            action: () => this.game.showScene('missions') 
        });

        return choices;
    }

    // Générer les choix pour la scène de résultat de combat
    getCombatResultChoices() {
        const choices = [];

        // Vérifier si le joueur peut préparer une autre mission similaire
        const hasEnoughEnergyForSameMission = this.game.player.energy >= this.currentMission.energyCost;
        
        if (hasEnoughEnergyForSameMission) {
            choices.push({
                text: '🔄 Prepare Another Mission',
                action: () => this.game.showScene('missionPrep')
            });
        }

        // Toujours permettre de retourner à la table de guerre ou au hall principal
        choices.push({
            text: '⚔️ Return to War Table', 
            action: () => this.game.showScene('missions')
        });
        
        choices.push({
            text: '🏰 Return to Main Hall', 
            action: () => this.game.showScene('hub')
        });

        return choices;
    }

    // Créer les ennemis pour une mission
    createEnemiesForMission(missionKey) {
        const mission = this.game.missions[missionKey];
        const enemies = [];
        
        // Mapping des missions vers les types d'ennemis
        const missionEnemyMap = {
            "village": [
                { type: "village_guard", count: 2 },
                { type: "farm_worker", count: 3 }
            ],
            "ferme": [
                { type: "farm_worker", count: 4 }
            ],
            "caravane": [
                { type: "merchant_guard", count: 3 },
                { type: "village_guard", count: 1 }
            ],
            "convoi": [
                { type: "royal_soldier", count: 2 },
                { type: "merchant_guard", count: 2 }
            ],
            "chateau": [
                { type: "castle_knight", count: 2 },
                { type: "royal_soldier", count: 3 }
            ],
            "port": [
                { type: "port_captain", count: 1 },
                { type: "merchant_guard", count: 3 },
                { type: "royal_soldier", count: 2 }
            ]
        };
        
        const enemyGroups = missionEnemyMap[missionKey] || [
            { type: "village_guard", count: 2 }
        ];
        
        // Créer les instances d'ennemis
        enemyGroups.forEach(group => {
            for (let i = 0; i < group.count; i++) {
                const enemyTemplate = this.enemies[group.type];
                if (enemyTemplate) {
                    const enemy = {
                        id: `${group.type}_${i}`,
                        name: enemyTemplate.name,
                        emoji: enemyTemplate.emoji,
                        maxHp: enemyTemplate.hp,
                        hp: enemyTemplate.hp,
                        attack: enemyTemplate.attack,
                        defense: enemyTemplate.defense,
                        speed: enemyTemplate.speed,
                        abilities: [...enemyTemplate.abilities],
                        effects: [],
                        isAlive: true
                    };
                    enemies.push(enemy);
                }
            }
        });
        
        return enemies;
    }

    // Calculer les stats de combat d'un monstre
    getMonsterCombatStats(monster) {
        const baseStats = monster.baseStats || { strength: 1, defense: 1, speed: 1, magic: 1 };
        const level = monster.level || 1;
        
        // Calculer les stats de combat
        let hp = 20 + (baseStats.strength + baseStats.defense) * 3 + (level - 1) * 5;
        let attack = baseStats.strength + Math.floor(baseStats.magic / 2) + (level - 1) * 2;
        let defense = baseStats.defense + Math.floor(baseStats.strength / 3) + (level - 1);
        let speed = baseStats.speed + Math.floor(baseStats.magic / 3) + (level - 1);
        
        // Bonus d'équipement
        if (monster.equipment) {
            Object.values(monster.equipment).forEach(equipId => {
                if (equipId && this.game.equipment[equipId]) {
                    const equipment = this.game.equipment[equipId];
                    if (equipment.stats) {
                        hp += (equipment.stats.strength || 0) * 3;
                        attack += (equipment.stats.strength || 0) + (equipment.stats.magic || 0);
                        defense += (equipment.stats.defense || 0);
                        speed += (equipment.stats.speed || 0);
                    }
                }
            });
        }
        
        // Déterminer les capacités selon le type
        const abilities = this.getMonsterAbilities(monster);
        
        return {
            name: monster.name,
            emoji: monster.emoji,
            maxHp: hp,
            hp: hp,
            attack: attack,
            defense: defense,
            speed: speed,
            abilities: abilities,
            effects: [],
            isAlive: true,
            monsterId: monster.id || Math.random().toString(36).substr(2, 9)
        };
    }

    // Obtenir les capacités d'un monstre selon son type
    getMonsterAbilities(monster) {
        const typeAbilities = {
            "Imp": ["shadow_strike"],
            "Shadow": ["shadow_strike", "terror"],
            "Wraith": ["life_drain", "terror"],
            "Sorcerer": ["dark_magic"],
            "Lich": ["dark_magic", "life_drain"],
            "Demon": ["dark_magic", "terror"],
            "Orc": ["brute_force"],
            "Troll": ["brute_force", "rage"],
            "Dragon": ["brute_force", "dark_magic", "terror"]
        };
        
        return typeAbilities[monster.type] || ["shadow_strike"];
    }

    // Nouveau système de combat réaliste
    simulateRealisticCombat() {
        // Préparer les combattants
        const playerTeam = this.selectedMonsters.map(index => {
            const monster = this.game.player.monsters[index];
            return this.getMonsterCombatStats(monster);
        });
        
        const enemyTeam = this.createEnemiesForMission(Object.keys(this.game.missions).find(key => 
            this.game.missions[key] === this.currentMission
        ));
        
        const combatLog = [];
        let turn = 1;
        const maxTurns = 20; // Limite pour éviter les combats infinis
        
        // Introduction du combat
        combatLog.push(`🎯 <strong>Mission: ${this.currentMission.name}</strong>`);
        combatLog.push(`📍 ${this.currentMission.description}`);
        combatLog.push(`⚔️ <em>The battle begins!</em>`);
        combatLog.push(`---`);
        
        // Présentation des équipes
        combatLog.push(`👹 <strong>Your Army</strong>`);
        playerTeam.forEach(unit => {
            combatLog.push(`   ${unit.emoji} ${unit.name} - HP: ${unit.hp}, ATK: ${unit.attack}, DEF: ${unit.defense}`);
        });
        
        combatLog.push(`💀 <strong>Enemy Forces</strong>`);
        enemyTeam.forEach(unit => {
            combatLog.push(`   ${unit.emoji} ${unit.name} - HP: ${unit.hp}, ATK: ${unit.attack}, DEF: ${unit.defense}`);
        });
        combatLog.push(`---`);
        
        // Combat tour par tour
        while (turn <= maxTurns) {
            // Vérifier les conditions de victoire
            const alivePlayerUnits = playerTeam.filter(unit => unit.isAlive);
            const aliveEnemyUnits = enemyTeam.filter(unit => unit.isAlive);
            
            if (alivePlayerUnits.length === 0) {
                combatLog.push(`💀 <strong>DEFEAT!</strong> All your monsters have fallen!`);
                break;
            }
            
            if (aliveEnemyUnits.length === 0) {
                combatLog.push(`🎉 <strong>VICTORY!</strong> All enemies have been defeated!`);
                break;
            }
            
            combatLog.push(`🔥 <strong>Turn ${turn}</strong>`);
            
            // Créer l'ordre d'initiative basé sur la vitesse
            const allUnits = [...alivePlayerUnits, ...aliveEnemyUnits].sort((a, b) => {
                // Ajouter un facteur aléatoire pour la variété
                const aSpeed = a.speed + Math.random() * 3;
                const bSpeed = b.speed + Math.random() * 3;
                return bSpeed - aSpeed;
            });
            
            // Chaque unité agit
            for (const unit of allUnits) {
                if (!unit.isAlive) continue;
                
                const isPlayerUnit = playerTeam.includes(unit);
                const enemies = isPlayerUnit ? aliveEnemyUnits : alivePlayerUnits;
                const allies = isPlayerUnit ? alivePlayerUnits : aliveEnemyUnits;
                
                if (enemies.length === 0) break;
                
                // Choisir une cible
                const target = enemies[Math.floor(Math.random() * enemies.length)];
                
                // Effectuer l'attaque
                const attackResult = this.performAttack(unit, target, allies, combatLog);
                
                // Appliquer les dégâts
                if (attackResult.damage > 0) {
                    target.hp = Math.max(0, target.hp - attackResult.damage);
                    
                    if (target.hp <= 0) {
                        target.isAlive = false;
                        combatLog.push(`   💀 ${target.name} has been defeated!`);
                    } else if (target.hp <= target.maxHp * 0.3) {
                        combatLog.push(`   🩸 ${target.name} is critically wounded! (${target.hp}/${target.maxHp} HP)`);
                    }
                }
                
                // Vérifier si le combat est terminé
                if (enemies.filter(e => e.isAlive).length === 0) break;
            }
            
            turn++;
        }
        
        // Résultat final
        const victory = enemyTeam.filter(unit => unit.isAlive).length === 0;
        const playerCasualties = playerTeam.filter(unit => !unit.isAlive).length;
        const enemyCasualties = enemyTeam.filter(unit => !unit.isAlive).length;
        
        let outcome;
        if (victory) {
            if (playerCasualties === 0) {
                outcome = 'crushing_victory';
                combatLog.push(`🎊 <strong>FLAWLESS VICTORY!</strong> No casualties on your side!`);
            } else if (playerCasualties <= playerTeam.length * 0.3) {
                outcome = 'victory';
                combatLog.push(`🎉 <strong>VICTORY!</strong> Light casualties sustained.`);
            } else {
                outcome = 'narrow_victory';
                combatLog.push(`😤 <strong>Pyrrhic Victory</strong> - Heavy losses, but victory is yours.`);
            }
        } else {
            if (playerCasualties >= playerTeam.length * 0.8) {
                outcome = 'crushing_defeat';
                combatLog.push(`💀 <strong>CRUSHING DEFEAT!</strong> Your forces are decimated!`);
            } else {
                outcome = 'narrow_defeat';
                combatLog.push(`😔 <strong>Tactical Retreat</strong> - You must fall back to regroup.`);
            }
        }
        
        combatLog.push(`📊 <strong>Battle Summary:</strong>`);
        combatLog.push(`   👹 Your casualties: ${playerCasualties}/${playerTeam.length}`);
        combatLog.push(`   💀 Enemy casualties: ${enemyCasualties}/${enemyTeam.length}`);
        
        return {
            victory: victory,
            outcome: outcome,
            combatLog: combatLog,
            playerTeam: playerTeam,
            enemyTeam: enemyTeam,
            casualties: playerCasualties
        };
    }

    // Effectuer une attaque
    performAttack(attacker, target, allies, combatLog) {
        // Choisir une capacité (20% de chance d'utiliser une capacité spéciale)
        let ability = null;
        if (Math.random() < 0.2 && attacker.abilities.length > 0) {
            const abilityName = attacker.abilities[Math.floor(Math.random() * attacker.abilities.length)];
            ability = this.abilities.abilities[abilityName] || this.abilities.monster_abilities[abilityName];
        }
        
        // Calculer les dégâts de base
        let damage = Math.max(1, attacker.attack - Math.floor(target.defense / 2));
        
        // Ajouter variabilité (±20%)
        damage = Math.floor(damage * (0.8 + Math.random() * 0.4));
        
        // Appliquer les effets de capacité
        if (ability) {
            damage = Math.floor(damage * ability.damage_multiplier);
            combatLog.push(`   ✨ ${attacker.name} uses ${ability.name}!`);
            
            // Effets spéciaux
            this.applyAbilityEffects(ability, attacker, target, allies, combatLog);
        }
        
        // Message d'attaque
        const attackMessages = [
            `${attacker.name} attacks ${target.name}`,
            `${attacker.name} strikes at ${target.name}`,
            `${attacker.name} lunges at ${target.name}`,
            `${attacker.name} assaults ${target.name}`
        ];
        
        const message = attackMessages[Math.floor(Math.random() * attackMessages.length)];
        combatLog.push(`   ⚔️ ${message} for ${damage} damage!`);
        
        return { damage: damage, ability: ability };
    }

    // Appliquer les effets des capacités
    applyAbilityEffects(ability, attacker, target, allies, combatLog) {
        switch (ability.effect) {
            case 'lifesteal':
                const healing = Math.floor(ability.damage_multiplier * 10);
                attacker.hp = Math.min(attacker.maxHp, attacker.hp + healing);
                combatLog.push(`     💚 ${attacker.name} heals for ${healing} HP!`);
                break;
                
            case 'critical':
                combatLog.push(`     💥 Critical hit!`);
                break;
                
            case 'stun':
                combatLog.push(`     😵 ${target.name} is stunned!`);
                break;
                
            case 'fear':
                combatLog.push(`     😱 ${target.name} is terrified!`);
                break;
                
            case 'buff_allies':
                combatLog.push(`     📢 ${attacker.name} rallies the troops!`);
                break;
                
            case 'armor_pierce':
                combatLog.push(`     🗡️ Armor piercing attack!`);
                break;
        }
    }
}
