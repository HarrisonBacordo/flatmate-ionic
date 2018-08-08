import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Injectable()
export class AuthProvider {
	constructor(public firestoreProvider: FirestoreProvider) { }

	/**
	 * Attempts to login the user with the given email and password
	 * @param email - Email of the user
	 * @param password Password of the user
	 */
	async loginUser(email: string, password: string): Promise<any> {
		const userDetails = await firebase.auth().signInWithEmailAndPassword(email, password);
		// Update Firestore fields to the current user
		this.firestoreProvider.userId = userDetails.user.uid;
		await this.firestoreProvider.setFlatId();
		return userDetails
	}

	/**
	 * Attempts to sign up a user with the given parameters
	 * @param email - Desired email of the new user
	 * @param password - Desired password of the new user
	 * @param firstName - First name of the new user
	 * @param lastName - Last name of the new user
	 */
	async signupUser(email: string, password: string, firstName: string, lastName: string): Promise<any> {
		const newUser = await firebase.auth().createUserWithEmailAndPassword(email, password);
		// Create flatmate in Firestore database; update Firestore fields to the current user
		this.firestoreProvider.createFlatmate(newUser.user.uid, email, firstName,lastName, firstName + " " + lastName, 'Unassigned')
		this.firestoreProvider.userId = newUser.user.uid;
		await this.firestoreProvider.setFlatId();
		return newUser;
	}
	
	/**
	 * Sends a reset password email to the given email
	 * @param email - Email to send the reset password email to
	 */
	resetPassword(email: string): Promise<void> {
		// NEED TO SHOW A DIALOGUE SAYING THE PASSWORD HAS BEEN RESET
		return firebase.auth().sendPasswordResetEmail(email);
	}
	
	/**
	 * Attempts to log the current user out
	 */
	logoutUser(): Promise<void> {
		// TODO need to remove tabs on signout
		return firebase.auth().signOut();
	}
}