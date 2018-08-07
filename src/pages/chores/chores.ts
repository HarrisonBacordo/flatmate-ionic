import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddChorePage } from '../add-chore/add-chore';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Component({
	selector: 'page-chores',
	templateUrl: 'chores.html'
})
export class ChoresPage {
	public chores = [];
	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public databaseProvider: FirestoreProvider) {
	}

	/**
	 * Loads the chores list
	 */
	ionViewDidLoad() {
		this.chores = this.databaseProvider.choresList;
	}

	/**
	 * Updates this chore item's isDone value
	 * @param chore - Chore item to update
	 */
	updateChore(chore) {
		chore.isDone = !chore.isDone;
		this.databaseProvider.updateChore(chore, chore.isDone);
	}

	/**
	 * Opens AddChore modal
	 */
	openAddChorePage() {
		const modal = this.modalCtrl.create(AddChorePage);
		modal.present();
	}

}
