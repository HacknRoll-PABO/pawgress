// Base URL for the API
const API_BASE_URL = "http://localhost:5000";

const headers = {
  'Content-Type': 'application/json'
};

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  return response.json();
}

// Task Service object containing all API calls
const taskService = {
  // Get all tasks
  async getAllTasks() {
    const response = await fetch(`${API_BASE_URL}/fetchtask`, {
      method: 'GET',
      headers,
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Get a single task by ID
  //   getTaskById: async (taskId) => {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`);
  //       return handleResponse(response);
  //     } catch (error) {
  //       console.error(`Error fetching task `);
  //       throw error;
  //     }
  //   },
  // Create a new task
  async createSubject(subjectData) {
    const response = await fetch(`${API_BASE_URL}/addsubject`, {
      method: 'POST',
      headers,
      body: JSON.stringify(subjectData)
    });
    return handleResponse(response);
  },
  // Create a new task
  async createTask(taskData) {
    const response = await fetch(`${API_BASE_URL}/addtask`, {
      method: 'POST',
      headers,
      body: JSON.stringify(taskData)
    });
    return handleResponse(response);
  },

  // Update an existing task
  async updateTask(taskId, taskData) {
    const response = await fetch(`${API_BASE_URL}/updatetask`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ ...taskData, id: taskId })
    });
    return handleResponse(response);
  },

  // Delete a task
  async deleteTask(taskId) {
    const response = await fetch(`${API_BASE_URL}/deletetask`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id: taskId })
    });
    return handleResponse(response);
  },
};

export default taskService;
