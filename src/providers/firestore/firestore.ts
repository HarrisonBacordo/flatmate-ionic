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
	public groceryCollection: CollectionReference;
	public choresList = [];
	public remindersList: Array<any>;
	public groceriesList: Array<any>;




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
		const promise = await this._DB.doc(`users/${chosenFlatmateId}`).get();
		const flatmateName = promise.get('fullName');
		return this.choresCollection.doc().set({ 'choreName': choreName, 'interval': interval, 'flatmate': flatmateName, isDone: false });
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

	getChores(): Array<any> {
		var chores = [];
		this.choresCollection.onSnapshot(function (docs) {
			docs.forEach(doc => {
				chores.push({
					"choreName": doc.data().choreName,
					"interval": doc.data().interval,
					"flatmate": doc.data().flatmate,
					"isDone": doc.data().isDone
				});
			});
			return chores;
		});
		return chores;
	}

	getReminders(): Array<any> {
		var reminders = [];
		this.remindersCollection.onSnapshot(function (docs) {
			docs.forEach(doc => {
				reminders.push({
					"reminderName": doc.data().reminderName,
					"reminderDate": doc.data().reminderDate
				});
			});
			return reminders;
		});
		return reminders;
	}

	getGroceries(): Array<any> {
		var groceries = [];
		this.groceryCollection.onSnapshot(function (docs) {
			docs.forEach(doc => {
				groceries.push({
					"groceryName": doc.data().groceryName,
					"completed": doc.data().completed
				});
			});
			return groceries;
		});
		return groceries;

	}

	/**
	 * 
	 */
	async setFlatId() {
		const docSnapshot = await this._DB.doc(`users/${this.userId}`).get();
		this.flatId = docSnapshot.get('flatKey');
		this.choresCollection = this._DB.collection(`flats/${this.flatId}/chores`);
		this.choresList = this.getChores();
		this.groceryCollection = this._DB.collection(`flats/${this.flatId}/groceries`);
		this.groceriesList = this.getGroceries();
		this.remindersCollection = this._DB.collection(`flats/${this.flatId}/reminders`);
		this.remindersList = this.getReminders();
	}
}