import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators'; 
import { updateTask, deleteTask } from '../../../store/tasks/task.actions';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  
  tasks$: Observable<Task[]> = of([]); 
  allTasks$: Observable<Task[]> = of([]);

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.allTasks$ = this.store.select((state: any) => state.tasksState.tasks);
    this.tasks$ = this.allTasks$;
  }

  filterTasks(filter: string): void {
    this.tasks$ = this.allTasks$.pipe(
      map(tasks => {
        if (filter === 'completed') {
          return tasks.filter(task => task.completed);
        } else if (filter === 'pending') {
          return tasks.filter(task => !task.completed);
        }
        return tasks;  
      })
    );
  }

  formatSkills(person: any): string {
    return person.skills?.map((skill: any) => skill.skill).join(', ') || 'Sin habilidades';
  }

  toggleTaskStatus(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };  
    this.store.dispatch(updateTask({ task: updatedTask }));
  }

  confirmDeleteTask(task: Task): void {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.name}"?`);
    if (confirmed) {
      this.store.dispatch(deleteTask({ taskId: task.id })); 
    }
  }

  navigateToCreateTask(): void {
    this.router.navigate(['/create-task']);
  }

  navigateToEditTask(taskId: string): void {
    this.router.navigate([`/edit-task/${taskId}`]);  
  }
}
