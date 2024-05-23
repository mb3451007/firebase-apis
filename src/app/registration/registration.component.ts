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

    // Get Data from data base
    try {
      // Get users data
      this.userService.getAllData('registration').subscribe((data: any) => {
        console.log('User data received by One Method:', data);
        this.users = data;
        this.apiResponseCounter++;
        this.checkAllResponsesReceived();
      });

      // Get fishing data
      this.userService.getAllData('fishing_data').subscribe((response: any) => {
        console.log('Fishing data received by One method:', response);
        this.fishingData = response;
        this.apiResponseCounter++;
        this.checkAllResponsesReceived();
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Add User Data
  registerData() {
    try {
      this.userService.addData('registration', this.registrationForm.value);
      console.log('User data added', this.registrationForm.value);
    } catch (error) {
      console.error('Error while adding Data:', error);
    }
  }
  // Add FIsh Data
  AddFishData() {
    try {
      this.userService.addData('fishing_data', this.fishForm.value);
      console.log('User data added', this.fishForm.value);
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
    } catch (error) {
      console.error('Issue for Deleting User', Error);
    }
  }

  // Get Data By Id
  async getDataById(Id: string, collectionName: string) {
    try {
      console.log('here');
      await this.userService
        .getDataById(Id, collectionName)
        .subscribe((data: any) => {
          console.log(data, 'this is data by Id');
        });
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
}
