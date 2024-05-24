import { Component, OnDestroy,OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit ,OnDestroy {
  editorContent: string = '';
  html = '';
  showNotification:boolean=false
  description:string="";
  imageUrl: string | ArrayBuffer | null = null;
  showImage = false;
constructor(private fireStore:AngularFirestore,){}
ngOnInit(){
  
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
}
