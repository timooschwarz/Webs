/* ---------------------------------------------------
   🍏 LOGIN SCREEN – nur beim ersten Besuch
--------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

    if (!localStorage.getItem("loggedIn")) {

        const start = document.createElement("div");
        start.id = "startscreen";
        start.innerHTML = `
            <div class="avatar">
                <svg viewBox="0 0 24 24" fill="white" width="60" height="60">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                </svg>
            </div>

            <div class="greeting"></div>

            <div class="progress">
                <div class="bar"></div>
            </div>

            <div id="loginbox">
                <input type="password" id="loginpass" placeholder="Kennwort eingeben">
                <button id="loginbtn">Anmelden</button>
            </div>
        `;
        document.body.prepend(start);

        function getGreeting() {
            const hour = new Date().getHours();
            if (hour < 5) return "Gute Nacht";
            if (hour < 10) return "Guten Morgen";
            if (hour < 13) return "Schönen Vormittag";
            if (hour < 18) return "Schönen Nachmittag";
            if (hour < 22) return "Schönen Abend";
            return "Gute Nacht";
        }

        document.querySelector("#startscreen .greeting").textContent = getGreeting();

        setTimeout(() => {
            document.querySelector("#startscreen .bar").style.width = "100%";
        }, 200);

        setTimeout(() => {
            document.getElementById("loginbox").style.display = "flex";
        }, 2600);

        document.addEventListener("click", (e) => {
            if (e.target.id === "loginbtn") {
                const pass = document.getElementById("loginpass").value;
                if (pass.length > 0) {
                    localStorage.setItem("loggedIn", "true");
                    start.classList.add("hidden");
                }
            }
        });
    }
});

/* ---------------------------------------------------
   🍏 GAMIFICATION SYSTEM
--------------------------------------------------- */

let userData = JSON.parse(localStorage.getItem("userData")) || {
    xp: 0,
    level: 1,
    achievements: [],
    guidesRead: 0
};

const achievements = {
    firstGuide: {
        name: "Erste Schritte",
        desc: "Du hast deine erste Anleitung gelesen.",
        xp: 20
    },
    fiveGuides: {
        name: "Leseratte",
        desc: "Du hast 5 Anleitungen gelesen.",
        xp: 40
    },
    tenGuides: {
        name: "Power User",
        desc: "Du hast 10 Anleitungen gelesen.",
        xp: 80
    },
    level5: {
        name: "Level 5 erreicht",
        desc: "Du bist richtig gut dabei!",
        xp: 100
    }
};

function saveUserData() {
    localStorage.setItem("userData", JSON.stringify(userData));
}

function showPopup(text) {
    const pop = document.createElement("div");
    pop.className = "achievement-popup";
    pop.textContent = text;
    document.body.appendChild(pop);

    setTimeout(() => pop.classList.add("show"), 50);
    setTimeout(() => pop.classList.remove("show"), 2500);
    setTimeout(() => pop.remove(), 3000);
}

function updateUI() {
    const bar = document.getElementById("xp-bar");
    const levelDisplay = document.getElementById("level-display");
    if (!bar || !levelDisplay) return;

    const needed = userData.level * 100;
    const percent = (userData.xp / needed) * 100;

    bar.style.width = percent + "%";
    levelDisplay.textContent = `Level ${userData.level} – ${userData.xp} / ${needed} XP`;
}

function checkLevelAchievements() {
    if (userData.level >= 5) unlockAchievement("level5");
}

function addXP(amount) {
    userData.xp += amount;

    const needed = userData.level * 100;
    if (userData.xp >= needed) {
        userData.xp -= needed;
        userData.level++;
        showPopup(`🎉 Level ${userData.level} erreicht!`);
        checkLevelAchievements();
    }

    updateUI();
    saveUserData();
}

function unlockAchievement(id) {
    if (!userData.achievements.includes(id)) {
        userData.achievements.push(id);
        addXP(achievements[id].xp);
        showPopup(`🏆 ${achievements[id].name}`);
        saveUserData();
    }
}

function guideOpened() {
    userData.guidesRead++;
    addXP(20);

    if (userData.guidesRead >= 1) unlockAchievement("firstGuide");
    if (userData.guidesRead >= 5) unlockAchievement("fiveGuides");
    if (userData.guidesRead >= 10) unlockAchievement("tenGuides");

    saveUserData();
}

document.addEventListener("DOMContentLoaded", () => {
    updateUI();

    const openBtn = document.getElementById("open-achievements");
    const overlay = document.getElementById("achievement-overlay");
    const list = document.getElementById("achievement-list");

    if (openBtn && overlay && list) {
        openBtn.onclick = () => {
            list.innerHTML = "";

            for (const id in achievements) {
                const a = achievements[id];
                const unlocked = userData.achievements.includes(id);

                const item = document.createElement("div");
                item.className = "achievement-item" + (unlocked ? "" : " locked");
                item.innerHTML = `
                    <span>${a.name}</span>
                    <span>${unlocked ? "✔️" : "🔒"}</span>
                `;
                list.appendChild(item);
            }

            overlay.style.display = "flex";
        };

        overlay.onclick = () => {
            overlay.style.display = "none";
        };
    }
});
