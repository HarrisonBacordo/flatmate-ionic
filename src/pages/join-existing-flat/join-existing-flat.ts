import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { TabsPage } from '../tabs/tabs';
import { ChoresPage } from '../chores/chores';
import { BarcodeScanner } from '../../../node_modules/@ionic-native/barcode-scanner';

@Component({
	selector: 'page-join-existing-flat',
	templateUrl: 'join-existing-flat.html'
})

export class JoinExistingFlatPage {
	public joinExistingFlatForm: FormGroup;
	public loading: Loading;
	public scannedCode = null;
	constructor(
		public navCtrl: NavController,
		public formBuilder: FormBuilder,
		public loadCtrl: LoadingController,
		public databaseProvider: FirestoreProvider,
		public alertCtrl: AlertController,
		public barcodeScanner: BarcodeScanner
	) {
		this.joinExistingFlatForm = formBuilder.group({
			flatId: ['', Validators.required]
		});
	}

	attemptJoin() {
		if (!this.joinExistingFlatForm.valid) {
			console.log(this.joinExistingFlatForm.value);
		} else {
			this.databaseProvider.attemptJoinExistingFlat(this.joinExistingFlatForm.value.flatId)
				.then(authData => {
					this.loading.dismiss().then(() => {
						this.navCtrl.setRoot(ChoresPage);
					}, error => {
						this.loading.dismiss().then(() => {
							let alert = this.alertCtrl.create({
								message: error.message,
								buttons: [
									{
										text: "Ok",
										role: 'cancel'
									}
								]
							});
							alert.present();
						});
					});
				});
			this.loading = this.loadCtrl.create();
			this.loading.present();
		}
	}

	scanCode() {
		this.barcodeScanner.scan().then(barcodeData => {
			this.scannedCode = barcodeData.text;
		}, (err) => {
			console.log('Error: ', err);
		});
	}
}
