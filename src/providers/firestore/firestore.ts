import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { firebaseConfig } from '../../app/credentials';
import { last } from '../../../node_modules/rxjs/operator/last';

@Injectable()
export class FirestoreProvider {
	private _DB: any;
  constructor() {
	  this._DB = firebase.firestore()
  }

  createFlatmate(
	id: String,
	email: string,
	firstName: string,
	lastName: string,
	fullName: string,
	flatKey: string
  ): Promise<void> {

    return this._DB.doc(`Users/${id}`).set({
      email,
      firstName,
      lastName,
	  fullName,
	  flatKey,
    });
  }

  createNewFlat(flatName: string): Promise<void> {
	  const flatCollection = this._DB.collection('Flats');
	  const flatId = flatCollection.doc().id;
	  return flatCollection.doc().update("flatName", flatName);
  }
}