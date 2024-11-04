async function loadDevoirs() {
    const response = await fetch('/devoirs');
    return response.json();
}

async function enregistrerDevoir() {
    const matiere = document.getElementById("matiere").value;
    const titre = document.getElementById("titre").value;
    const contenu = document.getElementById("contenu").value;
    const date = document.getElementById("date").value;

    if (!matiere || !titre || !contenu || !date) return alert("Veuillez remplir tous les champs");

    const newDevoir = {
        matiere,
        titre,
        contenu,
        date,
    };

    await fetch('/devoirs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDevoir)
    })
        .catch(error => console.error('Erreur lors de l\'ajout du devoir:', error));

    afficherDevoirs();
}

async function afficherDevoirs() {
    const devoirs = await loadDevoirs();
    const container = document.getElementById("devoirs");
    container.innerHTML = "";

    devoirs.forEach((devoir, index) => {
        const devoirElem = document.createElement("div");
        devoirElem.classList.add("devoir");
        devoirElem.innerHTML = `
            <h2>${devoir.titre}</h2>
            <p><strong>Matière :</strong> ${devoir.matiere}</p>
            <br>
            <p><strong>Contenu :</strong></p>
            <p> ${devoir.contenu}</p>
            <br>
            <p><strong>Date du devoir :</strong> ${new Date(devoir.date).toLocaleDateString("fr-FR")}</p>
            <div class="date-ajout">
                <em>Ajouté le</em>${new Date(devoir.dateAjout).toLocaleDateString("fr-FR")}
                <button class="edit-btn" onclick="editDevoir(${index})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteDevoir(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        container.appendChild(devoirElem);
    });
}

async function editDevoir(index) {
    const devoirs = await loadDevoirs();
    const devoir = devoirs[index];

    document.getElementById("matiere").value = devoir.matiere;
    document.getElementById("titre").value = devoir.titre;
    document.getElementById("contenu").value = devoir.contenu;
    document.getElementById("date").value = devoir.date;

    devoir.dateAjout = devoir.dateAjout; // Assure la persistance de dateAjout

    await fetch('/devoirs', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(devoir)
    })
        .catch(error => console.error('Erreur lors de la mise à jour du devoir:', error));

    afficherDevoirs(); // Met à jour l'affichage
}


async function deleteDevoir(index) {
    await fetch(`/devoirs/${index}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    afficherDevoirs();
}

document.getElementById("sort-options").addEventListener("change", async (e) => {
    const sortBy = e.target.value;
    const devoirs = await loadDevoirs();
    devoirs.sort((a, b) => {
        if (sortBy === "date-devoir") {
            return new Date(a.date) - new Date(b.date);
        } else if (sortBy === "date-ajout") {
            return new Date(a.dateAjout) - new Date(b.dateAjout);
        } else if (sortBy === "matiere") {
            return a.matiere.localeCompare(b.matiere);
        }
    });
    afficherDevoirs();
});

afficherDevoirs();

const themeSwitch = document.getElementById("theme-switch");
themeSwitch.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add(savedTheme);
});

document.getElementById("toggle-form").addEventListener("click", () => {
    const form = document.getElementById("formulaire");
    form.classList.toggle("visible");
});