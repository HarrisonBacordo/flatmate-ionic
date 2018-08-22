import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp();


exports.newSubscriberNotification = functions.firestore
    .document('users/{userId}')
    .onUpdate(async event => {
        
	const afterData = event.data;
	const beforeData = afterData.previous;

    const userId = afterData.id;
    const newNudgeCount = afterData.get("nudgeCount");
	const oldNudgeCount = beforeData.get("nudgeCount");
	
	if (newNudgeCount === oldNudgeCount) { 
		return null; 
	}
	
    // Notification content
    const payload = {
      notification: {
          title: 'You\'ve been nudged!',
          body: 'One of your flatmates just nudged you to do your chores!',
          icon: 'https://goo.gl/Fz9nrQ'
      }
    }

    // ref to the device collection for the user
    const db = admin.firestore()
    const devicesRef = db.collection('devices').where('userId', '==', userId)


    // get the user's tokens and send notifications
    const devices = await devicesRef.get();

    const tokens = [];

    // send a notification to each device token
    devices.forEach(result => {
      const token = result.data().token;

      tokens.push( token )
    })

    return admin.messaging().sendToDevice(tokens, payload)

});