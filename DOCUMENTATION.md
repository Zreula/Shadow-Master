# 🌙 Shadow Master - Documentation Complète du Projet

## Vue d'ensemble du projet

**Shadow Master** est un jeu RPG textuel basé sur le web où le joueur incarne un maître des ombres qui doit développer son donjon, recruter des monstres et partir en missions pour étendre son empire sombre.

### Technologies utilisées
- **HTML/CSS/JavaScript** : Interface web responsive
- **JSON** : Données de configuration et contenu
- **Architecture modulaire** : Classes séparées pour chaque système

---

## 📁 Structure des fichiers

### 🏠 Fichiers racine

#### `index.html`
**Rôle** : Page principale du jeu
**Contenu** :
- Structure HTML de base du jeu
- Panneau de statistiques (or, réputation, monstres, énergie, jour)
- Zone principale d'histoire et de choix
- Panneaux latéraux (monstres, inventaire)
- Contrôles de sauvegarde
- Chargement de tous les scripts JS

#### `style.css`
**Rôle** : Feuille de style complète ultra-compacte
**Caractéristiques** :
- **Design sombre et minimaliste** : Couleurs #1a1a1a, #2a2a2a, #3a3a3a
- **Interface ultra-compacte** : Maximise l'espace de jeu
- **Responsive design** : Adapté mobile et desktop
- **Sections principales** :
  - Reset CSS et base
  - Layout principal (flexbox)
  - Composants de missions (style liste compact)
  - Système de combat (cartes, arène)
  - Panneaux latéraux (monstres, inventaire)
  - Messages et états (success, warning, error)

---

## 📂 Dossier `/js` - Logique du jeu

### `main.js`
**Rôle** : Point d'entrée du jeu
**Fonctions** :
- Initialise l'instance principale du jeu
- Lance le chargement des données
- Gère les événements globaux

### `game.js` 
**Rôle** : Classe principale du jeu (Game)
**Responsabilités** :
- **État du joueur** : gold, reputation, monsters, energy, day
- **Gestion des scènes** : currentScene, navigation
- **Initialisation** : Charge toutes les données JSON
- **Cycle de jeu** : repos, passage au jour suivant
- **Sauvegarde/Chargement** : localStorage
- **Intégration** : Relie tous les autres systèmes

**Méthodes clés** :
- `initialize()` : Charge les données et initialise le jeu
- `showScene(sceneId)` : Affiche une scène
- `updateUI()` : Met à jour l'interface
- `rest()` : Passe au jour suivant, restaure l'énergie
- `save()/load()` : Gestion des sauvegardes

### `scenes.js`
**Rôle** : Gestionnaire des scènes de jeu (Scenes)
**Scènes disponibles** :
- `start` : Écran d'introduction
- `hub` : Hall principal avec tous les choix
- `recruit` : Casernes pour recruter des monstres
- `missions` : Table de guerre pour sélectionner les missions
- `market` : Marché noir pour acheter de l'équipement
- `upgrade` : Amélioration du donjon
- `explore` : Exploration pour bonus
- `missionPrep` : Préparation tactique des missions

**Fonctionnalités spéciales** :
- **Tutoriel intégré** : Guide pour nouveaux joueurs
- **Gestion de l'énergie** : Désactive les actions si énergie = 0
- **Messages dynamiques** : Indique pourquoi certaines missions sont bloquées

### `combat.js`
**Rôle** : Système de combat tactique complet (Combat)
**Fonctionnalités** :
- **Sélection de monstres** : Interface pour choisir l'équipe
- **Combat réaliste** : Système tour par tour avec initiative
- **Statistiques complètes** : HP, attaque, défense, vitesse
- **Capacités spéciales** : Chaque monstre/ennemi a des abilities
- **Journal de combat** : Log détaillé de chaque action
- **Calcul de puissance** : Intègre niveau, stats de base et équipement
- **Récompenses dynamiques** : Équipement selon le type de victoire

**Méthodes principales** :
- `prepareMission()` : Lance la préparation tactique
- `getMissionPrepScene()` : Interface de sélection des monstres
- `simulateCombat()` : Simulation tour par tour réaliste
- `calculateMonsterPower()` : Calcul de puissance robuste

### `actions.js`
**Rôle** : Actions disponibles au joueur (Actions)
**Actions disponibles** :
- **Recrutement** : `recruitMonster()` - Acheter de nouveaux monstres
- **Équipement** : `buyEquipment()`, `equipItem()` - Gérer l'équipement
- **Amélioration** : `upgradeDungeon()` - Améliorer le donjon
- **Exploration** : `exploreRuins()`, `followWhispers()` - Actions d'exploration
- **Gestion** : `dismissMonster()`, `meditate()` - Autres actions

**Système d'XP** : Les monstres gagnent de l'expérience et montent de niveau

### `ui.js`
**Rôle** : Gestion de l'interface utilisateur (UI)
**Responsabilités** :
- **Affichage des scènes** : `displayScene()`
- **Mise à jour des stats** : `updatePlayerStats()`
- **Rendu des listes** : Monstres, inventaire, missions
- **Messages** : Notifications et feedbacks

