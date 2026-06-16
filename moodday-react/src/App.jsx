import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { jsPDF } from 'jspdf';
import './App.css';

Chart.register(...registerables);

function App() {
  // --- ESTADOS ---
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('moodEntries');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState('all');

  // --- NOVO ESTADO: Para guardar o clima atual de Recife ---
  const [weather, setWeather] = useState({ temp: '--', desc: 'Carregando clima...' });

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // --- BUSCAR CLIMA AO CARREGAR O APP ---
  useEffect(() => {
    fetchWeather();
  }, []);

  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(entries));
    renderChart();
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [entries]);

  // --- FUNÇÃO DA API DE CLIMA (Recife-PE) ---
  const fetchWeather = async () => {
    try {
      // Usando a sua chave antiga que já está funcionando perfeitamente!
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Recife,BR&appid=4d8fb5b93d4af21d66a2948710284366&units=metric&lang=pt_br`
      );
      const data = await response.json();
      
      if (data.main) {
        const tempRounded = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const descFormatted = description.charAt(0).toUpperCase() + description.slice(1);
        
        setWeather({
          temp: `${tempRounded}°C`,
          desc: descFormatted
        });
      }
    } catch (error) {
      console.error('Erro ao buscar o clima:', error);
      setWeather({ temp: '26°C', desc: 'Tempo limpo' }); 
    }
  };
 
  // --- LÓGICA DO CHART.JS ---
  const renderChart = () => {
    if (!chartRef.current) return;
    const moodsCount = { '😊': 0, '😔': 0, '😰': 0, '😴': 0, '😎': 0 };
    entries.forEach(entry => {
      if (moodsCount[entry.mood] !== undefined) moodsCount[entry.mood]++;
    });

    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['😊', '😔', '😰', '😴', '😎'],
        datasets: [{
          label: 'Registros',
          data: [
            moodsCount['😊'],
            moodsCount['😔'],
            moodsCount['😰'],
            moodsCount['😴'],
            moodsCount['😎']
          ],
          backgroundColor: '#38bdf8',
          borderWidth: 0,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#94a3b8' } },
          x: { ticks: { color: '#f8fafc', font: { size: 16 } } }
        }
      }
    });
  };

  // --- SALVAR REGISTRO (Agora incluindo o clima do momento!) ---
  const handleSave = () => {
    if (selectedMood === '') {
      alert('Escolha como você está se sentindo 😊');
      return;
    }
    const today = new Date();
    const date = today.toLocaleDateString('pt-BR');

    const newEntry = { 
      mood: selectedMood, 
      note: note.trim(), 
      date: date,
      weather: `${weather.temp} - ${weather.desc}` // Salva o clima atual junto com a nota!
    };

    setEntries([newEntry, ...entries]);
    setSelectedMood('');
    setNote('');
  };

  const handleDelete = (indexOriginal) => {
    const updatedEntries = entries.filter((_, idx) => idx !== indexOriginal);
    setEntries(updatedEntries);
  };

  const handleEdit = (indexOriginal) => {
    const newNote = prompt('Editar Anotação:', entries[indexOriginal].note);
    if (newNote !== null) {
      const updatedEntries = [...entries];
      updatedEntries[indexOriginal].note = newNote;
      setEntries(updatedEntries);
    }
  };

  const handleExportPDF = () => {
    if (entries.length === 0) {
      alert('Nenhum registro para exportar.');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Relatório MoodDay', 20, 20);
    doc.setFontSize(11);
    let y = 35;
    entries.forEach((entry) => {
      // Adiciona o clima no relatório em PDF também se existir
      const weatherText = entry.weather ? ` | Clima: ${entry.weather}` : '';
      doc.text(`${entry.date} | ${entry.mood}${weatherText}`, 20, y);
      y += 8;
      doc.text(`${entry.note || 'Sem anotação.'}`, 20, y);
      y += 12;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save('relatorio-moodday.pdf');
  };

  const filteredEntries = filter === 'all' 
    ? entries 
    : entries.filter(entry => entry.mood === filter);

  return (
    <div className="container">
      <header>
        <h1>MoodDay</h1>
        <p>Como você está hoje?</p>
        
        {/* Widget de Clima Organizado e Alinhado */}
        <div className="weather-widget">
          <span className="location">📍 Recife, PE</span>
          <span className="temp">{weather.temp}</span>
          <span className="desc">• {weather.desc}</span>
        </div>
      </header>

      <section className="moods">
        {['😊', '😔', '😰', '😴', '😎'].map((emoji) => (
          <button
            key={emoji}
            className={`mood ${selectedMood === emoji ? 'active' : ''}`}
            onClick={() => setSelectedMood(emoji)}
          >
            {emoji}
          </button>
        ))}
      </section>

      <section className="note-area">
        <textarea
          id="note"
          placeholder="Quer escrever algo sobre hoje?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
        <div className="buttons">
          <button id="saveBtn" onClick={handleSave}>Salvar Registro</button>
          <button id="exportBtn" onClick={handleExportPDF}>Exportar PDF</button>
        </div>
      </section>

      <section className="history">
        <h2>Histórico</h2>
        <div id="historyList">
          {filteredEntries.length === 0 ? (
            <p>Nenhum registro encontrado</p>
          ) : (
            filteredEntries.map((entry, index) => {
              const originalIndex = entries.findIndex(e => e === entry);
              return (
                <div className="entry" key={index}>
                  <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
                    <strong style={{ flex: 1 }}>{entry.mood}</strong>
                    {/* Exibe o clima salvo na data daquele registro */}
                    {entry.weather && (
                      <span style={{ fontSize: '0.8rem', background: '#334155', padding: '2px 8px', borderRadius: '20px', color: '#38bdf8' }}>
                        🌤️ {entry.weather}
                      </span>
                    )}
                  </div>
                  <span>{entry.date}</span>
                  <p>{entry.note || 'Sem anotação.'}</p>
                  <div className="entry-buttons">
                    <button onClick={() => handleEdit(originalIndex)}>Editar</button>
                    <button onClick={() => handleDelete(originalIndex)}>Excluir</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <label htmlFor="filterMood">
        <h4>Filtrar Emoções</h4>
      </label>
      <select id="filterMood" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Todos</option>
        <option value="😊">😊 Feliz</option>
        <option value="😔">😔 Triste</option>
        <option value="😰">😰 Ansioso</option>
        <option value="😴">😴 Cansado</option>
        <option value="😎">😎 Motivado</option>
      </select>

      <section className="chart-area">
        <h2>Resumo da Semana</h2>
        <canvas ref={chartRef} id="moodChart"></canvas>
      </section>
    </div>
  );
}

export default App;