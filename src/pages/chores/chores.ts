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

	ionViewDidLoad() {
		this.chores = this.databaseProvider.getChores();
	}

	updateChore(chore) {
		chore.isDone = !chore.isDone;
		this.chores = [];
		this.databaseProvider.updateChore(chore, chore.isDone).then(() => {
			this.chores = this.databaseProvider.getChores();
		})
	}

	openAddChorePage() {
		const modal = this.modalCtrl.create(AddChorePage);
		modal.present();
	}

}
