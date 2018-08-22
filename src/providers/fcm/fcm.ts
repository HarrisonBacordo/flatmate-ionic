import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import firebase from 'firebase/app';
import { Firebase } from '@ionic-native/firebase';
import { FirestoreProvider } from '../firestore/firestore';

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

	constructor(
		public firebaseNative: Firebase,
		private platform: Platform,
		public firestoreProvider: FirestoreProvider
	) {}

	async getToken() {
		let token;

		if (this.platform.is('ios')) {
			token = await this.firebaseNative.getToken();
			const perm = await this.firebaseNative.grantPermission();
		}

		if (this.platform.is('android')) {
			token = await this.firebaseNative.getToken();
		  } 

		return this.saveTokenToFirestore(token);
	}

	private saveTokenToFirestore(token) {
		return this.firestoreProvider.saveToken(token);
	}

	listenToNotifications() {
		return this.firebaseNative.onNotificationOpen();
	}
}
