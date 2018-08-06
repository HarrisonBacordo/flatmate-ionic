import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddChorePage } from '../add-chore/add-chore';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Component({
	selector: 'page-chores',
	templateUrl: 'chores.html'
})
export class ChoresPage {
	public chores: any;
	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public databaseProvider: FirestoreProvider) {
			this.chores = this.databaseProvider.getChores();
	}

	openAddChorePage() {
		const modal = this.modalCtrl.create(AddChorePage);
		modal.present();
	}

}
