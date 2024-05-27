import { Component, OnDestroy,OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { LoaderService } from '../services/loader.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit ,OnDestroy {
  blogId:any;
  usersPage = 1;
  fishPage = 1;
  pageSize = 10;
  lastUserDoc: any = null;
  lastFishDoc: any = null;
  blogs: any[] = [];
  editorContent: string = '';
  html = '';
  showNotification:boolean=false
  description:string="";
  imageUrl: string | ArrayBuffer | null = null;
  showImage = false;
  createdAt: any;
constructor(private fireStore:AngularFirestore,private loaderService:LoaderService,private  userService:UserService,private router:Router,private activeRoute:ActivatedRoute){}
ngOnInit(){
this.blogId=this.activeRoute.snapshot.paramMap.get('id')
  this.loadBlogsData();
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

  convertIntoDate(timeStamp: any) {
    const milliseconds = (timeStamp.seconds * 1000) + (timeStamp.nanoseconds / 1000000);
    return new Date(milliseconds);

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
    this.createdAt = firebase.firestore.FieldValue.serverTimestamp();

  // Add the blog to the database
  this.fireStore.collection('blogs').add({editorContent: this.editorContent,imageUrl: this.imageUrl,createdAt:this.createdAt}).then(() => {
      this.showNotification=true;
    // Reset fields after saving
    this.editorContent = '';
    this.imageUrl = null;
    this.createdAt = null;
  }).catch((error:any) => {
    console.error("Error saving blog:", error);
  });
}
}
// geting blogs data 


// Load Fish Data

loadBlogsData() {
  this.userService.getPaginatedData('blogs', this.pageSize,'createdAt', this.lastUserDoc).subscribe((data:any) => {
    if (data.length) {
      this.blogs = this.blogs.concat(data);
      this.lastUserDoc = this.blogs[this.blogs.length - 1].createdAt;
      console.log ('lasttttt', this.lastUserDoc)
    }
    console.log ('Blogs Data', data)
    this.loaderService.hide();
  }, e => {
    console.log ('error', e)
  });
}

async deleteBlog(blogId: string, collectionName: string) {
  try {
    await this.userService.deleteData(blogId, collectionName);
    console.log('blog Deleted successfully');
  } catch (error) {
    console.error('Issue for Deleting blog', Error);
  }
}

// get Blog by ID
async getBlogById(blogId: string, collectionName: string) {
  try {
    console.log('here');
    await this.userService.getDataById(blogId, collectionName).subscribe((data: any) => {
        console.log(data, 'this is data by Id');});
  } catch (error) {
    console.error(error, 'Show search by id failed');
  }
}

// update Blog Data
  async updateBlogData(blogId: string) {
    this.router.navigate(['/update-blog', blogId]);
  }
  loadMoreBlogs(){
    this.loadBlogsData();
  }
}

