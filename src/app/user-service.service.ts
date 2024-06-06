import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private updateList = new BehaviorSubject<any>(undefined);
  constructor() { }

  updateUserList(user:any){

    this.updateList.next(user);
  }

  getUserList(){
    return this.updateList;
  }

}
