import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  constructor() {}
  show() {
    console.log('loader true');
    this.isLoading.next(true);
  }
  hide() {
    console.log('loader false');
    this.isLoading.next(false);
  }
}
