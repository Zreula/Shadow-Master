// Classe pour gérer toutes les actions de gameplay
class Actions {
    constructor(game) {
        this.game = game;
    }
    
    // Recrutement de monstres
    recruitMonster(monsterKey) {
        const monster = this.game.monsterTypes[monsterKey];
        
        if (!monster) {
            const message = window.translation ? `❌ ${window.translation.t('monsterNotFound')}` : '❌ Monstre introuvable !';
            this.game.addToJournal(message);
            return;
        }
        
        if (this.game.player.gold < monster.cost) {
            const message = window.translation ? `❌ ${window.translation.t('notEnoughGold')}` : '❌ Pas assez d\'or pour recruter cette créature !';
            this.game.addToJournal(message);
            return;
        }
        
        if (this.game.player.monsters.length >= this.game.player.maxMonsters) {
            const message = window.translation ? `❌ ${window.translation.t('barracksFull')}` : '❌ Vos casernes sont pleines !';
            this.game.addToJournal(message);
            return;
        }
        
        this.game.player.gold -= monster.cost;
        
        const newMonster = {
            type: monsterKey,
            name: monster.name,
            emoji: monster.emoji,
            baseStats: { ...monster.baseStats },
            level: 1,
            experience: 0,
            equipment: { weapon: null, armor: null, boots: null, accessory: null }
        };
        
        this.game.player.monsters.push(newMonster);
        
        this.game.addToJournal(`✅ ${monster.emoji} ${monster.name} répond à votre appel et rejoint vos légions !`);
        this.game.updateUI();
        this.game.showScene('recruit');
    }
    
    // Achat d'équipement
    buyEquipment(equipmentKey) {
        const equipment = this.game.equipment[equipmentKey];
        
        if (!equipment) {
            this.game.addToJournal('❌ Équipement introuvable !');
            return;
        }
        
        if (this.game.player.gold < equipment.cost) {
            this.game.addToJournal('❌ Pas assez d\'or pour cet équipement !');
            return;
        }
        
        this.game.player.gold -= equipment.cost;
        this.game.player.inventory.push(equipmentKey);
        
        this.game.addToJournal(`✅ Vous achetez ${equipment.emoji} ${equipment.name} !`);
        this.game.updateUI();
        this.game.showScene('market');
    }
    
    // Amélioration du donjon
    upgradeDungeon() {
        const nextLevel = this.game.player.dungeonLevel + 1;
        const upgrades = this.game.gameConfig.dungeonUpgrades || {};
        const upgrade = upgrades[nextLevel];
        
        if (!upgrade || this.game.player.gold < upgrade.cost) {
            this.game.addToJournal('❌ Pas assez d\'or pour améliorer le donjon !');
            return;
        }
        
        this.game.player.gold -= upgrade.cost;
        this.game.player.dungeonLevel = nextLevel;
        this.game.player.maxMonsters = upgrade.maxMonsters;
        this.game.player.maxEnergy = upgrade.maxEnergy;
        this.game.player.energy = this.game.player.maxEnergy; // Restaure l'énergie lors de l'amélioration
        
        this.game.addToJournal(`🔨 Votre donjon évolue vers: ${upgrade.name} !`);
        this.game.addToJournal(`✨ Nouvelles fonctionnalités: ${upgrade.newFeatures.join(', ')}`);
        this.game.addToJournal(`⚡ Énergie maximale augmentée à ${this.game.player.maxEnergy} !`);
        this.game.updateUI();
        this.game.showScene('hub');
    }
    
