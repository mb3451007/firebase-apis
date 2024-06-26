import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  usersPage = 1;
  fishPage = 1;
  pageSize = 10;
  lastUserDoc: any = null;
  lastFishDoc: any = null;


  showUser=true;
  fishForm: FormGroup;
  registrationForm: FormGroup;
  userId: any;
  private apiResponseCounter = 0;
  usersinfo: any[] = [];
  fishinfo: any[] = [];
  fishingData: any[] = [];
  addedData: any[] = [];
  users: any[] = [];
  // firstName: string = '';
  // lastName: string = '';
  // Email: string = '';
  // Password: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private loaderService: LoaderService
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      Email: ['', Validators.required],
      Password: ['', Validators.required],
    });

    this.fishForm = this.fb.group({
      date: ['', Validators.required],
      number_of_fish: ['', Validators.required],
      location: ['', Validators.required],
      fish_type: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.loaderService.show();
    this.userId = this.activeRoute.snapshot.paramMap.get('id');
    console.log(this.userId, 'User id for Delete Button');
    this.loadUserData();
    this.loadFishingData();

    // Get Data from data base

    // try {
    //   Get users data
    //   this.userService.getAllData('registration').subscribe((data: any) => {
    //     console.log('User data received by One Method:', data);
    //     this.users = data;
    //     this.apiResponseCounter++;
    //     this.checkAllResponsesReceived();
    //   });

      // Get fishing data
    //   this.userService.getAllData('fishing_data').subscribe((response: any) => {
    //     console.log('Fishing data received by One method:', response);
    //     this.fishingData = response;
    //     this.apiResponseCounter++;
    //     // this.checkAllResponsesReceived();/
    //   });
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  }
  
  // Add User Data
  registerData() {
    try {
      this.userService.addData('registration', this.registrationForm.value);
      console.log('User data added', this.registrationForm.value);
      this.registrationForm.reset();
      this.loadUserData(true);
    } catch (error) {
      console.error('Error while adding Data:', error);
    }
  }
  // Add FIsh Data
  AddFishData() {
    try {
      this.userService.addData('fishing_data', this.fishForm.value);
      console.log('User data added', this.fishForm.value);
      this.fishForm.reset();
      this.loadFishingData(true);
    } catch (error) {
      console.error('Error while adding Data:', error);
    }
  }

  // Update Data
  async updateUserData(userId: string) {
    this.router.navigate(['/update-user', userId]);
  }
  async updateFishData(fishId: string) {
    this.router.navigate(['/update-fish', fishId]);
  }

  // Loader

  checkAllResponsesReceived() {
    if (this.apiResponseCounter === 2) {
      this.loaderService.hide();
    }
  }

  // Delete Data

  async deleteData(userId: string, collectionName: string) {
    try {
      await this.userService.deleteData(userId, collectionName);
      console.log('User Deleted successfully');
      this.loadUserData(true);
      this.loadFishingData(true);
    } catch (error) {
      console.error('Issue for Deleting User', Error);
    }
  }

  // Get Data By Id
  async getDataById(Id: string, collectionName: string) {
    try {
      console.log('here');
      await this.userService.getDataById(Id, collectionName).subscribe((data: any) => {
          console.log(data, 'this is data by Id');});
    } catch (error) {
      console.error(error, 'Show search by id failed');
    }
  }
  openFish() {
    this.showUser = false;
  }

  openUser() {
    this.showUser = true;
  }


// Pagination of Data

loadUserData(clearData: boolean = false) {
  if (clearData) {
    this.users = [];
    console.log(this.users,'checking multiple calls');
    this.lastUserDoc = null;
  }
  this.loaderService.show();
  this.userService.getPaginatedData('registration', this.pageSize,'Email', this.lastUserDoc).subscribe((data:any) => {
    if (data.length) {
      this.users = this.users.concat(data);
      this.lastUserDoc = this.users[this.users.length - 1].Email;
    }
    console.log ('Users Data', data)
    this.loaderService.hide();
  }, e => {
    console.log ('error', e)
  });
}

// Load Fish Data

loadFishingData(clearData: boolean = false) {
  if (clearData) {
    this.users = [];
    this.lastUserDoc = null;
  }
  this.loaderService.show();
  this.userService.getPaginatedData('fishing_data', this.pageSize,'location', this.lastUserDoc).subscribe((data:any) => {
    if (data.length) {
      this.fishingData = this.fishingData.concat(data);
      this.lastUserDoc = this.fishingData[this.fishingData.length - 1].location;
    }
    console.log ('Fish Data data', data)
    this.loaderService.hide();
  }, (e: any) => {
    console.log ('error', e)
  });
}

loadMoreUsers() {
  this.usersPage++;
  this.loadUserData();
}

loadMoreFish() {
  this.fishPage++;
  this.loadFishingData();
}

// Filters Users
filterUsers(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const filterValue = inputElement.value;
  this.loaderService.show();
  this.userService.filterData('registration', 'Email', filterValue).subscribe((data: any) => {
    this.users = data;
    console.log('Filtered Users Data', data);
    this.loaderService.hide();
  }, e => {
    console.log('error', e);
    this.loaderService.hide();
  });
}

filterFish(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const filterValue = inputElement.value;
  this.loaderService.show();
  this.userService.filterData('fishing_data', 'location', filterValue).subscribe((data: any) => {
    this.fishingData = data;
    console.log('Filtered Fish Data', data);
    this.loaderService.hide();
  }, e => {
    console.log('error', e);
    this.loaderService.hide();
  });
}

}
