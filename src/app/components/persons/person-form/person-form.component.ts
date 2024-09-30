import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { addPerson } from '../../../store/persons/person.actions';
import { ReactiveFormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { Person } from '../../../models/person.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {
  personForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {
    this.personForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: this.fb.array([this.fb.control('', Validators.required)]) 
    });
  }

  ngOnInit(): void {
  }

  get skills(): FormArray {
    return this.personForm?.get('skills') as FormArray;
  }

  addSkill(): void {
    this.skills.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  onSubmit(): void {

    if (this.skills.length === 0) {
      return;
    }

    if (this.personForm.invalid || this.hasInvalidSkills()) {
      this.markAllSkillsAsTouched();
      return;
    }

    const newPerson: Person = {
      id: uuidv4(), 
      ...this.personForm.value
    };

    this.store.dispatch(addPerson({ person: newPerson }));
    this.navigateToPersonList();
  }

  hasInvalidSkills(): boolean {
    return this.skills.controls.some(skillControl => skillControl.invalid);
  }

  markAllSkillsAsTouched(): void {
    Object.keys(this.personForm.controls).forEach(field => {
      const control = this.personForm.get(field);
      if (control instanceof FormArray) {
        control.controls.forEach(skillControl => skillControl.markAsTouched());
      } else {
        control?.markAsTouched();
      }
    });
  }

  navigateToPersonList(): void {
    this.router.navigate(['/persons']); 
  }
}
