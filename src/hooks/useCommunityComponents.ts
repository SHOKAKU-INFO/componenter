import { useCallback, useEffect, useMemo, useState } from 'react';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, increment, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { useAuth } from '../app/AuthContext';
import { featuredComponents, type CommunityComponent } from '../data/community';
import { db } from '../lib/firebaseDb';

const STORAGE = 'componenter-user-components'; const LIKES = 'componenter-liked-components';
const readLocal = (): CommunityComponent[] => { try { const x=JSON.parse(localStorage.getItem(STORAGE)||'[]'); return Array.isArray(x)?x:[] } catch { return [] } };
const writeLocal = (items: CommunityComponent[]) => localStorage.setItem(STORAGE,JSON.stringify(items.filter(x=>x.id.startsWith('local-'))));

export function useCommunityComponents(){
  const { user } = useAuth(); const [custom,setCustom]=useState<CommunityComponent[]>(readLocal); const [liked,setLiked]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem(LIKES)||'[]')}catch{return[]}}); const [loading,setLoading]=useState(Boolean(db));
  const refresh = useCallback(async()=>{
    if(!db)return; setLoading(true);
    try{
      const publicSnap=await getDocs(query(collection(db,'components'),where('visibility','==','public')));
      const ownSnap=user?await getDocs(query(collection(db,'components'),where('authorId','==',user.uid))):null;
      const merged=new Map<string,CommunityComponent>(); [...publicSnap.docs,...(ownSnap?.docs||[])].forEach(d=>merged.set(d.id,{id:d.id,...d.data()} as CommunityComponent)); if(!user)readLocal().forEach(item=>merged.set(item.id,item));setCustom([...merged.values()]);
    }finally{setLoading(false)}
  },[user]);
  useEffect(()=>{void refresh()},[refresh]);
  const create=async(input:Omit<CommunityComponent,'id'|'authorId'|'authorName'|'likes'>)=>{
    const record={...input,authorId:user?.uid||'local-user',authorName:user?.displayName||user?.email?.split('@')[0]||'You',likes:0,likedBy:[],createdAt:serverTimestamp()};
    if(db&&user){const ref=await addDoc(collection(db,'components'),record);setCustom(x=>[{...record,id:ref.id} as CommunityComponent,...x]);return ref.id}
    const local={...record,id:`local-${Date.now()}`,createdAt:Date.now()} as CommunityComponent; const next=[local,...custom];setCustom(next);writeLocal(next);return local.id;
  };
  const updateComponent=async(id:string,patch:Partial<Omit<CommunityComponent,'id'|'authorId'|'authorName'|'likes'|'likedBy'>>)=>{
    if(db&&user&&!id.startsWith('local-'))await updateDoc(doc(db,'components',id),{...patch,updatedAt:serverTimestamp()});
    setCustom(current=>{const next=current.map(item=>item.id===id?{...item,...patch,updatedAt:Date.now()}:item);writeLocal(next);return next});
  };
  const deleteComponent=async(id:string)=>{
    if(db&&user&&!id.startsWith('local-'))await deleteDoc(doc(db,'components',id));
    setCustom(current=>{const next=current.filter(item=>item.id!==id);writeLocal(next);return next});
  };
  const duplicateComponent=async(item:CommunityComponent)=>create({name:`${item.name} Copy`,description:item.description,type:item.type,text:item.text,color:item.color,radius:item.radius,visibility:'private',customHtml:item.customHtml,customCss:item.customCss,customJs:item.customJs,styles:item.styles});
  const toggleLike=async(item:CommunityComponent)=>{const actor=user?.uid||'local-user';const isLiked=item.likedBy?.includes(actor)||liked.includes(item.id);setLiked(x=>{const n=isLiked?x.filter(id=>id!==item.id):[...x,item.id];localStorage.setItem(LIKES,JSON.stringify(n));return n});setCustom(x=>x.map(c=>c.id===item.id?{...c,likes:Math.max(0,c.likes+(isLiked?-1:1)),likedBy:isLiked?c.likedBy?.filter(id=>id!==actor):[...(c.likedBy||[]),actor]}:c));if(db&&user&&!item.id.startsWith('featured-')&&!item.id.startsWith('local-'))await updateDoc(doc(db,'components',item.id),{likes:increment(isLiked?-1:1),likedBy:isLiked?arrayRemove(actor):arrayUnion(actor)})};
  const all=useMemo(()=>[...featuredComponents.map(x=>({...x,likes:x.likes+(liked.includes(x.id)?1:0)})),...custom],[custom,liked]);
  return {all,custom,liked,loading,create,updateComponent,deleteComponent,duplicateComponent,toggleLike,user};
}
