import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { firebaseConfig } from '../../app/credentials';
import { last } from '../../../node_modules/rxjs/operator/last';
import { Query, DocumentReference, CollectionReference } from '../../../node_modules/angularfire2/firestore';
import { FirebaseFirestore } from '../../../node_modules/angularfire2';

@Injectable()
export class FirestoreProvider {
	private _DB: FirebaseFirestore;
	public userId: string;
	public flatId: string;
	public userDoc: any;
	public choresCollection: CollectionReference;
	public remindersCollection: CollectionReference;
	public groceriesCollection: CollectionReference;

	constructor() {
		this._DB = firebase.firestore();
	}
 
	saveToken(token) {
		if (!token) return;
		const devicesRef = this._DB.collection('devices');

		const docData = {
			token,
			userId: this.userId
		}

		return devicesRef.doc(token).set(docData);
	}

	/**
	 * Creates a flatmate with the given parameters
	 * @param id - ID of the flatmate
	 * @param email - Email of the flatmate
	 * @param firstName - First name of the flatmate
	 * @param lastName - Last name of the flatmate
	 * @param fullName - Full name of the flatmate
	 * @param flatKey - Current flat key of the flatmate
	 */
	createFlatmate(id: String, email: string, firstName: string, lastName: string, fullName: string, flatKey: string): Promise<void> {
		const nudgeCount = 0;
		return this._DB.doc(`users/${id}`).set({ email, firstName, lastName, fullName, flatKey, nudgeCount });
	}

	/**
	 * Creates a new flat with the given flat name
	 * @param flatName - Desired name of the flat
	 */
	createNewFlat(flatName: string): Promise<void> {
		// Create doc in the flat table and get its id
		const ref = this._DB.collection('flats').doc();
		const id = ref.id;
		// Update the current user's flatId to this id and update all flat variables in this file
		this._DB.doc(`users/${this.userId}`).update('flatKey', id);
		this.setFlatId();
		return ref.set({ 'flatName': flatName });
	}

	/**
	 * Attempts to set the current user's flatId to the given flatId
	 * @param flatId - Desired flatId
	 */
	async attemptJoinExistingFlat(flatId: string): Promise<void> {
		const flatRef: DocumentReference = this._DB.collection('flats').doc(flatId);
		const promise = await flatRef.get();
		// Check if flatId exists in Firestore
		if (!promise.exists) {
			console.log('cant find ' + this.userId);
		} else {
			const promise = await this._DB.doc(`users/${this.userId}`).update('flatKey', flatId);
			return this.setFlatId();
		}
	}

	/**
	 * Attempts to add a chore item to Firestore
	 * @param choreName - Name of chore
	 * @param interval - Interval the chore should be refreshed
	 */
	async attemptAddChore(choreName: string, interval: any): Promise<void> {
		// Randomly select a flatmate to do this chore, and get their full name
		const flatmates = await this.getAllFlatmates(this.flatId)
		const keys = Object.keys(flatmates);
		const chosenFlatmate = flatmates[keys[ keys.length * Math.random() << 0]];
		// Add the chore item to Firestore
		return this.choresCollection.doc().set({ 'choreName': choreName, 'interval': interval, 'flatmate': chosenFlatmate, isDone: false });
	}

	/**
	 * Attempts to add a reminder item to Firestore
	 * @param reminderName - Name of the reminder
	 * @param date - Date for the reminder to trigger
	 */
	attemptAddReminder(reminderName: string, date: string): Promise<void> {
		return this.remindersCollection.doc().set({ 'reminderName': reminderName, 'reminderDate': date });
	}

	/**
	 * Attempts to add a grocery item to Firestore
	 * @param groceryName - Name of the grocery item 
	 */
	attemptAddGrocery(groceryName: string): Promise<void> {
		return this.groceriesCollection.doc().set({ 'groceryName': groceryName, 'completed': false });
	}

	/**
	 * Sends nudge to given flatmate
	 * @param flatmateName - name of flatmate to receive nudge
	 */
	async sendNudge(flatmateName: string) {
		const flatmates = await this.getAllFlatmates(this.flatId);
		for (const key in flatmates) {
			if (flatmates[key] == flatmateName) {
				const docSnapshot = await this._DB.doc(`users/${key}`).get();
				docSnapshot.ref.update('nudgeCount', ++docSnapshot.data().nudgeCount);
			}
		}
	}

	/**
	 * Returns a list of all flatmates within the current flat in Firestore
	 * @param flatId 
	 */
	async getAllFlatmates(flatId: string) {
		const flatmateIds: Object = {};
		const query: Query = this._DB.collection('users').where('flatKey', '==', flatId);
		const promise = await query.get();
		promise.forEach(doc => {
			flatmateIds[doc.id] = doc.data().fullName;
		});
		return flatmateIds;
	}

	/**
	 * Gets chores from firestore database
	 */
	getChores(): Array<any> {
		var chores = [];
		this.choresCollection.onSnapshot(function (docs) {
			docs.forEach(doc => {
				// Store each chore in a map
				chores.push({
					"choreName": doc.data().choreName,
					"interval": doc.data().interval,
					"flatmate": doc.data().flatmate,
					"isDone": doc.data().isDone,
					"id": doc.id
				});
			});
			return chores;
		});
		return chores;
	}

	/**
	 * Gets reminders from Firestore database
	 */
	getReminders(): Array<any> {
		var reminders = [];
		this.remindersCollection.onSnapshot(function (docs) {
			docs.forEach(doc => {
				// Store each reminder in a map
				reminders.push({
					"reminderName": doc.data().reminderName,
					"reminderDate": doc.data().reminderDate,
					"id": doc.id
				});
			});
			return reminders;
		});
		return reminders;
	}

	/**
	 * Gets groceries from Firestore database
	 */
	getGroceries(): Array<any> {
		var groceries = [];
		this.groceriesCollection.onSnapshot(function (docs) {
			docs.forEach(doc => {
				// Store each grocery in a map
				groceries.push({
					"groceryName": doc.data().groceryName,
					"completed": doc.data().completed,
					"id": doc.id
				});
			});
			return groceries;
		});
		return groceries;

	}

	/**
	 * Update the given chore's isDone value
	 * @param chore - the chore to update
	 * @param isDone - the value to update isDone to
	 */
	updateChore(chore, isDone): Promise<void> {
		return this.choresCollection.doc(chore.id).update('isDone', isDone);
	}

	/**
	 * Update the given grocery's completed value
	 * @param grocery - the grocery to update
	 * @param completed - the value to update completed to
	 */
	updateGrocery(grocery, completed): Promise<void> {
		return this.groceriesCollection.doc(grocery.id).update('completed', completed);
	}

	deleteChore(chore) {
		return this.choresCollection.doc(chore.id).delete();
	}

	deleteGrocery(grocery) {
		return this.groceriesCollection.doc(grocery.id).delete();
	}
	
	deleteReminder(reminder) {
		return this.remindersCollection.doc(reminder.id).delete();
	}

	/**
	 * Sets up flat variables according to the flat that the user is in
	 */
	async setFlatId() {
		const docSnapshot = await this._DB.doc(`users/${this.userId}`).get();
		this.flatId = docSnapshot.get('flatKey');
		this.choresCollection = this._DB.collection(`flats/${this.flatId}/chores`);
		this.groceriesCollection = this._DB.collection(`flats/${this.flatId}/groceries`);
		this.remindersCollection = this._DB.collection(`flats/${this.flatId}/reminders`);
	}
}