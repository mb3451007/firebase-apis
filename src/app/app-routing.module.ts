import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { UpdateDataComponent } from './update-data/update-data.component';
import { UpdateFishDataComponent } from './update-fish-data/update-fish-data.component';
import { BlogsComponent } from './blogs/blogs.component';
import { UpdateBlogComponent } from './update-blog/update-blog.component';
import { CarComponent } from './car/car.component';
import { CarUpdateComponent } from './car-update/car-update.component';
import { MatTreeComponent } from './mat-tree/mat-tree.component';

const routes: Routes = [
  { path: 'register', component: RegistrationComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'car', component: CarComponent },
  { path: 'mat-tree', component: MatTreeComponent },
  { path: 'update-user/:id', component: UpdateDataComponent },
  { path: 'update-fish/:id', component: UpdateFishDataComponent },
  { path: 'update-blog/:id', component: UpdateBlogComponent },
  { path: 'update-car/:id', component: CarUpdateComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
