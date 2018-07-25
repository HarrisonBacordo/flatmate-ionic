import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ChoresPage } from '../pages/chores/chores';
import { RemindersPage } from '../pages/reminders/reminders';
import { GroceriesPage } from '../pages/groceries/groceries'
import { MorePage } from '../pages/more/more'
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AddChorePage } from '../pages/add-chore/add-chore';
import { AddReminderPage } from '../pages/add-reminder/add-reminder';
import { AddGroceryPage } from '../pages/add-grocery/add-grocery';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import firebase from 'firebase/app';
import { HttpModule } from '@angular/http';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { firebaseConfig } from './credentials'
import { FirebaseProvider } from './../providers/firebase/firebase';
import { AuthProvider } from '../providers/auth/auth';
import { FirestoreProvider } from '../providers/firestore/firestore';

firebase.initializeApp(firebaseConfig);

@NgModule({
	declarations: [
		MyApp,
		LoginPage,
		SignupPage,
		ForgotPasswordPage,
		ChoresPage,
		AddChorePage,
		RemindersPage,
		AddReminderPage,
		GroceriesPage,
		AddGroceryPage,
		MorePage,
		TabsPage
	],
	imports: [
		BrowserModule,
		HttpModule,
		AngularFirestoreModule,
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFireAuthModule,
		IonicModule.forRoot(MyApp)
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		LoginPage,
		SignupPage,
		ForgotPasswordPage,
		ChoresPage,
		AddChorePage,
		RemindersPage,
		AddReminderPage,
		GroceriesPage,
		AddGroceryPage,
		MorePage,
		TabsPage
	],
	providers: [
		StatusBar,
		SplashScreen,
		FirebaseProvider,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		FirestoreProvider,
		AuthProvider,
	]
})
export class AppModule { }
