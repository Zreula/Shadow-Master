# 🤝 Guide de contribution - Shadow Master

Merci de ton intérêt pour contribuer à Shadow Master ! Ce guide t'aidera à comprendre comment participer au développement du projet.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Structure du projet](#structure-du-projet)
- [Standards de développement](#standards-de-développement)
- [Processus de développement](#processus-de-développement)
- [Types de contributions](#types-de-contributions)

## 🤝 Code de conduite

Ce projet respecte un code de conduite. En participant, tu acceptes de respecter ces règles :

- **Respectueux** : Traite tous les contributeurs avec respect
- **Inclusif** : Accueille les contributions de tous niveaux
- **Constructif** : Donne des feedback utiles et bienveillants
- **Professionnel** : Garde les discussions centrées sur le projet

## 🚀 Comment contribuer

### Première contribution

1. **Fork le projet** sur GitHub
2. **Clone ton fork** localement
3. **Crée une branche** pour ta fonctionnalité
4. **Développe et teste** tes changements
5. **Commit et push** tes modifications
6. **Ouvre une Pull Request**

```bash
# Clone ton fork
git clone https://github.com/TON-USERNAME/shadow-master.git
cd shadow-master

# Crée une branche pour ta fonctionnalité
git checkout -b feature/nouvelle-fonctionnalite

# Après tes modifications
git add .
git commit -m "feat: ajoute nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite
```

### Types de contributions recherchées

- 🐛 **Corrections de bugs**
- ✨ **Nouvelles fonctionnalités**
- 📚 **Amélioration de la documentation**
- 🎨 **Améliorations UI/UX**
- 🔧 **Optimisations de performance**
- 🧪 **Tests automatisés**
- 🌐 **Localisation/traduction**

## 📁 Structure du projet

```
shadow-master/
├── index.html              # Page principale
├── style.css               # Styles ultra-compacts
├── js/                     # Scripts modulaires
│   ├── main.js            # Point d'entrée
│   ├── game.js            # Logique principale
│   ├── combat.js          # Système de combat
│   ├── scenes.js          # Gestionnaire de scènes
│   ├── actions.js         # Actions du joueur
│   ├── ui.js              # Interface utilisateur
│   ├── dataManager.js     # Gestion des données
│   └── utils.js           # Utilitaires
├── data/                   # Configuration JSON
│   ├── *.json            # Fichiers de données
└── docs/                   # Documentation
```

### Responsabilités des fichiers

- **`game.js`** : État du jeu, sauvegarde, orchestration
- **`combat.js`** : Système de combat tactique
- **`scenes.js`** : Navigation et interface des scènes
- **`actions.js`** : Actions disponibles au joueur
- **`ui.js`** : Rendu de l'interface utilisateur
- **`data/*.json`** : Configuration externalisée

## 🛠️ Standards de développement

### Code JavaScript

```javascript
// ✅ Bon : Classes avec documentation
/**
 * Classe responsable de la gestion des monstres
 */
class MonsterManager {
    constructor(game) {
        this.game = game;
        this.monsters = [];
    }
    
    /**
     * Recrute un nouveau monstre
     * @param {string} type - Type de monstre à recruter
     * @returns {Object} Monstre créé
     */
    recruitMonster(type) {
        // Logique ici
    }
}

// ❌ Éviter : Code sans documentation
function doStuff(x, y) {
    return x + y * 2;
}
```

### Données JSON

```json
{
  "// Commentaire": "Structure standard pour les monstres",
  "monster_id": {
    "name": "Nom du monstre",
    "emoji": "🐉",
    "cost": 100,
    "rarity": "common|rare|epic|legendary",
    "baseStats": {
      "attack": 10,
      "defense": 8,
      "hp": 50,
      "speed": 6
    }
  }
}
```

### CSS

```css
/* ✅ Bon : Structure modulaire avec commentaires */
/* =============================================================================
   SECTION - DESCRIPTION
   ============================================================================= */
.component-name {
    /* Propriétés ordonnées logiquement */
    display: flex;
    flex-direction: column;
    
    /* Dimensions */
    width: 100%;
    height: auto;
    
    /* Couleurs */
    background-color: #2a2a2a;
    color: #e0e0e0;
    
    /* Espacement */
    padding: 10px;
    margin: 5px 0;
}
```

## 🔄 Processus de développement

### Avant de commencer

1. **Vérifie les issues** existantes
2. **Discute de ta fonctionnalité** en ouvrant une issue
3. **Assure-toi** qu'elle s'aligne avec la vision du projet

### Pendant le développement

1. **Code de qualité** : Suis les standards établis
2. **Tests** : Teste tes changements sur plusieurs navigateurs
3. **Documentation** : Ajoute/met à jour la documentation si nécessaire
4. **Commits atomiques** : Un commit = une modification logique

### Format des commits

```
type(scope): description courte

Description détaillée si nécessaire

Fixes #123
```

**Types de commits :**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Changements de style/formatage
- `refactor`: Refactoring sans changement fonctionnel
- `test`: Ajout/modification de tests
- `chore`: Tâches de maintenance

**Exemples :**
```
feat(combat): ajoute système de formations tactiques
fix(ui): corrige affichage des monstres sur mobile
docs(readme): met à jour les instructions d'installation
```

## 🎯 Types de contributions

### 🐛 Corrections de bugs

1. **Reproduis le bug** et documente les étapes
2. **Cherche la cause** dans le code
3. **Teste la correction** dans plusieurs scénarios
4. **Ajoute des tests** pour éviter la régression

### ✨ Nouvelles fonctionnalités

1. **Discute l'idée** via une issue
2. **Conçois l'architecture** si c'est complexe
3. **Implémente par petites étapes**
4. **Documente** la nouvelle fonctionnalité

### 📚 Documentation

1. **Identifie** ce qui manque ou est obsolète
2. **Écris clairement** en pensant aux nouveaux utilisateurs
3. **Inclus des exemples** pratiques
4. **Relis** pour la cohérence

### 🎨 Améliorations UI/UX

1. **Respecte le thème** sombre et compact
2. **Maintiens la cohérence** visuelle
3. **Teste la responsivité** mobile
4. **Considère l'accessibilité**

## 🧪 Tests

Avant de soumettre :

1. **Teste sur plusieurs navigateurs** (Chrome, Firefox, Safari)
2. **Vérifie la responsivité** mobile
3. **Teste les cas limites** (données manquantes, etc.)
4. **Vérifie la console** pour les erreurs JavaScript

## 📝 Pull Requests

### Checklist avant soumission

- [ ] Le code suit les standards du projet
- [ ] Les tests passent (si applicable)
- [ ] La documentation est à jour
- [ ] Pas de console.log oubliés
- [ ] Le code est formaté correctement
- [ ] La PR a un titre descriptif
- [ ] La description explique le changement

### Template de PR

```markdown
## 🎯 Objectif
Brève description du changement

## 🔄 Changements
- Liste des modifications
- Nouveau comportement

## 🧪 Tests
Comment tester le changement

## 📸 Screenshots
Si applicable, captures d'écran

## 📋 Checklist
- [ ] Code testé
- [ ] Documentation mise à jour
- [ ] Pas de breaking changes
```

## 💡 Idées de contributions

### Fonctionnalités recherchées

- **Système de formations** : Arrangements tactiques des monstres
- **Effets environnementaux** : Modificateurs selon le terrain
- **Mode automatique** : IA pour les décisions répétitives
- **Statistiques avancées** : Graphiques de progression
- **Système de quêtes** : Objectifs à long terme
- **Sauvegarde cloud** : Synchronisation entre appareils

### Améliorations techniques

- **Tests automatisés** : Framework de test JavaScript
- **Build system** : Optimisation et bundling
- **PWA** : Installation comme app native
- **Performance** : Profiling et optimisations
- **Accessibilité** : Support screen readers

## 🚀 Après ta contribution

1. **Surveille ta PR** pour les commentaires
2. **Réponds rapidement** aux demandes de changement
3. **Participe aux discussions** sur ton code
4. **Aide à review** d'autres PRs

## 🤔 Questions ?

- **Issues** : Pour les questions techniques
- **Discussions** : Pour les idées et suggestions
- **Email** : Pour les questions privées

---

**Merci de contribuer à Shadow Master ! Ensemble, nous créons un jeu fantastique ! 🌙⚔️**
