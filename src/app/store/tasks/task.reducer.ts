import { createReducer, on } from '@ngrx/store';
import { addTask, deleteTask, updateTask, loadTasks } from './task.actions';
import { Task } from '../../models/task.model';

export interface TaskState {
  tasks: Task[];
}

export const initialState: TaskState = {
  tasks: localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')!) : []
};

function saveToLocalStorage(state: TaskState) {
  localStorage.setItem('tasks', JSON.stringify(state.tasks));
}

export const taskReducer = createReducer(
  initialState,
  on(loadTasks, state => ({ ...state })),
  on(addTask, (state, { task }) => {
    const updatedState = {
      ...state,
      tasks: [...state.tasks, task]
    };
    saveToLocalStorage(updatedState); 
    return updatedState;
  }),
  on(deleteTask, (state, { taskId }) => {
    const updatedState = {
      ...state,
      tasks: state.tasks.filter(task => task.id !== taskId)
    };
    saveToLocalStorage(updatedState);  
    return updatedState;
  }),
  on(updateTask, (state, { task }) => {
    const updatedState = {
      ...state,
      tasks: state.tasks.map(t => t.id === task.id ? task : t)
    };
    saveToLocalStorage(updatedState); 
    return updatedState;
  })
);
