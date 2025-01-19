import { useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import TaskItem from "./TaskItem";
import { addTaskToHistory } from "../services/taskHistoryService";
import { motion } from "framer-motion";
import { SUBJECT_COLORS } from "../constants/colors";

export default function SubjectCard({
  subject,
  onUpdate,
  onDelete,
  difficultyLevels,
}) {
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [taskDifficulty, setTaskDifficulty] = useState("MEDIUM");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create task locally
      const taskData = {
        id: Date.now(),
        content: newTask.trim(),
        completed: false,
        completedAt: null,
        difficulty: taskDifficulty,
        timestamp: new Date().toISOString(),
      };

      // Update local state
      const updatedSubject = {
        ...subject,
        tasks: [
          ...(subject.tasks || []),
          taskData
        ],
      };

      onUpdate(updatedSubject);
      setNewTask("");
      setTaskDifficulty("MEDIUM");
      console.log("Task added successfully:", taskData);
    } catch (err) {
      setError(err.message);
      console.error("Error adding task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = (taskId, completedAt) => {
    const task = (subject.tasks || []).find((t) => t?.id === taskId);
    if (!task || task.completed) return; // Prevent toggling if task is already completed

    const wasCompleted = task.completed;
    
    try {
      // Update local state
      const updatedSubject = {
        ...subject,
        tasks: (subject.tasks || []).map((task) =>
          task?.id === taskId
            ? { ...task, completed: true, completedAt }
            : task
        ),
      };
      
      // Add to task history if the task was just completed
      if (!wasCompleted) {
        addTaskToHistory();
      }
      
      onUpdate(updatedSubject, !wasCompleted, task.difficulty);
    } catch (err) {
      setError(err.message);
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = (taskId) => {
    const updatedSubject = {
      ...subject,
      tasks: (subject.tasks || []).filter((task) => task?.id !== taskId),
    };
    onUpdate(updatedSubject);
  };

  const handleEditTask = (taskId) => {
    const task = (subject.tasks || []).find((t) => t?.id === taskId);
    if (task) {
      setEditingTask({
        id: taskId,
        content: task.content,
        difficulty: task.difficulty,
      });
    }
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (!editingTask || !editingTask.content?.trim()) return;

    const updatedSubject = {
      ...subject,
      tasks: (subject.tasks || []).map((task) =>
        task?.id === editingTask.id
          ? {
              ...task,
              content: editingTask.content.trim(),
              difficulty: editingTask.difficulty,
            }
          : task
      ),
    };
    onUpdate(updatedSubject);
    setEditingTask(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`h-2 ${SUBJECT_COLORS.find(c => c.name === subject.color)?.class || 'bg-[#FFB5A7]'}`} />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">{subject.title}</h3>
          <button
            onClick={() => onDelete(subject.id)}
            className="p-1 hover:bg-neutral-100 rounded"
          >
            <XMarkIcon className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4">
          {(subject.tasks || []).map((task) => {
            if (!task) return null;
            return editingTask?.id === task.id ? (
              <form
                key={task.id}
                onSubmit={handleUpdateTask}
                className="space-y-2"
              >
                <input
                  type="text"
                  value={editingTask.content}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, content: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  autoFocus
                />
                <div className="flex gap-2">
                  <select
                    value={editingTask.difficulty}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        difficulty: e.target.value,
                      })
                    }
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-400 text-sm"
                  >
                    {Object.entries(difficultyLevels).map(([key, { label }]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                difficultyLevel={difficultyLevels[task.difficulty]}
              />
            );
          })}
        </div>

        <form onSubmit={handleAddTask} className="space-y-2">
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <motion.div className="relative">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-amber-500 relative z-10 bg-white"
              disabled={isLoading}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileFocus={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 -m-0.5 rounded-lg bg-amber-500/20 blur-sm"
            />
          </motion.div>
          <div className="flex gap-2">
            {Object.entries(difficultyLevels).map(([key, { label }]) => {
              const getSelectedStyle = (key) => {
                switch(key) {
                  case 'LOW':
                    return 'bg-green-100 text-green-700 border-green-200';
                  case 'MEDIUM':
                    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                  case 'HIGH':
                    return 'bg-red-100 text-red-700 border-red-200';
                  default:
                    return 'bg-neutral-100 text-neutral-500';
                }
              };

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTaskDifficulty(key)}
                  className={`px-4 py-2 rounded-md border border-neutral-300 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md ${
                    taskDifficulty === key 
                      ? getSelectedStyle(key)
                      : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-neutral-300 bg-neutral-100 text-neutral-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
            disabled={isLoading}
          >
            <PlusIcon className="w-5 h-5" />
            {isLoading ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
