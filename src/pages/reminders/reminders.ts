import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController, Loading, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AddReminderPage } from '../add-reminder/add-reminder';
import { FormControl, FormGroup, FormBuilder } from '../../../node_modules/@angular/forms';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Component({
	selector: 'page-reminders',
	templateUrl: 'reminders.html'
})
export class RemindersPage {
	public reminders = [];
	public loading: Loading;
	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public databaseProvider: FirestoreProvider,
		public actionSheetCtrl: ActionSheetController,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController) {
	}

	ionViewDidLoad() {
		this.reminders = this.databaseProvider.getReminders();
	}

	openAddReminderPage() {
		const modal = this.modalCtrl.create(AddReminderPage);
		modal.onDidDismiss(data => {
			if (data) {
				this.reminders = [];
				this.reminders = this.databaseProvider.getReminders();
			}
		})
		modal.present();
	}

	/**
	 * Presents the action sheet for the specific reminder
	 * @param reminder 
	 */
	presentActionSheet(reminder) {
		const actionSheet = this.actionSheetCtrl.create({
			title: reminder.reminderName,
			buttons: [
				{
					text: 'Delete',
					role: 'destructive',
					handler: () => {
						this.databaseProvider.deleteReminder(reminder).then(() => {
							this.loading.dismiss().then(() => {
								this.reminders = [];
								this.reminders = this.databaseProvider.getReminders();
								const toast = this.toastCtrl.create({
									message: "Reminder successfully deleted",
									duration: 1500
								});
								toast.present();
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
				}, {
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
					}
				}
			]
		});
		actionSheet.present();
	}
}
