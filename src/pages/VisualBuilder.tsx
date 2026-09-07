import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../app/icons';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../app/AuthContext';
import { db } from '../lib/firebaseDb';

type BlockType = 'hero' | 'features' | 'cta' | 'article';
type Block = { id: string; type: BlockType; title: string; body: string; accent: string };
const templates: Record<BlockType, Omit<Block, 'id'>> = {
  hero: { type: 'hero', title: 'Build something people love.', body: 'A clear starting point for your next product. Composed from your own component library.', accent: '#635bff' },
  features: { type: 'features', title: 'Everything you need', body: 'Fast setup|Reusable parts|Production ready', accent: '#635bff' },
  cta: { type: 'cta', title: 'Ready to get started?', body: 'Create your first project today.', accent: '#151519' },
  article: { type: 'article', title: 'A thoughtful approach to design', body: 'The best interfaces feel inevitable. Start small, reuse what works, and let your system grow with the product.', accent: '#ef7c5c' },
};
const initial: Block[] = [{ ...templates.hero, id: 'hero-1' }, { ...templates.features, id: 'features-1' }, { ...templates.cta, id: 'cta-1' }];

function BlockPreview({ block, selected, onClick }: { block: Block; selected: boolean; onClick: () => void }) {
  if (block.type === 'hero') return <section onClick={onClick} className={`canvas-block canvas-hero ${selected?'selected':''}`}><span className="mini-pill">NEW RELEASE</span><h1>{block.title}</h1><p>{block.body}</p><div><button style={{background:block.accent}}>Get started</button><button className="outline">Learn more</button></div></section>;
  if (block.type === 'features') return <section onClick={onClick} className={`canvas-block canvas-features ${selected?'selected':''}`}><span className="canvas-kicker" style={{color:block.accent}}>WHY COMPONENTS</span><h2>{block.title}</h2><div>{block.body.split('|').map((x,i)=><article key={i}><i style={{background:`${block.accent}18`,color:block.accent}}>{i+1}</i><strong>{x}</strong><small>Designed to stay consistent as your product grows.</small></article>)}</div></section>;
  if (block.type === 'article') return <section onClick={onClick} className={`canvas-block canvas-article ${selected?'selected':''}`}><span className="canvas-kicker" style={{color:block.accent}}>JOURNAL · 5 MIN READ</span><h2>{block.title}</h2><p>{block.body}</p><a style={{color:block.accent}}>Read the story →</a></section>;
  return <section onClick={onClick} className={`canvas-block canvas-cta ${selected?'selected':''}`} style={{background:block.accent}}><div><h2>{block.title}</h2><p>{block.body}</p></div><button>Start building</button></section>;
}

function generateCode(blocks: Block[]) {
  const rows = blocks.map(b => {
    if (b.type==='hero') return `      <Hero title="${b.title}" description="${b.body}" accent="${b.accent}" />`;
    if (b.type==='features') return `      <FeatureGrid title="${b.title}" items={${JSON.stringify(b.body.split('|'))}} />`;
    if (b.type==='article') return `      <ArticlePreview title="${b.title}" summary="${b.body}" />`;
    return `      <CallToAction title="${b.title}" description="${b.body}" accent="${b.accent}" />`;
  });
  return `export default function LandingPage() {\n  return (\n    <main>\n${rows.join('\n')}\n    </main>\n  );\n}`;
}

