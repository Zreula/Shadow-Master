// Classe pour gérer toutes les actions de gameplay
class Actions {
    constructor(game) {
        this.game = game;
    }
    
    // Recrutement de monstres
    recruitMonster(monsterKey) {
        const monster = this.game.monsterTypes[monsterKey];
        
        if (!monster) {
            this.game.addToJournal('❌ Monster not found!');
            return;
        }
        
        if (this.game.player.gold < monster.cost) {
            this.game.addToJournal('❌ Not enough gold to recruit this creature!');
            return;
        }
        
        if (this.game.player.monsters.length >= this.game.player.maxMonsters) {
            this.game.addToJournal('❌ Your barracks are full!');
            return;
        }
        
        this.game.player.gold -= monster.cost;
        
        const newMonster = {
            id: monsterKey,
            type: monsterKey,
            name: monster.name,
            emoji: monster.emoji,
            baseStats: { ...monster.baseStats },
            level: 1,
            experience: 0,
            equipment: { weapon: null, armor: null, boots: null, accessory: null }
        };
        
        this.game.player.monsters.push(newMonster);
        
        this.game.addToJournal(`✅ ${monster.emoji} ${monster.name} answered your call and joined your legions !`);
        this.game.updateUI();
        this.game.showScene('recruit');
    }
    
    // Purchase equipment
    buyEquipment(equipmentKey) {
        const equipment = this.game.equipment[equipmentKey];
        
        if (!equipment) {
            this.game.addToJournal('❌ Equipment not found !');
            return;
        }
        
        if (this.game.player.gold < equipment.cost) {
            this.game.addToJournal('❌ Not enough gold for this equipment !');
            return;
        }
        
        this.game.player.gold -= equipment.cost;
        this.game.player.inventory.push(equipmentKey);
        
        this.game.addToJournal(`✅ You purchase ${equipment.emoji} ${equipment.name}!`);
        this.game.updateUI();
        this.game.showScene('market');
    }
    
    // Amélioration du donjon
    upgradeDungeon() {
        const nextLevel = this.game.player.dungeonLevel + 1;
        const upgrades = this.game.gameConfig.dungeonUpgrades || {};
        const upgrade = upgrades[nextLevel];
        
        if (!upgrade || this.game.player.gold < upgrade.cost) {
            this.game.addToJournal('❌ Not enough gold to upgrade the dungeon !');
            return;
        }
        
        this.game.player.gold -= upgrade.cost;
        this.game.player.dungeonLevel = nextLevel;
        this.game.player.maxMonsters = upgrade.maxMonsters;
        this.game.player.maxEnergy = upgrade.maxEnergy;
        this.game.player.energy = this.game.player.maxEnergy; // Restore energy when upgrading

        this.game.addToJournal(`🔨 Your dungeon evolves to: ${upgrade.name} !`);
        this.game.addToJournal(`✨ New features: ${upgrade.newFeatures.join(', ')}`);
        this.game.addToJournal(`⚡ Maximum energy increased to ${this.game.player.maxEnergy} !`);
        this.game.updateUI();
        this.game.showScene('hub');
    }

    // Start a mission
    startMission(missionKey) {
        const mission = this.game.missions[missionKey];
        const totalPower = this.game.calculateTotalPower();
        
        if (!mission) {
            this.game.addToJournal('❌ Mission not found !');
            return;
        }
        
        if (this.game.player.energy < mission.energyCost) {
            this.game.addToJournal('❌ Not enough energy for this mission !');
            return;
        }
        
        if (totalPower < mission.requiredPower) {
            this.game.addToJournal('❌ Your army is too weak for this mission !');
            return;
        }
        
        this.game.consumeEnergy(mission.energyCost);
        
        // Simulation de combat
        const combatResult = this.simulateDetailedCombat(mission);
        this.displayCombatResult(combatResult, mission);
        
        // Expérience pour les monstres
        this.game.player.monsters.forEach(monster => {
            this.gainExperience(monster, Math.floor(mission.requiredPower / 5));
        });
    }
    
    // Simulation de combat détaillée
    simulateDetailedCombat(mission) {
        const scenarios = this.game.gameConfig.combatScenarios || [
            'Your monsters strike from the shadows! The element of surprise is total.',
            'The battle rages for hours. Your creatures show their superiority.',
            'The defenders attempt a heroic resistance, but your legions are relentless.',
            'A crushing victory! The enemy flees, leaving everything behind.',
            'Your monsters sow terror with terrifying efficiency.'
        ];
        
        const casualty = Math.random() < 0.1; // 10% de chance de perdre un monstre
        
        return {
            description: scenarios[Math.floor(Math.random() * scenarios.length)],
            casualty: casualty,
            success: true
        };
    }
    
