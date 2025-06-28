// Système de traduction pour Shadow Master
class Translation {
    constructor() {
        this.currentLanguage = localStorage.getItem('shadowMasterLanguage') || 'fr';
        this.translations = {
            fr: {
                // Interface principale
                title: "Maître des Ombres",
                subtitle: "Version Modulaire",
                gold: "Or",
                goldAvailable: "Or disponible",
                reputation: "Réputation:",
                monsters: "Monstres:",
                dungeon: "Donjon:",
                energy: "Énergie:",
                day: "Jour",
                dayLabel: "Jour:",
                legions: "Légions",
                inventory: "Inventaire",
                journal: "Journal des Ombres",
                
                // Boutons
                save: "Sauvegarder",
                load: "Charger",
                newGame: "Nouveau Jeu",
                delete: "Supprimer",
                manage: "Gérer",
                
                // Messages
                noMonsters: "Aucun monstre recruté",
                emptyInventory: "Inventaire vide",
                reignBegins: "Votre règne commence...",
                reignBeginsDetailed: "Votre règne commence dans les ténèbres...",
                loading: "Chargement...",
                gameInit: "Initialisation du jeu en cours...",
                
                // Messages de confirmation
                confirmNewGame: "Êtes-vous sûr de vouloir commencer un nouveau jeu ? Toute progression non sauvegardée sera perdue.",
                confirmDelete: "Êtes-vous sûr de vouloir supprimer définitivement votre sauvegarde ?",
                saveDeleted: "Sauvegarde supprimée !",
                
                // Actions et choix
                accept: "Accepter",
                refuse: "Refuser",
                continue: "Continuer",
                back: "Retour",
                recruit: "Recruter",
                unavailable: "Indisponible",
                
                // Navigation et menus
                barracks: "Casernes (Recruter des monstres)",
                warTable: "Table de Guerre (Missions)",
                blackMarketMenu: "Marché Noir (Équipements)",
                upgradeDungeon: "Améliorer le Donjon",
                exploreDarkness: "Explorer les Ténèbres",
                meditate: "Méditer dans les Ombres",
                rest: "Se reposer (Passer au jour suivant)",
                
                // Interface de jeu
                tired: "Vous êtes épuisé ! Vous devez vous reposer pour passer au jour suivant.",
                restNeeded: "Repos nécessaire",
                barracksTitle: "Casernes des Légions Infernales",
                barracksDesc: "Les échos de rugissements et de grognements résonnent dans ces halls sombres. Ici, vous pouvez recruter des créatures des ténèbres pour servir vos ambitions maléfiques.",
                barracksOccupied: "Casernes :",
                placesOccupied: "places occupées",
                newBarracks: "Nouvelles casernes :",
                places: "places",
                currently: "actuellement",
                
                // Messages d'erreur
                notEnoughGold: "Pas assez d'or pour recruter cette créature !",
                barracksFull: "Vos casernes sont pleines !",
                barracksFullWild: "mais vos casernes sont pleines !",
                monsterNotFound: "Monstre introuvable !",
                blackMarketLocked: "Le marché noir n'est pas encore disponible. Améliorez votre donjon au niveau 2 pour débloquer cette fonctionnalité.",
                
                // Messages de sauvegarde et système
                exhausted: "Vous êtes épuisé ! Vous devez vous reposer.",
                gameSaved: "Partie sauvegardée !",
                saveError: "Erreur lors de la sauvegarde !",
                saveDeleted: "Sauvegarde supprimée !",
                deleteError: "Erreur lors de la suppression !",
                newGameStarted: "Nouveau jeu commencé !",
                confirmNewGameLong: "Êtes-vous sûr de vouloir commencer un nouveau jeu ? Toute progression sera perdue !",
                
                // Niveaux et progression
                level: "Niveau",
                currentLevel: "Niveau actuel :",
                fortress: "Forteresse :",
                newFeaturesUnlocked: "Nouvelles fonctionnalités débloquées grâce à votre donjon niveau",
                maxLevelReached: "Félicitations ! Votre donjon a atteint son niveau maximum !",
                levelUp: "monte au niveau",
                exp: "EXP:",
                
                // Temps et énergie
                timeOfDay: {
                    morning: "Aube Sanglante",
                    day: "Jour Sombre", 
                    evening: "Crépuscule",
                    night: "Nuit Éternelle"
                },
                
                // Textes d'exploration
                youComeAcross: "Vous tombez sur",
                wild: "sauvage",
                inTheDepths: "Dans les profondeurs, vous tombez sur",
                solitary: "solitaire",
                
                // Exploration des Ténèbres
                explorationTitle: "Exploration des Ténèbres",
                explorationDesc: "Votre donjon recèle encore de nombreux mystères. Des couloirs oubliés, des chambres secrètes et des passages interdits attendent votre exploration.",
                explorationSubDesc: "Chaque expédition dans les profondeurs peut révéler des trésors, des connaissances anciennes, ou des rencontres inattendues...",
                energyAvailable: "Énergie disponible :",
                explorationPoints: "Points d'exploration :",
                
                // Actions d'exploration
                searchRuins: "Fouiller les ruines anciennes",
                followWhispers: "Suivre les murmures spectraux", 
                descendDeeper: "Descendre plus profondément",
                returnToHall: "Retourner au Hall Principal",
                continueExploration: "Continuer l'exploration",
                returnToDungeon: "Retourner au donjon",
                
                // Résultats d'exploration
                ruinsExploration: "Exploration des Ruines",
                ruinsDesc: "Vous fouillez minutieusement les décombres de civilisations oubliées...",
                ancientTreasure: "Vous découvrez un coffre rempli d'or ancien !",
                
                spectralWhispers: "Murmures Spectraux", 
                spectralDesc: "Vous suivez les voix venues d'outre-tombe à travers les couloirs hantés...",
                silenceDesc: "les voix se taisent, vous laissant dans le silence...",
                
                deepAbyss: "Abysses Profonds",
                abyssDesc: "Vous descendez dans les entrailles de la terre, là où la lumière n'a jamais brillé...",
                blackVein: "Vous découvrez une veine d'or noir...",
                
                // Méditation
                meditationTitle: "Méditation des Ombres",
                meditationDesc: "Votre connexion avec les forces obscures se renforce...",
                spiritSharpens: "Votre esprit s'aiguise.",
                goldReward: "+24 or, +4 réputation.",
                
                // Repos et nouveau jour
                newDay: "Nouveau Jour",
                restfulWakeup: "Vous vous réveillez après un repos réparateur dans les ténèbres de votre donjon.",
                dayBegins: "commence ! Votre énergie est restaurée",
                shadowsWhisper: "Les ombres vous murmurent que de nouveaux défis vous attendent...",
                startDay: "Commencer la journée",
                restComplete: "Repos terminé, énergie restaurée !",
                
                // Scène de démarrage
                darknessAwakening: "L'Éveil des Ténèbres",
                startSceneIntro: "Les brumes matinales se dissipent, révélant votre nouveau domaine. Cette forteresse oubliée, nichée dans les montagnes maudites, sera le berceau de votre empire des ombres.",
                startSceneDescription: "Les murs suintent d'une magie ancienne, et l'air vibre de promesses de pouvoir. Votre destin vous attend dans les profondeurs...",
                firstMission: "Votre première mission : établir votre domination sur ces terres abandonnées par les dieux.",
                prepareForUnknown: "Préparez-vous à plonger dans l'inconnu...",
                enterDungeon: "Entrer dans le donjon",
                
                // Hall des Ombres
                hallTitle: "Hall des Ombres Éternelles",
                hallDesc: "Vous dominez votre domaine depuis votre trône d'obsidienne. Les torches noires projettent des ombres dansantes sur les murs gravés de runes anciennes.",
                treasure: "Trésor :",
                terror: "Terreur :",
                goldPieces: "pièces d'or",
                points: "points",
                creatures: "créatures",
                
                // Événements aléatoires
                travelerEvent: "Un voyageur perdu offre de l'or contre sa liberté...",
                acceptGold: "Accepter l'or (+50 or)",
                devour: "Le dévorer (+5 réputation)",
                adventurersEvent: "Des aventuriers tentent d'infiltrer votre donjon !",
                fight: "Les combattre",
                negotiate: "Négocier",
                demonEvent: "Un démon propose un pacte mystérieux...",
                acceptPact: "Accepter le pacte",
                
                // Noms de dongeons
                catacombs: "Catacombes",
                deepCrypt: "Crypte Profonde",
                shadowCitadel: "Citadelle des Ombres",
                cursedFortress: "Forteresse Maudite",
                
                // Fonctionnalités
                blackMarket: "Marché Noir",
                alchemyLab: "Laboratoire Alchimique",
                combatArena: "Arène de Combat",
                demonPortal: "Portail Démoniaque",
                
                // Monstres
                monsters: {
                    goblin: { name: "Gobelin", description: "Petit mais vicieux, excellent éclaireur" },
                    orc: { name: "Orc", description: "Guerrier brutal et résistant" },
                    troll: { name: "Troll", description: "Colosse destructeur aux poings de pierre" },
                    sorcier: { name: "Sorcier Noir", description: "Maître des arts obscurs et des malédictions" },
                    vampire: { name: "Vampire", description: "Noble des ténèbres assoiffé de sang" },
                    demon: { name: "Démon", description: "Créature des abysses aux pouvoirs terrifiants" }
                },
                
                // Équipement
                equipment: {
                    sword: { name: "Épée Rouillée" },
                    darkSword: { name: "Lame des Ombres" },
                    cursedBlade: { name: "Lame Maudite" },
                    shield: { name: "Bouclier de Fer" },
                    darkShield: { name: "Bouclier des Ombres" },
                    soulShield: { name: "Bouclier d'Âmes" },
                    leather: { name: "Armure de Cuir" },
                    chainmail: { name: "Cotte de Mailles" },
                    plate: { name: "Armure de Plaques" },
                    darkPlate: { name: "Armure des Ténèbres" },
                    boots: { name: "Bottes de Marche" },
                    shadowBoots: { name: "Bottes de l'Ombre" },
                    windBoots: { name: "Bottes du Vent" },
                    ring: { name: "Anneau de Force" },
                    manaRing: { name: "Anneau de Mana" },
                    cursedRing: { name: "Anneau Maudit" },
                    pendant: { name: "Pendentif de Protection" },
                    darkPendant: { name: "Pendentif des Ombres" },
                    soulPendant: { name: "Pendentif d'Âme" }
                },
                
                // Gestion des monstres
                dismissMonster: "Renvoyer",
                confirmDismiss: "Êtes-vous sûr de vouloir renvoyer ce monstre ? Cette action est irréversible.",
                monsterDismissed: "a été renvoyé des légions",
                dismiss: "Renvoyer",
                
                // Niveaux et progression
                level: "Niveau",
                currentLevel: "Niveau actuel :",
                fortress: "Forteresse :",
                newFeaturesUnlocked: "Nouvelles fonctionnalités débloquées grâce à votre donjon niveau",
                maxLevelReached: "Félicitations ! Votre donjon a atteint son niveau maximum !",
                levelUp: "monte au niveau",
                exp: "EXP:",
                
                // Temps et énergie
                timeOfDay: {
                    morning: "Aube Sanglante",
                    day: "Jour Sombre", 
                    evening: "Crépuscule",
                    night: "Nuit Éternelle"
                },
                
                // Textes d'exploration
                youComeAcross: "Vous tombez sur",
                wild: "sauvage",
                inTheDepths: "Dans les profondeurs, vous tombez sur",
                solitary: "solitaire",
                
                // Exploration des Ténèbres
                explorationTitle: "Exploration des Ténèbres",
                explorationDesc: "Votre donjon recèle encore de nombreux mystères. Des couloirs oubliés, des chambres secrètes et des passages interdits attendent votre exploration.",
                explorationSubDesc: "Chaque expédition dans les profondeurs peut révéler des trésors, des connaissances anciennes, ou des rencontres inattendues...",
                energyAvailable: "Énergie disponible :",
                explorationPoints: "Points d'exploration :",
                
                // Actions d'exploration
                searchRuins: "Fouiller les ruines anciennes",
                followWhispers: "Suivre les murmures spectraux", 
                descendDeeper: "Descendre plus profondément",
                returnToHall: "Retourner au Hall Principal",
                continueExploration: "Continuer l'exploration",
                returnToDungeon: "Retourner au donjon",
                
                // Résultats d'exploration
                ruinsExploration: "Exploration des Ruines",
                ruinsDesc: "Vous fouillez minutieusement les décombres de civilisations oubliées...",
                ancientTreasure: "Vous découvrez un coffre rempli d'or ancien !",
                
                spectralWhispers: "Murmures Spectraux", 
                spectralDesc: "Vous suivez les voix venues d'outre-tombe à travers les couloirs hantés...",
                silenceDesc: "les voix se taisent, vous laissant dans le silence...",
                
                deepAbyss: "Abysses Profonds",
                abyssDesc: "Vous descendez dans les entrailles de la terre, là où la lumière n'a jamais brillé...",
                blackVein: "Vous découvrez une veine d'or noir...",
                
                // Méditation
                meditationTitle: "Méditation des Ombres",
                meditationDesc: "Votre connexion avec les forces obscures se renforce...",
                spiritSharpens: "Votre esprit s'aiguise.",
                goldReward: "+24 or, +4 réputation.",
                
                // Repos et nouveau jour
                newDay: "Nouveau Jour",
                restfulWakeup: "Vous vous réveillez après un repos réparateur dans les ténèbres de votre donjon.",
                dayBegins: "commence ! Votre énergie est restaurée",
                shadowsWhisper: "Les ombres vous murmurent que de nouveaux défis vous attendent...",
                startDay: "Commencer la journée",
                restComplete: "Repos terminé, énergie restaurée !",
                
                // Scène de démarrage
                darknessAwakening: "L'Éveil des Ténèbres",
                startSceneIntro: "Les brumes matinales se dissipent, révélant votre nouveau domaine. Cette forteresse oubliée, nichée dans les montagnes maudites, sera le berceau de votre empire des ombres.",
                startSceneDescription: "Les murs suintent d'une magie ancienne, et l'air vibre de promesses de pouvoir. Votre destin vous attend dans les profondeurs...",
                firstMission: "Votre première mission : établir votre domination sur ces terres abandonnées par les dieux.",
                prepareForUnknown: "Préparez-vous à plonger dans l'inconnu...",
                enterDungeon: "Entrer dans le donjon",
                
                // Hall des Ombres
                hallTitle: "Hall des Ombres Éternelles",
                hallDesc: "Vous dominez votre domaine depuis votre trône d'obsidienne. Les torches noires projettent des ombres dansantes sur les murs gravés de runes anciennes.",
                treasure: "Trésor :",
                terror: "Terreur :",
                goldPieces: "pièces d'or",
                points: "points",
                creatures: "créatures",
                
                // Événements aléatoires
                travelerEvent: "Un voyageur perdu offre de l'or contre sa liberté...",
                acceptGold: "Accepter l'or (+50 or)",
                devour: "Le dévorer (+5 réputation)",
                adventurersEvent: "Des aventuriers tentent d'infiltrer votre donjon !",
                fight: "Les combattre",
                negotiate: "Négocier",
                demonEvent: "Un démon propose un pacte mystérieux...",
                acceptPact: "Accepter le pacte",
                
                // Noms de dongeons
                catacombs: "Catacombes",
                deepCrypt: "Crypte Profonde",
                shadowCitadel: "Citadelle des Ombres",
                cursedFortress: "Forteresse Maudite",
                
                // Fonctionnalités
                blackMarket: "Marché Noir",
                alchemyLab: "Laboratoire Alchimique",
                combatArena: "Arène de Combat",
                demonPortal: "Portail Démoniaque",
                
                // Monstres
                monsters: {
                    goblin: { name: "Gobelin", description: "Petit mais vicieux, excellent éclaireur" },
                    orc: { name: "Orc", description: "Guerrier brutal et résistant" },
                    troll: { name: "Troll", description: "Colosse destructeur aux poings de pierre" },
                    sorcier: { name: "Sorcier Noir", description: "Maître des arts obscurs et des malédictions" },
                    vampire: { name: "Vampire", description: "Noble des ténèbres assoiffé de sang" },
                    demon: { name: "Démon", description: "Créature des abysses aux pouvoirs terrifiants" }
                },
                
                // Équipement
                equipment: {
                    sword: { name: "Épée Rouillée" },
                    darkSword: { name: "Lame des Ombres" },
                    cursedBlade: { name: "Lame Maudite" },
                    shield: { name: "Bouclier de Fer" },
                    darkShield: { name: "Bouclier des Ombres" },
                    soulShield: { name: "Bouclier d'Âmes" },
                    leather: { name: "Armure de Cuir" },
                    chainmail: { name: "Cotte de Mailles" },
                    plate: { name: "Armure de Plaques" },
                    darkPlate: { name: "Armure des Ténèbres" },
                    boots: { name: "Bottes de Marche" },
                    shadowBoots: { name: "Bottes de l'Ombre" },
                    windBoots: { name: "Bottes du Vent" },
                    ring: { name: "Anneau de Force" },
                    manaRing: { name: "Anneau de Mana" },
                    cursedRing: { name: "Anneau Maudit" },
                    pendant: { name: "Pendentif de Protection" },
                    darkPendant: { name: "Pendentif des Ombres" },
                    soulPendant: { name: "Pendentif d'Âme" }
                },
                
                // Gestion des monstres
                dismissMonster: "Renvoyer",
                confirmDismiss: "Êtes-vous sûr de vouloir renvoyer ce monstre ? Cette action est irréversible.",
                monsterDismissed: "a été renvoyé des légions",
                dismiss: "Renvoyer",
                
                // Niveaux et progression
                level: "Niveau",
                currentLevel: "Niveau actuel :",
                fortress: "Forteresse :",
                newFeaturesUnlocked: "Nouvelles fonctionnalités débloquées grâce à votre donjon niveau",
                maxLevelReached: "Félicitations ! Votre donjon a atteint son niveau maximum !",
                levelUp: "monte au niveau",
                exp: "EXP:",
                
                // Temps et énergie
                timeOfDay: {
                    morning: "Aube Sanglante",
                    day: "Jour Sombre", 
                    evening: "Crépuscule",
                    night: "Nuit Éternelle"
                },
                
                // Textes d'exploration
                youComeAcross: "Vous tombez sur",
                wild: "sauvage",
                inTheDepths: "Dans les profondeurs, vous tombez sur",
                solitary: "solitaire",
                
                // Exploration des Ténèbres
                explorationTitle: "Exploration des Ténèbres",
                explorationDesc: "Votre donjon recèle encore de nombreux mystères. Des couloirs oubliés, des chambres secrètes et des passages interdits attendent votre exploration.",
                explorationSubDesc: "Chaque expédition dans les profondeurs peut révéler des trésors, des connaissances anciennes, ou des rencontres inattendues...",
                energyAvailable: "Énergie disponible :",
                explorationPoints: "Points d'exploration :",
                
                // Actions d'exploration
                searchRuins: "Fouiller les ruines anciennes",
                followWhispers: "Suivre les murmures spectraux", 
                descendDeeper: "Descendre plus profondément",
                returnToHall: "Retourner au Hall Principal",
                continueExploration: "Continuer l'exploration",
                returnToDungeon: "Retourner au donjon",
                
                // Résultats d'exploration
                ruinsExploration: "Exploration des Ruines",
                ruinsDesc: "Vous fouillez minutieusement les décombres de civilisations oubliées...",
                ancientTreasure: "Vous découvrez un coffre rempli d'or ancien !",
                
                spectralWhispers: "Murmures Spectraux", 
                spectralDesc: "Vous suivez les voix venues d'outre-tombe à travers les couloirs hantés...",
                silenceDesc: "les voix se taisent, vous laissant dans le silence...",
                
                deepAbyss: "Abysses Profonds",
                abyssDesc: "Vous descendez dans les entrailles de la terre, là où la lumière n'a jamais brillé...",
                blackVein: "Vous découvrez une veine d'or noir...",
                
                // Méditation
                meditationTitle: "Méditation des Ombres",
                meditationDesc: "Votre connexion avec les forces obscures se renforce...",
                spiritSharpens: "Votre esprit s'aiguise.",
                goldReward: "+24 or, +4 réputation.",
                
                // Repos et nouveau jour
                newDay: "Nouveau Jour",
                restfulWakeup: "Vous vous réveillez après un repos réparateur dans les ténèbres de votre donjon.",
                dayBegins: "commence ! Votre énergie est restaurée",
                shadowsWhisper: "Les ombres vous murmurent que de nouveaux défis vous attendent...",
                startDay: "Commencer la journée",
                restComplete: "Repos terminé, énergie restaurée !",
                
                // Scène de démarrage
                darknessAwakening: "L'Éveil des Ténèbres",
                startSceneIntro: "Les brumes matinales se dissipent, révélant votre nouveau domaine. Cette forteresse oubliée, nichée dans les montagnes maudites, sera le berceau de votre empire des ombres.",
                startSceneDescription: "Les murs suintent d'une magie ancienne, et l'air vibre de promesses de pouvoir. Votre destin vous attend dans les profondeurs...",
                firstMission: "Votre première mission : établir votre domination sur ces terres abandonnées par les dieux.",
                prepareForUnknown: "Préparez-vous à plonger dans l'inconnu...",
                enterDungeon: "Entrer dans le donjon",
                
                // Hall des Ombres
                hallTitle: "Hall des Ombres Éternelles",
                hallDesc: "Vous dominez votre domaine depuis votre trône d'obsidienne. Les torches noires projettent des ombres dansantes sur les murs gravés de runes anciennes.",
                treasure: "Trésor :",
                terror: "Terreur :",
                goldPieces: "pièces d'or",
                points: "points",
                creatures: "créatures",
                
                // Événements aléatoires
                travelerEvent: "Un voyageur perdu offre de l'or contre sa liberté...",
                acceptGold: "Accepter l'or (+50 or)",
                devour: "Le dévorer (+5 réputation)",
                adventurersEvent: "Des aventuriers tentent d'infiltrer votre donjon !",
                fight: "Les combattre",
                negotiate: "Négocier",
                demonEvent: "Un démon propose un pacte mystérieux...",
                acceptPact: "Accepter le pacte",
                
                // Noms de dongeons
                catacombs: "Catacombes",
                deepCrypt: "Crypte Profonde",
                shadowCitadel: "Citadelle des Ombres",
                cursedFortress: "Forteresse Maudite",
                
                // Fonctionnalités
                blackMarket: "Marché Noir",
                alchemyLab: "Laboratoire Alchimique",
                combatArena: "Arène de Combat",
                demonPortal: "Portail Démoniaque",
                
                // Monstres
                monsters: {
                    goblin: { name: "Gobelin", description: "Petit mais vicieux, excellent éclaireur" },
                    orc: { name: "Orc", description: "Guerrier brutal et résistant" },
                    troll: { name: "Troll", description: "Colosse destructeur aux poings de pierre" },
                    sorcier: { name: "Sorcier Noir", description: "Maître des arts obscurs et des malédictions" },
                    vampire: { name: "Vampire", description: "Noble des ténèbres assoiffé de sang" },
                    demon: { name: "Démon", description: "Créature des abysses aux pouvoirs terrifiants" }
                },
                
                // Équipement
                equipment: {
                    sword: { name: "Épée Rouillée" },
                    darkSword: { name: "Lame des Ombres" },
                    cursedBlade: { name: "Lame Maudite" },
                    shield: { name: "Bouclier de Fer" },
                    darkShield: { name: "Bouclier des Ombres" },
                    soulShield: { name: "Bouclier d'Âmes" },
                    leather: { name: "Armure de Cuir" },
                    chainmail: { name: "Cotte de Mailles" },
                    plate: { name: "Armure de Plaques" },
                    darkPlate: { name: "Armure des Ténèbres" },
                    boots: { name: "Bottes de Marche" },
                    shadowBoots: { name: "Bottes de l'Ombre" },
                    windBoots: { name: "Bottes du Vent" },
                    ring: { name: "Anneau de Force" },
                    manaRing: { name: "Anneau de Mana" },
                    cursedRing: { name: "Anneau Maudit" },
                    pendant: { name: "Pendentif de Protection" },
                    darkPendant: { name: "Pendentif des Ombres" },
                    soulPendant: { name: "Pendentif d'Âme" }
                }
            },
            en: {
                // Main interface
                title: "Shadow Master",
                subtitle: "Modular Version",
                gold: "Gold",
                goldAvailable: "Available Gold",
                reputation: "Reputation:",
                monsters: "Monsters:",
                dungeon: "Dungeon:",
                energy: "Energy:",
                day: "Day",
                dayLabel: "Day:",
                legions: "Legions",
                inventory: "Inventory",
                journal: "Shadow Journal",
                
                // Buttons
                save: "Save",
                load: "Load",
                newGame: "New Game",
                delete: "Delete",
                manage: "Manage",
                
                // Messages
                noMonsters: "No monsters recruited",
                emptyInventory: "Empty inventory",
                reignBegins: "Your reign begins...",
                reignBeginsDetailed: "Your reign begins in darkness...",
                loading: "Loading...",
                gameInit: "Game initialization in progress...",
                
                // Confirmation messages
                confirmNewGame: "Are you sure you want to start a new game? Any unsaved progress will be lost.",
                confirmDelete: "Are you sure you want to permanently delete your save?",
                saveDeleted: "Save deleted!",
                
                // Actions and choices
                accept: "Accept",
                refuse: "Refuse",
                continue: "Continue",
                back: "Back",
                recruit: "Recruit",
                unavailable: "Unavailable",
                
                // Navigation and menus
                barracks: "Barracks (Recruit monsters)",
                warTable: "War Table (Missions)",
                blackMarketMenu: "Black Market (Equipment)",
                upgradeDungeon: "Upgrade Dungeon",
                exploreDarkness: "Explore Darkness",
                meditate: "Meditate in Shadows",
                rest: "Rest (Go to next day)",
                
                // Game interface
                tired: "You are exhausted! You must rest to go to the next day.",
                restNeeded: "Rest needed",
                barracksTitle: "Infernal Legions Barracks",
                barracksDesc: "Echoes of roars and growls resonate in these dark halls. Here, you can recruit creatures of darkness to serve your evil ambitions.",
                barracksOccupied: "Barracks:",
                placesOccupied: "places occupied",
                newBarracks: "New barracks:",
                places: "places",
                currently: "currently",
                
                // Error messages
                notEnoughGold: "Not enough gold to recruit this creature!",
                barracksFull: "Your barracks are full!",
                barracksFullWild: "but your barracks are full!",
                monsterNotFound: "Monster not found!",
                blackMarketLocked: "The black market is not yet available. Upgrade your dungeon to level 2 to unlock this feature.",
                
                // Save and system messages
                exhausted: "You are exhausted! You need to rest.",
                gameSaved: "Game saved!",
                saveError: "Error saving game!",
                saveDeleted: "Save deleted!",
                deleteError: "Error deleting save!",
                newGameStarted: "New game started!",
                confirmNewGameLong: "Are you sure you want to start a new game? All progress will be lost!",
                
                // Levels and progression
                level: "Level",
                currentLevel: "Current level:",
                fortress: "Fortress:",
                newFeaturesUnlocked: "New features unlocked thanks to your dungeon level",
                maxLevelReached: "Congratulations! Your dungeon has reached its maximum level!",
                levelUp: "levels up to level",
                exp: "EXP:",
                
                // Time and energy
                timeOfDay: {
                    morning: "Bloody Dawn",
                    day: "Dark Day",
                    evening: "Twilight",
                    night: "Eternal Night"
                },
                
                // Exploration texts
                youComeAcross: "You come across",
                wild: "wild",
                inTheDepths: "In the depths, you come across",
                solitary: "solitary",
                
                // Darkness Exploration
                explorationTitle: "Darkness Exploration",
                explorationDesc: "Your dungeon still holds many mysteries. Forgotten corridors, secret chambers and forbidden passages await your exploration.",
                explorationSubDesc: "Each expedition into the depths can reveal treasures, ancient knowledge, or unexpected encounters...",
                energyAvailable: "Available energy:",
                explorationPoints: "Exploration points:",
                
                // Exploration actions
                searchRuins: "Search ancient ruins",
                followWhispers: "Follow spectral whispers",
                descendDeeper: "Descend deeper",
                returnToHall: "Return to Main Hall",
                continueExploration: "Continue exploration",
                returnToDungeon: "Return to dungeon",
                
                // Exploration results
                ruinsExploration: "Ruins Exploration",
                ruinsDesc: "You carefully search through the debris of forgotten civilizations...",
                ancientTreasure: "You discover a chest filled with ancient gold!",
                
                spectralWhispers: "Spectral Whispers",
                spectralDesc: "You follow the voices from beyond the grave through the haunted corridors...",
                silenceDesc: "the voices fall silent, leaving you in silence...",
                
                deepAbyss: "Deep Abyss",
                abyssDesc: "You descend into the bowels of the earth, where light has never shone...",
                blackVein: "You discover a vein of black gold...",
                
                // Meditation
                meditationTitle: "Shadow Meditation",
                meditationDesc: "Your connection with dark forces strengthens...",
                spiritSharpens: "Your spirit sharpens.",
                goldReward: "+24 gold, +4 reputation.",
                
                // Rest and new day
                newDay: "New Day",
                restfulWakeup: "You wake up after a restful sleep in the darkness of your dungeon.",
                dayBegins: "begins! Your energy is restored",
                shadowsWhisper: "The shadows whisper that new challenges await you...",
                startDay: "Start the day",
                restComplete: "Rest complete, energy restored!",
                
                // Start scene
                darknessAwakening: "The Awakening of Darkness",
                startSceneIntro: "The morning mists dissipate, revealing your new domain. This forgotten fortress, nestled in the cursed mountains, will be the cradle of your shadow empire.",
                startSceneDescription: "The walls ooze with ancient magic, and the air vibrates with promises of power. Your destiny awaits you in the depths...",
                firstMission: "Your first mission: establish your domination over these lands abandoned by the gods.",
                prepareForUnknown: "Prepare to dive into the unknown...",
                enterDungeon: "Enter the dungeon",
                
                // Hall of Shadows
                hallTitle: "Hall of Eternal Shadows",
                hallDesc: "You dominate your domain from your obsidian throne. Black torches cast dancing shadows on the walls engraved with ancient runes.",
                treasure: "Treasure:",
                terror: "Terror:",
                goldPieces: "gold pieces",
                points: "points",
                creatures: "creatures",
                
                // Random events
                travelerEvent: "A lost traveler offers gold for his freedom...",
                acceptGold: "Accept gold (+50 gold)",
                devour: "Devour him (+5 reputation)",
                adventurersEvent: "Adventurers try to infiltrate your dungeon!",
                fight: "Fight them",
                negotiate: "Negotiate",
                demonEvent: "A demon offers a mysterious pact...",
                acceptPact: "Accept the pact",
                
                // Dungeon names
                catacombs: "Catacombs",
                deepCrypt: "Deep Crypt",
                shadowCitadel: "Shadow Citadel",
                cursedFortress: "Cursed Fortress",
                
                // Features
                blackMarket: "Black Market",
                alchemyLab: "Alchemy Laboratory",
                combatArena: "Combat Arena",
                demonPortal: "Demon Portal",
                
                // Monsters
                monsters: {
                    goblin: { name: "Goblin", description: "Small but vicious, excellent scout" },
                    orc: { name: "Orc", description: "Brutal and resilient warrior" },
                    troll: { name: "Troll", description: "Destructive colossus with stone fists" },
                    sorcier: { name: "Dark Sorcerer", description: "Master of dark arts and curses" },
                    vampire: { name: "Vampire", description: "Noble of darkness thirsting for blood" },
                    demon: { name: "Demon", description: "Creature from the abyss with terrifying powers" }
                },
                
                // Equipment
                equipment: {
                    sword: { name: "Rusty Sword" },
                    darkSword: { name: "Shadow Blade" },
                    cursedBlade: { name: "Cursed Blade" },
                    shield: { name: "Iron Shield" },
                    darkShield: { name: "Shadow Shield" },
                    soulShield: { name: "Soul Shield" },
                    leather: { name: "Leather Armor" },
                    chainmail: { name: "Chain Mail" },
                    plate: { name: "Plate Armor" },
                    darkPlate: { name: "Darkness Armor" },
                    boots: { name: "Walking Boots" },
                    shadowBoots: { name: "Shadow Boots" },
                    windBoots: { name: "Wind Boots" },
                    ring: { name: "Ring of Strength" },
                    manaRing: { name: "Mana Ring" },
                    cursedRing: { name: "Cursed Ring" },
                    pendant: { name: "Pendant of Protection" },
                    darkPendant: { name: "Shadow Pendant" },
                    soulPendant: { name: "Soul Pendant" }
                },
                
                // Gestion des monstres
                dismissMonster: "Dismiss",
                confirmDismiss: "Are you sure you want to dismiss this monster? This action is irreversible.",
                monsterDismissed: "has been dismissed from the legions",
                dismiss: "Dismiss",
                
                // Niveaux et progression
                level: "Niveau",
                currentLevel: "Niveau actuel :",
                fortress: "Forteresse :",
                newFeaturesUnlocked: "Nouvelles fonctionnalités débloquées grâce à votre donjon niveau",
                maxLevelReached: "Félicitations ! Votre donjon a atteint son niveau maximum !",
                levelUp: "monte au niveau",
                exp: "EXP:",
                
                // Temps et énergie
                timeOfDay: {
                    morning: "Aube Sanglante",
                    day: "Jour Sombre", 
                    evening: "Crépuscule",
                    night: "Nuit Éternelle"
                },
                
                // Textes d'exploration
                youComeAcross: "Vous tombez sur",
                wild: "sauvage",
                inTheDepths: "Dans les profondeurs, vous tombez sur",
                solitary: "solitaire",
                
                // Exploration des Ténèbres
                explorationTitle: "Exploration des Ténèbres",
                explorationDesc: "Votre donjon recèle encore de nombreux mystères. Des couloirs oubliés, des chambres secrètes et des passages interdits attendent votre exploration.",
                explorationSubDesc: "Chaque expédition dans les profondeurs peut révéler des trésors, des connaissances anciennes, ou des rencontres inattendues...",
                energyAvailable: "Énergie disponible :",
                explorationPoints: "Points d'exploration :",
                
                // Actions d'exploration
                searchRuins: "Fouiller les ruines anciennes",
                followWhispers: "Suivre les murmures spectraux", 
                descendDeeper: "Descendre plus profondément",
                returnToHall: "Retourner au Hall Principal",
                continueExploration: "Continuer l'exploration",
                returnToDungeon: "Retourner au donjon",
                
                // Résultats d'exploration
                ruinsExploration: "Exploration des Ruines",
                ruinsDesc: "Vous fouillez minutieusement les décombres de civilisations oubliées...",
                ancientTreasure: "Vous découvrez un coffre rempli d'or ancien !",
                
                spectralWhispers: "Murmures Spectraux", 
                spectralDesc: "Vous suivez les voix venues d'outre-tombe à travers les couloirs hantés...",
                silenceDesc: "les voix se taisent, vous laissant dans le silence...",
                
                deepAbyss: "Abysses Profonds",
                abyssDesc: "Vous descendez dans les entrailles de la terre, là où la lumière n'a jamais brillé...",
                blackVein: "Vous découvrez une veine d'or noir...",
                
                // Méditation
                meditationTitle: "Méditation des Ombres",
                meditationDesc: "Votre connexion avec les forces obscures se renforce...",
                spiritSharpens: "Votre esprit s'aiguise.",
                goldReward: "+24 or, +4 réputation.",
                
                // Repos et nouveau jour
                newDay: "Nouveau Jour",
                restfulWakeup: "Vous vous réveillez après un repos réparateur dans les ténèbres de votre donjon.",
                dayBegins: "commence ! Votre énergie est restaurée",
                shadowsWhisper: "Les ombres vous murmurent que de nouveaux défis vous attendent...",
                startDay: "Commencer la journée",
                restComplete: "Repos terminé, énergie restaurée !",
                
                // Scène de démarrage
                darknessAwakening: "L'Éveil des Ténèbres",
                startSceneIntro: "Les brumes matinales se dissipent, révélant votre nouveau domaine. Cette forteresse oubliée, nichée dans les montagnes maudites, sera le berceau de votre empire des ombres.",
                startSceneDescription: "Les murs suintent d'une magie ancienne, et l'air vibre de promesses de pouvoir. Votre destin vous attend dans les profondeurs...",
                firstMission: "Votre première mission : établir votre domination sur ces terres abandonnées par les dieux.",
                prepareForUnknown: "Préparez-vous à plonger dans l'inconnu...",
                enterDungeon: "Entrer dans le donjon",
                
                // Hall des Ombres
                hallTitle: "Hall des Ombres Éternelles",
                hallDesc: "Vous dominez votre domaine depuis votre trône d'obsidienne. Les torches noires projettent des ombres dansantes sur les murs gravés de runes anciennes.",
                treasure: "Trésor :",
                terror: "Terreur :",
                goldPieces: "pièces d'or",
                points: "points",
                creatures: "créatures",
                
                // Événements aléatoires
                travelerEvent: "Un voyageur perdu offre de l'or contre sa liberté...",
                acceptGold: "Accepter l'or (+50 or)",
                devour: "Le dévorer (+5 réputation)",
                adventurersEvent: "Des aventuriers tentent d'infiltrer votre donjon !",
                fight: "Les combattre",
                negotiate: "Négocier",
                demonEvent: "Un démon propose un pacte mystérieux...",
                acceptPact: "Accepter le pacte",
                
                // Noms de dongeons
                catacombs: "Catacombes",
                deepCrypt: "Crypte Profonde",
                shadowCitadel: "Citadelle des Ombres",
                cursedFortress: "Forteresse Maudite",
                
                // Fonctionnalités
                blackMarket: "Marché Noir",
                alchemyLab: "Laboratoire Alchimique",
                combatArena: "Arène de Combat",
                demonPortal: "Portail Démoniaque",
                
                // Monstres
                monsters: {
                    goblin: { name: "Gobelin", description: "Petit mais vicieux, excellent éclaireur" },
                    orc: { name: "Orc", description: "Guerrier brutal et résistant" },
                    troll: { name: "Troll", description: "Colosse destructeur aux poings de pierre" },
                    sorcier: { name: "Sorcier Noir", description: "Maître des arts obscurs et des malédictions" },
                    vampire: { name: "Vampire", description: "Noble des ténèbres assoiffé de sang" },
                    demon: { name: "Démon", description: "Créature des abysses aux pouvoirs terrifiants" }
                },
                
                // Équipement
                equipment: {
                    sword: { name: "Épée Rouillée" },
                    darkSword: { name: "Lame des Ombres" },
                    cursedBlade: { name: "Lame Maudite" },
                    shield: { name: "Bouclier de Fer" },
                    darkShield: { name: "Bouclier des Ombres" },
                    soulShield: { name: "Bouclier d'Âmes" },
                    leather: { name: "Armure de Cuir" },
                    chainmail: { name: "Cotte de Mailles" },
                    plate: { name: "Armure de Plaques" },
                    darkPlate: { name: "Armure des Ténèbres" },
                    boots: { name: "Bottes de Marche" },
                    shadowBoots: { name: "Bottes de l'Ombre" },
                    windBoots: { name: "Bottes du Vent" },
                    ring: { name: "Anneau de Force" },
                    manaRing: { name: "Anneau de Mana" },
                    cursedRing: { name: "Anneau Maudit" },
                    pendant: { name: "Pendentif de Protection" },
                    darkPendant: { name: "Pendentif des Ombres" },
                    soulPendant: { name: "Pendentif d'Âme" }
                }
            }
        };
    }
    
