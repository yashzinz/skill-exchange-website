document.addEventListener('DOMContentLoaded', () => {
    const skills = [
        "Basic Coding", "Sketching & Drawing", "Fashion Illustration",
        "learning new Languages", "Cultural Cooking Lessons", "singing",
        "Music", "Excel & Google Sheets", "Freelancing", "Dancing",
        "Video Editing", "Calligraphy or Hand Lettering", "Bodyweight Fitness"
    ];

    const skillsSelectionContainer = document.querySelector('.skills-selection');
    const skillSearchInput = document.getElementById('skillSearch');
    const nextButton = document.querySelector('.next-button');

    let selectedSkills = new Set();

    // Populate skills
    function renderSkills(filter = "") {
        skillsSelectionContainer.innerHTML = ''; // Clear existing skills
        const lowerFilter = filter.toLowerCase();
        skills.forEach(skill => {
            if (skill.toLowerCase().includes(lowerFilter)) {
                const skillTag = document.createElement('button');
                skillTag.classList.add('skill-tag');
                skillTag.textContent = skill;
                skillTag.dataset.skill = skill; // Store skill name in data attribute

                if (selectedSkills.has(skill)) {
                    skillTag.classList.add('active');
                }

                skillTag.addEventListener('click', () => {
                    skillTag.classList.toggle('active');
                    if (skillTag.classList.contains('active')) {
                        selectedSkills.add(skill);
                    } else {
                        selectedSkills.delete(skill);
                    }
                    console.log("Selected skills:", Array.from(selectedSkills));
                });
                skillsSelectionContainer.appendChild(skillTag);
            }
        });
    }

    // Initial render
    renderSkills();

    // Filter skills on search input
    skillSearchInput.addEventListener('input', (e) => {
        renderSkills(e.target.value);
    });

    // Next button functionality (placeholder)
    nextButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (selectedSkills.size > 0) {
            alert("Proceeding with skills: " + Array.from(selectedSkills).join(', '));
            // Here you would typically send this data to a server or navigate to the next page
            // Get the selected skills
            const skillsArray = Array.from(selectedSkills);

            if (skillsArray.length === 0) {
                responseMessage.innerText = 'Please select at least one skill.';
                return;
            }

            try {
                const response = await fetch('/add-skills', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ skills: skillsArray }) 
                });

                const result = await response.json();
                if (response.ok) {
                    alert("Skills Selected!")
                    window.location.href = "userProfile.html"
                } else {
                    document.getElementById('responseMessage').innerText = 'Error: ' + result.message;
                }
        } catch (error) {
            document.getElementById('responseMessage').innerText = 'Error submitting skills: ' + error.message;
        }
        } else {
            alert("Please select at least one skill.");
        }
    });
});