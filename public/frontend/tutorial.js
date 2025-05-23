  document.addEventListener("DOMContentLoaded", () => {
    // Get the quest ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const questId = urlParams.get('questId'); // Assuming the URL is like: tutorial.html?questId=123

    if (questId) {
      fetchQuestDetails(questId); // Fetch quest details with the quest ID
      displayUser();

      const addPointsButton = document.getElementById("addpoints");

      // Check localStorage to see if the button should be hidden
      if (localStorage.getItem(`quest_${questId}_claimed`)) {
          addPointsButton.hidden = true; // Hide the button if points have already been claimed
      }
      addPointsButton.addEventListener("click", claimPoints);

    } else {
      console.error("Quest ID not found in the URL.");
    }

  });

// function to get the quest cards
async function fetchQuestDetails(questId) {
  const questDescription = document.getElementById("quest-description");
  const authorName = document.getElementById("author-name");
  const videoList = document.getElementById("video-list");

  try {
    const response = await fetch(`/api/public-quests/${questId}`); // Fetch the specific public quest by ID from the db
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const quest = await response.json();

    // update the HTML with quest details
    questDescription.innerHTML = `<strong>Description:</strong> ${quest.description}`;
    authorName.innerHTML = `<h1>${quest.author.toUpperCase()}</h1>`;

    // display the videos
    videoList.innerHTML = ""; // clear previous videos
    
    if (quest.videos && quest.videos.length > 0) {
      quest.videos.forEach((video, index) => {
          const videoCard = document.createElement('div');
          videoCard.className = 'video-card';

          const unlockedVideos = JSON.parse(localStorage.getItem(`quest_${questId}_unlocked_videos`)) || [];
          if (index < 3 || unlockedVideos.includes(index)) {
              // display the first three videos for free
              videoCard.innerHTML = `
                  <video width="420" height="340" controls>
                      <source src="/${video}" type="video/mp4">
                      Your browser does not support the video tag.
                  </video>
              `;
          } else {
              // if the videos are more than three, the rest of the videos will be locked
              videoCard.innerHTML = `
                  <p>This video is locked. Unlock it with points.</p>
                  <button class="unlock-button" data-video="${video}" data-index="${index}">Unlock Video</button>
              `;
          }
          videoList.appendChild(videoCard);
      });

      // call the function to unlock the video
      const unlockButtons = document.querySelectorAll('.unlock-button');
        unlockButtons.forEach(button => {
            button.addEventListener('click', unlockVideo);
      });

    } else {
      videoList.innerHTML = "<p>No videos available for this quest.</p>";
    }
  } catch (error) {
    console.error("Error fetching quest details:", error);
    questDescription.innerHTML = "Error loading quest details.";
  }
}

// function to unlock the video
async function unlockVideo(event) {
    const video = event.target.getAttribute('data-video');
    const index = parseInt(event.target.getAttribute('data-index'), 10); // convert index to an integer
    const pointsRequired = 3; // define how many points are required to unlock

    // check if the user has enough points
    const userPoints = await getCurrentPoints(); 

    if (userPoints >= pointsRequired) {

        // call function to deduct the points
        await deductPoints(pointsRequired);

        // unlock the video
        const videoCard = event.target.parentElement;
        videoCard.innerHTML = `
            <video width="420" height="340" controls>
                <source src="/${video}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;

        alert("Video Unlocked!");

        // store the unlocked video in local storage
        const questId = new URLSearchParams(window.location.search).get('questId');
        const unlockedVideos = JSON.parse(localStorage.getItem(`quest_${questId}_unlocked_videos`)) || [];
        unlockedVideos.push(index);
        localStorage.setItem(`quest_${questId}_unlocked_videos`, JSON.stringify(unlockedVideos));

    } else {
        alert("Not enough points to unlock this video.");
    }
}

// get user's current points
async function getCurrentPoints() {
    try {
        const response = await fetch('/api/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch current points');
        }
        const data = await response.json();
        return data.points;
    } catch (error) {
        console.error("Error fetching current points:", error);
    }
}

// function to minus the points from the database
async function deductPoints(points) {
    const responseMessage = document.getElementById("responseMessage");
    try {
        const response = await fetch('/api/sub-points', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ points: points })
        });
        if (!response.ok) {
            throw new Error('Failed to deduct points');
        }
        alert("Points Deducted!");
    } catch (error) {
        console.error("Error deducting points:", error);
        responseMessage.textContent = "Error deducting points.";
    }
}

// function to claim the points of the quest
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
        
        alert("Points Claimed!");

        // disable the claim button after successful claim
        if (claimButton) {
            claimButton.disabled = true;
            claimButton.hidden = true;
        }

        // Store in localStorage that points have been claimed for this quest
        const questId = new URLSearchParams(window.location.search).get('questId');
        localStorage.setItem(`quest_${questId}_claimed`, true);
        
    } catch (error) {
        console.error("Error claiming points:", error);
        responseMessage.textContent = "Error claiming points.";
    }
}

// function to display the user's socials
async function displayUser() {
  const socialDisplay = document.getElementById("social-display");

  try{

    const response = await fetch('/api/user');

    if(!response.ok){
      throw new Error("Network response was not ok");
    }

    const userDisp = await response.json();
    socialDisplay.innerHTML = `${userDisp.certification}`;

  } catch (error) {
        console.error("Error claiming points:", error);
        responseMessage.textContent = "Error claiming points.";
    }
};