    // Affichage du résultat de combat
    displayCombatResult(result, mission) {
        this.game.player.gold += mission.reward.gold;
        this.game.player.reputation += mission.reward.reputation;
        
        // Récompenses d'équipement
        if (mission.reward.items && Math.random() < 0.4) { // 40% de chance
            const randomItem = mission.reward.items[Math.floor(Math.random() * mission.reward.items.length)];
            
            // Vérifier que l'item existe dans l'équipement
            if (this.game.equipment[randomItem]) {
                this.game.player.inventory.push(randomItem);
                this.game.addToJournal(`You find ${this.game.equipment[randomItem].emoji} ${this.game.equipment[randomItem].name}!`);
            } else {
                // Si l'item n'existe pas, donner de l'or supplémentaire à la place
                const bonusGold = Math.floor(Math.random() * 50) + 25; // 25-75 gold bonus
                this.game.player.gold += bonusGold;
                this.game.addToJournal(`You find ancient treasures worth ${bonusGold} gold!`);
            }
        }
        
        let resultText = `
            <h2>⚔️ Missions report </h2>
            <p><strong>${mission.name}</strong></p>
            <p>${result.description}</p>
        `;
        
        if (result.casualty && this.game.player.monsters.length > 0) {
            const lostMonster = this.game.player.monsters.splice(Math.floor(Math.random() * this.game.player.monsters.length), 1)[0];
            // Safety check to ensure monster has required properties
            const monsterName = lostMonster.name || 'Unknown Monster';
            const monsterEmoji = lostMonster.emoji || '👹';
            resultText += `<p class="error">💀 ${monsterEmoji} ${monsterName} was lost in battle!</p>`;
            this.game.addToJournal(`💀 ${monsterName} died a hero of the shadows...`);
        }
        
        resultText += `
            <p class="success">
                🎉 TOTAL VICTORY! You gain ${mission.reward.gold} gold and ${mission.reward.reputation} reputation points!
            </p>
        `;
        
        this.game.ui.displayScene(resultText, [
            { text: '🏰 Return to dungeon', action: () => this.game.showScene('hub') },
            { text: '⚔️ Choose a new mission', action: () => this.game.showScene('missions') }
        ]);
        
        this.game.addToJournal(`🎉 Mission accomplished: +${mission.reward.gold} gold, +${mission.reward.reputation} reputation`);
        this.game.updateUI();
    }
    
    // Gain d'expérience pour un monstre
    gainExperience(monster, exp) {
        monster.experience += exp;
        const expNeeded = monster.level * 100;
        
        if (monster.experience >= expNeeded) {
            monster.level++;
            monster.experience = 0;
            const message = `⭐ ${monster.emoji} ${monster.name} reaches level ${monster.level}!`;
            this.game.addToJournal(message);
        }
    }
    
    // Actions d'exploration
    exploreRuins() {
        if (this.game.player.energy < 1) {
            this.game.addToJournal('❌ You are too tired to explore!');
            this.game.showScene('hub');
            return;
        }
        
        this.game.consumeEnergy(1);
        
        const discoveries = this.game.dataManager.getDiscoveries('ruins');
        const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
        
        if (discovery.gold) this.game.player.gold += discovery.gold;
        if (discovery.reputation) this.game.player.reputation += discovery.reputation;
        
        this.game.ui.displayScene(`
            <h2>🔍 Explore Ruins</h2>
            <p>You carefully search through the debris of forgotten civilizations...</p>
            <p class="success">${discovery.text}</p>
        `, [
            { text: `🌙 Continue Exploration`, action: () => this.game.showScene('explore'), disabled: this.game.player.energy === 0 },
            { text: `🏰 Return to Dungeon`, action: () => this.game.showScene('hub') }
        ]);
        
        this.game.addToJournal(`🔍 ${discovery.text}`);
        this.game.updateUI();
    }
    
