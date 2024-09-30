import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation  } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { taskReducer } from './store/tasks/task.reducer';
import { personReducer } from './store/persons/person.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withHashLocation()), 
    provideStore({ tasksState: taskReducer, personsState: personReducer }), 
    provideEffects(), 
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
