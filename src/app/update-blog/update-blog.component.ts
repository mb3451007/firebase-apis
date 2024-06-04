import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoaderService } from '../services/loader.service';
import { UserService } from '../services/user.service';
import firebase from 'firebase/compat/app';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-update-blog',
  templateUrl: './update-blog.component.html',
  styleUrls: ['./update-blog.component.css']
})
export class UpdateBlogComponent implements OnDestroy, AfterViewInit{
  blogForm: FormGroup;
  blogId: any;
  _editorContent: any;
  imageUrl: string | ArrayBuffer | null = null;
  showNotification: boolean = false;
  showImage = false;

  constructor(
    private fireStore: AngularFirestore,
    private loaderService: LoaderService,
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.blogForm = this.fb.group({
      editorContent: [''],
      image: [''],
      created_at: [''],
    });
  }

  // ngAfterViewInit(): void {
    // ql-editor
  // }

  getBlog(){
    return this.sanitizer.bypassSecurityTrustHtml(this._editorContent)
    console.log(this._editorContent);
    
  }

  ngAfterViewInit(): void {
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

          console.log ('vvvvvvvvvvvvvvvvv', this.blogForm)
          this._editorContent = blog.editorContent;
          this.imageUrl = blog.imageUrl;
          console.log(this._editorContent);
          console.log(blog.editorContent);

          const quill = document.getElementsByClassName('ql-editor');
          if (quill && quill.length > 0) {
            const _p = quill[0].getElementsByTagName('p')

            if (_p && _p.length > 0) {
              _p[0].innerHTML = this.blogForm.value.editorContent
            }

          }
      
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
    if (!this._editorContent || !this.imageUrl) {
      console.error("Description or image not provided.");
      return;
    } else {
      this.fireStore.collection('blogs').doc(this.blogId).update({
        editorContent: this._editorContent,
        imageUrl: this.imageUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        setTimeout(() => {
          this.showNotification = true;
        }, 1);
        this.router.navigate(['/blogs']);
        this._editorContent==null;
      }).catch((error: any) => {
        console.error("Error updating blog:", error);
      });
    }
  }

  logChange($event:any) {
    console.log($event);
  }
}
