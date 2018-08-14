import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from 'ionic-angular';
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
		public databaseProvider: FirestoreProvider,
		public actionSheetCtrl: ActionSheetController) {
	}

	/**
	 * Loads the chores list
	 */
	ionViewDidLoad() {
		this.chores = this.databaseProvider.getChores();
	}

	/**
	 * Updates this chore item's isDone value
	 * @param chore - Chore item to update
	 */
	updateChore(chore) {
		chore.isDone = !chore.isDone;
		this.chores = [];
		this.databaseProvider.updateChore(chore, chore.isDone).then(() => {
			this.chores = this.databaseProvider.getChores();
		})
	}

	sendNudge(flatmate) {
		this.databaseProvider.sendNudge(flatmate);
	}

	/**
	 * Opens AddChore modal
	 */
	openAddChorePage() {
		const modal = this.modalCtrl.create(AddChorePage);
		modal.onDidDismiss(data => {
			if (data) {
				this.chores = [];
				this.chores = this.databaseProvider.getChores();
			}
		})
		modal.present();
	}

	/**
	 * Presents the action sheet for the specific chore
	 * @param chore 
	 */
	presentActionSheet(chore) {
		const actionSheet = this.actionSheetCtrl.create({
			title: chore.choreName,
			buttons: [
				{
					text: 'Delete',
					role: 'destructive',
					handler: () => {
						this.chores = [];
						this.databaseProvider.deleteChore(chore);
						this.chores = this.databaseProvider.getChores();
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

	getColor(isDone) {
		if (isDone) { return '#49CB43'; }
		else { return '#E87570'; }
	}

}
