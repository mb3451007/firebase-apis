import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { signUp } from '../registration/data-type';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { User } from 'firebase/auth';
import { fish } from '../fish.model';
import { Users } from '../user.model';
import { FoodNode } from '../mat-tree/tree.model';
import { TREE_DATA } from '../mat-tree/tree-data';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private treeDataName = 'tree_data';
  private collectionName = 'fishing_data';
  private blogsName = 'blogs';
  private carName = 'car';
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
        return this.firestore.collection(collectionName, ref => ref.orderBy(orderByField).startAfter(lastDoc).limit(pageSize)).get().pipe(
          map(actions => actions.docs.map(a => {
            const obj: any = a.data();
            obj.id = a.id;
            return obj
          }))
        );
      } else {
        return this.firestore.collection(collectionName, ref => ref.orderBy(orderByField).limit(pageSize)).get().pipe(
          map(actions => actions.docs.map(a => {
            const obj: any = a.data();
            obj.id = a.id;
            return obj
          }))
        );
      }
    }
    
    // Filters

    filterData(collectionName: string, field: string, filterValue: string): Observable<any> {
      return this.firestore.collection<any>(collectionName, ref => ref.where(field, '>=', filterValue).where(field, '<=', filterValue + '\uf8ff')).snapshotChanges().pipe(
        map(actions => actions.map(this.documentToDomainObject))
      );
    }
    
    // Tree data
  saveTreeData(treeData: FoodNode[]): Promise<void> {
    return this.firestore.collection(this.collectionName).doc('data').set({ data: treeData });
  }

  loadTreeData(): Observable<FoodNode[]> {
    return this.firestore.collection(this.collectionName).doc('data').get().pipe(
      map(doc => {
        const data = doc.data() as { data: FoodNode[] } | undefined;
        return data ? data.data : TREE_DATA;
      })
    );
  }
}
