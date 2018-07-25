import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { firebaseConfig } from '../../app/credentials';

@Injectable()
export class FirestoreProvider {
	private _DB: any;
  constructor() {
	  this._DB = firebase.firestore()
  }

  createFlatmate(
    albumName: string,
    artistName: string,
    songDescription: string,
    songName: string
  ): Promise<void> {
    const id = this._DB.createId();

    return this._DB.doc(`songList/${id}`).set({
      id,
      albumName,
      artistName,
      songDescription,
      songName,
    });
  }
}