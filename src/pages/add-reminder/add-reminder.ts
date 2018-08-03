import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { RemindersPage } from '../reminders/reminders';

@Component({
	selector: 'page-add-reminder',
	templateUrl: 'add-reminder.html'
})
export class AddReminderPage {

	public addReminderForm: FormGroup;
	public loading: Loading;
	constructor(
		public navCtrl: NavController,
		public formBuilder: FormBuilder,
		public databaseProvider: FirestoreProvider,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController) {
		this.addReminderForm = formBuilder.group({
			reminderName: ['',
				Validators.compose([Validators.required])],
			reminderDate: ['',
				Validators.compose([Validators.required])]
		});
	}

	tryAddReminder() {
		this.databaseProvider.attemptAddReminder(this.addReminderForm.value.reminderName,
			this.addReminderForm.value.reminderDate)
			.then(data => {
				this.loading.dismiss().then(() => {
					this.navCtrl.push(TabsPage);
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
