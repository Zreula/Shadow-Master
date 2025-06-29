// Système de gestion de missions
class Combat {
    constructor(game) {
        this.game = game;
        this.currentMission = null;
        this.selectedMonsters = [];
        this.activeMissions = []; // Missions en cours
        this.completedMissions = []; // Missions terminées pour le récap
    }

    // Initialiser le système de missions
    async initialize() {
        try {
            // Charger les ennemis pour les descriptions
            const enemiesResponse = await fetch('./data/enemies.json');
            this.enemies = await enemiesResponse.json();
            
            console.log('Mission system initialized');
        } catch (error) {
            console.error('Failed to load mission data:', error);
            // Données de fallback
            this.enemies = this.getDefaultEnemies();
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
        this.currentMission = { ...this.game.missions[missionKey], key: missionKey };
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

        // Obtenir seulement les monstres disponibles
        const availableMonsters = this.getAvailableMonsters();
        
        if (availableMonsters.length === 0) {
            return {
                text: `
                    <h2>⚔️ Mission Preparation: ${this.currentMission.name}</h2>
                    <div class="mission-brief">
                        <h4>📋 Mission Brief:</h4>
                        <p>${this.currentMission.description}</p>
                        <p><strong>Difficulty:</strong> ${this.currentMission.difficulty}</p>
                        <p><strong>Power Required:</strong> ${this.currentMission.requiredPower}</p>
                    </div>
                    
                    <div class="no-monsters-warning" style="background: rgba(183, 28, 28, 0.2); padding: 15px; border-radius: 6px; margin: 15px 0;">
                        <h4>⚠️ No monsters available!</h4>
                        <p>All your monsters are currently on missions. Wait for them to return or choose a different mission.</p>
                    </div>
                `,
                choices: [{
                    text: "🔙 Back to Missions",
                    action: () => this.game.showScene('missions')
                }]
            };
        }

        let monsterSelection = '<div class="combat-monster-selection">';
        monsterSelection += '<h4>🎯 Select your monsters for this mission:</h4>';
        monsterSelection += '<div class="available-monsters">';

        // Parcourir tous les monstres du joueur pour maintenir les indices
        this.game.player.monsters.forEach((monster, index) => {
            // Ne montrer que les monstres disponibles
            if (!monster.onMission) {
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
            } else {
                // Afficher les monstres en mission comme indisponibles
                const monsterType = this.game.monsterTypes[monster.type];
                const monsterPower = this.calculateMonsterPower(monster);
                
                monsterSelection += `
                    <div class="combat-monster-item unavailable" style="opacity: 0.5; cursor: not-allowed;">
                        <div class="monster-info">
                            <span class="monster-emoji">${monster.emoji || (monsterType ? monsterType.emoji : '👹')}</span>
                            <span class="monster-name">${monster.name}</span>
                            <span class="monster-level">Lv.${monster.level || 1}</span>
                            <span class="monster-power">💪${monsterPower}</span>
                        </div>
                        <span class="unavailable-indicator">⚔️ On Mission</span>
                    </div>
                `;
            }
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
                <p><strong>Available Monsters:</strong> ${availableMonsters.length} / ${this.game.player.monsters.length}</p>
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
                    <p><strong>Expected Enemies:</strong> ${this.getEnemyDescription(this.currentMission.difficulty)}</p>
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
        // Vérifier que le monstre est disponible
        if (!this.isMonsterAvailable(index)) {
            this.game.addToJournal('❌ This monster is currently on a mission!');
            return;
        }

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

    // Envoyer une équipe en mission
    sendMission() {
        if (!this.currentMission || this.selectedMonsters.length === 0) {
            this.game.addToJournal('❌ No monsters selected for the mission!');
            return;
        }

        const selectedPower = this.calculateSelectedPower();
        const powerNeeded = this.currentMission.requiredPower;
        
        if (selectedPower < powerNeeded) {
            this.game.addToJournal('❌ Your selected team is too weak for this mission!');
            return;
        }

        if (this.game.player.energy < this.currentMission.energyCost) {
            this.game.addToJournal('❌ Not enough energy for this mission!');
            return;
        }

        // Créer l'objet mission avec l'équipe sélectionnée
        const missionTeam = this.selectedMonsters.map(index => ({
            ...this.game.player.monsters[index],
            originalIndex: index
        }));

        const mission = {
            ...this.currentMission,
            team: missionTeam,
            teamPower: selectedPower,
            sentAt: Date.now()
        };

        // Ajouter à la liste des missions actives
        this.activeMissions.push(mission);

        // Consommer l'énergie immédiatement
        this.game.consumeEnergy(this.currentMission.energyCost);

        // Marquer les monstres comme en mission (optionnel - on peut les rendre indisponibles)
        this.selectedMonsters.forEach(index => {
            this.game.player.monsters[index].onMission = true;
            this.game.player.monsters[index].missionKey = this.currentMission.key;
        });

        // Message de confirmation
        this.game.addToJournal(`⚔️ ${this.currentMission.name}: Team of ${missionTeam.length} monsters sent! (${selectedPower} power)`);
        
        // Réinitialiser la sélection
        this.currentMission = null;
        this.selectedMonsters = [];

        // Mettre à jour l'UI et retourner aux missions
        this.game.updateUI();
        this.game.showScene('missions');
    }

    // Obtenir les choix pour la préparation de mission
    getMissionPrepChoices(canStart, hasEnoughEnergy) {
        const choices = [];

        if (canStart) {
            choices.push({
                text: "🚀 Launch Mission",
                action: () => this.sendMission()
            });
        }

        choices.push({
            text: "🔙 Back to Missions",
            action: () => this.game.showScene('missions')
        });

        return choices;
    }

    // Générer une description des ennemis selon la mission
    getEnemyDescription(difficulty) {
        const descriptions = {
            'Easy': '🛡️ Village Guards with rusty swords and wooden shields',
            'Medium': '🏹 Ruthless bandits with daggers and crossbows', 
            'Hard': '⚔️ Well-armed royal soldiers in gleaming armor',
            'Very Hard': '🛡️ Elite palace guards with enchanted weapons',
            'Extreme': '✨ Holy knights blessed with divine protection'
        };
        
        return descriptions[difficulty] || descriptions['Easy'];
    }

    // Obtenir le récapitulatif des missions actives
    getActiveMissionsStatus() {
        if (this.activeMissions.length === 0) {
            return {
                hasActiveMissions: false,
                summary: "No missions currently active."
            };
        }

        let summary = `<h4>📋 Active Missions (${this.activeMissions.length}):</h4>`;
        let totalMonstersOnMission = 0;

        this.activeMissions.forEach((mission, index) => {
            totalMonstersOnMission += mission.team.length;
            const teamNames = mission.team.map(monster => `${monster.emoji} ${monster.name}`).join(', ');
            
            summary += `
                <div class="active-mission-item" style="background: rgba(0,100,0,0.1); padding: 10px; margin: 5px 0; border-radius: 5px;">
                    <p><strong>${mission.name}</strong> (${mission.difficulty})</p>
                    <p>👥 Team: ${teamNames}</p>
                    <p>💪 Power: ${mission.teamPower} / ${mission.requiredPower}</p>
                </div>
            `;
        });

        return {
            hasActiveMissions: true,
            summary: summary,
            totalMonstersOnMission: totalMonstersOnMission
        };
    }

    // Traiter toutes les missions actives en fin de journée
    processMissions() {
        if (this.activeMissions.length === 0) {
            return [];
        }

        const results = [];

        // Traiter chaque mission active
        this.activeMissions.forEach(mission => {
            const result = this.simulateMissionOutcome(mission);
            results.push(result);

            // Appliquer les récompenses ou pénalités
            if (result.success) {
                this.game.player.gold += result.rewards.gold;
                this.game.player.reputation += result.rewards.reputation;
                
                // Équipement possible
                if (result.equipment) {
                    this.game.player.inventory.push(result.equipment);
                }

                // Expérience pour les monstres
                mission.team.forEach(monster => {
                    const originalMonster = this.game.player.monsters[monster.originalIndex];
                    if (originalMonster) {
                        this.game.actions.giveExperience(monster.originalIndex, result.experience || 3);
                    }
                });

                // Log de succès
                this.game.addToJournal(`✅ Mission "${mission.name}" completed successfully! +${result.rewards.gold} gold, +${result.rewards.reputation} reputation`);
            } else {
                // Log d'échec
                this.game.addToJournal(`❌ Mission "${mission.name}" failed. Your team retreats with minimal rewards.`);
                
                // Donner un peu d'XP même en cas d'échec
                mission.team.forEach(monster => {
                    const originalMonster = this.game.player.monsters[monster.originalIndex];
                    if (originalMonster) {
                        this.game.actions.giveExperience(monster.originalIndex, 1);
                    }
                });
            }

            // Traiter les blessures/pertes si il y en a
            if (result.casualties > 0) {
                const casualtiesCount = Math.min(result.casualties, mission.team.length);
                for (let i = 0; i < casualtiesCount; i++) {
                    const monsterIndex = mission.team[i].originalIndex;
                    const monster = this.game.player.monsters[monsterIndex];
                    if (monster && monster.level > 1) {
                        // Réduire le niveau du monstre blessé (système de blessure temporaire)
                        const levelLoss = Math.max(1, Math.floor(monster.level * 0.1));
                        monster.level = Math.max(1, monster.level - levelLoss);
                        this.game.addToJournal(`🩹 ${monster.name} was injured and lost ${levelLoss} level(s)`);
                    }
                }
            }

            // Libérer les monstres de la mission
            mission.team.forEach(monster => {
                const originalMonster = this.game.player.monsters[monster.originalIndex];
                if (originalMonster) {
                    originalMonster.onMission = false;
                    delete originalMonster.missionKey;
                }
            });
        });

        // Sauvegarder les missions complétées pour le récapitulatif
        this.completedMissions.push(...this.activeMissions.map(mission => ({
            ...mission,
            completedAt: Date.now()
        })));

        // Vider la liste des missions actives
        this.activeMissions = [];

        return results;
    }

    // Simuler le résultat d'une mission (sans combat en temps réel)
    simulateMissionOutcome(mission) {
        const powerRatio = mission.teamPower / mission.requiredPower;
        
        // Calcul du taux de succès basé sur la puissance de l'équipe
        let baseSuccessChance = 0.3; // 30% de base
        
        if (powerRatio >= 2.0) {
            baseSuccessChance = 0.95; // 95% si 2x plus fort
        } else if (powerRatio >= 1.5) {
            baseSuccessChance = 0.85; // 85% si 1.5x plus fort  
        } else if (powerRatio >= 1.2) {
            baseSuccessChance = 0.70; // 70% si 1.2x plus fort
        } else if (powerRatio >= 1.0) {
            baseSuccessChance = 0.55; // 55% si équivalent
        } else if (powerRatio >= 0.8) {
            baseSuccessChance = 0.40; // 40% si un peu plus faible
        } else {
            baseSuccessChance = 0.25; // 25% si beaucoup plus faible
        }

        // Facteur aléatoire pour la variabilité
        const randomFactor = Math.random();
        const success = randomFactor < baseSuccessChance;

        const result = {
            mission: mission,
            success: success,
            description: '',
            rewards: { gold: 0, reputation: 0 },
            casualties: 0,
            experience: 0,
            equipment: null,
            powerRatio: powerRatio
        };

        if (success) {
            // Calculer les récompenses selon la facilité de la victoire
            let rewardMultiplier = 1.0;
            let experienceGain = 3;
            let casualtyChance = 0.1;

            if (powerRatio >= 2.0) {
                // Victoire écrasante
                result.description = `Your overwhelming force crushes all resistance! The ${mission.name} is completed with minimal effort.`;
                rewardMultiplier = 1.5;
                experienceGain = 5;
                casualtyChance = 0.0;
            } else if (powerRatio >= 1.5) {
                // Victoire dominante  
                result.description = `Your forces dominate the battlefield! The ${mission.name} ends in decisive victory.`;
                rewardMultiplier = 1.3;
                experienceGain = 4;
                casualtyChance = 0.05;
            } else if (powerRatio >= 1.0) {
                // Victoire standard
                result.description = `After fierce fighting, your monsters achieve victory in the ${mission.name}. The battle was well-fought.`;
                rewardMultiplier = 1.0;
                experienceGain = 3;
                casualtyChance = 0.15;
            } else {
                // Victoire difficile
                result.description = `Despite being outmatched, your monsters pull off a surprising victory in the ${mission.name}!`;
                rewardMultiplier = 0.8;
                experienceGain = 2;
                casualtyChance = 0.25;
            }

            // Appliquer les récompenses
            result.rewards = {
                gold: Math.floor(mission.reward.gold * rewardMultiplier),
                reputation: Math.floor(mission.reward.reputation * rewardMultiplier)
            };
            result.experience = experienceGain;

            // Calculer les pertes
            result.casualties = Math.random() < casualtyChance ? Math.floor(mission.team.length * 0.2) : 0;

            // Chance d'équipement selon la qualité de la victoire
            if (mission.reward.items && mission.reward.items.length > 0) {
                let equipmentChance = 0.2 * rewardMultiplier; // Base 20% modulé par la qualité
                
                if (Math.random() < equipmentChance) {
                    const randomItem = mission.reward.items[Math.floor(Math.random() * mission.reward.items.length)];
                    if (this.game.equipment && this.game.equipment[randomItem]) {
                        result.equipment = randomItem;
                    }
                }
            }

        } else {
            // Échec de la mission
            if (powerRatio >= 0.8) {
                result.description = `Your forces fought valiantly but were repelled during the ${mission.name}. A tactical retreat was necessary.`;
            } else {
                result.description = `Your forces were overwhelmed during the ${mission.name}. The enemy proved far stronger than expected.`;
            }
            
            // Récompenses réduites même en cas d'échec
            result.rewards = {
                gold: Math.floor(mission.reward.gold * 0.1), // 10% des récompenses
                reputation: Math.floor(mission.reward.reputation * 0.05) // 5% de la réputation
            };
            result.experience = 1; // Un peu d'expérience quand même
            result.casualties = Math.floor(mission.team.length * Math.max(0.2, 0.5 - powerRatio)); // Plus de pertes si très faible
        }

        return result;
    }

    // Obtenir les monstres disponibles (pas en mission)
    getAvailableMonsters() {
        return this.game.player.monsters.filter(monster => !monster.onMission);
    }

    // Obtenir le nombre de monstres disponibles
    getAvailableMonstersCount() {
        return this.getAvailableMonsters().length;
    }

    // Vérifier si un monstre spécifique est disponible
    isMonsterAvailable(monsterIndex) {
        const monster = this.game.player.monsters[monsterIndex];
        return monster && !monster.onMission;
    }

    // Générer le récapitulatif de fin de journée
    generateDayEndSummary(missionResults) {
        if (missionResults.length === 0) {
            return {
                text: `
                    <h2>🌙 End of Day Summary</h2>
                    <p>No missions were completed today. Your monsters rest and prepare for tomorrow's challenges.</p>
                `,
                choices: [{
                    text: "💤 Continue to Next Day",
                    action: () => this.game.showScene('base')
                }]
            };
        }

        let totalGold = 0;
        let totalReputation = 0;
        let successfulMissions = 0;
        let failedMissions = 0;

        let summaryText = `<h2>🌙 End of Day Summary</h2>`;
        summaryText += `<div class="day-summary">`;

        missionResults.forEach(result => {
            totalGold += result.rewards.gold;
            totalReputation += result.rewards.reputation;
            
            if (result.success) {
                successfulMissions++;
                summaryText += `
                    <div class="mission-result success" style="background: rgba(46, 125, 50, 0.2); padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #4caf50;">
                        <h4>✅ ${result.mission.name} - SUCCESS</h4>
                        <p>${result.description}</p>
                        <p><strong>Rewards:</strong> 💰 ${result.rewards.gold} gold, ⭐ ${result.rewards.reputation} reputation</p>
                        <p><strong>Team:</strong> ${result.mission.team.map(m => `${m.emoji} ${m.name}`).join(', ')}</p>
                        ${result.equipment ? `<p><strong>🎁 Equipment Found:</strong> ${this.game.equipment[result.equipment].emoji} ${this.game.equipment[result.equipment].name}</p>` : ''}
                        ${result.casualties > 0 ? `<p><strong>💔 Casualties:</strong> ${result.casualties} monster(s) injured</p>` : ''}
                    </div>
                `;
            } else {
                failedMissions++;
                summaryText += `
                    <div class="mission-result failure" style="background: rgba(183, 28, 28, 0.2); padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #f44336;">
                        <h4>❌ ${result.mission.name} - FAILED</h4>
                        <p>${result.description}</p>
                        <p><strong>Rewards:</strong> 💰 ${result.rewards.gold} gold, ⭐ ${result.rewards.reputation} reputation</p>
                        <p><strong>Team:</strong> ${result.mission.team.map(m => `${m.emoji} ${m.name}`).join(', ')}</p>
                        ${result.casualties > 0 ? `<p><strong>💔 Casualties:</strong> ${result.casualties} monster(s) injured</p>` : ''}
                    </div>
                `;
            }
        });

        summaryText += `
            <div class="day-totals" style="background: rgba(0,0,0,0.3); padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3>📊 Daily Totals</h3>
                <p><strong>Missions Completed:</strong> ${missionResults.length} (${successfulMissions} successful, ${failedMissions} failed)</p>
                <p><strong>Total Gold Earned:</strong> 💰 ${totalGold}</p>
                <p><strong>Total Reputation Gained:</strong> ⭐ ${totalReputation}</p>
            </div>
        `;

        summaryText += `</div>`;

        return {
            text: summaryText,
            choices: [{
                text: "💤 Continue to Next Day",
                action: () => {
                    // Mettre à jour l'UI avec les nouvelles valeurs
                    this.game.updateUI();
                    this.game.showScene('base');
                }
            }]
        };
}
}
