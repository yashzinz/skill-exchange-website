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

// Profile Section
function setupProfile() {
  const editProfileButton = document.getElementById("edit-profile-button");
  const saveProfileButton = document.getElementById("save-profile");
  const cancelEditButton = document.getElementById("cancel-edit");
  const profileForm = document.getElementById("profile-form");
  const profileInfo = document.querySelector(".profile-info");

  const fieldDisplay = document.getElementById("field-display");
  const certDisplay = document.getElementById("cert-display");
  const expDisplay = document.getElementById("exp-display");

  const fieldInput = document.getElementById("field-input");
  const certInput = document.getElementById("cert-input");
  const expInput = document.getElementById("exp-input");

  // Load from localStorage
  const loadProfile = () => {
    const profile = JSON.parse(localStorage.getItem("profile")) || {};
    fieldDisplay.textContent = `Field of Study: ${
      profile.fieldOfStudy || "Not provided"
    }`;
    certDisplay.textContent = `Certification: ${
      profile.certification || "Not provided"
    }`;
    expDisplay.textContent = `Experience: ${
      profile.experience || "Not provided"
    }`;
    fieldInput.value = profile.fieldOfStudy || "";
    certInput.value = profile.certification || "";
    expInput.value = profile.experience || "";
  };

  // Save profile to localStorage
  const saveProfile = () => {
    const profile = {
      fieldOfStudy: fieldInput.value,
      certification: certInput.value,
      experience: expInput.value,
    };
    localStorage.setItem("profile", JSON.stringify(profile));
    loadProfile();
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

function setupSkills() {
  const skillsList = document.getElementById("skills-list");
  const noSkillsMessage = document.getElementById("no-skills-message");
  const addSkillButton = document.getElementById("add-skill-button");
  const addSkillForm = document.getElementById("add-skill-form");
  const newSkillInput = document.getElementById("new-skill");
  const submitSkillButton = document.getElementById("submit-skill-button");
  const cancelSkillButton = document.getElementById("cancel-skill-button");

  // Show the input form when "Add Skill" is pressed
  addSkillButton.addEventListener("click", () => {
    addSkillForm.classList.remove("hide");
    addSkillButton.classList.add("hide"); // Hide the "Add Skill" button
  });

  // Adding skill when the "Submit" button is pressed
  submitSkillButton.addEventListener("click", () => {
    const skillValue = newSkillInput.value.trim();
    if (skillValue === "") {
      alert("Please enter a skill.");
      return;
    }

    const noSkillsMessage = document.getElementById("no-skills-message");
    if (noSkillsMessage) {
      noSkillsMessage.remove();
    }

    // Create a new skill tag
    const skillTag = document.createElement("span");
    skillTag.textContent = skillValue;
    skillTag.classList.add("skill-tag");

    skillTag.addEventListener("click", () => {
      skillTag.remove();
      if (!skillsList.querySelector("span")) {
        const noSkills = document.createElement("p");
        noSkills.textContent = "No skills added yet.";
        noSkills.id = "no-skills-message";
        skillsList.appendChild(noSkills);
      }
    });

    skillsList.appendChild(skillTag);
    newSkillInput.value = ""; // Clear the input
    addSkillForm.classList.add("hide"); // Hide the form
    addSkillButton.classList.remove("hide"); // Show "Add Skill" button

    // Save skill to localStorage
    const skills = JSON.parse(localStorage.getItem("skills")) || [];
    skills.push(skillValue);
    localStorage.setItem("skills", JSON.stringify(skills));
  });

  cancelSkillButton.addEventListener("click", () => {
    newSkillInput.value = ""; // Clear the input
    addSkillForm.classList.add("hide"); // Hide the form
    addSkillButton.classList.remove("hide"); // Show "Add Skill" button
  });

  // Load skills from localStorage
  const loadSkills = () => {
    const skills = JSON.parse(localStorage.getItem("skills")) || [];
    skillsList.innerHTML = "";
    if (skills.length === 0) {
      skillsList.innerHTML =
        "<p id='no-skills-message'>No skills added yet.</p>";
    } else {
      skills.forEach((skill) => {
        const skillTag = document.createElement("span");
        skillTag.textContent = skill;
        skillTag.classList.add("skill-tag");

        // Add functionality to remove the skill tag on click
        skillTag.addEventListener("click", () => {
          skillTag.remove();
          const remainingSkills = Array.from(
            skillsList.querySelectorAll(".skill-tag")
          ).map((tag) => tag.textContent);

          localStorage.setItem("skills", JSON.stringify(remainingSkills));

          if (!skillsList.querySelector(".skill-tag")) {
            skillsList.innerHTML =
              "<p id='no-skills-message'>No skills added yet.</p>";
          }
        });

        skillsList.appendChild(skillTag);
      });
    }
  };

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
  const quests = {
    completed: [
      {
        title: "Cooking Quest",
        author: "Matthew Mercer",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "images/cooking.jpg",
        buttonText: "View Quest",
      },
    ],
    inProgress: [
      {
        title: "Dancing Quest",
        author: "Matthew Mercer",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "images/dance.jpg",
        buttonText: "Continue Quest",
      },
    ],
    created: [],
  };

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

  const loadQuests = (category) => {
    questsDisplay.innerHTML = ""; // Clear current quests

    if (quests[category].length === 0) {
      noQuestsMessage.style.display = "block"; // Show "No quests" message
    } else {
      noQuestsMessage.style.display = "none"; // Hide "No quests" message
      quests[category].forEach((quest) => {
        const questCard = document.createElement("div");
        questCard.classList.add("quest-card");

        questCard.innerHTML = `
          <img src="${quest.image}" alt="${quest.title}">
          <div class="quest-card-content">
            <h3 class="quest-card-title">${quest.title}</h3>
            <p class="quest-card-author">${quest.author}</p>
            <p class="quest-card-description">${quest.description}</p>
          </div>
          <button>${quest.buttonText}</button>
        `;

        questsDisplay.appendChild(questCard);
      });
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
  submitQuestBtn.addEventListener("click", () => {
    const title = document.getElementById("quest-title").value.trim();
    const author = document.getElementById("quest-author").value.trim();
    const description = document
      .getElementById("quest-description")
      .value.trim();
    const image = document.getElementById("quest-image").value.trim();

    // Validate the input fields
    if (!title || !author || !description) {
      alert("Please fill out all required fields.");
      return;
    }

    // Create a new quest object
    const newQuest = {
      title,
      author,
      description,
      image: image || "images/quest.jpg", // placeholder image if not provided
      buttonText: "Start Quest",
    };

    // Save the new quest to localStorage
    const quests = JSON.parse(localStorage.getItem("userQuests")) || [];
    quests.push(newQuest);
    localStorage.setItem("userQuests", JSON.stringify(quests));

    // Refresh the quest display
    displayQuests();

    document.getElementById("quest-title").value = "";
    document.getElementById("quest-author").value = "";
    document.getElementById("quest-description").value = "";
    document.getElementById("quest-image").value = "";

    modal.style.display = "none";
  });

  // Display quests from localStorage
  const displayQuests = () => {
    const questsDisplay = document.getElementById("quests-display");
    questsDisplay.innerHTML = ""; // Clear existing quests

    const quests = JSON.parse(localStorage.getItem("userQuests")) || [];

    if (quests.length === 0) {
      questsDisplay.innerHTML = `<p id="no-quests-message">No quests created yet.</p>`;
    } else {
      quests.forEach((quest, index) => {
        const questCard = document.createElement("div");
        questCard.classList.add("quest-card");

        questCard.innerHTML = `
        <img src="${quest.image}" alt="${quest.title}" />
        <div class="quest-card-content">
          <h3 class="quest-card-title">${quest.title}</h3>
          <p class="quest-card-author">Author: ${quest.author}</p>
          <p class="quest-card-description">${quest.description}</p>
        </div>
        <button id="start-quest-${index}">${quest.buttonText}</button>
      `;

        questsDisplay.appendChild(questCard);

        //Adding event listener to the Start Quest button
        const startButton = document.getElementById(`start-quest-${index}`);
        startButton.addEventListener("click", () => {
          // Save the selected quest to localStorage
          localStorage.setItem("currentQuest", JSON.stringify(quest));
          // Redirect to questDetails page
          window.location.href = "questDetails.html";
        });
      });
    }
  };

  // Event listeners for category buttons
  completedQuestsBtn.addEventListener("click", () => loadQuests("completed"));
  inProgressQuestsBtn.addEventListener("click", () => loadQuests("inProgress"));
  createdQuestsBtn.addEventListener("click", () => displayQuests());

  loadQuests("completed");
});
