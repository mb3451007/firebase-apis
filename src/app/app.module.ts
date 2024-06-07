import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { UpdateDataComponent } from './update-data/update-data.component';
import { UpdateFishDataComponent } from './update-fish-data/update-fish-data.component';
import { LoaderComponent } from './loader/loader.component';
import { BlogsComponent } from './blogs/blogs.component';
import { QuillConfigModule } from 'ngx-quill';
import { QuillModule } from 'ngx-quill';
import { UpdateBlogComponent } from './update-blog/update-blog.component';
import { CarComponent } from './car/car.component';
import { CarUpdateComponent } from './car-update/car-update.component';
import { MatTreeComponent } from './mat-tree/mat-tree.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    UpdateDataComponent,
    UpdateFishDataComponent,
    LoaderComponent,
    BlogsComponent,
    UpdateBlogComponent,
    CarComponent,
    CarUpdateComponent,
    MatTreeComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    QuillModule.forRoot(),
    BrowserAnimationsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    DragDropModule

  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
