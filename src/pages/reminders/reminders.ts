import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
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
		public databaseProvider: FirestoreProvider) {
	}

	ionViewWillEnter() {
		this.reminders = this.databaseProvider.getReminders();
	}

	openAddReminderPage() {
		const modal = this.modalCtrl.create(AddReminderPage);
		modal.present();
	}
}
