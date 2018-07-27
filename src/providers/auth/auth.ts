import { Injectable } from '@angular/core';
import firebase, { firestore } from 'firebase/app';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Injectable()
export class AuthProvider {
	constructor(public firestoreProvider: FirestoreProvider) { }

	loginUser(email: string, password: string): Promise<any> {
		const temp = firebase.auth().signInWithEmailAndPassword(email, password)
			.then(signInData => {
				this.firestoreProvider.userId = signInData.user.uid;
				this.firestoreProvider.setFlatId();
			});
		return temp;
	}

	signupUser(email: string, password: string, firstName: string, lastName: string): Promise<any> {
		const temp = firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(newUser => {
				this.firestoreProvider.createFlatmate(newUser.user.uid, email, firstName,lastName, firstName + " " + lastName, 'Unassigned')
				this.firestoreProvider.userId = newUser.user.uid;
				this.firestoreProvider.setFlatId();
			});
			return temp
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