    followWhispers() {
        if (this.game.player.energy < 1) {
            this.game.addToJournal('❌ You are too tired to follow the whispers!');
            this.game.showScene('hub');
            return;
        }
        
        this.game.consumeEnergy(1);
        
        if (Math.random() < 0.3) {
            this.triggerRandomEvent();
        } else {
            const whispers = this.game.dataManager.getDiscoveries('whispers');
            const whisper = whispers[Math.floor(Math.random() * whispers.length)];
            
            if (whisper.gold) this.game.player.gold += whisper.gold;
            if (whisper.reputation) this.game.player.reputation += whisper.reputation;
            
            this.game.ui.displayScene(`
                <h2>👻 Spectral Whispers</h2>
                <p>You follow the voices from beyond the grave through the haunted corridors...</p>
                <p class="warning">${whisper.text}</p>
            `, [
                { text: `🌙 Continue Exploration`, action: () => this.game.showScene('explore'), disabled: this.game.player.energy === 0 },
                { text: `🏰 Return to Dungeon`, action: () => this.game.showScene('hub') }
            ]);
            
            this.game.addToJournal(`👻 ${whisper.text}`);
            this.game.updateUI();
        }
    }
    
    exploreDeeper() {
        if (this.game.player.energy < 1) {
            this.game.addToJournal('❌ You are too tired to descend deeper!');
            this.game.showScene('hub');
            return;
        }
        
        this.game.consumeEnergy(1);
        
        if (Math.random() < 0.2) {
            // Trouve un monstre rare
            this.findWildMonster();
        } else {
            const findings = this.game.dataManager.getDiscoveries('depths');
            const finding = findings[Math.floor(Math.random() * findings.length)];
            
            if (finding.gold) this.game.player.gold += finding.gold;
            if (finding.reputation) this.game.player.reputation += finding.reputation;
            
            this.game.ui.displayScene(`
                <h2>🕳️ Deep Abyss</h2>
                <p>You descend into the bowels of the earth, where light has never shone...</p>
                <p class="warning">${finding.text}</p>
            `, [
                { text: `🌙 Continue Exploration`, action: () => this.game.showScene('explore'), disabled: this.game.player.energy === 0 },
                { text: `🏰 Return to Dungeon`, action: () => this.game.showScene('hub') }
            ]);
            
            this.game.addToJournal(`🕳️ ${finding.text}`);
            this.game.updateUI();
        }
    }
    
    // Trouver un monstre sauvage
    findWildMonster() {
        const wildMonsters = ['goblin', 'orc', 'sorcier'];
        const monsterType = wildMonsters[Math.floor(Math.random() * wildMonsters.length)];
        const monster = this.game.monsterTypes[monsterType];
        
        if (this.game.player.monsters.length >= this.game.player.maxMonsters) {
            this.game.ui.displayScene(`
                <h2>🐺 Wild Encounter</h2>
                <p>You come across ${monster.emoji} ${monster.name} wild, but your barracks are full!</p>
                <p class="error">The creature flees into the darkness...</p>
            `, [
                { text: '🌙 Continue Exploration', action: () => this.game.showScene('explore') },
                { text: '🏰 Return to Dungeon', action: () => this.game.showScene('hub') }
            ]);
            return;
        }
        
        const newMonster = {
            id: monsterType,
            type: monsterType,
            name: monster.name,
            emoji: monster.emoji,
            baseStats: { ...monster.baseStats },
            level: 1,
            experience: 0,
            equipment: { weapon: null, armor: null, boots: null, accessory: null }
        };
        
        this.game.player.monsters.push(newMonster);
        
        this.game.ui.displayScene(`
            <h2>🐺 Wild Encounter</h2>
            <p>In the depths, you come across ${monster.emoji} ${monster.name} solitary!</p>
            <p class="success">The creature recognizes your authority and joins your ranks for free!</p>
        `, [
            { text: '🌙 Continue Exploration', action: () => this.game.showScene('explore') },
            { text: '🏰 Return to Dungeon', action: () => this.game.showScene('hub') }
        ]);
        
        this.game.addToJournal(`🐺 ${monster.emoji} ${monster.name} wild join your legion !`);
        this.game.updateUI();
    }
    
