import { Person } from './person.model';

export interface Task {
    id: string;
    name: string;
    dueDate: string;
    completed: boolean;
    persons: Person[];
}
