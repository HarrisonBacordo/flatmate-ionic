import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { CreateNewFlatPage } from '../create-new-flat/create-new-flat';
import { FlatIdPage } from '../flat-id/flat-id';

@Component({
	selector: 'page-more',
	templateUrl: 'more.html'
})
export class MorePage {
	public loading: Loading;
	constructor(
		public navCtrl: NavController,
		public authCtrl: AuthProvider,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController) {

	}

	logoutUser() {
		this.authCtrl.logoutUser()
		.then(logoutData => {
			this.loading.dismiss().then(() => {
				this.navCtrl.setRoot(LoginPage);
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
		this.loading = this.loadingCtrl.create();
		this.loading.present();
	}

	goToNewFlatPage() {
		this.navCtrl.push(CreateNewFlatPage);
	}

	goToFlatId() {
		this.navCtrl.push(FlatIdPage);
	}
}
