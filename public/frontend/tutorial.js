document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
});
async function fetchUsers() {
  const response = await fetch('/api/users');
  const users = await response.json();
  const questDescription = document.getElementById("quest-description");
  const videoList = document.getElementById("video-list");
  const currentQuest = JSON.parse(localStorage.getItem("currentQuest"));

  videoList.innerHTML = ''; // Clear existing rows

  users.forEach(user => {
    questDescription.innerHTML = `<strong>Description:</strong> ${currentQuest.description}`;
      const videoCard = document.createElement('div');

      const videoElements = user.videos.map(video => `
      <video width="320" height="240" controls>
          <source src="/${video}" type="video/mp4">
          Your browser does not support the video tag.
      </video>
      `).join('');
  
      videoCard.innerHTML = `
          <div>${videoElements}</div>
      `;
      videoList.appendChild(videoCard);
  });
}