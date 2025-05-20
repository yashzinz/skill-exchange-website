document.addEventListener("DOMContentLoaded", () => {
  // Initialize all features
  setupMenu();
  setupProfile();
  setupSkills();
  setupBio();
});

// Menu Section
function setupMenu() {
  const hamburger = document.getElementById("hamburger");
  const sideMenu = document.getElementById("sideMenu");
  const closeButton = document.getElementById("closeButton");

  sideMenu.classList.add("open"); // Open the menu by default
  hamburger.classList.add("hidden"); // Hide the hamburger icon

  hamburger.addEventListener("click", () => {
    sideMenu.classList.add("open");
    hamburger.classList.add("hidden"); // Hide the hamburger icon
  });

  closeButton.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    hamburger.classList.remove("hidden"); // Show the hamburger icon
  });
}

// set up profile
function setupProfile() {
  const editProfileButton = document.getElementById("edit-profile-button");
  const saveProfileButton = document.getElementById("save-profile");
  const profileForm = document.getElementById("profile-form");
  const profileInfo = document.querySelector(".profile-info");

  const fieldDisplay = document.getElementById("field-display");
  const certDisplay = document.getElementById("cert-display");
  const expDisplay = document.getElementById("exp-display");

  const nameDisplay = document.getElementById("name-display");

  const fieldInput = document.getElementById("field-input");
  const certInput = document.getElementById("cert-input");
  const expInput = document.getElementById("exp-input");

  // Load from localStorage
  const loadProfile = () => {
    fetch("/api/user")
      .then((response) => {
        if (!response.ok) { 
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((user) => {
        nameDisplay.textContent = `Welcome ${user.name}`;

        fieldDisplay.textContent = `Field of Study: ${
          user.fieldOfStudy || "Not provided"
        }`;
        certDisplay.textContent = `Certification: ${
          user.certification || "Not provided"
        }`;
        expDisplay.textContent = `Experience: ${
          user.experience || "Not provided"
        }`;

        fieldInput.value = user.fieldOfStudy || "";
        certInput.value = user.certification || "";
        expInput.value = user.experience || "";
      })
      .catch((error) => console.error("Error loading profile:", error));
  };

  // Save profile to MongoDB
  const saveProfile = () => {
    const profile = {
      fieldOfStudy: fieldInput.value,
      certification: certInput.value,
      experience: expInput.value,
    };
    fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    })
      .then((response) => {
        if (response.ok) {
          loadProfile(); // Reload profile data after saving
          profileForm.classList.add("hidden");
          profileInfo.classList.remove("hidden");
        } else {
          console.error("Failed to save profile");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  //event listeners
  editProfileButton.addEventListener("click", () => {
    profileForm.classList.remove("hidden");
    profileInfo.classList.add("hidden");
  });
  saveProfileButton.addEventListener("click", () => {
    saveProfile();
    profileForm.classList.add("hidden");
    profileInfo.classList.remove("hidden");
  });

  loadProfile();
}

// set up skills
function setupSkills() {
  const skillsList = document.getElementById("skills-list");
  const addSkillButton = document.getElementById("add-skill-button");
  const addSkillForm = document.getElementById("add-skill-form");
  const newSkillInput = document.getElementById("new-skill");
  const submitSkillButton = document.getElementById("submit-skill-button");
  const cancelSkillButton = document.getElementById("cancel-skill-button");

  // Load skills from the database
  const loadSkills = async () => {
    try {
      const response = await fetch("/api/skills"); // Adjust the endpoint as necessary
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const skills = data.skills || []; // Assuming the response contains a 'skills' array

      skillsList.innerHTML = ""; // Clear existing skills
      if (skills.length === 0) {
        skillsList.innerHTML = "No skills added yet";
      } else {
        skillsList.innerHTML = "";
        skills.forEach((skill) => {
          const skillTag = document.createElement("span");
          skillTag.textContent = skill;
          skillTag.classList.add("skill-tag");

          // Add functionality to remove the skill tag on click
          skillTag.addEventListener("click", () => {
            skillTag.remove();
            deleteUserSkill(skill);
          });

          skillsList.appendChild(skillTag);
        });
      }
    } catch (error) {
      console.error("Error loading skills:", error);
    }
  };

  // Show the input form when "Add Skill" is pressed
  addSkillButton.addEventListener("click", () => {
    addSkillForm.classList.remove("hide");
    addSkillButton.classList.add("hide"); // Hide the "Add Skill" button
  });

  // Add the skill when the "Submit" button is pressed
  submitSkillButton.addEventListener("click", async () => {
    const skillValue = newSkillInput.value.trim();
    if (skillValue === "") {
      alert("Please enter a skill.");
      return;
    }

    // Create a new skill tag
    const skillTag = document.createElement("span");
    skillTag.textContent = skillValue;
    skillTag.classList.add("skill-tag");

    skillTag.addEventListener("click", () => {
      skillTag.remove();
      deleteUserSkill(skillValue);
    });

    skillsList.appendChild(skillTag);
    newSkillInput.value = ""; // Clear the input
    addSkillForm.classList.add("hide"); // Hide the form
    addSkillButton.classList.remove("hide"); // Show "Add Skill" button

    // Save skill to the database
    try {
      const response = await fetch("/add-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills: [skillValue] }), // Send the new skill as an array
      });

      if (!response.ok) {
        throw new Error("Failed to save skill");
      }
    } catch (error) {
      console.error("Error saving skill:", error);
    }

    newSkillInput.value = ""; // Clear the input
    addSkillForm.classList.add("hide"); // Hide the form
    addSkillButton.classList.remove("hide"); // Show "Add Skill" button
  });

  cancelSkillButton.addEventListener("click", () => {
    newSkillInput.value = ""; // Clear the input
    addSkillForm.classList.add("hide"); // Hide the form
    addSkillButton.classList.remove("hide"); // Show "Add Skill" button
  });

  // delete the skills
  async function deleteUserSkill(skill) {
    try {
      const response = await fetch("/api/skills", {
        method: "DELETE", // Use DELETE method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skill }), // Send skill in request body
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(
          "Error deleting skill: " + (errorData.message || "Unknown error")
        );
      }
    } catch (error) {
      alert("Error deleting skill: " + error.message);
    }
  }
  // Load skills on page load
  loadSkills();
}

// Bio Section
function setupBio() {
  const bioDisplay = document.getElementById("bio-display");
  const editBioButton = document.getElementById("edit-bio-button");
  const bioForm = document.getElementById("bio-form");
  const bioInput = document.getElementById("bio-input");
  const saveBioButton = document.getElementById("save-bio-button");
  const cancelBioButton = document.getElementById("cancel-bio-button");

  const loadBio = () => {
    const bio = localStorage.getItem("bio") || "No bio added yet.";
    bioDisplay.textContent = bio;
    bioInput.value = bio !== "No bio added yet." ? bio : "";
  };

  const saveBio = () => {
    const bio = bioInput.value.trim();
    if (bio === "") {
      alert("Bio cannot be empty.");
      return;
    }
    localStorage.setItem("bio", bio);
    loadBio();
  };

  editBioButton.addEventListener("click", () => {
    bioForm.classList.remove("hide");
    editBioButton.classList.add("hide");
  });

  saveBioButton.addEventListener("click", () => {
    saveBio();
    bioForm.classList.add("hide");
    editBioButton.classList.remove("hide");
  });

  cancelBioButton.addEventListener("click", () => {
    bioForm.classList.add("hide");
    editBioButton.classList.remove("hide");
  });

  loadBio();
}

document.addEventListener("DOMContentLoaded", () => {
  const questsDisplay = document.getElementById("quests-display");
  const noQuestsMessage = document.getElementById("no-quests-message");
  const completedQuestsBtn = document.getElementById("completed-quests-btn");
  const inProgressQuestsBtn = document.getElementById("in-progress-quests-btn");
  const createdQuestsBtn = document.getElementById("created-quests-btn");
  const modal = document.getElementById("quest-modal");
  const addQuestBtn = document.getElementById("add-quest-btn");
  const questModal = document.getElementById("quest-modal");
  const closeModal = document.getElementById("close-modal");
  const submitQuestBtn = document.getElementById("submit-quest");
  const cancelQuestBtn = document.getElementById("cancel-quest");
  const videoUploadInput = document.getElementById("video-upload");

  // Load quests from the database
const loadQuests = async () => {
  try {
      const response = await fetch("/api/quests");
      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      const quests = await response.json();
      questsDisplay.innerHTML = ""; // Clear current quests
      if (quests.length === 0) {
          noQuestsMessage.style.display = "block"; // Show "No quests" message
      } else {
          noQuestsMessage.style.display = "none"; // Hide "No quests" message
          quests.forEach((quest) => {
              const questCard = document.createElement("div");
              questCard.classList.add("quest-card");
              questCard.innerHTML = `
                  <img src="${quest.image}" alt="${quest.title}">
                  <div class="quest-card-content">
                      <h3 class="quest-card-title">${quest.title}</h3>
                      <p class="quest-card-author">${quest.author}</p>
                      <p class="quest-card-description">${quest.description}</p>
                  </div>
                  <button onclick="window.location.href='test.html'">${quest.buttonText}</button>
              `;
              questsDisplay.appendChild(questCard);
          });
      }
  } catch (error) {
      console.error("Error loading quests:", error);
  }
};

  // Open modal
  addQuestBtn.addEventListener("click", () => {
    questModal.style.display = "block";
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    questModal.style.display = "none";
  });

  cancelQuestBtn.addEventListener("click", () => {
    questModal.style.display = "none";
  });

  // Submit quest
  submitQuestBtn.addEventListener("click", async () => {
    const title = document.getElementById("quest-title").value.trim();
    const author = document.getElementById("quest-author").value.trim();
    const description = document.getElementById("quest-description").value.trim();
    const image = document.getElementById("quest-image").value.trim();
    const videoFiles = videoUploadInput.files; // Get video files

    // Validate the input fields
    if (!title || !author || !description) {
        alert("Please fill out all required fields.");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("image", image);
    // Append each video file to the FormData
    Array.from(videoFiles).forEach(file => {
        formData.append("videos", file);
    });

    try{
      const response = await fetch("/api/quests", {
            method: "POST",
            body: formData,
        });

      if (!response.ok) {
            throw new Error("Failed to save quest");
        }

        document.getElementById("quest-title").value = "";
        document.getElementById("quest-author").value = "";
        document.getElementById("quest-description").value = "";
        document.getElementById("quest-image").value = "";

        modal.style.display = "none";

    } catch (error) {
        console.error("Error saving quest:", error);
    }
  });

  window.displayQuests = async function (showDelete = false) {
    const questsDisplay = document.getElementById("quests-display");
    questsDisplay.innerHTML = ""; // Clear existing quests

    try {
        const response = await fetch("/api/quests"); // Fetch quests from the server
        if (!response.ok) {
            throw new Error("Failed to load quests");
        }
        const quests = await response.json(); // Parse the JSON response

        if (quests.length === 0) {
            questsDisplay.innerHTML = `<p id="no-quests-message">No quests created yet.</p>`;
        } else {
            quests.forEach((quest) => {
                const questCard = document.createElement("div");
                questCard.classList.add("quest-card");

                questCard.innerHTML = `
                    <img src="${quest.image}" alt="${quest.title}" />
                    <div class="quest-card-content">
                        <h3 class="quest-card-title">${quest.title}</h3>
                        <p class="quest-card-author">Author: ${quest.author}</p>
                        <p class="quest-card-description">${quest.description}</p>
                    </div>
                `;
                // Create Start Quest button
                const startButton = document.createElement("button");
                startButton.textContent = quest.buttonText || "Start Quest";
                startButton.id = `start-quest-${quest._id}`;
                startButton.textContent = "Start Quest";
                startButton.addEventListener("click", () => {
                    window.location.href = "tutorial.html?questId=" + quest._id;
                });

                questCard.appendChild(startButton);

                // If showDelete is true, create and append Delete button
                if (showDelete) {
                    const deleteButton = document.createElement("button");
                    deleteButton.id = `delete-quest-${quest._id}`;
                    deleteButton.classList.add("delete-quest-btn");
                    deleteButton.style.marginLeft = "8px";
                    deleteButton.style.background = "#e74c3c";
                    deleteButton.style.color = "white";
                    deleteButton.textContent = "Delete";
                    deleteButton.addEventListener("click", () => {
                        setQuestIdToDelete(quest._id); // Set the quest ID for deletion
                        const modal = document.getElementById("delete-confirm-modal");
                        modal.classList.remove("hide");
                        modal.style.display = "block"; // Show the confirmation modal
                    });
                    questCard.appendChild(deleteButton);
                }
                questsDisplay.appendChild(questCard);
            });
        }
    } catch (error) {
        console.error("Error displaying quests:", error);
        questsDisplay.innerHTML = `<p id="no-quests-message">Error loading quests. Please try again later.</p>`;
    }
};

  // Event listeners for category buttons
  completedQuestsBtn.addEventListener("click", () => loadQuests("completed"));
  inProgressQuestsBtn.addEventListener("click", () => loadQuests("inProgress"));
  createdQuestsBtn.addEventListener("click", () => displayQuests(true));

  displayQuests(true);
});

let questIdToDelete = null; // Store the ID of the quest to delete

const deleteConfirmModal = document.getElementById("delete-confirm-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

confirmDeleteBtn.addEventListener("click", async () => {
    if (questIdToDelete !== null) {
        try {
            const response = await fetch(`/api/quests/${questIdToDelete}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete quest");
            }

            // Reload quests to reflect the deletion
            displayQuests(true);
            questIdToDelete = null; // Reset the quest ID
            deleteConfirmModal.classList.add("hide");
            deleteConfirmModal.style.display = "none";
        } catch (error) {
            console.error("Error deleting quest:", error);
        }
    }
});

cancelDeleteBtn.addEventListener("click", () => {
    questIdToDelete = null; // Reset the quest ID
    deleteConfirmModal.classList.add("hide");
    deleteConfirmModal.style.display = "none";
});

// Function to set the quest ID to delete
function setQuestIdToDelete(questId) {
    questIdToDelete = questId;
    deleteConfirmModal.classList.remove("hide");
    deleteConfirmModal.style.display = "block";
}