    // Lancement d'une mission
    startMission(missionKey) {
        const mission = this.game.missions[missionKey];
        const totalPower = this.game.calculateTotalPower();
        
        if (!mission) {
            this.game.addToJournal('❌ Mission introuvable !');
            return;
        }
        
        if (this.game.player.energy < mission.energyCost) {
            this.game.addToJournal('❌ Pas assez d\'énergie pour cette mission !');
            return;
        }
        
        if (totalPower < mission.requiredPower) {
            this.game.addToJournal('❌ Votre armée est trop faible pour cette mission !');
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
            'Vos monstres frappent dans l\'ombre ! L\'effet de surprise est total.',
            'Le combat fait rage pendant des heures. Vos créatures montrent leur supériorité.',
            'Les défenseurs tentent une résistance héroïque, mais vos légions sont implacables.',
            'Une victoire écrasante ! L\'ennemi fuit en abandonnant tout derrière lui.',
            'Vos monstres sèment la terreur avec une efficacité terrifiante.'
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
            this.game.player.inventory.push(randomItem);
            this.game.addToJournal(`🎁 Vous trouvez ${this.game.equipment[randomItem].emoji} ${this.game.equipment[randomItem].name} !`);
        }
        
        let resultText = `
            <h2>⚔️ Rapport de Mission</h2>
            <p><strong>${mission.name}</strong></p>
            <p>${result.description}</p>
        `;
        
        if (result.casualty && this.game.player.monsters.length > 0) {
            const lostMonster = this.game.player.monsters.splice(Math.floor(Math.random() * this.game.player.monsters.length), 1)[0];
            resultText += `<p class="error">💀 ${lostMonster.emoji} ${lostMonster.name} est tombé au combat !</p>`;
            this.game.addToJournal(`💀 ${lostMonster.name} est mort en héros des ténèbres...`);
        }
        
        resultText += `
            <p class="success">
                🎉 VICTOIRE TOTALE ! Vous gagnez ${mission.reward.gold} or et ${mission.reward.reputation} points de réputation !
            </p>
        `;
        
        this.game.ui.displayScene(resultText, [
            { text: '🏰 Retourner au donjon', action: () => this.game.showScene('hub') },
            { text: '⚔️ Choisir une nouvelle mission', action: () => this.game.showScene('missions') }
        ]);
        
        this.game.addToJournal(`🎉 Mission accomplie : +${mission.reward.gold} or, +${mission.reward.reputation} réputation`);
        this.game.updateUI();
    }
    
    // Gain d'expérience pour un monstre
    gainExperience(monster, exp) {
        monster.experience += exp;
        const expNeeded = monster.level * 100;
        
        if (monster.experience >= expNeeded) {
            monster.level++;
            monster.experience = 0;
            const message = window.translation ? `⭐ ${monster.emoji} ${monster.name} ${window.translation.t('levelUp')} ${monster.level} !` : `⭐ ${monster.emoji} ${monster.name} monte au niveau ${monster.level} !`;
            this.game.addToJournal(message);
        }
    }
    
    // Actions d'exploration
    exploreRuins() {
        if (this.game.player.energy < 1) {
            this.game.addToJournal('❌ Vous êtes trop fatigué pour explorer !');
            this.game.showScene('hub');
            return;
        }
        
        this.game.consumeEnergy(1);
        
        const discoveries = this.game.dataManager.getDiscoveries('ruins');
        const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
        
        if (discovery.gold) this.game.player.gold += discovery.gold;
        if (discovery.reputation) this.game.player.reputation += discovery.reputation;
        
        this.game.ui.displayScene(`
            <h2>🔍 ${window.translation ? window.translation.t('ruinsExploration') : 'Exploration des Ruines'}</h2>
            <p>${window.translation ? window.translation.t('ruinsDesc') : 'Vous fouillez minutieusement les décombres de civilisations oubliées...'}</p>
            <p class="success">${discovery.text}</p>
        `, [
            { text: `🌙 ${window.translation ? window.translation.t('continueExploration') : 'Continuer l\'exploration'}`, action: () => this.game.showScene('explore'), disabled: this.game.player.energy === 0 },
            { text: `🏰 ${window.translation ? window.translation.t('returnToDungeon') : 'Retourner au donjon'}`, action: () => this.game.showScene('hub') }
        ]);
        
        this.game.addToJournal(`🔍 ${discovery.text}`);
        this.game.updateUI();
    }
    
