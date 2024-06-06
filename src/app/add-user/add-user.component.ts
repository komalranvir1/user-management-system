import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PeriodicElement } from '../user-list/user-list.component';
import { UserServiceService } from '../user-service.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup;
  userData: any = {};
  dataSource: PeriodicElement[] = [

    { name: 'Hydrogen', email: "komal@gmail.com", role: 'Admin' }

  ];
  email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = '';
  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private dialog: MatDialog, private dialogRef: MatDialogRef<AddUserComponent>, private userService: UserServiceService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    })

  }
  ngOnInit(): void {
    const tempUser: string | null = localStorage.getItem('user');

    if (tempUser) {
      this.dataSource = JSON.parse(tempUser);

      // Ensure this.dataSource is an array
      if (!Array.isArray(this.dataSource)) {
        this.dataSource = [];
      }
    } else {
      // Handle the case where tempUser is null
      this.dataSource = [];
    }

    // this.paginateData();

    if (this.data) {
      this.userForm.patchValue(this.data);
    }
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
  Cancel() {
    this.router.navigateByUrl('')
  }



  save() {
    let paylode = {

      name: this.userForm.get('name')?.value,
      email: this.userForm.get('email')?.value,
      role: this.userForm.get('role')?.value,
    }
    this.dataSource.push(paylode);

    let user = JSON.stringify(this.dataSource);
    localStorage.setItem('user', user);
    this.userForm.reset();

    this.userService.updateUserList(paylode);
    this.dialogRef.close();
   
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }

}