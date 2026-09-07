import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Icon, type IconName } from './icons';
import { useAuth } from './AuthContext';

const nav: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'ホーム', icon: 'home' }, { to: '/components', label: 'コンポーネント', icon: 'grid' },
  { to: '/builder', label: 'UIビルダー', icon: 'wand' }, { to: '/guide', label: '使い方', icon: 'book' },
  { to: '/community', label: 'みんなの作品', icon: 'users' },
];

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  useEffect(() => { window.scrollTo({ top: 0, left: 0 }); }, [location.pathname]);
  const title = location.pathname === '/create' ? 'コンポーネント作成' : nav.find(n => n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to))?.label ?? '設定';
  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Icon name="layers" size={19}/></span><span>Componenter</span></div>
      <div className="workspace-switch"><span className="workspace-avatar">C</span><span><small>Workspace</small><strong>My design system</strong></span><Icon name="down" size={14}/></div>
      <nav className="main-nav">
        <span className="nav-label">WORKSPACE</span>
        {nav.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setOpen(false)}><Icon name={item.icon}/><span>{item.label}</span></NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <NavLink to="/settings" onClick={() => setOpen(false)}><Icon name="settings"/><span>設定・連携</span></NavLink>
        <div className="sync-card"><span className={`status-dot ${user?'online':''}`}/><div><strong>{user?'クラウド同期中':'ローカル保存中'}</strong><small>{user?user.email:'Firebaseを接続して同期'}</small></div></div>
      </div>
    </aside>
    {open && <button className="backdrop" onClick={() => setOpen(false)} aria-label="メニューを閉じる"/>}
    <main className="main-area">
      <header className="topbar"><button className="icon-button menu-button" onClick={() => setOpen(!open)}><Icon name={open ? 'x' : 'menu'}/></button><span className="mobile-title">{title}</span><div className="topbar-actions"><NavLink className="help-link" to="/guide">使い方を見る</NavLink><NavLink className="avatar" to="/settings">{user?.displayName?.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase() || 'TM'}</NavLink></div></header>
      <div className="page"><Outlet/></div>
    </main>
  </div>;
}
