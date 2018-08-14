import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from 'ionic-angular';
import { AddReminderPage } from '../add-reminder/add-reminder';
import { FormControl, FormGroup, FormBuilder } from '../../../node_modules/@angular/forms';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Component({
	selector: 'page-reminders',
	templateUrl: 'reminders.html'
})
export class RemindersPage {
	public reminders = [];
	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public databaseProvider: FirestoreProvider,
		public actionSheetCtrl: ActionSheetController) {
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
						this.reminders = [];
						this.databaseProvider.deleteReminder(reminder);
						this.reminders = this.databaseProvider.getReminders();
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
