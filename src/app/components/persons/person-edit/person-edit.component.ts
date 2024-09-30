import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Person } from '../../../models/person.model';
import { updatePerson } from '../../../store/persons/person.actions';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-person',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.css']
})
export class PersonEditComponent implements OnInit {
  personForm: FormGroup;
  personId: string | undefined;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store,
    private router: Router
  ) {
    this.personForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: this.fb.array([this.fb.control('', Validators.required)])
    });
  }

  ngOnInit(): void {
    this.personId = this.route.snapshot.paramMap.get('id') || undefined;
    console.log(this.personId)
    this.store.select((state: any) => state.personsState.persons).subscribe((persons: Person[]) => {
      const personToEdit = persons.find(p => p.id === this.personId);
      if (personToEdit) {
        this.personForm.patchValue({
          fullName: personToEdit.fullName,
          age: personToEdit.age,
          skills: personToEdit.skills || []
        });
        this.skills.clear();  
        personToEdit.skills.forEach(skill => {
          this.skills.push(this.fb.control(skill, Validators.required));
        });
      }
    });
  }

  get skills(): FormArray {
    return this.personForm.get('skills') as FormArray;
  }

  addSkill(): void {
    this.skills.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  onSubmit(): void {
    if (this.personForm.valid && this.personId !== undefined) {
      const updatedPerson: Person = {
        id: this.personId,
        ...this.personForm.value
      };
      this.store.dispatch(updatePerson({ person: updatedPerson }));
      this.router.navigate(['/persons']);  
    }
  }

  navigateToPersonList(): void {
    this.router.navigate(['/persons']);
  }
}
