import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController, Loading, ToastController } from 'ionic-angular';
import { AddGroceryPage } from '../add-grocery/add-grocery';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Component({
	selector: 'page-groceries',
	templateUrl: 'groceries.html'
})
export class GroceriesPage {
	public groceries = [];
	public loading: Loading;

	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public databaseProvider: FirestoreProvider,
		public actionSheetCtrl: ActionSheetController,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController) {
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
		this.databaseProvider.updateGrocery(grocery, grocery.completed).then(() => {
			this.loading.dismiss().then(() => {
				this.groceries = [];
				this.groceries = this.databaseProvider.getGroceries();
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
						this.databaseProvider.deleteGrocery(grocery).then(() => {
							this.loading.dismiss().then(() => {
								this.groceries = [];
								this.groceries = this.databaseProvider.getGroceries();
								const toast = this.toastCtrl.create({
									message: "Grocery successfully deleted",
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
