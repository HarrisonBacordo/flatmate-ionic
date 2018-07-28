import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddReminderPage } from '../add-reminder/add-reminder';
import { FormControl, FormGroup, FormBuilder } from '../../../node_modules/@angular/forms';

@Component({
	selector: 'page-reminders',
	templateUrl: 'reminders.html'
})
export class RemindersPage {
	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController) {
	}

	openAddReminderPage() {
		const modal = this.modalCtrl.create(AddReminderPage);
		modal.present();
	}
}
