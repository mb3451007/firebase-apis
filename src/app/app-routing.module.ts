import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { UpdateDataComponent } from './update-data/update-data.component';
import { UpdateFishDataComponent } from './update-fish-data/update-fish-data.component';

const routes: Routes = [
  { path: 'register', component: RegistrationComponent },
  { path: 'update-user/:id', component: UpdateDataComponent },
  { path: 'update-fish/:id', component: UpdateFishDataComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
