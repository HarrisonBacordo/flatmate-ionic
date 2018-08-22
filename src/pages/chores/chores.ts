import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AddChorePage } from '../add-chore/add-chore';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Component({
	selector: 'page-chores',
	templateUrl: 'chores.html'
})
export class ChoresPage {
	public chores = [];
	public loading: Loading;
	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public databaseProvider: FirestoreProvider,
		public actionSheetCtrl: ActionSheetController,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController
	) {
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
		this.databaseProvider.updateChore(chore, chore.isDone)
			.then(() => {
				this.loading.dismiss().then(() => {
					this.chores = [];
					this.chores = this.databaseProvider.getChores();
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

	sendNudge(flatmate) {
		this.databaseProvider.sendNudge(flatmate);
		const toast = this.toastCtrl.create({
			message: "Your anonymous nudge has been sent!",
			duration: 1500
		});
		toast.present();
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
						this.databaseProvider.deleteChore(chore).then(() => {
							this.loading.dismiss().then(() => {
								this.chores = [];
								this.chores = this.databaseProvider.getChores();
								const toast = this.toastCtrl.create({
									message: "Chore successfully deleted",
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

	getColor(isDone) {
		if (isDone) { return '#49CB43'; }
		else { return '#E87570'; }
	}

}
