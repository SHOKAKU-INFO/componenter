/* eslint-disable react-refresh/only-export-components */
import { useState, type CSSProperties } from 'react';

export type CommunityComponent = {
  id: string; name: string; description: string; type: 'button'|'card'|'badge'|'custom'; text: string; color: string; radius: number;
  visibility: 'public'|'private'; authorId: string; authorName: string; likes: number; likedBy?: string[]; createdAt?: unknown;
  customHtml?: string; customCss?: string; customJs?: string;
  styles?: { color?:string; secondaryColor?:string; fontSize?:number; fontWeight?:number; paddingX?:number; paddingY?:number; width?:number; minHeight?:number; borderWidth?:number; borderColor?:string; shadow?:string; gradient?:boolean; gradientAngle?:number; fontFamily?:string; letterSpacing?:number; rotate?:number; scale?:number; hoverRotate?:number; hoverScale?:number; activeScale?:number; duration?:number; easing?:string; animation?:string; clickAction?:string; clickValue?:string; beforeEnabled?:boolean; beforeContent?:string; beforeColor?:string; beforeSize?:number; beforeRotate?:number; afterEnabled?:boolean; afterContent?:string; afterColor?:string; afterSize?:number; afterRotate?:number; };
};

export const featuredComponents: CommunityComponent[] = [
  { id:'featured-orbit', name:'Orbit Button', description:'グラデーションが印象的なメインアクション。', type:'button', text:'Launch project', color:'#665cff', radius:12, visibility:'public', authorId:'seed-aya', authorName:'Aya Mori', likes:184 },
  { id:'featured-note', name:'Quiet Note Card', description:'情報を静かに整理するノートカード。', type:'card', text:'Small decisions make clear products.', color:'#df765a', radius:18, visibility:'public', authorId:'seed-ren', authorName:'Ren Ito', likes:132 },
  { id:'featured-status', name:'Fresh Status', description:'プロダクトの状態を伝える小さなバッジ。', type:'badge', text:'Ready to ship', color:'#3b9470', radius:99, visibility:'public', authorId:'seed-mio', authorName:'Mio', likes:97 },
  { id:'featured-night', name:'Night Card', description:'ダークUI向けのコンテンツカード。', type:'card', text:'Built after midnight.', color:'#292833', radius:14, visibility:'public', authorId:'seed-kai', authorName:'Kai Sato', likes:76 },
];

export function CommunityPreview({ item, interactive = true }: { item: CommunityComponent; interactive?: boolean }) {
  const [active,setActive]=useState(false); const [count,setCount]=useState(0);
  if(item.type==='custom' && item.customHtml) {
    const safeJs=(item.customJs||'').replace(/<\/script/gi,'<\\/script');
    return <iframe className="custom-component-frame" title={`${item.name} preview`} sandbox={interactive?'allow-scripts':''} srcDoc={`<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob:"><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;display:grid;place-items:center;font-family:system-ui,sans-serif}${item.customCss||''}</style>${item.customHtml}${interactive?`<script>${safeJs}</script>`:''}`}/>;
  }
  const base: CSSProperties = { borderRadius:item.radius };
  const s=item.styles||{}; const background=s.gradient?`linear-gradient(${s.gradientAngle||135}deg,${item.color},${s.secondaryColor||'#9b8cff'})`:item.color;
  const advanced:CSSProperties={...base,color:s.color||(item.type==='card'?'#ffffff':undefined),fontSize:s.fontSize,fontWeight:s.fontWeight,padding:`${s.paddingY??11}px ${s.paddingX??18}px`,width:s.width?`${s.width}px`:undefined,minHeight:s.minHeight?`${s.minHeight}px`:undefined,borderWidth:s.borderWidth,borderColor:s.borderColor,borderStyle:s.borderWidth?'solid':undefined,boxShadow:s.shadow,fontFamily:s.fontFamily,letterSpacing:s.letterSpacing};
  const scope=`made-${item.id.replace(/[^a-z0-9]/gi,'')||'preview'}`; const content=s.clickAction==='counter'&&count?`${item.text} ${count}`:s.clickAction==='text'&&active?(s.clickValue||'Done!'):item.text;
  const click=()=>{if(s.clickAction==='counter')setCount(x=>x+1);else if(s.clickAction&&s.clickAction!=='none')setActive(x=>!x)};
  const motion=`.${scope}{position:relative;transform:rotate(${s.rotate||0}deg) scale(${s.scale||1});transition:all ${s.duration??300}ms ${s.easing||'ease'};animation:${animationValue(s.animation)}}.${scope}:hover{transform:rotate(${s.hoverRotate??s.rotate??0}deg) scale(${s.hoverScale||1.04})}.${scope}:active{transform:rotate(${s.hoverRotate??s.rotate??0}deg) scale(${s.activeScale||.96})}.${scope}.is-active{filter:saturate(1.3);transform:rotate(${(s.rotate||0)+8}deg) scale(${s.hoverScale||1.04})}.${scope}::before{${pseudo(s.beforeEnabled,s.beforeContent,s.beforeColor,s.beforeSize,s.beforeRotate,'-14px','auto')}}.${scope}::after{${pseudo(s.afterEnabled,s.afterContent,s.afterColor,s.afterSize,s.afterRotate,'auto','-14px')}}@keyframes component-float{50%{transform:translateY(-10px) rotate(${s.rotate||0}deg)}}@keyframes component-pulse{50%{transform:scale(1.08)}}@keyframes component-spin{to{transform:rotate(360deg)}}@keyframes component-bounce{50%{transform:translateY(-14px)}}@keyframes component-reveal{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`;
  if(item.type==='button') return <><style>{motion}</style><button onClick={click} className={`made-button ${scope} ${active?'is-active':''}`} style={{...advanced,background}}>{content}</button></>;
  if(item.type==='badge') return <><style>{motion}</style><span onClick={click} className={`made-badge ${scope} ${active?'is-active':''}`} style={{...advanced,color:s.color||item.color,background:s.gradient?background:`${item.color}18`}}><i style={{background:s.color||item.color}}/>{content}</span></>;
  return <><style>{motion}</style><article onClick={click} className={`made-card ${scope} ${active?'is-active':''}`} style={{...advanced,background}}><span>COMPONENT NOTE</span><strong>{content}</strong><small>Created in Componenter</small></article></>;
}

function animationValue(name?:string){const map:Record<string,string>={float:'component-float 2.4s ease-in-out infinite',pulse:'component-pulse 1.8s ease-in-out infinite',spin:'component-spin 3s linear infinite',bounce:'component-bounce 1.5s ease-in-out infinite',reveal:'component-reveal .6s ease both'};return map[name||'']||'none'}
function pseudo(enabled?:boolean,content='',color='#8b7cff',size=18,rotate=0,top='auto',bottom='auto'){return enabled?`content:${JSON.stringify(content)};position:absolute;z-index:2;top:${top};bottom:${bottom};right:-10px;display:grid;place-items:center;width:${size}px;height:${size}px;color:#fff;background:${color};border-radius:999px;font-size:${Math.max(8,size*.45)}px;transform:rotate(${rotate}deg);pointer-events:none;`:'content:none;'}
