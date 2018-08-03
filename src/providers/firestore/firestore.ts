import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { firebaseConfig } from '../../app/credentials';
import { last } from '../../../node_modules/rxjs/operator/last';
import { Query, DocumentReference } from '../../../node_modules/angularfire2/firestore';

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

	/**
	 * 
	 * @param id 
	 * @param email 
	 * @param firstName 
	 * @param lastName 
	 * @param fullName 
	 * @param flatKey 
	 */
	createFlatmate(id: String, email: string, firstName: string, lastName: string, fullName: string, flatKey: string): Promise<void> {
		const choresList = [];
		return this._DB.doc(`users/${id}`).set({ email, firstName, lastName, fullName, flatKey, choresList });
	}

	/**
	 * 
	 * @param flatName 
	 */
	createNewFlat(flatName: string): Promise<void> {
		const ref = this._DB.collection('flats').doc();
		const id = ref.id;
		this._DB.doc(`users/${this.userId}`).update('flatKey', id);
		this.setFlatId();
		return ref.set({ 'flatName': flatName });
	}

	/**
	 * 
	 * @param flatId 
	 */
	async attemptJoinExistingFlat(flatId: string): Promise<void> {
		const flatRef: DocumentReference = this._DB.collection('flats').doc(flatId);
		const promise = await flatRef.get();
		if (!promise.exists) {
			console.log('cant find ' + this.userId);
		} else {
			return this._DB.doc(`users/${this.userId}`).update('flatKey', flatId);
		}
	}

	/**
	 * 
	 * @param choreName 
	 * @param interval 
	 */
	async attemptAddChore(choreName: string, interval: any): Promise<void> {
		const flatmates = await this.getAllFlatmates(this.flatId);
		var chosenFlatmateId = flatmates[Math.floor(Math.random() * flatmates.length)];
		return this.choresCollection.doc().set({ 'choreName': choreName, 'interval': interval, 'flatmate': chosenFlatmateId, isDone: false });
	}

	/**
	 * 
	 * @param reminderName 
	 * @param date 
	 */
	attemptAddReminder(reminderName: string, date: string): Promise<void> {
		return this.remindersCollection.doc().set({ 'reminderName': reminderName, 'reminderDate': date });
	}

	/**
	 * 
	 * @param groceryName 
	 */
	attemptAddGrocery(groceryName: string): Promise<void> {
		return this.groceryCollection.doc().set({ 'groceryName': groceryName, 'completed': false });
	}

	/**
	 * 
	 * @param flatId 
	 */
	async getAllFlatmates(flatId: string) {
		const flatmateIds: Array<string> = new Array();
		const query: Query = this._DB.collection('users').where('flatKey', '==', flatId);
		const promise = await query.get();
		promise.forEach(doc => {
			flatmateIds.push(doc.id);
		});
		return flatmateIds;
	}

	async getChores() {
		this.choresCollection.onSnapshot(function(docs) {
			const chores = []
			docs.array.forEach(doc => {
				chores.push({
					"choreName": doc.data().choreName,
					"interval": doc.data().interval,
					"flatmate": doc.data().flatmate
				});
			});
		});
		return chores;
	}

	async getReminders() {
		this.remindersCollection.onSnapshot(function(docs) {
			const reminders = []
			docs.array.forEach(doc => {
				reminders.push({
					"reminderName": doc.data().reminderName,
					"reminderDate": doc.data().reminderDate
				});
			});
		});
		return reminders;
	}

	async getGroceries() {
		this.groceryCollection.onSnapshot(function(docs) {
			const groceries = []
			docs.array.forEach(doc => {
				groceries.push({
					"groceryName": doc.data().groceryName,
					"completed": doc.data().completed
				});
			});
		});
		return groceries;
	}

	/**
	 * 
	 */
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