    followWhispers() {
        if (this.game.player.energy < 1) {
            this.game.addToJournal('❌ Vous êtes trop fatigué pour suivre les murmures !');
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
                <h2>👻 ${window.translation ? window.translation.t('spectralWhispers') : 'Murmures Spectraux'}</h2>
                <p>${window.translation ? window.translation.t('spectralDesc') : 'Vous suivez les voix venues d\'outre-tombe à travers les couloirs hantés...'}</p>
                <p class="warning">${whisper.text}</p>
            `, [
                { text: `🌙 ${window.translation ? window.translation.t('continueExploration') : 'Continuer l\'exploration'}`, action: () => this.game.showScene('explore'), disabled: this.game.player.energy === 0 },
                { text: `🏰 ${window.translation ? window.translation.t('returnToDungeon') : 'Retourner au donjon'}`, action: () => this.game.showScene('hub') }
            ]);
            
            this.game.addToJournal(`👻 ${whisper.text}`);
            this.game.updateUI();
        }
    }
    
    exploreDeeper() {
        if (this.game.player.energy < 1) {
            this.game.addToJournal('❌ Vous êtes trop fatigué pour descendre plus profondément !');
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
                <h2>🕳️ ${window.translation ? window.translation.t('deepAbyss') : 'Abysses Profonds'}</h2>
                <p>${window.translation ? window.translation.t('abyssDesc') : 'Vous descendez dans les entrailles de la terre, là où la lumière n\'a jamais brillé...'}</p>
                <p class="warning">${finding.text}</p>
            `, [
                { text: `🌙 ${window.translation ? window.translation.t('continueExploration') : 'Continuer l\'exploration'}`, action: () => this.game.showScene('explore'), disabled: this.game.player.energy === 0 },
                { text: `🏰 ${window.translation ? window.translation.t('returnToDungeon') : 'Retourner au donjon'}`, action: () => this.game.showScene('hub') }
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
                <h2>🐺 Rencontre Sauvage</h2>
                <p>${window.translation ? `${window.translation.t('youComeAcross')} ${monster.emoji} ${monster.name} ${window.translation.t('wild')}, ${window.translation.t('barracksFullWild')}` : `Vous tombez sur ${monster.emoji} ${monster.name} sauvage, mais vos casernes sont pleines !`}</p>
                <p class="error">La créature s'enfuit dans les ténèbres...</p>
            `, [
                { text: '🌙 Continuer l\'exploration', action: () => this.game.showScene('explore') },
                { text: '🏰 Retourner au donjon', action: () => this.game.showScene('hub') }
            ]);
            return;
        }
        
        const newMonster = {
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
            <h2>🐺 Rencontre Sauvage</h2>
            <p>${window.translation ? `${window.translation.t('inTheDepths')} ${monster.emoji} ${monster.name} ${window.translation.t('solitary')} !` : `Dans les profondeurs, vous tombez sur ${monster.emoji} ${monster.name} solitaire !`}</p>
            <p class="success">La créature reconnaît votre autorité et rejoint vos rangs gratuitement !</p>
        `, [
            { text: '🌙 Continuer l\'exploration', action: () => this.game.showScene('explore') },
            { text: '🏰 Retourner au donjon', action: () => this.game.showScene('hub') }
        ]);
        
        this.game.addToJournal(`🐺 ${monster.emoji} ${monster.name} sauvage rejoint vos légions !`);
        this.game.updateUI();
    }
    
    // Méditation
    meditate() {
        if (this.game.player.energy < 1) {
            this.game.addToJournal('❌ Vous êtes trop fatigué pour méditer !');
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
            <h2>🔮 ${window.translation ? window.translation.t('meditationTitle') : 'Méditation des Ombres'}</h2>
            <p>${meditation}</p>
            <p class="success">${window.translation ? window.translation.t('spiritSharpens') : 'Votre esprit s\'aiguise.'} ${window.translation ? `+${goldGained} ${window.translation.t('gold')}, +${repGained} ${window.translation.t('reputation').replace(':', '')}.` : `+${goldGained} or, +${repGained} réputation.`}</p>
        `, [
            { text: `🏰 ${window.translation ? window.translation.t('returnToHall') : 'Retourner au Hall Principal'}`, action: () => this.game.showScene('hub') }
        ]);
        
        this.game.addToJournal(`🔮 Méditation accomplie : +${goldGained} or, +${repGained} réputation`);
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
                <h4>Équiper des objets :</h4>
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
            <h2>👹 Gestion de ${monster.emoji} ${monster.name}</h2>
            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p><strong>${window.translation ? window.translation.t('level') : 'Niveau'} :</strong> ${monster.level} (${window.translation ? window.translation.t('exp') : 'EXP'}: ${monster.experience}/${monster.level * 100})</p>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0;">
                    <div><strong>⚔️ Force:</strong> ${stats.force}</div>
                    <div><strong>🛡️ Défense:</strong> ${stats.defense}</div>
                    <div><strong>⚡ Vitesse:</strong> ${stats.vitesse}</div>
                    <div><strong>🔮 Magie:</strong> ${stats.magie}</div>
                </div>
                
                <h4>Équipement actuel :</h4>
                <div style="display: grid; gap: 4px; font-size: 0.9em;">
                    ${Object.entries(monster.equipment).map(([slot, item]) => 
                        `<div>${slot}: ${item ? `${item.emoji} ${item.name}` : 'Aucun'}</div>`
                    ).join('')}
                </div>
                
                ${equipmentOptions}
            </div>
        `, [
            { text: '🏰 Retourner au Hall Principal', action: () => this.game.showScene('hub') }
        ]);
    }
    
    // Équiper un objet sur un monstre
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
        
        this.game.addToJournal(`✅ ${monster.name} équipe ${item.emoji} ${item.name} !`);
        this.game.updateUI();
        this.showMonsterDetails(monsterIndex);
    }
    
