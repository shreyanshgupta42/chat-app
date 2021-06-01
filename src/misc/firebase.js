/* eslint-disable import/no-extraneous-dependencies */
import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const config = {
  apiKey: 'AIzaSyCkmj7IWOlBfk32ZYuwApF9f7TjNXld1Hk',
  authDomain: 'chat-web-app-4c247.firebaseapp.com',
  projectId: 'chat-web-app-4c247',
  storageBucket: 'chat-web-app-4c247.appspot.com',
  messagingSenderId: '1031695393112',
  appId: '1:1031695393112:web:926ced863cc967dae0052d',
};

const app = firebase.initializeApp(config);
export const auth=app.auth();
export const database=app.database();
export const storage=app.storage();