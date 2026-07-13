const { useState, useEffect } = React;

function App() {
  const [activeTab, setActiveTab] = useState('calendario');
  const [selectedDate, setSelectedDate] = useState('2026-07-13');

  // Carrega as Notas salvas ou começa com um texto vazio
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('planner_notes');
    return saved ? JSON.parse(saved) : {};
  });

  // Carrega a Rotina salva ou usa a padrão
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('planner_routines');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, time: '06:30', text: 'Acordar e agradecer', done: false, emoji: '🌸' },
      { id: 2, time: '07:00', text: 'Café da manhã', done: false, emoji: '☕' },
      { id: 3, time: '08:00', text: 'Trabalho / Estudos', done: false, emoji: '📚' },
      { id: 4, time: '12:00', text: 'Almoço', done: false, emoji: '🍽️' },
      { id: 5, time: '14:00', text: 'Tarefas do dia', done: false, emoji: '✅' },
      { id: 6, time: '18:00', text: 'Exercício', done: false, emoji: '🏋️' },
      { id: 7, time: '19:30', text: 'Jantar', done: false, emoji: '🍲' },
      { id: 8, time: '21:00', text: 'Banho / skincare', done: false, emoji: '🧴' },
      { id: 9, time: '22:00', text: 'Leitura (10 páginas)', done: false, emoji: '📖' }
    ];
  });

  // Carrega as Tarefas salvas
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('planner_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTaskText, setNewTaskText] = useState('');

  // Salva no celular toda vez que você mexer nas notas
  useEffect(() => {
    localStorage.setItem('planner_notes', JSON.stringify(notes));
  }, [notes]);

  // Salva no celular toda vez que você marcar ou desmarcar a rotina
  useEffect(() => {
    localStorage.setItem('planner_routines', JSON.stringify(routines));
  }, [routines]);

  // Salva no celular toda vez que você mexer nas tarefas
  useEffect(() => {
    localStorage.setItem('planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // --- Funções para marcar ---
  const toggleRoutine = (id) => {
    setRoutines(prev => prev.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const handleNoteChange = (text) => {
    setNotes(prev => ({
      ...prev,
      [selectedDate]: text
    }));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newItem = { id: Date.now(), text: newTaskText, done: false };
    setTasks(prev => [...prev, newItem]);
    setNewTaskText('');
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(item => item.id !== id));
  };

  const doneRoutineCount = routines.filter(r => r.done).length;

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#FFF9FA]">
      <header className="p-5 flex justify-between items-center bg-white border-b border-pink-100">
        <h1 className="text-2xl font-bold text-pink-600">✨ Meu Cantinho — 2026</h1>
        <span className="text-xs text-pink-400">✓ salvo</span>
      </header>

      <div className="flex justify-around bg-white p-2 border-b border-pink-100">
        <button onClick={() => setActiveTab('calendario')} className={`py-2 px-4 rounded-full text-sm font-medium ${activeTab === 'calendario' ? 'bg-pink-100 text-pink-700' : 'text-slate-500'}`}>📅 Calendário</button>
        <button onClick={() => setActiveTab('rotina')} className={`py-2 px-4 rounded-full text-sm font-medium ${activeTab === 'rotina' ? 'bg-pink-100 text-pink-700' : 'text-slate-500'}`}>🕒 Rotina</button>
        <button onClick={() => setActiveTab('tarefas')} className={`py-2 px-4 rounded-full text-sm font-medium ${activeTab === 'tarefas' ? 'bg-pink-100 text-pink-700' : 'text-slate-500'}`}>✅ Tarefas</button>
      </div>

      <main className="flex-1 p-4">
        {activeTab === 'calendario' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <h2 className="text-center font-bold text-pink-600 mb-4 text-lg">🌸 Julho de 2026</h2>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
              <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-2 justify-items-center mb-6">
              {Array.from({ length: 3 }).map((_, i) => <div key={`empty-${i}`}></div>)}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate === `2026-07-${day.toString().padStart(2, '0')}`;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(`2026-07-${day.toString().padStart(2, '0')}`)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${isSelected ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300' : 'text-slate-700'}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <div className="border-t border-pink-100 pt-4">
              <h3 className="font-semibold text-pink-600 mb-2 text-sm">📌 Notas:</h3>
              <textarea
                value={notes[selectedDate] || ''}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Escreva seus planos... 💕"
                className="w-full h-24 p-3 bg-pink-50 rounded-2xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-pink-200 resize-none"
              ></textarea>
            </div>
          </div>
        )}

        {activeTab === 'rotina' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <h2 className="font-bold text-lg text-pink-700 mb-2">☀️ Minha Rotina Base</h2>
            <p className="text-xs text-slate-400 mb-4">Progresso: {doneRoutineCount}/{routines.length} feitos</p>
            <div className="space-y-2">
              {routines.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleRoutine(item.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${item.done ? 'bg-pink-300 border-pink-300 text-white' : 'border-pink-200'}`}
                    >
                      {item.done && '✓'}
                    </button>
                    <span className="text-xs font-mono text-pink-400 bg-pink-50 px-2 py-0.5 rounded-md">{item.time}</span>
                    <span className={`text-sm ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.emoji} {item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tarefas' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <h2 className="font-bold text-lg text-pink-700 mb-4">✍️ Minhas Tarefas</h2>
            <form onSubmit={addTask} className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Próxima meta..." 
                value={newTaskText} 
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 border border-pink-100 rounded-xl px-3 py-2 text-sm focus:outline-none"
              />
              <button type="submit" className="bg-pink-100 text-pink-700 font-bold px-4 py-2 rounded-xl">Adicionar</button>
            </form>
            <div className="space-y-2">
              {tasks.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleTask(item.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${item.done ? 'bg-pink-300 border-pink-300 text-white' : 'border-pink-200'}`}
                    >
                      {item.done && '✓'}
                    </button>
                    <span className={`text-sm ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.text}</span>
                  </div>
                  <button onClick={() => deleteTask(item.id)} className="text-xs">🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);