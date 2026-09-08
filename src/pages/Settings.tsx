import { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { Icon } from '../app/icons';
import { useAuth } from '../app/AuthContext';

export default function Settings(){
  const {user,enabled,login,logout}=useAuth();const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
  const connect=async()=>{setBusy(true);setMessage('');try{await login();setMessage('ログインしました。作品を同期しています。')}catch(error){setMessage(authErrorMessage(error))}finally{setBusy(false)}};
  return <div className="page-stack"><section className="page-heading"><div><span className="eyebrow">ACCOUNT</span><h1>アカウント</h1><p>Googleでログインすると、作品をどの端末からでも利用できます。</p></div>{user?<button className="button" onClick={()=>void logout()}>ログアウト</button>:<button className="button google-button" disabled={!enabled||busy} onClick={()=>void connect()}><span>G</span>{busy?'ログイン中…':'Googleでログイン'}</button>}</section>{!enabled&&<div className="notice auth-notice"><strong>Googleログインは現在利用できません</strong><span>Firebaseの接続設定がこのデプロイに反映されていません。設定後に再デプロイしてください。</span></div>}{message&&<div className="notice">{message}</div>}<section className="settings-section"><h2>作品の保存</h2><div className="integration-list"><article><span className="integration-icon cloud"><Icon name="cloud" size={25}/></span><div><h3>{user?'クラウドに同期中':'この端末に保存中'}</h3><p>{user?`${user.displayName||user.email} のコンポーネントとページを同期しています。`:'作成した内容はこのブラウザに保存されます。ログインすると複数端末で共有できます。'}</p></div><span className={`connection-badge ${user?'ready':''}`}><i/>{user?'同期中':'ローカル保存'}</span></article></div></section></div>
}

function authErrorMessage(error:unknown){
  if(!(error instanceof FirebaseError))return 'ログインできませんでした。時間をおいてもう一度お試しください。';
  const messages:Record<string,string>={
    'auth/popup-closed-by-user':'ログイン画面が閉じられました。もう一度お試しください。',
    'auth/popup-blocked':'ログイン画面がブロックされました。ポップアップを許可してください。',
    'auth/unauthorized-domain':'このドメインはFirebaseで許可されていません。Firebase Authenticationの承認済みドメインへ追加してください。',
    'auth/operation-not-allowed':'GoogleログインがFirebaseで有効になっていません。ログイン方法からGoogleを有効化してください。',
    'auth/network-request-failed':'通信に失敗しました。ネットワークを確認してもう一度お試しください。',
  };
  return messages[error.code]||`ログインできませんでした（${error.code}）。`;
}
