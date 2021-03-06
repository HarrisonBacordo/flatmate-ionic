import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Loading, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { JoinExistingFlatPage } from '../join-existing-flat/join-existing-flat';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { ChoresPage } from '../chores/chores';
import { TabsPage } from '../tabs/tabs';
import { FcmProvider } from '../../providers/fcm/fcm';
import { tap } from 'rxjs/operators';

@Component({
	selector: 'page-create-new-flat',
	templateUrl: 'create-new-flat.html'
})
export class CreateNewFlatPage {
	public createNewFlatForm: FormGroup;
	public loading: Loading;
	constructor(
		public navCtrl: NavController,
		public formBuilder: FormBuilder,
		public databaseProvider: FirestoreProvider,
		public loadCtrl: LoadingController,
		public alertCtrl: AlertController,
		public fcm: FcmProvider,
		public toastCtrl: ToastController
	) {
		this.createNewFlatForm = formBuilder.group({
			flatName: ['', Validators.required]
		});
	}

	ionViewDidLoad() {
		// this.fcm.getToken();

		// this.fcm.listenToNotifications().pipe(
		// 	tap(msg => {
		// 		const toast = this.toastCtrl.create({
		// 			message: msg.body,
		// 			duration: 3000
		// 		});
		// 		toast.present();
		// 	})
		// )
		// .subscribe();
	}

	createNewFlat() {
		if(!this.createNewFlatForm.valid) {
			console.log(this.createNewFlatForm.value);
		}  else {
			this.databaseProvider.createNewFlat(this.createNewFlatForm.value.flatName)
				.then(authData => {
					this.loading.dismiss().then(() => {
						this.navCtrl.push(TabsPage);
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
				});
			this.loading = this.loadCtrl.create();
			this.loading.present();
		}
	}

	goToJoinExistingFlatPage() {
		this.navCtrl.setRoot(JoinExistingFlatPage);
	}
}
