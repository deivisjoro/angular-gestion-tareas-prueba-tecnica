import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskCreateComponent } from './components/tasks/task-create/task-create.component';
import { TaskEditComponent } from './components/tasks/task-edit/task-edit.component';
import { PersonListComponent } from './components/persons/person-list/person-list.component';
import { PersonFormComponent } from './components/persons/person-form/person-form.component';
import { PersonEditComponent } from './components/persons/person-edit/person-edit.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'tasks', component: TaskListComponent },
    { path: 'create-task', component: TaskCreateComponent },    
    { path: 'edit-task/:id', component: TaskEditComponent },
    { path: 'persons', component: PersonListComponent },
    { path: 'add-person', component: PersonFormComponent },
    { path: 'edit-person/:id', component: PersonEditComponent }
];
