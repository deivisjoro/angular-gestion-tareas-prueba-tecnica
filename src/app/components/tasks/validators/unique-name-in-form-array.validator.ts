import { AbstractControl, ValidationErrors, FormArray, FormGroup } from '@angular/forms';

export function uniqueNameInFormArrayValidator(formArray: AbstractControl): ValidationErrors | null {
  if (!(formArray instanceof FormArray)) {
    return null;  
  }

  const names = formArray.controls
    .map((group: AbstractControl) => (group as FormGroup).controls['fullName'].value?.trim().toLowerCase());

  const hasDuplicate = names.some((name, index) => names.indexOf(name) !== index);

  console.log('Nombres en el array para validar duplicados:', names);
  console.log('¿Hay duplicado?:', hasDuplicate);

  return hasDuplicate ? { uniqueName: true } : null;
}
