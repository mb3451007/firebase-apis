import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { UserService } from '../services/user.service';
import { LoaderService } from '../services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  cars: any[] = [];
  makes: string[] = ['Honda', 'Toyota', 'Suzuki'];
  models: { [key: string]: string[] } = {
    Honda: ['Civic', 'City', 'Accord'],
    Toyota: ['Carolla', 'Prado', 'Prius'],
    Suzuki: ['Alto', 'Cultus', 'Swift']
  };
  years: number[] = Array.from({ length: 55 }, (_, i) => 1970 + i);
  selectedMake: string = '';
  selectedModel: string = '';
  selectedYear: number = new Date().getFullYear();
  isAccidented: string = 'No';
  Insured: boolean = false;
  token_Paid: boolean = false;
  total_Genuine: boolean = false;
  firstOwner: boolean = false;
  image: string | ArrayBuffer | null = null;
  createdAt: any;
  showNotification: boolean = false;
  pageSize = 10;
  lastcarDoc: any = null;
  carId: any;
  showError: boolean = false;
  errorMessage: string='';
  carsForm: FormGroup;

  constructor(
    private fireStore: AngularFirestore, 
    private userService: UserService,
    private loaderService: LoaderService, 
    private activeRouter: ActivatedRoute, 
    private router: Router, 
    private fb: FormBuilder
  ) {
    this.carsForm = this.fb.group({
      make: ['', Validators.required],
      model: [''],
      year: ['', Validators.required],
      image: [''],
      isAccidented: ['', Validators.required],
      Insured: [false],
      token_Paid: [false],
      total_Genuine: [false],
      firstOwner: [false]
    });
    console.log(this.carsForm.value,'these are cars froms values')
  }

  ngOnInit(): void {
    this.carId = this.activeRouter.snapshot.paramMap.get('id');
    this.loadCarData();
  }

  onMakeChange() {
    this.carsForm.patchValue({ model: '' });
  }


  onFileChange(event: any) {
    const image = event.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        this.image = reader.result;
        this.carsForm.patchValue({ image: this.image });  // Update the form control
      }
    }
  }

  
  
  addCar() {
    if (!this.carsForm.valid) {
      this.showError = true;
      return;
    }
    const formValues = this.carsForm.value;
    formValues.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    this.fireStore.collection('car').add(formValues).then(() => {
      this.loadCarData();
      this.carsForm.reset();
      this.showError = false;
    }).catch((error: any) => {
      if (error && error.message) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'An error occurred while uploading the image';
      }
    });
  }
  
  loadCarData() {
    this.userService.getPaginatedData('car', this.pageSize, 'createdAt', this.lastcarDoc).subscribe((data) => {
      if (data.length) {
        data.forEach(car => {
          if (car.createdAt && car.createdAt.seconds) {
            car.createdAt = new Date(car.createdAt.seconds * 1000);
          }
        });
        this.cars = this.cars.concat(data);
        console.log('carsssss', this.cars)
        this.lastcarDoc = this.cars[this.cars.length - 1].createdAt;
      }
      this.loaderService.hide()
    },
    e => {
      console.log(e, 'error in loading cars data');
    });
  }

  deleteCar(carId: string, collectionName: string) {
    try {
      this.userService.deleteData(carId, collectionName);
      console.log('car Deleted successfully');
      this.loadCarData();
      // this.cars = this.cars.filter(car => car.id == carId);
    } catch (error) {
      console.error('Issue for Deleting blog', Error);
    }
  }

  async updateCarData(carId: string) {
    console.log('iddddd', carId)
    this.router.navigate(['/update-car', carId]);
  }

  async getCarById(carId: string, collectionName: string) {
    try {
      console.log('here');
      await this.userService.getDataById(carId, collectionName).subscribe((data: any) => {
        console.log(data, 'this is car  data by Id');
      });
    } catch (error) {
      console.error(error, 'Show search by id failed');
    }
  }

  loadMoreCars() {
    this.loadCarData();
  }
}
