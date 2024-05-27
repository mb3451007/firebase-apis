import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoaderService } from '../services/loader.service';
import { UserService } from '../services/user.service';
import firebase from 'firebase/compat/app';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-blog',
  templateUrl: './update-blog.component.html',
  styleUrls: ['./update-blog.component.css']
})
export class UpdateBlogComponent implements OnInit ,OnDestroy {
    blogForm: FormGroup;
    blogId: any;
    usersPage = 1;
    fishPage = 1;
    pageSize = 10;
    lastUserDoc: any = null;
    lastFishDoc: any = null;
    blogs: any[] = [];
  
  
    editorContent: string = '';
    html = '';
    showNotification:boolean=false
    // description:string="";
    imageUrl: string | ArrayBuffer | null = null;
    showImage = false;
  constructor(private fireStore:AngularFirestore,private loaderService:LoaderService,private  userService:UserService,private router: Router,private activeRoute: ActivatedRoute,private fb: FormBuilder){
    this.blogForm=this.fb.group({
      description:[''],
      image:[''],
      created_at:[''],
    })
  }
   ngOnInit(): void {
    this.loadBlogsData();
    this.blogId = this.activeRoute.snapshot.paramMap.get('id');
    if (this.blogId) {
      this.userService.getAllData('blogs').subscribe((data: any) => {
        const blogs = data.find((u: any) => u.id == this.blogId);
        if (blogs) {
          this.blogForm.patchValue({
            description: blogs.description,
            image: blogs.image,
            created_at: blogs.created_at,
            
          });
          console.log(this.blogForm.value, 'values of updated form');
        }
      });
    }
  }
  ngOnDestroy(): void {
    ;
  }
    onFileSelected(event: any) {
      const file: File = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageUrl = reader.result;
        };
      }
    }
  
    toggleFullscreen() {
      this.showImage = !this.showImage;
    }
    saveBlog() {
      if (!this.editorContent || !this.imageUrl) {
        console.error("Description or image not provided.");
        return;
        
      }
      else{
      // save Created in Data base too
      const createdAt = firebase.firestore.FieldValue.serverTimestamp();
  
    // Add the blog to the database
    this.fireStore.collection('blogs').add({editorContent: this.editorContent,imageUrl: this.imageUrl,createdAt:createdAt}).then(() => {
      setTimeout(() => {
        this.showNotification=true;
      },1);
      // Reset fields after saving
      this.editorContent = '';
      this.imageUrl = null;
    }).catch((error:any) => {
      console.error("Error saving blog:", error);
    });
  }
  }
  // geting blogs data 
  
  
  // Load Fish Data
  
  loadBlogsData() {
    this.userService.getPaginatedData('blogs', this.pageSize,'description', this.lastUserDoc).subscribe((data:any) => {
      if (data.length) {
        this.blogs = this.blogs.concat(data);
        this.lastUserDoc = this.blogs[this.blogs.length - 1].description;
      }
      console.log ('Blogs Data', data)
      this.loaderService.hide();
    }, e => {
      console.log ('error', e)
    });
  }
 

  // ??????????????????????????????????

  updateBlog() {
    // if(this.updateForm.valid){
    try {
      console.log(this.blogId, 'this is blogId for update blog');
      this.userService.updateData('registration',this.blogId,this.blogForm.value);
      console.log('User Data Update Successfully');
      this.router.navigate(['/blogs']);
    } catch (error) {
      console.error('ERROR updating User Date', error);
    }
  }
}