    // Obtenir une traduction
    t(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
    
    // Changer la langue
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('shadowMasterLanguage', lang);
            this.updateUI();
        }
    }
    
    // Obtenir la langue actuelle
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // Mettre à jour l'interface utilisateur
    updateUI() {
        // Mettre à jour le titre
        const title = document.querySelector('.game-header h1');
        if (title) title.textContent = `🌙 ${this.t('title')}`;
        
        const subtitle = document.querySelector('.version-info');
        if (subtitle) subtitle.textContent = this.t('subtitle');
        
        // Mettre à jour les labels des stats
        const statLabels = {
            gold: '💰 ' + this.t('gold') + ':',
            reputation: '⭐ ' + this.t('reputation'),
            monsters: '👹 ' + this.t('monsters'),
            dungeon: '🏰 ' + this.t('dungeon'),
            energy: '⚡ ' + this.t('energy'),
            day: '📅 ' + this.t('dayLabel')
        };
        
        Object.entries(statLabels).forEach(([key, label]) => {
            const element = document.querySelector(`#${key}`);
            if (element) {
                const statItem = element.closest('.stat-item');
                if (statItem) {
                    const labelElement = statItem.querySelector('.stat-label');
                    if (labelElement) labelElement.textContent = label;
                }
            }
        });
        
        // Mettre à jour les titres des sections
        const legionsTitle = document.querySelector('.monsters-panel h3');
        if (legionsTitle) legionsTitle.textContent = `👹 ${this.t('legions')}`;
        
        const inventoryTitle = document.querySelector('.inventory-panel h3');
        if (inventoryTitle) inventoryTitle.textContent = `🎒 ${this.t('inventory')}`;
        
        const journalTitle = document.querySelector('.journal-section h3');
        if (journalTitle) journalTitle.textContent = `📖 ${this.t('journal')}`;
        
        // Mettre à jour les boutons
        const buttons = {
            saveGame: '💾 ' + this.t('save'),
            loadGame: '📁 ' + this.t('load'),
            newGame: '🎮 ' + this.t('newGame'),
            deleteGame: '🗑️ ' + this.t('delete')
        };
        
        Object.entries(buttons).forEach(([id, text]) => {
            const button = document.getElementById(id);
            if (button) button.textContent = text;
        });
        
        // Mettre à jour les messages par défaut
        const monstersEmpty = document.querySelector('.monsters-list .empty');
        if (monstersEmpty) monstersEmpty.textContent = this.t('noMonsters');
        
        const inventoryEmpty = document.querySelector('.inventory .empty');
        if (inventoryEmpty) inventoryEmpty.textContent = this.t('emptyInventory');
        
        // Mettre à jour le message initial du journal s'il existe
        const journalInitial = document.querySelector('#journal p');
        if (journalInitial && journalInitial.textContent === 'Votre règne commence...') {
            journalInitial.textContent = this.t('reignBegins');
        } else if (journalInitial && journalInitial.textContent === 'Your reign begins...') {
            journalInitial.textContent = this.t('reignBegins');
        }
        
        // Mettre à jour la langue du HTML
        document.documentElement.lang = this.currentLanguage;
        
        // Émettre un événement pour que le jeu puisse se mettre à jour
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: this.currentLanguage } 
        }));
    }
    
    // Obtenir les traductions pour les données du jeu
    getGameData(key, data) {
        // Pour les événements aléatoires et autres données de jeu
        if (this.currentLanguage === 'en') {
            switch(key) {
                case 'dungeonUpgrades':
                    return this.translateDungeonUpgrades(data);
                case 'randomEvents':
                    return this.translateRandomEvents(data);
                case 'gameConfig':
                    return this.translateGameConfig(data);
                default:
                    return data;
            }
        }
        return data;
    }
    
    // Obtenir le nom traduit d'un monstre
    getMonsterName(monsterId, originalName) {
        const translation = this.translations[this.currentLanguage].monsters[monsterId];
        return translation ? translation.name : originalName;
    }
    
    // Obtenir la description traduite d'un monstre
    getMonsterDescription(monsterId, originalDescription) {
        const translation = this.translations[this.currentLanguage].monsters[monsterId];
        return translation ? translation.description : originalDescription;
    }
    
    // Obtenir le nom traduit d'un équipement
    getEquipmentName(equipmentId, originalName) {
        const translation = this.translations[this.currentLanguage].equipment[equipmentId];
        return translation ? translation.name : originalName;
    }
    
    translateDungeonUpgrades(upgrades) {
        const translated = {};
        const names = {
            'Catacombes': 'Catacombs',
            'Crypte Profonde': 'Deep Crypt',
            'Citadelle des Ombres': 'Shadow Citadel',
            'Forteresse Maudite': 'Cursed Fortress'
        };
        
        const features = {
            'Marché Noir': 'Black Market',
            'Laboratoire Alchimique': 'Alchemy Laboratory',
            'Arène de Combat': 'Combat Arena',
            'Portail Démoniaque': 'Demon Portal'
        };
        
        Object.entries(upgrades).forEach(([level, upgrade]) => {
            translated[level] = {
                ...upgrade,
                name: names[upgrade.name] || upgrade.name,
                newFeatures: upgrade.newFeatures?.map(feature => features[feature] || feature)
            };
        });
        
        return translated;
    }
    
    translateRandomEvents(events) {
        if (this.currentLanguage === 'fr') return events;
        
        const translations = {
            "Un voyageur perdu offre de l'or contre sa liberté...": "A lost traveler offers gold for his freedom...",
            "Accepter l'or (+50 or)": "Accept gold (+50 gold)",
            "Le dévorer (+5 réputation)": "Devour him (+5 reputation)",
            "Des aventuriers tentent d'infiltrer votre donjon !": "Adventurers try to infiltrate your dungeon!",
            "Les combattre": "Fight them",
            "Négocier": "Negotiate",
            "Un démon propose un pacte mystérieux...": "A demon offers a mysterious pact...",
            "Accepter le pacte": "Accept the pact",
            
            // Exploration texts
            "Vous découvrez un coffre rempli d'or ancien !": "You discover a chest filled with ancient gold!",
            "Les voix se taisent, vous laissant dans le silence...": "The voices fall silent, leaving you in silence...",
            "Vous découvrez une veine d'or noir...": "You discover a vein of black gold..."
        };
        
        return events.map(event => ({
            ...event,
            text: translations[event.text] || event.text,
            choices: event.choices?.map(choice => ({
                ...choice,
                text: translations[choice.text] || choice.text
            }))
        }));
    }
    
    // Traduire les données d'exploration et autres
    translateGameConfig(config) {
        if (this.currentLanguage === 'fr') return config;
        
        const translated = { ...config };
        
        // Traduire les découvertes si elles existent
        if (config.discoveries) {
            translated.discoveries = {};
            Object.keys(config.discoveries).forEach(key => {
                translated.discoveries[key] = config.discoveries[key].map(discovery => ({
                    ...discovery,
                    text: this.translateText(discovery.text)
                }));
            });
        }
        
        // Traduire les murmures
        if (config.whispers) {
            translated.whispers = config.whispers.map(whisper => ({
                ...whisper,
                text: this.translateText(whisper.text)
            }));
        }
        
        // Traduire les découvertes profondes
        if (config.deepFindings) {
            translated.deepFindings = config.deepFindings.map(finding => ({
                ...finding,
                text: this.translateText(finding.text)
            }));
        }
        
        return translated;
    }
    
    translateText(text) {
        const translations = {
            "Vous découvrez un coffre rempli d'or ancien !": "You discover a chest filled with ancient gold!",
            "Les voix se taisent, vous laissant dans le silence...": "The voices fall silent, leaving you in silence...",
            "Vous découvrez une veine d'or noir...": "You discover a vein of black gold..."
        };
        
        return translations[text] || text;
    }
}

// Instance globale de traduction
window.translation = new Translation();
