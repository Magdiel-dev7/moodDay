// Mood selecionado
let selectedMood = "";

//Elementos
const moodButtons = document.querySelectorAll(".mood");
const saveBtn = document.getElementById("saveBtn");
const noteInput = document.getElementById("note");
const historyList = document.getElementById("historyList");
const filterMood = document.getElementById("filterMood");
const exportBtn = document.getElementById("exportBtn");

filterMood.addEventListener("change", renderEntries);

// Selecionar humor
moodButtons.forEach(button =>{
    button.addEventListener("click",() => {

    //remove active de todos
    moodButtons.forEach(btn => btn.classList.remove("active"));
        
    // adiciona active no clicado
    button.classList.add("active");

    // pega valor do emoji
    selectedMood = button.dataset.mood;
    });
});

    // Salvar registro
    saveBtn.addEventListener("click", () => {

        if(selectedMood === ""){
            alert("Escolha como você está se sentindo 😊");
            return;

        }

        const note = noteInput.value.trim();

        const today = new Date();

        const date = today.toLocaleDateString("pt-BR");

        const entry = {
            mood: selectedMood,
            note: note,
            date: date
        };

        // pegar dados antigos
        const entries =  JSON.parse(localStorage.getItem("moodEntries")) || [];

        // adicionar novo no início
        entries.unshift(entry);

        // salvar
        localStorage.setItem("moodEntries", JSON.stringify(entries)
        );

        //limpar campos
        selectedMood = "";
        noteInput.value = "";
        moodButtons.forEach(btn => btn.classList.remove("active")
        );

        
        // atualizar tela
        renderEntries();
    });
        // Mostrar histórico
        function renderEntries(){
            const entries = JSON.parse(localStorage.getItem("moodEntries")) || [];
            
            const selectedFilter = filterMood.value;
            
            historyList.innerHTML = "";

            let filteredEntries = entries;

            if(selectedFilter !== "all"){
                filteredEntries = entries.filter(entry => entry.mood === selectedFilter);
            }

            if(filteredEntries.length === 0){
                historyList.innerHTML = "<p>Nenhuma registro encontrado</p>"
                return;
            }

            filteredEntries.forEach((entry, index) => {
                const div = document.createElement("div");
                div.classList.add("entry");

                div.innerHTML =`
                <strong>${entry.mood}</strong>
                <span>${entry.date}</span>
                <p>${entry.note || "Sem anotação."}</p>
                
                <div class="entry-buttons">
                <button onclick="editEntry(${index})">Editar</button>
                <button onclick="deleteEntry(${index})">Excluir</button>
                </div>
             `;

             historyList.appendChild(div);

          });
        }

            let chart;


            function renderChart(){


        const entries = JSON.parse(localStorage.getItem("moodEntries")) || [];
        const moods = {
            "😊":0,
            "😔":0,
            "😰":0,
            "😴":0,
            "😎":0
        };


    entries.forEach(entry =>{
        if(moods[entry.mood] !== undefined){
        moods[entry.mood]++;
        }
    });


    const ctx = document.getElementById("moodChart");

if(chart){
chart.destroy();
}

chart = new Chart(ctx,{
type:"bar",
data:{
labels:["😊","😔","😰","😴","😎"],
datasets:[{
label:"Registros",
data:[
moods["😊"],
moods["😔"],
moods["😰"],
moods["😴"],
moods["😎"]
],
borderWidth:1
}]
},
options:{
responsive:true,
plugins:{
legend:{
display:false
}
}
}
});


}

// carregar ao abrir
    renderEntries();
    renderChart();

exportBtn.addEventListener("click", () => {
    const entries = JSON.parse(localStorage.getItem("moodEntries")) || [];

    if(entries.length === 0){
        alert("Nenhum registro para exportar.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Relatório MoodDay", 20, 20)

    doc.setFontSize(11);

    let y = 35;

    entries.forEach((entry, index) => {
        doc.text(`${entry.date} | ${entry.mood}`, 20, y);
        y += 8;

        doc.text(`${entry.note || "Sem anotação."}`, 20, y);
        y += 12;

        if(y > 270){
            doc.addPage();
            y = 20;
        }

    });
    
    doc.save("relatorio-moodday.pdf");
});

function deleteEntry(index){
    const entries = JSON.parse(localStorage.getItem("moodEntries")) || [];

    entries.splice(index,1);

    localStorage.setItem("moodEntries", JSON.stringify(entries)
);

renderEntries();
renderChart();

}

function editEntry(index){
    const entries = JSON.parse(localStorage.getItem("moodEntries")) || [];

    const newNote = prompt("Editar Anotação:", entries[index].note
    );

    if(newNote !== null){
        entries[index].note = newNote;

        localStorage.setItem("moodEntries", JSON.stringify(entries)
    );

    renderEntries();
    renderChart();

    }

}