### `dataManager.js`
**Rôle** : Gestionnaire des données (DataManager)
**Fonctions** :
- Chargement des fichiers JSON
- Validation des données
- Gestion des erreurs de chargement

### `utils.js`
**Rôle** : Fonctions utilitaires
**Contient** :
- Fonctions mathématiques communes
- Helpers pour la manipulation des données
- Constantes globales

---

## 📂 Dossier `/data` - Configuration et contenu

### `gameConfig.json`
**Rôle** : Configuration principale du jeu
**Contient** :
- **Améliorations de donjon** : Coûts, capacités, nouvelles fonctionnalités
- **Paramètres de gameplay** : Énergie max, limites
- **Progression** : Système de niveaux et déblocages

### `monsters.json` 
**Rôle** : Définition des types de monstres
**Structure** :
```json
{
  "goblin": {
    "name": "Goblin Warrior",
    "emoji": "👹",
    "cost": 50,
    "rarity": "common",
    "baseStats": {
      "attack": 5,
      "defense": 3,
      "hp": 20,
      "speed": 6
    }
  }
}
```

### `equipment.json`
**Rôle** : Définition des équipements
**Types** : Armes, armures, accessoires
**Statistiques** : Bonus d'attaque, défense, HP, vitesse

### `missions.json`
**Rôle** : Définition des missions
**Contient** :
- **Difficulté et prérequis** : Puissance requise, niveau de donjon
- **Récompenses** : Or, réputation, équipement possible
- **Ennemis** : Types d'ennemis rencontrés
- **Coût en énergie** : Ressource nécessaire

### `enemies.json`
**Rôle** : Définition des ennemis réalistes
**Nouveauté** : Ennemis avec vraies statistiques de combat
**Contient** : HP, attaque, défense, vitesse, capacités spéciales

### `abilities.json`
**Rôle** : Définition des capacités spéciales
**Types** :
- Capacités de monstres
- Capacités d'ennemis
- Effets spéciaux (dégâts, buffs, debuffs)

### `combat.json`
**Rôle** : Configuration du système de combat
**Contient** :
- Événements de combat
- Modificateurs de difficulté
- Types de victoire et récompenses

---

## 🎮 Systèmes de jeu principaux

### 💰 Système économique
- **Or** : Monnaie principale pour recruter et acheter
- **Réputation** : Débloque des missions plus difficiles
- **Énergie** : Limite les actions quotidiennes (repos pour restaurer)

### 👹 Système de monstres
- **Recrutement** : Différentes raretés (common, rare, epic, legendary)
- **Évolution** : Gain d'XP et montée de niveau
- **Équipement** : Amélioration des statistiques
- **Puissance** : Calcul basé sur niveau + stats de base + équipement

### ⚔️ Système de missions et combat
- **Préparation tactique** : Sélection des monstres pour la mission
- **Combat réaliste** : Simulation tour par tour avec initiative
- **Journal de combat** : Narration immersive de chaque bataille
- **Récompenses variables** : Selon le type de victoire (écrasante, normale, difficile)

### 🏰 Système de progression
- **Niveau de donjon** : Débloque nouvelles fonctionnalités
- **Capacité** : Plus de monstres, plus d'énergie
- **Fonctionnalités** : Marché noir, laboratoire, arène, etc.

---

## 🔧 Améliorations récentes

### Interface utilisateur
- **Design ultra-compact** : Maximise l'espace de gameplay
- **Thème sombre cohérent** : Ambiance immersive
- **Responsive** : Adapté à tous les écrans

### Système de combat
- **Combat tactique** : Sélection d'équipe et préparation
- **Ennemis réalistes** : Vraies statistiques et capacités
- **Journal immersif** : Narration détaillée des combats
- **Calculs robustes** : Élimination des bugs NaN/undefined

### Gestion de l'énergie
- **Logique cohérente** : Consommation immédiate et mise à jour UI
- **Boutons dynamiques** : "Start Mission" ↔ "Rest" selon l'énergie
- **Prévention des abus** : Impossible de lancer plusieurs missions sans énergie

---

## 📝 Notes de développement

### Architecture
- **Modulaire** : Chaque système est une classe séparée
- **Données JSON** : Configuration externalisée
- **Event-driven** : Communication entre classes via callbacks

### Performance
- **Chargement asynchrone** : Données JSON chargées en parallèle
- **UI optimisée** : Mise à jour sélective des éléments
- **Mémoire** : Gestion propre des objets et événements

### Extensibilité
- **Nouveau contenu** : Facile d'ajouter monstres, missions, ennemis
- **Nouvelles mécaniques** : Architecture supportant l'ajout de systèmes
- **Localisation** : Support prévu pour plusieurs langues

---

## 🚀 Prochaines améliorations possibles

1. **Système de formation** : Arrangements tactiques des monstres
2. **Effets environnementaux** : Modificateurs selon le terrain
3. **Quêtes narratives** : Histoires plus développées
4. **Système de guildes** : Interactions sociales
5. **Animations** : Effets visuels pour le combat
6. **Sons** : Ambiances sonores immersives

---

*Documentation générée le 29 juin 2025*
*Version du projet : Combat System Overhaul*
