// Identifiants API Twitch
const clientId = 'VOTRE_CLIENT_ID';  // Remplace par ton Client ID
const accessToken = 'VOTRE_ACCESS_TOKEN';  // Remplace par ton Access Token
const broadcasterId = 'VOTRE_BROADCASTER_ID';  // Remplace par ton Broadcaster ID

// Paliers de subgoals
const subGoals = [50, 75, 100];
let currentSub = 0;  // Abonnés actuels
let currentGoalIndex = 0;  // Index du palier actuel

// Fonction pour mettre à jour l'interface de la barre de progression
function updateSubGoal() {
    const currentGoal = subGoals[currentGoalIndex];  // Objectif actuel
    const progressPercentage = (currentSub / currentGoal) * 100;

    // Met à jour la barre et le texte
    document.querySelector('.progress').style.width = progressPercentage + '%';
    document.querySelector('.current-sub').textContent = currentSub;
    document.querySelector('.goal').textContent = currentGoal;
}

// Fonction pour ajouter des abonnés
function addSub(count) {
    currentSub += count;

    const currentGoal = subGoals[currentGoalIndex];

    // Si l'objectif du palier est atteint, passe au suivant
    if (currentSub >= currentGoal) {
        currentSub = currentGoal;

        if (currentGoalIndex < subGoals.length - 1) {
            currentGoalIndex++;  // Passe au palier suivant
        }
    }

    updateSubGoal();  // Met à jour l'interface
}

// Fonction pour récupérer le nombre d'abonnés via l'API Twitch
async function fetchSubscribers() {
    const response = await fetch(`https://api.twitch.tv/helix/subscriptions?broadcaster_id=${broadcasterId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-Id': clientId
        }
    });

    const data = await response.json();
    const totalSubs = data.total;  // Récupère le nombre total d'abonnés

    addSub(totalSubs - currentSub);  // Met à jour la barre de progression
}

// Actualise les abonnés toutes les 60 secondes
setInterval(fetchSubscribers, 60000);

// Appelle la fonction de récupération des abonnés à l'initialisation
fetchSubscribers();
