import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../app/icons';
import { CommunityPreview, componentCode } from '../data/community';
import { useCommunityComponents } from '../hooks/useCommunityComponents';

export default function UserComponentDetail(){
  const {id=''}=useParams(); const navigate=useNavigate();
  const {custom,user,loading,updateComponent,deleteComponent,duplicateComponent}=useCommunityComponents();
  const [busy,setBusy]=useState(false); const [copied,setCopied]=useState(false); const [message,setMessage]=useState('');
  const item=custom.find(component=>component.id===id&&component.authorId===(user?.uid||'local-user'));
  if(!item&&loading)return <div className="empty-state"><h2>コンポーネントを読み込んでいます</h2></div>;
  if(!item)return <div className="empty-state"><h2>コンポーネントが見つかりません</h2><p>削除されたか、表示する権限がありません。</p><Link to="/components" className="button">一覧へ戻る</Link></div>;
  const copy=async()=>{await navigator.clipboard?.writeText(componentCode(item));setCopied(true);setTimeout(()=>setCopied(false),1500)};
  const toggleVisibility=async()=>{setBusy(true);setMessage('');try{const visibility=item.visibility==='public'?'private':'public';await updateComponent(item.id,{visibility});setMessage(visibility==='public'?'公開しました。':'非公開にしました。')}catch{setMessage('公開設定を変更できませんでした。')}finally{setBusy(false)}};
  const duplicate=async()=>{setBusy(true);setMessage('');try{const nextId=await duplicateComponent(item);navigate(`/components/mine/${nextId}`)}catch{setMessage('複製できませんでした。')}finally{setBusy(false)}};
  const remove=async()=>{if(!window.confirm(`「${item.name}」を削除しますか？この操作は取り消せません。`))return;setBusy(true);try{await deleteComponent(item.id);navigate('/components')}catch{setMessage('削除できませんでした。');setBusy(false)}};
  return <div className="page-stack user-component-detail">
    <div className="breadcrumbs"><Link to="/components">コンポーネント</Link><Icon name="arrow" size={13}/><span>{item.name}</span></div>
    <section className="detail-heading"><div><span className={`visibility-label ${item.visibility}`}><Icon name={item.visibility==='public'?'globe':'lock'} size={10}/>{item.visibility==='public'?'公開':'非公開'}</span><h1>{item.name}</h1><p>{item.description}</p></div><div className="button-row manage-actions"><button className="button" disabled={busy} onClick={()=>void duplicate()}><Icon name="copy"/>複製</button><Link className="button primary" to={`/components/mine/${item.id}/edit`}><Icon name="wand"/>編集</Link></div></section>
    {message&&<div className="notice">{message}</div>}
    <div className="detail-layout"><div className="detail-main"><div className="preview-toolbar"><strong>プレビュー</strong><button className="button small" onClick={()=>void copy()}><Icon name={copied?'check':'copy'}/>{copied?'コピーしました':'コードをコピー'}</button></div><div className="detail-preview"><CommunityPreview item={item}/></div></div><aside className="detail-aside"><h3>管理</h3><dl><div><dt>種類</dt><dd>{item.type}</dd></div><div><dt>公開範囲</dt><dd>{item.visibility==='public'?'みんなに公開':'自分だけ'}</dd></div><div><dt>いいね</dt><dd>{item.likes}</dd></div></dl><button className="button manage-wide" disabled={busy} onClick={()=>void toggleVisibility()}><Icon name={item.visibility==='public'?'lock':'globe'}/>{item.visibility==='public'?'非公開にする':'公開する'}</button><button className="button danger-button manage-wide" disabled={busy} onClick={()=>void remove()}><Icon name="trash"/>削除する</button></aside></div>
  </div>
}
