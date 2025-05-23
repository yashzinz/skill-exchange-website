document.addEventListener("DOMContentLoaded", () => {
    const skillCards = document.querySelectorAll(".skill-card");
    const confirmRewardBtn = document.getElementById("confirm-reward-btn");
    const cancelRewardBtn = document.getElementById("cancel-reward-btn");
    const rewardModal = document.getElementById("reward-confirm-modal");
    let pointsToDeduct = 50; // Points to deduct

    skillCards.forEach(card => {
        card.addEventListener("click", async (e) => {
            e.preventDefault();

            const currentPoints = await getCurrentPoints(); // Fetch current points
            if (currentPoints < pointsToDeduct) {
                alert("You do not have enough points to claim this reward."); // Notify the user
                return; // Exit the function if not enough points
            }

            // Open the modal when a skill card is clicked
            rewardModal.classList.remove("hide");
            rewardModal.style.display = "block"; // Show the confirmation modal
        });
    });

    confirmRewardBtn.addEventListener("click", async () => {
        await deductPoints(pointsToDeduct); // Call the deductPoints function
        rewardModal.classList.add("hide");
        rewardModal.style.display = "none"; // Hide the modal
    });

    cancelRewardBtn.addEventListener("click", () => {
        rewardModal.classList.add("hide");
        rewardModal.style.display = "none"; // Hide the modal
    });
});

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
        return data.points; // Assuming the response contains a 'points' field
    } catch (error) {
        console.error("Error fetching current points:", error);
    }
}

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

        alert("Reward Claimed!"); // Notify the user

    } catch (error) {
        console.error("Error claiming points:", error);
        responseMessage.textContent = "Error claiming points.";
    }
}
