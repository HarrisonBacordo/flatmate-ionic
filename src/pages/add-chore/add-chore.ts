import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { ChoresPage } from '../chores/chores';
import { TabsPage } from '../tabs/tabs';

@Component({
	selector: 'page-add-chore',
	templateUrl: 'add-chore.html'
})
export class AddChorePage {
	public addChoreForm: FormGroup;
	public loading: Loading;
	constructor(
		public navCtrl: NavController,
		public formBuilder: FormBuilder,
		public databaseProvider: FirestoreProvider,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public viewCtrl: ViewController) {
		this.addChoreForm = formBuilder.group({
			choreName: ['',
				Validators.compose([Validators.required])],
			interval: ['',
				Validators.compose([Validators.required])]
		});
	}

	dismiss() {
		this.viewCtrl.dismiss(false);
	}

	/**
	 * Attempts to add chore to Firestore
	 */
	tryAddChore() {
		this.databaseProvider.attemptAddChore(this.addChoreForm.value.choreName, this.addChoreForm.value.interval)
			.then(data => {
				this.loading.dismiss().then(() => {
					this.viewCtrl.dismiss(true);
				})
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
		this.loading = this.loadingCtrl.create();
		this.loading.present();
	}

}
