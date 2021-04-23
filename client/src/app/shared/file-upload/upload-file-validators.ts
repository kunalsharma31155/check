import { FormControl, FormGroup } from '@angular/forms';
import { pipe } from 'rxjs';
import { HttpErrorResponse, HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { filter, map, tap } from 'rxjs/operators';
// import { clearLine } from 'readline';



export function requiredFileType(type: string) {
  return function (control: FormControl) {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();
      if (type.toLowerCase() !== extension.toLowerCase()) {
        return {
          requiredFileType: true
        };
      }

      return null;
    }

    return null;
  };
}

export function uploadProgress<T>(cb: (progress: number) => void) {
  return tap((event: HttpEvent<T>) => {
    if (event.type === HttpEventType.UploadProgress) {
      cb(Math.round((100 * event.loaded) / event.total));
    }
  });
}

export function toResponseBody<T>() {
  return pipe(
    filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
    map((res: HttpResponse<T>) => res.body)
  );
}

export function markAllAsDirty(form: FormGroup) {
  for (const control of Object.keys(form.controls)) {
    form.controls[control].markAsDirty();
  }
}

export function toFormData<T>(formValue: T) {
  const formData = new FormData();

  for (const key of Object.keys(formValue)) {
    let value = formValue[key];
    formData.append(key, value);
  }
  return formData;
}

export function toFormDataForCollection<T>(formValue: T) {
  const formData = new FormData();

  for (const key of Object.keys(formValue)) {
    const value = formValue[key];
    if (Array.isArray(value)) {
      for (const key of Object.keys(value)) {
        if (value[key].image) {
          formData.append('images[]', value[key].image);
          formData.append('fileName[]', value[key].fileName);
        }
      }
    }
    formData.append(key, value);
  }
  return formData;
}
