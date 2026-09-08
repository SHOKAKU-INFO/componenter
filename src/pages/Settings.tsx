import { useState } from 'react';
import { Icon } from '../app/icons';
import { useAuth } from '../app/AuthContext';

export default function Settings(){
  const {user,enabled,login,logout}=useAuth();const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
  const connect=async()=>{setBusy(true);setMessage('');try{await login();setMessage('ログインしました。作品を同期しています。')}catch{setMessage('ログインできませんでした。時間をおいてもう一度お試しください。')}finally{setBusy(false)}};
  return <div className="page-stack"><section className="page-heading"><div><span className="eyebrow">ACCOUNT</span><h1>アカウント</h1><p>Googleでログインすると、作品をどの端末からでも利用できます。</p></div>{user?<button className="button" onClick={()=>void logout()}>ログアウト</button>:<button className="button google-button" disabled={!enabled||busy} onClick={()=>void connect()}><span>G</span>{busy?'ログイン中…':'Googleでログイン'}</button>}</section>{message&&<div className="notice">{message}</div>}<section className="settings-section"><h2>作品の保存</h2><div className="integration-list"><article><span className="integration-icon cloud"><Icon name="cloud" size={25}/></span><div><h3>{user?'クラウドに同期中':'この端末に保存中'}</h3><p>{user?`${user.displayName||user.email} のコンポーネントとページを同期しています。`:'作成した内容はこのブラウザに保存されます。ログインすると複数端末で共有できます。'}</p></div><span className={`connection-badge ${user?'ready':''}`}><i/>{user?'同期中':'ローカル保存'}</span></article></div></section></div>
}
