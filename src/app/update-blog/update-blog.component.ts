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
export class UpdateBlogComponent implements OnInit, OnDestroy {
  blogForm: FormGroup;
  blogId: any;
  editorContent: string = '';
  imageUrl: string | ArrayBuffer | null = null;
  showNotification: boolean = false;
  showImage = false;

  constructor(
    private fireStore: AngularFirestore,
    private loaderService: LoaderService,
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.blogForm = this.fb.group({
      description: [''],
      image: [''],
      created_at: [''],
    });
  }

  ngOnInit(): void {
    this.blogId = this.activeRoute.snapshot.paramMap.get('id');
    if (this.blogId) {
      this.userService.getAllData('blogs').subscribe((data: any) => {
        const blog = data.find((u: any) => u.id == this.blogId);
        if (blog) {
          this.blogForm.patchValue({
            editorContent: blog.editorContent,
            image: blog.imageUrl,
            created_at: blog.createdAt,
          });
          this.editorContent = blog.editorContent;
          this.imageUrl = blog.imageUrl;
        }
      });
    }
  }

  ngOnDestroy(): void {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.blogForm.patchValue({ image: this.imageUrl });
      };
    }
  }

  toggleFullscreen() {
    this.showImage = !this.showImage;
  }

  updateBlog() {
    if (!this.editorContent || !this.imageUrl) {
      console.error("Description or image not provided.");
      return;
    } else {
      this.fireStore.collection('blogs').doc(this.blogId).update({
        editorContent: this.editorContent,
        imageUrl: this.imageUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        setTimeout(() => {
          this.showNotification = true;
        }, 1);
        this.router.navigate(['/blogs']);
      }).catch((error: any) => {
        console.error("Error updating blog:", error);
      });
    }
  }
}