export default function VisualBuilder() {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<Block[]>(() => { try { return JSON.parse(localStorage.getItem('componenter-builder') || '') } catch { return initial } });
  const [selectedId, setSelectedId] = useState(blocks[0]?.id ?? ''); const [device, setDevice] = useState<'desktop'|'tablet'|'mobile'>(() => window.matchMedia('(max-width: 760px)').matches ? 'mobile' : 'desktop'); const [showCode, setShowCode] = useState(false); const [saved, setSaved] = useState(false);
  const [cloudLoaded, setCloudLoaded] = useState(!user);
  const selected = blocks.find(b=>b.id===selectedId); const code = useMemo(()=>generateCode(blocks),[blocks]);
  useEffect(()=>{ localStorage.setItem('componenter-builder', JSON.stringify(blocks)); setSaved(true); const t=setTimeout(()=>setSaved(false),900); return()=>clearTimeout(t); },[blocks]);
  useEffect(() => {
    if (!user || !db) { setCloudLoaded(true); return; }
    setCloudLoaded(false);
    getDoc(doc(db, 'users', user.uid, 'projects', 'current')).then(snapshot => {
      const cloudBlocks = snapshot.data()?.blocks;
      if (Array.isArray(cloudBlocks)) { setBlocks(cloudBlocks as Block[]); setSelectedId(cloudBlocks[0]?.id ?? ''); }
    }).finally(() => setCloudLoaded(true));
  }, [user]);
  useEffect(() => {
    if (!user || !db || !cloudLoaded) return;
    const timer = setTimeout(() => { void setDoc(doc(db!, 'users', user.uid, 'projects', 'current'), { blocks, updatedAt: serverTimestamp() }, { merge: true }); }, 700);
    return () => clearTimeout(timer);
  }, [blocks, cloudLoaded, user]);
  const add = (type: BlockType) => { const b={...templates[type], id:`${type}-${Date.now()}`}; setBlocks(x=>[...x,b]); setSelectedId(b.id); };
  const update = (patch: Partial<Block>) => setBlocks(x=>x.map(b=>b.id===selectedId?{...b,...patch}:b));
  const move = (dir: -1|1) => setBlocks(x=>{const i=x.findIndex(b=>b.id===selectedId); const n=i+dir;if(i<0||n<0||n>=x.length)return x;const copy=[...x];[copy[i],copy[n]]=[copy[n],copy[i]];return copy});
  const remove = () => { const i=blocks.findIndex(b=>b.id===selectedId); const next=blocks.filter(b=>b.id!==selectedId); setBlocks(next); setSelectedId(next[Math.max(0,i-1)]?.id??''); };
  const copy = () => navigator.clipboard?.writeText(code);
  return <div className="builder-page">
    <section className="builder-heading"><div><span className="eyebrow">VISUAL UI BUILDER</span><h1>ページを組み立てる</h1></div><div className="builder-actions"><span className="save-state"><Icon name="check" size={14}/>{user?(cloudLoaded?'クラウド同期済み':'同期中…'):(saved?'保存しました':'ローカルに保存済み')}</span><button className="button" onClick={()=>setShowCode(!showCode)}><Icon name="code"/>{showCode?'プレビューを見る':'コードを見る'}</button><button className="button primary" onClick={copy}><Icon name="copy"/>コードをコピー</button></div></section>
    <div className="builder-workspace">
      <aside className="block-panel"><h3>パーツを追加</h3><p>クリックしてキャンバスに追加</p><div className="block-options"><button onClick={()=>add('hero')}><span className="block-thumb hero-thumb"><i/><b/><small/></span><strong>ヒーロー</strong><small>見出し・説明・CTA</small></button><button onClick={()=>add('features')}><span className="block-thumb feature-thumb"><i/><i/><i/></span><strong>特徴リスト</strong><small>3つのポイント</small></button><button onClick={()=>add('article')}><span className="block-thumb article-thumb"><b/><i/><i/></span><strong>記事</strong><small>読みもの・紹介</small></button><button onClick={()=>add('cta')}><span className="block-thumb cta-thumb"><i/><b/></span><strong>CTA</strong><small>最後のひと押し</small></button></div><div className="builder-hint"><Icon name="sparkles"/><p><strong>まずは触ってみよう</strong>追加したパーツを選ぶと、右側で文言や色を変えられます。</p></div></aside>
      <section className="canvas-area"><div className="canvas-toolbar"><span>{showCode?'生成コード':'ライブプレビュー'}</span><div className="device-tabs">{(['desktop','tablet','mobile'] as const).map(d=><button key={d} className={device===d?'active':''} onClick={()=>setDevice(d)} disabled={showCode}>{d==='desktop'?'Desktop':d==='tablet'?'Tablet':'Mobile'}</button>)}</div><span>{blocks.length} blocks</span></div>{showCode?<pre className="builder-code"><code>{code}</code></pre>:<div className={`canvas-frame ${device}`}>{blocks.length?blocks.map(b=><BlockPreview key={b.id} block={b} selected={b.id===selectedId} onClick={()=>setSelectedId(b.id)}/>):<div className="canvas-empty"><Icon name="plus" size={28}/><h3>パーツを追加してください</h3><p>左の一覧から始められます。</p></div>}</div>}</section>
      <aside className="property-panel"><h3>プロパティ</h3>{selected?<><div className="selected-name"><span className="quick-icon lavender"><Icon name="layers"/></span><div><small>選択中</small><strong>{selected.type.toUpperCase()}</strong></div></div><label>タイトル<textarea rows={3} value={selected.title} onChange={e=>update({title:e.target.value})}/></label><label>本文<textarea rows={5} value={selected.body} onChange={e=>update({body:e.target.value})}/><small>{selected.type==='features'?'「|」で項目を区切ります':''}</small></label><label>アクセントカラー<div className="color-input"><input type="color" value={selected.accent} onChange={e=>update({accent:e.target.value})}/><input value={selected.accent} onChange={e=>update({accent:e.target.value})}/></div></label><div className="order-actions"><button onClick={()=>move(-1)}><Icon name="up"/>上へ</button><button onClick={()=>move(1)}><Icon name="down"/>下へ</button><button className="danger" onClick={remove}><Icon name="trash"/>削除</button></div></>:<div className="property-empty"><Icon name="wand"/><p>キャンバスのパーツを選択してください。</p></div>}</aside>
    </div>
  </div>;
}
