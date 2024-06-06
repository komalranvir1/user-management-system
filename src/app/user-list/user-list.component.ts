import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';
import { UserServiceService } from '../user-service.service';

//import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
export interface PeriodicElement {
  name: string;
  // id: number;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})

export class UserListComponent implements OnInit {
  isFormVisible: boolean = false;

  displayedColumns: string[] = ['name', 'email', 'role', 'symbol'];
  dataSource: PeriodicElement[] = [

    { name: 'Hydrogen', email: "komal@gmail.com", role: 'Admin' }

  ];

  p = 2;

  filtredData: any = [];
  email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = '';
  userForm: FormGroup;

  @ViewChild('confirmDialogTemplate') confirmDialogTemplate!: TemplateRef<any>;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // dataSource = new MatTableDataSource<PeriodicElement>(dataSource);

  paginatedData: PeriodicElement[] = [];
  pageSize = 5;
  currentPage = 0;
  tempUserEdit: any;
  size = 2;
  pageIndex = 0;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private userService: UserServiceService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    })

    this.userService.getUserList().subscribe((res: any) => {
      if (res) {
        if (this.tempUserEdit) {
          let tempUsers: any = localStorage.getItem('user');
          this.dataSource = JSON.parse(tempUsers);
          this.dataSource = this.dataSource.filter(x => x != this.tempUserEdit);
          this.tempUserEdit = null;
          let user = JSON.stringify(this.dataSource);
          localStorage.setItem('user', user);
        }
        let tempUsers: any = localStorage.getItem('user');
        this.dataSource = JSON.parse(tempUsers);
        this.filtredData = this.dataSource.slice();
        this.paginateData();
      }
    })
  }



  ngOnInit(): void {

    let tempUsers: any = localStorage.getItem('user');
    this.dataSource = JSON.parse(tempUsers);
    this.filtredData = this.dataSource.slice();
    this.paginateData();

    let tempUser: string | null = localStorage.getItem('user');

    if (tempUser) {
      this.dataSource = JSON.parse(tempUser);

      // If dataSource is an array, perform the slice
      if (Array.isArray(this.dataSource)) {
        this.filtredData = this.dataSource.slice();
      } else {
        this.filtredData = [];
      }
    } else {
      // Handle the case where tempUser is null
      this.dataSource = [];
      this.filtredData = [];
    }
    // this.dataSource.paginator = this.paginator;


    this.paginateData();

  }

  search(query: any) {
    // Convert the query to lowercase for case-insensitive search
    if (!query) {
      this.filtredData = this.dataSource;
      return;
    }
    const lowerCaseQuery = query.target.value.toLowerCase();

    this.filtredData = this.dataSource.filter(element => {

      // Check if the element contains any of the search criteria
      return (element.name && element.name.toLowerCase().includes(lowerCaseQuery)) ||
        (element.email && element.email.toLowerCase().includes(lowerCaseQuery)) ||
        (element.role && element.role.toLowerCase().includes(lowerCaseQuery));
    });

    this.currentPage = 0;
    this.paginateData();
  }

  openAddUserDialog(data: any = null): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '400px',
      data: data // Pass data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openConfirmationDialog(data: any = null): void {
    const dialogRef = this.dialog.open(this.confirmDialogTemplate);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Perform delete action
        this.delete(data);
      }
    });
  }

  edit(user: any): void {

    this.tempUserEdit = user;
    this.openAddUserDialog(user);
  }
  confirmDelete(user: any): void {
    this.openConfirmationDialog(user);
  }

  delete(data: any) {
    this.dataSource = this.dataSource.filter(datas => datas != data);
    let user = JSON.stringify(this.dataSource)
    localStorage.setItem('user', user);
    this.ngOnInit();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.paginateData();
  }

  paginateData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filtredData.slice(startIndex, endIndex);

  }

  openConfirmationModal(): void {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }



}

