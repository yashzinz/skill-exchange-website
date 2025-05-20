document.addEventListener("DOMContentLoaded", () => {
    // Get the quest ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const questId = urlParams.get('questId'); // Assuming the URL is like: tutorial.html?questId=123

    if (questId) {
        fetchQuestDetails(questId); // Fetch quest details with the quest ID
    } else {
        console.error("Quest ID not found in the URL.");
    }
});

async function fetchQuestDetails(questId) {
    const questDescription = document.getElementById("quest-description"); // Element to display the quest description
    const authorName = document.getElementById("author-name")
    const videoList = document.getElementById("video-list"); // Element to display the videos

    try {
        const response = await fetch(`/api/quests/${questId}`); // Fetch the specific quest by ID
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const quest = await response.json(); // Parse the JSON response

        // Update the HTML with quest details
        questDescription.innerHTML = `<strong>Description:</strong> ${quest.description}`;

        authorName.innerHTML = `<h1>${quest.author}</h1>`;

        // Display the videos
        videoList.innerHTML = ""; // Clear previous videos

        if (quest.videos && quest.videos.length > 0) {
            quest.videos.forEach(video => {
            const videoCard = document.createElement('div');  
            videoCard.innerHTML = `
                <video width="320" height="240" controls>
                    <source src="/${video}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>`;
            videoList.appendChild(videoCard);
            });
        } else {
            videoList.innerHTML = "<p>No videos available for this quest.</p>"; // Handle case with no videos
        }
    } catch (error) {
        console.error("Error fetching quest details:", error);
        questDescription.innerHTML = "Error loading quest details.";
    }
}