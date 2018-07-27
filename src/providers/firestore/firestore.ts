import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { firebaseConfig } from '../../app/credentials';
import { last } from '../../../node_modules/rxjs/operator/last';

@Injectable()
export class FirestoreProvider {
	private _DB: any;
	public userId: string;
	public flatId: string;
	public userDoc: any;
	public choresCollection: any;
	public remindersCollection: any;
	public groceryCollection: any;




	constructor() {
		this._DB = firebase.firestore();
	}

	createFlatmate(
		id: String,
		email: string,
		firstName: string,
		lastName: string,
		fullName: string,
		flatKey: string
	): Promise<void> {

		return this._DB.doc(`users/${id}`).set({
			email,
			firstName,
			lastName,
			fullName,
			flatKey,
		});
	}

	createNewFlat(flatName: string): Promise<void> {
		const ref = this._DB.collection('flats').doc();
		const id = ref.id;
		this._DB.doc(`users/${this.userId}`).update('flatKey', id);
		this.setFlatId();
		return ref.set({ 'flatName': flatName });
	}

	attemptJoinExistingFlat(flatId: string): Promise<void> {
		const flatRef = this._DB.collection('flats').doc(flatId);
		console.log(flatId);
		const getDoc = flatRef.get()
			// .then(doc => {
			// 	if (!doc.exists) {
			// 		console.log('cant find ' + this.userId);
			// 		//   TODO ALERT NO FLAT
			// 	} else {
			// 		console.log(doc);
			// 		//   TODO CHANGE USER FLATKEY TO THIS FLATKEY
			// 		return this._DB.doc(`Users/${this.userId}`).update('flatKey', flatId);
			// 	}
			// });
			this._DB.doc(`users/${this.userId}`).update('flatKey', flatId);
			this.setFlatId();
			return null;
	}
	
	// CHANGE THIS TO PICK A RANDOM FLATMATE
	attemptAddChore(choreName: string, interval: any): Promise<void> {
		return this.choresCollection.doc().set({'choreName': choreName, 'interval': interval, 'flatmate': this.userId, isDone: false});
	}

	attemptAddReminder(reminderName: string, date: string): Promise<void> {
		return this.remindersCollection.doc().set({'reminderName': reminderName, 'reminderDate': date});
	}

	attemptAddGrocery(groceryName: string): Promise<void> {
		return this.groceryCollection.doc().set({'groceryName': groceryName, 'completed': false});
	}

	getAllFlatmates(flatId: string) {
		
	}

	setFlatId() {
		this._DB.doc(`users/${this.userId}`).get()
			.then(docSnapshot => {
				this.flatId = docSnapshot.get('flatKey');
				this.choresCollection = this._DB.collection(`flats/${this.flatId}/chores`)
				this.groceryCollection = this._DB.collection(`flats/${this.flatId}/groceries`)
				this.remindersCollection = this._DB.collection(`flats/${this.flatId}/reminders`)
			});
	}
}