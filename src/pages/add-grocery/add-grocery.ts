import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { GroceriesPage } from '../groceries/groceries';
import { TabsPage } from '../tabs/tabs';

@Component({
	selector: 'page-add-grocery',
	templateUrl: 'add-grocery.html'
})
export class AddGroceryPage {

	public addGroceryForm: FormGroup;
	public loading: Loading;
	constructor(
		public navCtrl: NavController,
		public formBuilder: FormBuilder,
		public databaseProvider: FirestoreProvider,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController) {
		this.addGroceryForm = formBuilder.group({
			groceryName: ['',
				Validators.compose([Validators.required])]
		});
	}

	tryAddGrocery() {
		this.databaseProvider.attemptAddGrocery(this.addGroceryForm.value.groceryName)
			.then(data => {
				this.loading.dismiss().then(() => {
					this.navCtrl.pop();
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

}
