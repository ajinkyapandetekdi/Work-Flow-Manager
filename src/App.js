import React, { useState } from "react";

const App = () => {
  const [tasks, setTasks] = useState({
    backlog: ["Task 1", "Task 2", "Task 6", "Task 7"],
    todo: ["Task 3"],
    ongoing: ["Task 4"],
    done: ["Task 5"],
  });
  const [newTask, setNewTask] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  
  const handleDeleteTask = () => {
    if (selectedTask) {
      const currentList = findTaskList(selectedTask);
      const filterTasks = tasks[currentList].filter((item)=>{
        return item!==selectedTask;
      })
      setSelectedTask(null)
      setTasks({...tasks,[currentList]:filterTasks})

      // console.log(tasks[currentList].includes(selectedTask));
      // moveTask(selectedTask, currentList, "done");
    }
  };

  
  const moveTask = (task, fromList, toList) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      const taskIndex = updatedTasks[fromList].indexOf(task);

      if (taskIndex !== -1) {
        updatedTasks[fromList].splice(taskIndex, 1);
        updatedTasks[toList].push(task);
      }

      return { ...updatedTasks };
    });
  };

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks.backlog.push(newTask);
        setNewTask(""); // Reset the newTask state after adding a task
        return { ...updatedTasks };
      });
    }
  };

  

  const handleMoveForward = () => {
    if (selectedTask) {
      const currentList = findTaskList(selectedTask);
      const nextList = getNextList(currentList);
      toggleTaskMovement(selectedTask, currentList, nextList);
    }
  };

  const handleMoveBackward = () => {
    if (selectedTask) {
      const currentList = findTaskList(selectedTask);
      const previousList = getPreviousList(currentList);
      toggleTaskMovement(selectedTask, currentList, previousList);
    }
  };

  const toggleTaskMovement = (task, currentList, nextList) => {
    if (selectedTask === task) {
      const isMovingForward = currentList !== nextList;
      const targetList = isMovingForward
        ? nextList
        : getPreviousList(currentList);

      moveTask(task, currentList, targetList);
    } else {
      setSelectedTask(task);
    }
  };


  const findTaskList = (task) => {
    for (const [list, taskList] of Object.entries(tasks)) {
      if (taskList.includes(task)) {
        return list;
      }
    }
    return null;
  };

  const getNextList = (currentList) => {
    const columns = Object.keys(tasks);
    const currentIndex = columns.indexOf(currentList);
    return currentIndex < columns.length - 1
      ? columns[currentIndex + 1]
      : currentList;
  };

  const getPreviousList = (currentList) => {
    const columns = Object.keys(tasks);
    const currentIndex = columns.indexOf(currentList);
    return currentIndex > 0 ? columns[currentIndex - 1] : currentList;
  };

  return (
    <div className="kanban-board">
      <div className="board-column">
        <ul>
          <h1>Controls</h1>
          <li>
            <input
              type="text"
              value={newTask}
              onChange={handleInputChange}
              placeholder="New Task"
            />
            <button onClick={handleAddTask}>Add Task</button>
          </li>
          <li>
            <h2>{selectedTask}</h2>
            <button onClick={handleMoveBackward}>Move Backward</button>
            <button onClick={handleMoveForward}>Move Forward</button>
            <button onClick={handleDeleteTask}>Delete</button>
          </li>
        </ul>
      </div>
      <div className="board-container">
        {Object.entries(tasks).map(([listName, taskList]) => (
          <div className="board-column" key={listName}>
            <h2>{listName}</h2>
            <ul>
              {taskList &&
                taskList.map((task, index) => (
                  <li
                    key={index}
                    className={selectedTask === task ? "selected" : ""}
                    onClick={() => setSelectedTask(task)}
                  >
                    {task}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
