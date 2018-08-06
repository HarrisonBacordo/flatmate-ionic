import { Injectable } from '@angular/core';
import firebase, { firestore } from 'firebase/app';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Injectable()
export class AuthProvider {
	constructor(public firestoreProvider: FirestoreProvider) { }

	async loginUser(email: string, password: string): Promise<any> {
		const userDetails = await firebase.auth().signInWithEmailAndPassword(email, password);
		this.firestoreProvider.userId = userDetails.user.uid;
		await this.firestoreProvider.setFlatId();
		return userDetails
	}

	async signupUser(email: string, password: string, firstName: string, lastName: string): Promise<any> {
		const newUser = await firebase.auth().createUserWithEmailAndPassword(email, password);
		this.firestoreProvider.createFlatmate(newUser.user.uid, email, firstName,lastName, firstName + " " + lastName, 'Unassigned')
		this.firestoreProvider.userId = newUser.user.uid;
		await this.firestoreProvider.setFlatId();
		return newUser;
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