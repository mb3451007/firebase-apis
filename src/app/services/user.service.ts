import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { signUp } from '../registration/data-type';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { User } from 'firebase/auth';
import { fish } from '../fish.model';
import { Users } from '../user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private collectionName = 'fishing_data';
  private tableName = 'registration';
  constructor(private firestore: AngularFirestore) {}

  // add user

  documentToDomainObject<T>(_: any): T {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object as T;
  }

  // Add Data

  addData(collectionName: string,addedData: any): Promise<any> {
    const id = this.firestore.createId();
    addedData.id = id; // Add the auto-generated ID to the document data
    addedData.createdAt = new Date(); // Add a timestamp to the document
    return this.firestore.collection(collectionName).add(addedData);
  }

  // getAll Data
  getAllData(collectionName: string) {return this.firestore.collection<any>(collectionName).snapshotChanges().pipe(map((actions) => actions.map(this.documentToDomainObject)));
  }

  // Update Data
  updateData(collectionName: string,docId: string,updatedData: any): Promise<void> {
    return this.firestore.collection(collectionName).doc(docId).update(updatedData);
  }


  //  Delete Data
  deleteData(docId: string, collectionName: string):Promise<void>{
    return this.firestore.collection(collectionName).doc(docId).delete();
  }

  // Get User by Id

  getDataById(id: string,collectionName: string): Observable<any> {
    return this.firestore.collection(collectionName).doc(id).get().pipe(map((actions) => {return actions.data()}))
  }


    // Get paginated data from Firestore for users 
    getPaginatedData(collectionName: string, pageSize: number,orderByField: string, lastDoc: any = null) {
      console.log ('start after', lastDoc)
      if (lastDoc) {
        return this.firestore.collection(collectionName, ref => ref.orderBy(orderByField).startAfter(lastDoc).limit(pageSize)).snapshotChanges().pipe(
          map(actions => actions.map(this.documentToDomainObject))
        );
      } else {
        return this.firestore.collection(collectionName, ref => ref.orderBy(orderByField).limit(pageSize)).snapshotChanges().pipe(
          map(actions => actions.map(this.documentToDomainObject))
        );
      }
    }
}
