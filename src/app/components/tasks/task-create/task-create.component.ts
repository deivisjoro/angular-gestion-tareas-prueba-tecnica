import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Task } from '../../../models/task.model';
import { addTask } from '../../../store/tasks/task.actions';
import { v4 as uuidv4 } from 'uuid'; 
import { Router } from '@angular/router';
import { uniqueNameInFormArrayValidator } from '../validators/unique-name-in-form-array.validator';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TaskCreateComponent {
  taskForm: FormGroup;
  showPersonError: boolean = false;
  showSkillError: boolean = false;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      dueDate: ['', Validators.required],
      completed: [false],
      persons: this.fb.array([this.createPersonGroup()], { validators: uniqueNameInFormArrayValidator })
    });
  }

  createPersonGroup(): FormGroup {
    return this.fb.group({
      id: [uuidv4()], 
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: this.fb.array([this.createSkillGroup()])
    });
  }

  createSkillGroup(): FormGroup {
    return this.fb.group({
      skill: ['', Validators.required] 
    });
  }

  get persons(): FormArray {
    return this.taskForm.get('persons') as FormArray;
  }

  getSkills(personIndex: number): FormArray {
    return (this.persons.at(personIndex).get('skills') as FormArray);
  }

  addPerson() {
    this.showPersonError = false;
    this.persons.push(this.createPersonGroup());
  }

  removePerson(index: number) {
    if (this.persons.length > 1) {
      this.persons.removeAt(index);
    } else {
      this.showPersonError = true;
    }
  }  

  addSkill(personIndex: number) {
    const skillsArray = this.getSkills(personIndex);
    skillsArray.push(this.createSkillGroup());
  }

  removeSkill(personIndex: number, skillIndex: number) {
    const skillsArray = this.getSkills(personIndex);
    if (skillsArray.length > 1) {
      skillsArray.removeAt(skillIndex);
    } else {
      this.persons.at(personIndex).get('skills')?.setErrors({ noSkill: true });
    }
  }

  onSubmit() {

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    
    const newTask: Task = {
      id: uuidv4(),
      name: this.taskForm.value.name,
      dueDate: this.taskForm.value.dueDate,
      completed: this.taskForm.value.completed,
      persons: this.taskForm.value.persons
    };

    this.store.dispatch(addTask({ task: newTask }));
    this.navigateToTaskList();
    
  }

  uniqueNameValidator(control: AbstractControl): { [key: string]: boolean } | null {
    console.log('Validando control:', control); 
    console.log('Control Value (Nombre):', control.value);
  
    if (!control || !control.parent || !control.parent.parent) {
      console.log('El control no tiene la estructura esperada (parent o parent.parent es null).');
      return null; 
    }
  
    const fullName = control.value?.trim().toLowerCase(); 
    console.log('Nombre normalizado:', fullName);
  
    const formArray = control.parent.parent.get('persons') as FormArray;
    console.log('FormArray obtenido:', formArray);
  
    if (formArray && Array.isArray(formArray.controls)) {
      console.log('Lista de controles en FormArray:', formArray.controls);
  
      const names = formArray.controls
        .filter(group => group !== control.parent) 
        .map(group => group.get('fullName')?.value?.trim().toLowerCase()); 
  
      console.log('Lista de nombres en el array:', names); 
  
      const duplicate = names.includes(fullName);
      console.log('¿Hay duplicado?:', duplicate);
  
      return duplicate ? { uniqueName: true } : null;
    }
  
    console.log('El array de personas no se encontró o no tiene controles.');
    return null;
  }
  
  
  
  
  

  get name() {
    return this.taskForm.get('name');
  }

  get dueDate() {
    return this.taskForm.get('dueDate');
  }

  navigateToTaskList(): void {
    this.router.navigate(['/tasks']); 
  }
}
