import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { UserService } from '../services/user.service';
import { LoaderService } from '../services/loader.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit{
cars:any[]=[]
makes:string[]=['Honda','Toyota','Suzuki']
models:{[key:string]:string[]}={
Honda:['Civic','City','Accord'],
Toyota:['Carolla','Prado, ','Prius,'],
Suzuki:['Alto','Cultus','Swift']
};
years:number[]=Array.from({length:55},(_,i)=>1970 + i)
selectedMake:string='';
selectedModel:string='';
selectedYear:number=new Date().getFullYear();
isAccidented:string='no';
Insured:boolean=false;
token_Paid:boolean=false;
total_Genuine:boolean=false;
firstOwner:boolean=false;
// image:File |null =null;
image: string | ArrayBuffer | null = null;
createdAt:any;
showNotification:boolean=false
carPage = 1;
pageSize = 10;
lastcarDoc: any = null;
carId:any;
showError:boolean=false
carsForm:FormGroup;
constructor(private fireStore:AngularFirestore, private userService:UserService,private loaderService:LoaderService,private activeRouter:ActivatedRoute, private router:Router,private fb: FormBuilder,){
  this.carsForm = this.fb.group({
    make: ['',Validators.required],
    model: [''],
    year: ['',Validators.required],
    image: [''],
    isAccidented: ['',Validators.required],
    total_Genuine: [''],
    firstOwner: [''],
    token_Paid: [''],
    Insured: ['']
  });
}

 

ngOnInit(): void {
  this.carId=this.activeRouter.snapshot.paramMap.get('id');
  this.loadCarData();
  

}
onMakeChange(){
  this.selectedModel=''
  this.carsForm.patchValue({ model: '' });
}
onFileChange(event:any){
  const image=event.target.files[0];
  if(image){
  const Reader=new FileReader();
  Reader.readAsDataURL(image);
  Reader.onload=()=>{
    this.image=Reader.result;
  }
  }
}
onSubmit(){
  this.addCar();
  const formData={
    make:this.selectedMake,
    model:this.selectedModel,
    year:this.selectedYear,
    isAccidented:this.isAccidented,
    Insured: this.Insured,
    token_Paid: this.token_Paid,
    total_Genuine: this.total_Genuine,
    firstOwner: this.firstOwner,
    image: this.image
  }
  console.log(formData, 'this is carData we are entering');

}
addCar(){
  this.createdAt=firebase.firestore.FieldValue.serverTimestamp();
  console.log(this.createdAt, 'this is created at car Data'); 
  this.fireStore.collection('car').add({Insured:this.Insured,createdAt:this.createdAt,firstOwner:this.firstOwner,image:this.image,isAccidented:this.isAccidented,make:this.selectedMake,model:this.selectedModel,token_Paidd:this.token_Paid,total_Genuinee:this.total_Genuine,year:this.selectedYear}).then(()=>{
    console.log('car data saved successfully');
    
    this.createdAt=null;
    this.makes=[];
    this.years=[];
    this.image=null;
    this.firstOwner=false;
    this.firstOwner=false;
    this.token_Paid=false;
    this.Insured=false;
    this.isAccidented='';
    this.showNotification=true;
  })
  this.loadCarData();
}
loadCarData(){
  this.userService.getPaginatedData('car',this.pageSize,'createdAt',this.lastcarDoc).subscribe((data)=>{
   if(data.length){
    this.cars=this.cars.concat(data);
    console.log ('carsssss', this.cars)
    this.lastcarDoc=this.cars[this.cars.length -1].createdAt;
   }
   this.loaderService.hide()
  },
  e=>{
    console.log(e, 'error in loading cars data');
    
  }
)
}

// delete
deleteCar(carId: string, collectionName: string) {
  try {
    this.userService.deleteData(carId, collectionName);
    console.log('car Deleted successfully');
    this.cars=this.cars.filter(car=>{car.id==carId })
    // this.loadCarData();
  } catch (error) {
    console.error('Issue for Deleting blog', Error);
  }
}

async updateCarData(carId: string) {
  console.log ('iddddd', carId)
  this.router.navigate(['/update-car', carId]);
}

// get Blog by ID
async getCarById(carId: string, collectionName: string) {
  try {
    console.log('here');
    await this.userService.getDataById(carId, collectionName).subscribe((data: any) => {
     console.log(data, 'this is car  data by Id');});
  } catch (error) {
    console.error(error, 'Show search by id failed');
  }
}
loadMoreCars(){
  this.loadCarData();
}
}
