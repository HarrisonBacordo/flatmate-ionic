import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddChorePage } from '../add-chore/add-chore';

@Component({
	selector: 'page-chores',
	templateUrl: 'chores.html'
})
export class ChoresPage {

	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController) {

	}

	openAddChorePage() {
		const modal = this.modalCtrl.create(AddChorePage);
		modal.present();
	}

}
