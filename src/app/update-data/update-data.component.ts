import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Users } from '../user.model';

@Component({
  selector: 'app-update-data',
  templateUrl: './update-data.component.html',
  styleUrls: ['./update-data.component.css'],
})
export class UpdateDataComponent implements OnInit {
  updateForm: FormGroup;
  userId: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.updateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      Email: ['', Validators.required, Validators.email],
      Password: [Validators.required],
    });
  }
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.userService.getAllData('registration').subscribe((data: any) => {
        const user = data.find((u: Users) => u.id == this.userId);
        if (user) {
          this.updateForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            Email: user.Email,
            Password: user.Password,
          });
          console.log(this.updateForm.value, 'values of updated form');
        }
      });
    }
  }
  updateUser() {
    // if(this.updateForm.valid){
    try {
      console.log(this.userId, 'this is userId for update method');
      this.userService.updateData('registration',this.userId,this.updateForm.value);
      console.log('User Data Update Successfully');
      this.router.navigate(['/register']);
    } catch (error) {
      console.error('ERROR updating User Date', error);
    }
  }
}
