import { useState, useEffect } from 'react'

const App = () => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [editTaskId, setEditTaskId] = useState(null);
  const [fetchDataTrigger, setFetchDataTrigger] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/tasks");
        if (!response.ok) {
          throw new Error('Error al obtener datos');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (fetchDataTrigger) {
      fetchData();
      setFetchDataTrigger(false);
    }

  }, [fetchDataTrigger])

  const handleTasks = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:8080/tasks", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks: newTask }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar datos');
      }

      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask("");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const editTask = async (taskId) => {
    setEditTaskId(taskId);
    try {
      const updatedTaskContent = prompt('ACTUALIZAR:', tasks.find(t => t.id === taskId)?.task);
      if (updatedTaskContent !== null) {
        const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tasks: updatedTaskContent }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar datos');
        }

        setTasks(tasks.map(t => (t._id === taskId ? { ...t, task: updatedTaskContent } : t)));
        setFetchDataTrigger(true)
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setEditTaskId(null);
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar tarea');
      }

      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <form method='post' onSubmit={handleTasks}>
        <input type="text" placeholder='Nueva tarea'
          onChange={(e) => setNewTask(e.target.value)}
          value={newTask}
        />
        <button type='submit'>Agregar</button>
      </form>
      <h3>Lista de tareas</h3>
      <ul>
        {tasks.map((t) => (
          <ul>
            {t.tasks}
            <button onClick={() => editTask(t._id)}>Editar</button>
            <button onClick={() => deleteTask(t._id)}>Eliminar</button>
          </ul>

        ))}
      </ul>
    </div>
  )
}

export default App