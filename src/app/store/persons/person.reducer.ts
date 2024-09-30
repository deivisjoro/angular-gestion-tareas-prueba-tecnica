import { createReducer, on } from '@ngrx/store';
import { addPerson, deletePerson, updatePerson, loadPersons } from './person.actions';
import { Person } from '../../models/person.model';

export interface PersonState {
  persons: Person[];
}

export const initialState: PersonState = {
  persons: localStorage.getItem('persons') ? JSON.parse(localStorage.getItem('persons')!) : []
};

function saveToLocalStorage(state: PersonState) {
  localStorage.setItem('persons', JSON.stringify(state.persons));
}

export const personReducer = createReducer(
  initialState,
  on(loadPersons, state => ({ ...state })),
  on(addPerson, (state, { person }) => {
    const updatedState = {
      ...state,
      persons: [...state.persons, person]
    };
    saveToLocalStorage(updatedState); 
    return updatedState;
  }),
  on(deletePerson, (state, { personId }) => {
    const updatedState = {
      ...state,
      persons: state.persons.filter(person => person.id !== personId)
    };
    saveToLocalStorage(updatedState);  
    return updatedState;
  }),
  on(updatePerson, (state, { person }) => {
    const updatedState = {
      ...state,
      persons: state.persons.map(p => p.id === person.id ? person : p)
    };
    saveToLocalStorage(updatedState); 
    return updatedState;
  })
);
