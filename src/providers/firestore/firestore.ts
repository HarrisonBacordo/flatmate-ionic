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
		const ref = this._DB.collection('Flats').doc();
		const id = ref.id;
		return ref.set({ 'flatName': flatName });
	}

	attemptJoinExistingFlat(flatId: string) {
		const flatRef = _DB.collection('Flats').doc(flatId);
		const getDoc = flatRef.get()
			.then(doc => {
				if (!doc.exists) {
					//   TODO ALERT NO FLAT
				} else {
					//   TODO CHANGE USER FLATKEY TO THIS FLATKEY
				}
			})
	}
	
	attemptAddChore() {

	}

	attemptAddReminder() {

	}

	attemptAddGrocery() {

	}

	queryDocument() {

	}

	getAllFlatmates(flatId: string) {
		
	}
}