document.addEventListener("DOMContentLoaded", () => {
  // Load the current quest from localStorage
  const currentQuest = JSON.parse(localStorage.getItem("currentQuest"));
  const currentVideo = JSON.parse(localStorage.getItem("videoList"));

  if (currentQuest) {
    // Display the quest description
    const questDescriptionElement = document.getElementById("quest-description");
    questDescriptionElement.innerHTML = `<strong>Description:</strong> ${currentQuest.description}`;

    // Display the uploaded videos
    const videoListElement = document.getElementById("video-list");
    videoListElement.innerHTML = ""; // Clear existing videos

    if (currentVideo && currentVideo.length > 0) {

      // Create a main video player for the first video
      const mainVideoContainer = document.createElement("div");
      mainVideoContainer.classList.add("main-video-container");
      const mainVideo = document.createElement("video");
      mainVideo.controls = true;
      mainVideo.width = 640; // Set width for the main video
      mainVideo.src = currentVideo[0]; // Set the first video as the main video
      mainVideoContainer.appendChild(mainVideo);
      videoListElement.appendChild(mainVideoContainer);

      // Create a container for the thumbnails
      const thumbnailsContainer = document.createElement("div");
      thumbnailsContainer.classList.add("thumbnails-container");

      // Loop through the videos and create thumbnail elements
      currentVideo.forEach((videoUrl) => {
        const thumbnailItem = document.createElement("div");
        thumbnailItem.classList.add("thumbnail-item");
        thumbnailItem.innerHTML = `
          <video width="160" class="thumbnail-video">
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;

        // Add click event to change the main video when thumbnail is clicked
        thumbnailItem.addEventListener("click", () => {
          mainVideo.src = videoUrl; // Change the main video source
          mainVideo.play(); // Play the new video
        });

        thumbnailsContainer.appendChild(thumbnailItem);
      });

      // Append the thumbnails container to the video list
      videoListElement.appendChild(thumbnailsContainer);
    } else {
      videoListElement.innerHTML = "<p>No videos uploaded for this quest.</p>";
    }
  } else {
    const questDescriptionElement = document.getElementById("quest-description");
    questDescriptionElement.innerHTML = "<strong>Description:</strong> No quest selected.";
  }
});

document.getElementById("start-quest").addEventListener