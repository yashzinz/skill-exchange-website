  document.addEventListener("DOMContentLoaded", () => {
    // Get the quest ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const questId = urlParams.get('questId'); // Assuming the URL is like: tutorial.html?questId=123

    if (questId) {
      fetchQuestDetails(questId); // Fetch quest details with the quest ID

      const addPointsButton = document.getElementById("addpoints");
      addPointsButton.addEventListener("click", claimPoints);

    } else {
      console.error("Quest ID not found in the URL.");
    }

  });

async function fetchQuestDetails(questId) {
  const questDescription = document.getElementById("quest-description"); // Element to display the quest description
  const authorName = document.getElementById("author-name");
  const videoList = document.getElementById("video-list"); // Element to display the videos

  try {
    const response = await fetch(`/api/public-quests/${questId}`); // Fetch the specific public quest by ID
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const quest = await response.json(); // Parse the JSON response

    // Update the HTML with quest details
    questDescription.innerHTML = `<strong>Description:</strong> ${quest.description}`;
    authorName.innerHTML = `<h1>${quest.author.toUpperCase()}</h1>`;

    // Display the videos
    videoList.innerHTML = ""; // Clear previous videos

    if (quest.videos && quest.videos.length > 0) {
      quest.videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card'; // Add a class for styling
        videoCard.innerHTML = `
          <video width="320" height="240" controls>
            <source src="/${video}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
        videoList.appendChild(videoCard);
      });
    } else {
      videoList.innerHTML = "<p>No videos available for this quest.</p>";
    }
  } catch (error) {
    console.error("Error fetching quest details:", error);
    questDescription.innerHTML = "Error loading quest details.";
  }
}

async function claimPoints() {
    const pointsToAdd = 10; // Define how many points to add
    const responseMessage = document.getElementById("responseMessage");
    const claimButton = document.getElementById("addpoints");

    try {
        const response = await fetch('/api/add-points', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ points: pointsToAdd })
        });

        if (!response.ok) {
            throw new Error('Failed to claim points');
        }
        
        alertalert("Points Claimed!"); // Notify the user

        // Disable the claim button after successful claim
        if (claimButton) {
            claimButton.disabled = true;
            claimButton.hidden = true;
        }
        
    } catch (error) {
        console.error("Error claiming points:", error);
        responseMessage.textContent = "Error claiming points.";
    }
}

