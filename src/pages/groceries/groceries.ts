import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from 'ionic-angular';
import { AddGroceryPage } from '../add-grocery/add-grocery';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Component({
	selector: 'page-groceries',
	templateUrl: 'groceries.html'
})
export class GroceriesPage {
	public groceries: any;

	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public databaseProvider: FirestoreProvider,
		public actionSheetCtrl: ActionSheetController) {
	}

	ionViewDidLoad() {
		this.groceries = this.databaseProvider.getGroceries();

	}

	/**
	 * Updates this grocery's completed value
	 */
	updateGrocery(grocery) {
		// update database
		grocery.completed = !grocery.completed;
		this.groceries = [];
		this.databaseProvider.updateGrocery(grocery, grocery.completed).then(() => {
			this.groceries = this.databaseProvider.getGroceries();
		})
	}

	openAddGroceryPage() {
		const modal = this.modalCtrl.create(AddGroceryPage);
		modal.onDidDismiss(data => {
			if (data) {
				this.groceries = [];
				this.groceries = this.databaseProvider.getGroceries();
			}
		})
		modal.present();
	}

	presentActionSheet(grocery) {
		const actionSheet = this.actionSheetCtrl.create({
			title: grocery.groceryName,
			buttons: [
				{
					text: 'Delete',
					role: 'destructive',
					handler: () => {
						this.groceries = [];
						this.databaseProvider.deleteGrocery(grocery);
						this.groceries = this.databaseProvider.getGroceries();
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
