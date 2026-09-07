import { getAuth, GithubAuthProvider } from 'firebase/auth';
import { firebaseApp } from './firebase';

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('repo');
githubProvider.setCustomParameters({ allow_signup: 'true' });
