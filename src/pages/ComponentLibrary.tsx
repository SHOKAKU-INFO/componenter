import { useMemo, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { Icon } from '../app/icons';
import { categoryLabel, components, type ComponentCategory } from '../data/components';
import { CommunityPreview } from '../data/community';
import { useCommunityComponents } from '../hooks/useCommunityComponents';

function LibraryList() {
  const [query, setQuery] = useState(''); const [filter, setFilter] = useState<'All' | ComponentCategory>('All');
  const { custom, user } = useCommunityComponents();
  const mine = custom.filter(x => x.authorId === (user?.uid || 'local-user'));
  const visible = useMemo(() => components.filter(c => (filter === 'All' || c.category === filter) && `${c.name} ${c.description} ${c.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [query, filter]);
  return <div className="page-stack"><section className="page-heading"><div><span className="eyebrow">COMPONENT DICTIONARY</span><h1>コンポーネント</h1><p>ひとつずつ見て、試して、コードを持ち帰る。</p></div><div className="button-row"><Link to="/create" className="button"><Icon name="plus"/>部品を作る</Link><Link to="/builder" className="button primary"><Icon name="wand"/>UIを作る</Link></div></section>
    {mine.length>0&&<section><div className="section-heading"><div><h2>自分のコンポーネント</h2><p>公開・非公開を問わず、作成した部品がここに残ります。</p></div><Link to="/create" className="text-link">新しく作る <Icon name="arrow"/></Link></div><div className="community-grid compact">{mine.map(item=><article className="community-card" key={item.id}><div className="community-preview"><CommunityPreview item={item}/></div><div className="community-info"><div><span className={`visibility-label ${item.visibility}`}><Icon name={item.visibility==='public'?'globe':'lock'} size={10}/>{item.visibility==='public'?'公開':'非公開'}</span><h3>{item.name}</h3><p>{item.description}</p><Link className="manage-link" to={`/components/mine/${item.id}`}>管理する <Icon name="arrow" size={12}/></Link></div></div></article>)}</div></section>}
    <div className="library-toolbar"><label className="search-field"><Icon name="search"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="名前・用途・タグで検索"/></label><div className="filter-tabs">{(['All','Atoms','Molecules','Organisms'] as const).map(x => <button className={filter === x ? 'active' : ''} onClick={() => setFilter(x)} key={x}>{x === 'All' ? 'すべて' : categoryLabel[x]}</button>)}</div></div>
    <div className="results-line"><span>{visible.length} components</span><span>コードベースから自動検出</span></div>
    {visible.length ? <div className="component-grid library-grid">{visible.map(item => <Link to={item.slug} className="component-card" key={item.slug}><div className={`component-preview tone-${item.category.toLowerCase()}`}>{item.preview(true)}</div><div className="component-meta"><span className={`category-badge ${item.category.toLowerCase()}`}>{categoryLabel[item.category]}</span><h3>{item.name}</h3><p>{item.description}</p><div className="tag-row">{item.tags.map(t => <span key={t}>#{t}</span>)}</div></div></Link>)}</div> : <div className="empty-state"><Icon name="search" size={28}/><h3>見つかりませんでした</h3><p>検索語やカテゴリを変えてみてください。</p></div>}
  </div>;
}

function ComponentDetail() {
  const { slug } = useParams(); const item = components.find(c => c.slug === slug); const [tab, setTab] = useState<'preview'|'code'>('preview'); const [copied, setCopied] = useState(false); const [bg, setBg] = useState('#f7f7f4');
  if (!item) return <div className="empty-state"><h2>コンポーネントが見つかりません</h2><Link to="/components" className="button">一覧へ戻る</Link></div>;
  const copy = async () => { await navigator.clipboard?.writeText(item.code); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return <div className="page-stack"><div className="breadcrumbs"><Link to="/components">コンポーネント</Link><Icon name="arrow" size={13}/><span>{item.name}</span></div><section className="detail-heading"><div><span className={`category-badge ${item.category.toLowerCase()}`}>{categoryLabel[item.category]}</span><h1>{item.name}</h1><p>{item.description}</p></div><Link to="/builder" className="button primary"><Icon name="wand"/>この部品でUIを作る</Link></section>
    <div className="detail-layout"><div className="detail-main"><div className="preview-toolbar"><div className="segmented"><button className={tab==='preview'?'active':''} onClick={()=>setTab('preview')}><Icon name="eye"/>プレビュー</button><button className={tab==='code'?'active':''} onClick={()=>setTab('code')}><Icon name="code"/>コード</button></div>{tab==='preview' && <label className="color-setting">背景 <input type="color" value={bg} onChange={e=>setBg(e.target.value)}/></label>}{tab==='code' && <button className="button small" onClick={copy}><Icon name={copied?'check':'copy'}/>{copied?'コピーしました':'コピー'}</button>}</div>
      {tab === 'preview' ? <div className="detail-preview" style={{background:bg}}>{item.preview()}</div> : <pre className="code-block"><code>{item.code}</code></pre>}</div>
      <aside className="detail-aside"><h3>概要</h3><dl><div><dt>カテゴリ</dt><dd>{item.category}</dd></div><div><dt>ファイル</dt><dd>{item.name}.tsx</dd></div><div><dt>更新</dt><dd>{item.updated}</dd></div></dl><h3>タグ</h3><div className="tag-row">{item.tags.map(t=><span key={t}>#{t}</span>)}</div><div className="tip-box"><Icon name="book"/><p><strong>Tips</strong>プレビューとコードを切り替えて、実装を確認できます。</p></div></aside></div>
  </div>;
}

export default function ComponentLibrary(){ return <Routes><Route index element={<LibraryList/>}/><Route path=":slug" element={<ComponentDetail/>}/></Routes>; }
