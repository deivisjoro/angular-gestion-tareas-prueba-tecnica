import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Task } from '../../../models/task.model';
import { updateTask } from '../../../store/tasks/task.actions'; 
import { Router, ActivatedRoute } from '@angular/router';
import { uniqueNameInFormArrayValidator } from '../validators/unique-name-in-form-array.validator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid'; 

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TaskEditComponent implements OnInit {
  taskForm: FormGroup;
  showPersonError: boolean = false;
  showSkillError: boolean = false;
  taskId: string | null = null;

  tasks$: Observable<Task[]> | undefined; 

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute  
  ) {
    console.log(1)
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      dueDate: ['', Validators.required],
      completed: [false],
      persons: this.fb.array([this.createPersonGroup()], { validators: uniqueNameInFormArrayValidator })
    });
  }

  ngOnInit(): void {

    this.tasks$ = this.store.select((state: any) => state.tasksState.tasks);

    console.log(this.tasks$ );
    
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id');
      if (this.taskId) {
        this.loadTaskData(this.taskId);
      }
    });
  }

  loadTaskData(taskId: string) {
    if (this.tasks$) {
      this.tasks$.pipe(
        map(tasks => tasks.find(task => task.id === taskId))
      ).subscribe(task => {
        if (task) {
          console.log(task)
          this.taskForm.patchValue({
            name: task.name,
            dueDate: task.dueDate,
            completed: task.completed
          });
          this.setPersons(task.persons);
        }
      });
    } else {
      console.error('tasks$ is undefined');
    }
  }

  setPersons(persons: any[]) {
    this.persons.clear();  
    persons.forEach(person => {
      const personGroup = this.fb.group({
        id: [person.id],
        fullName: [person.fullName, [Validators.required, Validators.minLength(5)]],
        age: [person.age, [Validators.required, Validators.min(18)]],
        skills: this.fb.array(person.skills.map((skill:any) => this.fb.group({
          skill: [skill.skill, Validators.required]
        })))
      });
      this.persons.push(personGroup);
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

    const updatedTask: Task = {
      id: this.taskId!,  
      name: this.taskForm.value.name,
      dueDate: this.taskForm.value.dueDate,
      completed: this.taskForm.value.completed,
      persons: this.taskForm.value.persons
    };

    this.store.dispatch(updateTask({ task: updatedTask }));  // Despachamos la acción para actualizar la tarea
    this.navigateToTaskList();
  }

  uniqueNameValidator(control: AbstractControl): { [key: string]: boolean } | null {
    // Lógica del validador
    return null; 
  }

  navigateToTaskList(): void {
    this.router.navigate(['/tasks']); 
  }
}
