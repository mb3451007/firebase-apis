import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-car-update',
  templateUrl: './car-update.component.html',
  styleUrls: ['./car-update.component.css']
})
export class CarUpdateComponent implements OnInit {
  makes: string[] = ['Honda', 'Toyota', 'Suzuki'];
  models: { [key: string]: string[] } = {
    Honda: ['Civic', 'City', 'Accord'],
    Toyota: ['Corolla', 'Prado', 'Prius'],
    Suzuki: ['Alto', 'Cultus', 'Swift']
  };
  years: number[] = Array.from({ length: 55 }, (_, i) => 1970 + i);

  carForm: FormGroup;
  image: string | ArrayBuffer | null = null;
  carId: any;
  showNotification = false;

  constructor(
    private fireStore: AngularFirestore,
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.carForm = this.fb.group({
      make: [''],
      model: [''],
      year: [''],
      image: [''],
      isAccidented: [''],
      total_Genuine: [''],
      firstOwner: [''],
      token_Paid: [''],
      Insured: ['']
    });
  }

  ngOnInit(): void {
    this.carId = this.activeRoute.snapshot.paramMap.get('id');
    if (this.carId) {
      this.userService.getAllData('car').subscribe((data: any) => {
        const car = data.find((u: any) => u.id === this.carId);
        if (car) {
          this.carForm.patchValue({
            make: car.make,
            model: car.model,
            year: car.year,
            isAccidented: car.isAccidented,
            total_Genuine: car.total_Genuine,
            firstOwner: car.firstOwner,
            token_Paid: car.token_Paid,
            Insured: car.Insured
          });
          this.image = car.image;
        }
      });
    }
  }

  onMakeChange() {
    this.carForm.get('model')?.setValue('');
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.image = e.target.result;
      this.carForm.get('image')?.setValue(this.image);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  updateCar() {
    if (this.carForm.invalid) {
      console.error("Form is invalid.");
      return;
    }

    this.fireStore.collection('car').doc(this.carId).update({
      make: this.carForm.value.make,
      model: this.carForm.value.model,
      year: this.carForm.value.year,
      isAccidented: this.carForm.value.isAccidented,
      total_Genuine: this.carForm.value.total_Genuine,
      firstOwner: this.carForm.value.firstOwner,
      token_Paid: this.carForm.value.token_Paid,
      Insured: this.carForm.value.Insured,
      image: this.image,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      this.showNotification = true;
      this.router.navigate(['/car']);
    }).catch((error: any) => {
      console.error("Error updating car data:", error);
    });
  }
}
