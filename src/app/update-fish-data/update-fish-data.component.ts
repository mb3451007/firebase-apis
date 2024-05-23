import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Users } from '../user.model';

@Component({
  selector: 'app-update-fish-data',
  templateUrl: './update-fish-data.component.html',
  styleUrls: ['./update-fish-data.component.css'],
})
export class UpdateFishDataComponent {
  updateForm: FormGroup;
  fishId: any;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.updateForm = this.fb.group({
      date: [''],
      number_of_fish: [''],
      location: [''],
      fish_type: [],
    });
  }
  ngOnInit(): void {
    this.fishId = this.route.snapshot.paramMap.get('id');
    if (this.fishId) {
      this.userService.getAllData('fishing_data').subscribe((data: any) => {
        const Fish = data.find((u: Users) => u.id == this.fishId);
        if (Fish) {
          this.updateForm.patchValue({
            date: Fish.date,
            number_of_fish: Fish.number_of_fish,
            location: Fish.location,
            fish_type: Fish.fish_type,
          });
          console.log(this.updateForm.value, 'values of updated form');
        }
      });
    }
  }
  updateFish() {
    // if(this.updateForm.valid){
    try {
      console.log(this.fishId, 'this is userId for update method');
      this.userService.updateData('fishing_data',this.fishId,this.updateForm.value);
      console.log('User Data Update Successfully');
      this.router.navigate(['/register']);
    } catch (error) {
      console.error('ERROR updating User Date', error);
    }
  }
}