    // Renvoi d'un monstre
    dismissMonster(monsterIndex) {
        if (monsterIndex < 0 || monsterIndex >= this.game.player.monsters.length) {
            const message = window.translation ? `❌ ${window.translation.t('monsterNotFound')}` : '❌ Monstre introuvable !';
            this.game.addToJournal(message);
            return;
        }
        
        const monster = this.game.player.monsters[monsterIndex];
        const confirmMessage = window.translation ? window.translation.t('confirmDismiss') : 'Êtes-vous sûr de vouloir renvoyer ce monstre ? Cette action est irréversible.';
        
        if (confirm(confirmMessage)) {
            // Retirer le monstre de la liste
            this.game.player.monsters.splice(monsterIndex, 1);
            
            const dismissedMessage = window.translation ? 
                `🚪 ${monster.emoji} ${monster.name} ${window.translation.t('monsterDismissed')}` : 
                `🚪 ${monster.emoji} ${monster.name} a été renvoyé des légions`;
            
            this.game.addToJournal(dismissedMessage);
            this.game.updateUI();
        }
    }
    
    // Événements aléatoires
    triggerRandomEvent() {
        const events = this.game.dataManager.getRandomEvents();
        const event = events[Math.floor(Math.random() * events.length)];
        
        this.game.ui.displayScene(`
            <h2>🎲 Événement Mystérieux</h2>
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
                this.game.addToJournal(`💰 Vous gagnez ${choice.value} pièces d'or !`);
                break;
            case 'addReputation':
                this.game.player.reputation += choice.value;
                this.game.addToJournal(`⭐ Votre réputation augmente de ${choice.value} points !`);
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
            this.game.addToJournal(`🛡️ Vous repoussez les aventuriers ! +${goldGained} or, +${repGained} réputation`);
        } else {
            if (this.game.player.monsters.length > 0) {
                const lostMonster = this.game.player.monsters.splice(Math.floor(Math.random() * this.game.player.monsters.length), 1)[0];
                this.game.addToJournal(`💀 ${lostMonster.name} tombe face aux héros...`);
            } else {
                this.game.player.gold = Math.max(0, this.game.player.gold - 50);
                this.game.addToJournal(`💸 Les aventuriers pillent votre trésor ! -50 or`);
            }
        }
    }
    
    negotiateWithAdventurers() {
        const goldCost = 75;
        if (this.game.player.gold >= goldCost) {
            this.game.player.gold -= goldCost;
            this.game.addToJournal(`💰 Vous corrompez les aventuriers pour ${goldCost} or.`);
        } else {
            this.game.addToJournal(`❌ Pas assez d'or pour les corrompre ! Ils attaquent !`);
            this.defendDungeon();
        }
    }
    
    demonPact() {
        const cost = 100;
        if (this.game.player.gold >= cost) {
            this.game.player.gold -= cost;
            this.game.player.reputation += 25;
            this.game.addToJournal(`👹 Pacte démoniaque conclu ! -${cost} or, +25 réputation`);
            
            // Chance d'obtenir un monstre démoniaque
            if (Math.random() < 0.3 && this.game.player.monsters.length < this.game.player.maxMonsters) {
                const demonMonster = {
                    type: 'demon',
                    name: 'Démon',
                    emoji: '😈',
                    baseStats: { force: 7, defense: 4, vitesse: 5, magie: 6 },
                    level: 1,
                    experience: 0,
                    equipment: { weapon: null, armor: null, boots: null, accessory: null }
                };
                this.game.player.monsters.push(demonMonster);
                this.game.addToJournal(`👹 Un démon apparaît et se joint à vous !`);
            }
        } else {
            this.game.addToJournal(`❌ Le démon refuse, vous n'avez pas assez d'or...`);
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
