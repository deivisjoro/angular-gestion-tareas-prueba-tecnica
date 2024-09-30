import { createAction, props } from '@ngrx/store';
import { Person } from '../../models/person.model';

export const loadPersons = createAction(
  '[Person] Load Persons',
  props<{ persons: Person[] }>()  
);

export const addPerson = createAction(
  '[Person] Add Person',
  props<{ person: Person }>()
);

export const deletePerson = createAction(
  '[Person] Delete Person',
  props<{ personId: string }>()
);

export const updatePerson = createAction(
  '[Person] Update Person',
  props<{ person: Person }>()
);
