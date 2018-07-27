import { Injectable } from '@angular/core';
import firebase, { firestore } from 'firebase/app';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Injectable()
export class AuthProvider {
	constructor(public firestoreProvider: FirestoreProvider) { }

	loginUser(email: string, password: string): Promise<any> {
		const temp = firebase.auth().signInWithEmailAndPassword(email, password);
		this.firestoreProvider.userId = firebase.auth().currentUser.uid;
		console.log(this.firestoreProvider.userId);
		return temp;
	}

	signupUser(email: string, password: string, firstName: string, lastName: string): Promise<any> {
		return firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(newUser => {
				this.firestoreProvider.createFlatmate(newUser.user.uid, email, firstName,lastName, firstName + " " + lastName, 'Unassigned');
			});
	}

	// NEED TO SHOW A DIALOGUE SAYING THE PASSWORD HAS BEEN RESET
	resetPassword(email: string): Promise<void> {
		return firebase.auth().sendPasswordResetEmail(email);
	}
	// TODO need to remove tabs on signout
	logoutUser(): Promise<void> {
		return firebase.auth().signOut();
	}
}