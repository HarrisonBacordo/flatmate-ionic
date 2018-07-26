import { Component } from '@angular/core';
import { NavController, Loading, AlertController, LoadingController } from 'ionic-angular';
import { EmailValidator } from '../../validators/email';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';

@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html'
})
export class SignupPage {
	public signupForm: FormGroup;
	public loading: Loading;
	constructor(
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public formBuilder: FormBuilder,
		public authProvider: AuthProvider) {
		this.signupForm = formBuilder.group({
			email: ['',
				Validators.compose([Validators.required, EmailValidator.isValid])],
			password: ['',
				Validators.compose([Validators.minLength(6), Validators.required])],
			retypedPassword: ['',
				Validators.compose([Validators.minLength(6), Validators.required])],
				firstName: [],
				lastName: []
		});
	}

	signupUser() {
		if(!this.signupForm.valid) {
			console.log(this.signupForm.value);
		} else {
			this.authProvider.signupUser(this.signupForm.value.email, this.signupForm.value.password, 
													  this.signupForm.value.firstName, this.signupForm.value.lastName)
			.then(authData => {
				this.loading.dismiss().then(() => {
					this.navCtrl.setRoot(TabsPage);
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
	}

}
