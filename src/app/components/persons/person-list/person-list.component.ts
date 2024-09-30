import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Person } from '../../../models/person.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { deletePerson } from '../../../store/persons/person.actions';  

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
  persons$: Observable<Person[]> | undefined;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.persons$ = this.store.select((state: any) => state.personsState.persons);
  }

  navigateToAddPerson(): void {
    this.router.navigate(['/add-person']);
  }

  editPerson(person: Person): void {
    this.router.navigate(['/edit-person', person.id]); 
  }

  deletePerson(personId: string): void {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar a esta persona?');
    if (confirmDelete) {
      this.store.dispatch(deletePerson({ personId }));
    } 
  }
}