    // Méditation
    meditate() {
        if (this.game.player.energy < 1) {
            this.game.addToJournal('❌ You are too tired to meditate!');
            this.game.showScene('hub');
            return;
        }
        
        this.game.consumeEnergy(1);
        
        const goldGained = 15 + Math.floor(Math.random() * 15);
        const repGained = 3 + Math.floor(Math.random() * 6);
        
        this.game.player.gold += goldGained;
        this.game.player.reputation += repGained;
        
        const meditations = this.game.dataManager.getMeditations();
        const meditation = meditations[Math.floor(Math.random() * meditations.length)];
        
        this.game.ui.displayScene(`
            <h2>🔮 Shadow Meditation</h2>
            <p>${meditation}</p>
            <p class="success">Your mind sharpens. +${goldGained} gold, +${repGained} reputation.</p>
        `, [
            { text: `🏰 Return to Main Hall`, action: () => this.game.showScene('hub') }
        ]);
        
        this.game.addToJournal(`🔮 MMeditation completed: +${goldGained} or, +${repGained} reputation`);
        this.game.updateUI();
    }
    
    // Gestion des monstres
    showMonsterDetails(monsterIndex) {
        const monster = this.game.player.monsters[monsterIndex];
        if (!monster) return;
        
        const stats = this.game.calculateMonsterStats(monster);
        const equipmentSlots = ['weapon', 'armor', 'boots', 'accessory'];
        const availableItems = this.game.player.inventory.filter(itemKey => {
            const item = this.game.equipment[itemKey];
            return item && equipmentSlots.includes(item.slot);
        });
        
        let equipmentOptions = '';
        if (availableItems.length > 0) {
            equipmentOptions = `
                <h4>Equip object :</h4>
                <div style="display: grid; gap: 8px;">
                    ${availableItems.map(itemKey => {
                        const item = this.game.equipment[itemKey];
                        return `
                            <button class="choice-btn" onclick="game.actions.equipItem(${monsterIndex}, '${itemKey}')" style="padding: 4px 8px; font-size: 0.8em;">
                                ${item.emoji} ${item.name} (${item.slot})
                            </button>
                        `;
                    }).join('')}
                </div>
            `;
        }
        
        this.game.ui.displayScene(`
            <h2>👹 Manage ${monster.emoji} ${monster.name}</h2>
            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p><strong>Level:</strong> ${monster.level} (EXP: ${monster.experience}/${monster.level * 100})</p>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0;">
                    <div><strong>⚔️ Strength:</strong> ${stats.strength}</div>
                    <div><strong>🛡️ Defense:</strong> ${stats.defense}</div>
                    <div><strong>⚡ Speed:</strong> ${stats.speed}</div>
                    <div><strong>🔮 Magic:</strong> ${stats.magic}</div>
                </div>
                
                <h4>Current Equipment:</h4>
                <div style="display: grid; gap: 4px; font-size: 0.9em;">
                    ${Object.entries(monster.equipment).map(([slot, item]) =>
                        `<div>${slot}: ${item ? `${item.emoji} ${item.name}` : 'None'}</div>`
                    ).join('')}
                </div>
                
                ${equipmentOptions}
            </div>
        `, [
            { text: '🏰 Return to Main Hall', action: () => this.game.showScene('hub') }
        ]);
    }

    // Equip an item on a monster
    equipItem(monsterIndex, itemKey) {
        const monster = this.game.player.monsters[monsterIndex];
        const item = this.game.equipment[itemKey];
        
        if (!monster || !item) return;
        
        // Retirer l'objet de l'inventaire
        const itemIndex = this.game.player.inventory.indexOf(itemKey);
        if (itemIndex === -1) return;
        
        this.game.player.inventory.splice(itemIndex, 1);
        
        // Si le monstre a déjà un équipement dans ce slot, le remettre dans l'inventaire
        if (monster.equipment[item.slot]) {
            const oldItemKey = Object.keys(this.game.equipment).find(key => 
                this.game.equipment[key] === monster.equipment[item.slot]
            );
            if (oldItemKey) {
                this.game.player.inventory.push(oldItemKey);
            }
        }
        
        // Équiper le nouvel objet
        monster.equipment[item.slot] = item;
        
        this.game.addToJournal(`✅ ${monster.name} equips ${item.emoji} ${item.name} !`);
        this.game.updateUI();
        this.showMonsterDetails(monsterIndex);
    }
    
