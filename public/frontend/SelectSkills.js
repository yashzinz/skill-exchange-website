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
    nextButton.addEventListener('click', () => {
        if (selectedSkills.size > 0) {
            alert("Proceeding with skills: " + Array.from(selectedSkills).join(', '));
            // Here you would typically send this data to a server or navigate to the next page
        } else {
            alert("Please select at least one skill.");
        }
    });
});