import { Link } from 'react-router-dom';
import { Icon } from '../app/icons';
import { components, categoryLabel } from '../data/components';

export default function Dashboard() {
  return <div className="page-stack">
    <section className="welcome-row"><div><span className="eyebrow">MY DESIGN SYSTEM</span><h1>おかえりなさい。</h1><p>コンポーネントを育てて、画面づくりをもっと速く。</p></div><Link to="/builder" className="button primary"><Icon name="plus"/>新しいUIを作る</Link></section>
    <section className="hero-card">
      <div className="hero-copy"><span className="pill light"><Icon name="sparkles" size={14}/> VISUAL BUILDER</span><h2>コードを書かずに、<br/>アイデアを画面に。</h2><p>登録したコンポーネントを並べて、編集して、Reactコードとして持ち帰れます。</p><div className="button-row"><Link to="/builder" className="button white">ビルダーを開く <Icon name="arrow"/></Link><Link to="/guide" className="text-link light">3分でわかる使い方</Link></div></div>
      <div className="hero-visual" aria-hidden="true"><div className="mock-window"><div className="mock-dots"><i/><i/><i/></div><div className="mock-body"><div className="mock-side"><b/><b/><b/></div><div className="mock-canvas"><span/><strong/><small/><div><i/><i/><i/></div></div></div></div><span className="floating-chip chip-one"><Icon name="grid" size={14}/> 4 components</span><span className="floating-chip chip-two"><Icon name="code" size={14}/> React code</span></div>
    </section>
    <section className="section-block"><div className="section-heading"><div><h2>コンポーネント辞書</h2><p>プロジェクトにあるUIを、用途と見た目から探せます。</p></div><Link to="/components" className="text-link">すべて見る <Icon name="arrow" size={15}/></Link></div>
      <div className="component-grid">{components.slice(0,3).map(item => <Link to={`/components/${item.slug}`} className="component-card" key={item.slug}><div className={`component-preview tone-${item.category.toLowerCase()}`}>{item.preview(true)}</div><div className="component-meta"><span className={`category-badge ${item.category.toLowerCase()}`}>{categoryLabel[item.category]}</span><h3>{item.name}</h3><p>{item.description}</p><small>更新 {item.updated}</small></div></Link>)}</div>
    </section>
    <section className="quick-grid"><Link to="/create" className="quick-card"><span className="quick-icon lavender"><Icon name="plus"/></span><div><strong>コンポーネントを作る</strong><small>見た目を整えて公開</small></div><Icon name="arrow"/></Link><Link to="/community" className="quick-card"><span className="quick-icon mint"><Icon name="users"/></span><div><strong>みんなの作品を見る</strong><small>人気のUIからアイデアを探す</small></div><Icon name="arrow"/></Link><Link to="/guide" className="quick-card"><span className="quick-icon peach"><Icon name="book"/></span><div><strong>はじめてガイド</strong><small>基本の使い方を3ステップで</small></div><Icon name="arrow"/></Link></section>
  </div>;
}