    // Dismiss a monster
    dismissMonster(monsterIndex) {
        if (monsterIndex < 0 || monsterIndex >= this.game.player.monsters.length) {
            const message = '❌ Monster not found!';
            this.game.addToJournal(message);
            return;
        }
        
        const monster = this.game.player.monsters[monsterIndex];
        const confirmMessage = 'Are you sure you want to dismiss this monster? This action is irreversible.';
        
        if (confirm(confirmMessage)) {
            // Remove the monster from the list
            this.game.player.monsters.splice(monsterIndex, 1);
            
            const dismissedMessage = `🚪 ${monster.emoji} ${monster.name} has been dismissed from the legions`;
            
            this.game.addToJournal(dismissedMessage);
            this.game.updateUI();
        }
    }
    
    // Événements aléatoires
    triggerRandomEvent() {
        const events = this.game.dataManager.getRandomEvents();
        const event = events[Math.floor(Math.random() * events.length)];
        
        this.game.ui.displayScene(`
            <h2>🎲 Mysterious event</h2>
            <p>${event.text}</p>
        `, event.choices.map(choice => ({
            text: choice.text,
            action: () => {
                this.executeEventAction(choice);
                this.game.updateUI();
                this.game.showScene('explore');
            }
        })));
    }
    
    // Exécuter une action d'événement
    executeEventAction(choice) {
        switch(choice.action) {
            case 'addGold':
                this.game.player.gold += choice.value;
                this.game.addToJournal(`💰 You gain ${choice.value} gold pieces!`);
                break;
            case 'addReputation':
                this.game.player.reputation += choice.value;
                this.game.addToJournal(`⭐ Your reputation increases by ${choice.value} points!`);
                break;
            case 'defendDungeon':
                this.defendDungeon();
                break;
            case 'negotiateWithAdventurers':
                this.negotiateWithAdventurers();
                break;
            case 'demonPact':
                this.demonPact();
                break;
            case 'addJournalEntry':
                this.game.addToJournal(choice.value);
                break;
        }
    }
    
    // Actions pour les événements aléatoires
    defendDungeon() {
        const success = Math.random() < 0.7; // 70% de chance de succès
        
        if (success) {
            const goldGained = 100 + Math.floor(Math.random() * 100);
            const repGained = 15 + Math.floor(Math.random() * 10);
            this.game.player.gold += goldGained;
            this.game.player.reputation += repGained;
            this.game.addToJournal(`🛡️ You repel the adventurers! +${goldGained} gold, +${repGained} reputation`);
        } else {
            if (this.game.player.monsters.length > 0) {
                const lostMonster = this.game.player.monsters.splice(Math.floor(Math.random() * this.game.player.monsters.length), 1)[0];
                this.game.addToJournal(`💀 ${lostMonster.name} falls before the heroes...`);
            } else {
                this.game.player.gold = Math.max(0, this.game.player.gold - 50);
                this.game.addToJournal(`💸 The adventurers loot your treasure! -50 gold`);
            }
        }
    }
    
    negotiateWithAdventurers() {
        const goldCost = 75;
        if (this.game.player.gold >= goldCost) {
            this.game.player.gold -= goldCost;
            this.game.addToJournal(`💰 You corrupt the adventurers for ${goldCost} gold.`);
        } else {
            this.game.addToJournal(`❌ Not enough gold to corrupt them! They attack!`);
            this.defendDungeon();
        }
    }
    
    demonPact() {
        const cost = 100;
        if (this.game.player.gold >= cost) {
            this.game.player.gold -= cost;
            this.game.player.reputation += 25;
            this.game.addToJournal(`👹 Demonic pact concluded! -${cost} gold, +25 reputation`);

            // Chance d'obtenir un monstre démoniaque
            if (Math.random() < 0.3 && this.game.player.monsters.length < this.game.player.maxMonsters) {
                const demonMonster = {
                    id: 'demon',
                    type: 'demon',
                    name: 'Demon',
                    emoji: '😈',
                    baseStats: { strength: 7, defense: 4, speed: 5, magic: 6 },
                    level: 1,
                    experience: 0,
                    equipment: { weapon: null, armor: null, boots: null, accessory: null }
                };
                this.game.player.monsters.push(demonMonster);
                this.game.addToJournal(`👹 A demon appears and joins you!`);
            }
        } else {
            this.game.addToJournal(`❌ The demon refuses, you don't have enough gold...`);
        }
    }
    
    // Vérification des conditions
    canUpgradeDungeon() {
        const nextLevel = this.game.player.dungeonLevel + 1;
        const upgrades = this.game.gameConfig.dungeonUpgrades || {};
        const upgrade = upgrades[nextLevel];
        return upgrade && this.game.player.gold >= upgrade.cost;
    }
}
