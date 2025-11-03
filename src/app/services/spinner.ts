import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  
  showSpinner() {
    this.loadingSubject.next(true);
    setTimeout(() => {
      this.loadingSubject.next(false);
    }, 2000); // 2 secondz
  }
}