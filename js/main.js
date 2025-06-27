// Point d'entrée principal du jeu
let game;

// Initialisation du jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initialisation du jeu Maître des Ombres...');
    
    // Initialiser la traduction et mettre à jour l'interface
    if (window.translation) {
        window.translation.updateUI();
        updateLanguageButton(window.translation.getCurrentLanguage());
    }
    
    // Création de l'instance de jeu
    game = new Game();
    
    // Rendre l'objet game accessible globalement
    window.game = game;
    
    // Initialisation asynchrone
    const success = await game.init();
    
    if (success) {
        console.log('Jeu initialisé avec succès');
        
        // Attacher les gestionnaires d'événements aux boutons de contrôle
        attachGameControlButtons();
        
        // Vérifier s'il y a une sauvegarde existante
        const hasSave = localStorage.getItem('shadowMasterSave') !== null;
        if (hasSave) {
            console.log('Sauvegarde détectée');
        }
    } else {
        console.error('Échec de l\'initialisation du jeu');
    }
});

// Fonction pour attacher les gestionnaires d'événements aux boutons de contrôle
function attachGameControlButtons() {
    const saveBtn = document.getElementById('saveGame');
    const loadBtn = document.getElementById('loadGame');
    const newGameBtn = document.getElementById('newGame');
    const deleteBtn = document.getElementById('deleteGame');
    const langBtn = document.getElementById('langBtn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (window.game) {
                window.game.saveGame();
            }
        });
    }
    
    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            if (window.game) {
                window.game.loadGame();
            }
        });
    }
    
    if (newGameBtn) {
        newGameBtn.addEventListener('click', () => {
            if (window.game) {
                const message = window.translation ? window.translation.t('confirmNewGame') : 'Êtes-vous sûr de vouloir commencer un nouveau jeu ? Toute progression non sauvegardée sera perdue.';
                const confirmNew = confirm(message);
                if (confirmNew) {
                    window.game.newGame();
                }
            }
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const confirmMessage = window.translation ? window.translation.t('confirmDelete') : 'Êtes-vous sûr de vouloir supprimer définitivement votre sauvegarde ?';
            const confirmDelete = confirm(confirmMessage);
            if (confirmDelete) {
                localStorage.removeItem('shadowMasterSave');
                const deletedMessage = window.translation ? window.translation.t('saveDeleted') : 'Sauvegarde supprimée !';
                alert(deletedMessage);
                if (window.game) {
                    window.game.newGame();
                }
            }
        });
    }
    
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            if (window.translation) {
                const currentLang = window.translation.getCurrentLanguage();
                const newLang = currentLang === 'fr' ? 'en' : 'fr';
                window.translation.setLanguage(newLang);
                
                // Mettre à jour l'apparence du bouton
                updateLanguageButton(newLang);
            }
        });
    }
    
    console.log('Gestionnaires d\'événements attachés aux boutons de contrôle');
}

// Fonction pour mettre à jour l'apparence du bouton de langue
function updateLanguageButton(lang) {
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        const flag = langBtn.querySelector('.flag');
        const text = langBtn.querySelector('.lang-text');
        
        if (lang === 'fr') {
            flag.textContent = '🇫🇷';
            text.textContent = 'FR';
            langBtn.title = 'Changer la langue / Change language';
        } else {
            flag.textContent = '🇺🇸';
            text.textContent = 'EN';
            langBtn.title = 'Change language / Changer la langue';
        }
    }
}

// Fonctions globales pour l'interface (appelées depuis le HTML)
window.startNewGame = () => {
    if (game) {
        game.newGame();
    }
};

window.loadSavedGame = () => {
    if (game) {
        game.loadGame();
    }
};

window.saveCurrentGame = () => {
    if (game) {
        game.saveGame();
    }
};

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('Erreur JavaScript:', event.error);
    if (game && game.ui) {
        game.ui.addMessage('Une erreur est survenue. Consultez la console pour plus de détails.');
    }
});

// Fonction de debug globale
window.debugGame = () => {
    console.log('=== DEBUG GAME ===');
    console.log('window.game:', window.game);
    console.log('game.actions:', window.game ? window.game.actions : 'N/A');
    console.log('startMission:', window.game && window.game.actions ? window.game.actions.startMission : 'N/A');
    
    const missionButtons = document.querySelectorAll('.mission-btn');
    console.log('Boutons mission trouvés:', missionButtons.length);
    missionButtons.forEach((btn, i) => {
        console.log(`Bouton ${i}:`, btn.onclick);
        console.log(`Bouton ${i} disabled:`, btn.disabled);
        console.log(`Bouton ${i} style.pointerEvents:`, btn.style.pointerEvents);
        console.log(`Bouton ${i} CSS pointer-events:`, window.getComputedStyle(btn).pointerEvents);
        console.log(`Bouton ${i} zIndex:`, window.getComputedStyle(btn).zIndex);
        console.log(`Bouton ${i} position:`, window.getComputedStyle(btn).position);
        
        // Test de détection des éléments au-dessus
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const elementAtCenter = document.elementFromPoint(centerX, centerY);
        console.log(`Élément au centre du bouton ${i}:`, elementAtCenter);
        console.log(`C'est le bouton lui-même:`, elementAtCenter === btn);
    });
};

// Test direct d'un bouton
window.testMissionButton = () => {
    const btn = document.querySelector('.mission-btn');
    if (btn) {
        console.log('Test direct du premier bouton mission');
        try {
            btn.click();
        } catch (e) {
            console.error('Erreur lors du clic:', e);
        }
    } else {
        console.log('Aucun bouton mission trouvé');
    }
};

// Test direct d'appel de startMission
window.testStartMission = () => {
    console.log('Test direct de startMission');
    if (window.game && window.game.actions) {
        window.game.actions.startMission('village');
    } else {
        console.error('Game ou actions non disponible');
    }
};

// Ajouter des listeners de debug aux boutons de mission
window.addDebugListeners = () => {
    const missionButtons = document.querySelectorAll('.mission-btn');
    missionButtons.forEach((btn, i) => {
        // Supprimer les anciens listeners
        btn.removeEventListener('mousedown', debugMouseDown);
        btn.removeEventListener('mouseup', debugMouseUp);
        btn.removeEventListener('click', debugClick);
        
        // Ajouter de nouveaux listeners
        btn.addEventListener('mousedown', debugMouseDown);
        btn.addEventListener('mouseup', debugMouseUp);
        btn.addEventListener('click', debugClick);
        
        console.log(`Listeners de debug ajoutés au bouton ${i}`);
    });
};

function debugMouseDown(e) {
    console.log('MouseDown détecté sur:', e.target);
}

function debugMouseUp(e) {
    console.log('MouseUp détecté sur:', e.target);
}

function debugClick(e) {
    console.log('Click événement détecté sur:', e.target);
    console.log('Onclick function:', e.target.onclick);
};

// Test des boutons de contrôle
window.testControlButtons = () => {
    console.log('=== TEST BOUTONS DE CONTRÔLE ===');
    const buttons = ['saveGame', 'loadGame', 'newGame', 'deleteGame'];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        console.log(`Bouton ${id}:`, btn ? 'trouvé' : 'non trouvé');
        if (btn) {
            console.log(`  - disabled:`, btn.disabled);
            console.log(`  - onclick:`, btn.onclick);
            console.log(`  - événements:`, btn._events || 'aucun');
        }
    });
};

// Export de la variable game pour l'accès global
window.game = game;
