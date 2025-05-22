document.addEventListener("DOMContentLoaded", () => {
    const questsDisplay = document.getElementById("quests-display");
    const nameDisplay = document.getElementById("name-display");
    const pointsDisplay = document.getElementById("userpoints");

    const loadProfile = async () => {
        try {
            const response = await fetch("/api/user");
            
            if (!response.ok) { 
                throw new Error("Network response was not ok");
            }
            const user = await response.json();
            nameDisplay.textContent = `WELCOME ${user.name.toUpperCase()}`;
            pointsDisplay.innerHTML = `<div class="value coral-text" id="userpoints">${user.points}</div>`; // Display user's points
            
        } catch (error) {
            console.error("Error loading profile:", error);
            // Optionally, display an error message to the user
            pointsDisplay.innerHTML = "Error loading points.";
        }
    };
    loadProfile();
    
    const loadQuests = async () => {
        try {
            const response = await fetch('/api/public-quests');
            if (!response.ok) {
            throw new Error('Failed to load quests');
            }
            const quests = await response.json();
            // Clear previous quests
            questsDisplay.innerHTML = '';

            // Loop through each quest and create a card
            quests.forEach((quest) => {
                const questCard = document.createElement('a');
                questCard.classList.add('skill-card-link');
                questCard.href = `tutorial.html?questId=${quest._id}`; // Set the link for the quest

                questCard.innerHTML = `
                    <div class="skill-card">
                    <div class="skill-image" style="background-image: url('images/dance.jpg')">
                        <div class="skill-badge">50+ learners</div>
                    </div>
                    <div class="skill-content">
                        <h3 class="quest-card-title">${quest.title}</h3>
                        <div class="skill-users">
                        <div class="user">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="${quest.author}">
                            <span class="author-name">${quest.author}</span>
                        </div>
                        </div>
                    </div>
                    </div>
                `;

                // Append the quest card to the display container
                questsDisplay.appendChild(questCard);
            });
        } catch (error) {
            console.error('Error loading quests:', error);
        }
    };
    loadQuests();
});