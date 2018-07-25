import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Injectable()
export class AuthProvider {
	constructor(public firestoreProvider: FirestoreProvider) { }

	loginUser(email: string, password: string): Promise<any> {
		return firebase.auth().signInWithEmailAndPassword(email, password);
	}

	signupUser(email: string, password: string, firstName: string, lastName: string): Promise<any> {
		return firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(newUser => {
				this.firestoreProvider.createFlatmate(email, firstName,lastName, 'Unassigned');
			});
	}

	resetPassword(email: string): Promise<void> {
		return firebase.auth().sendPasswordResetEmail(email);
	}

	logoutUser(): Promise<void> {
		return firebase.auth().signOut();
	}
}