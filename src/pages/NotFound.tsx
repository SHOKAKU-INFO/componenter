import { Link } from 'react-router-dom';
import { Icon } from '../app/icons';

export default function NotFound(){return <main className="not-found"><Link to="/" className="lp-brand"><span><Icon name="layers" size={19}/></span>Componenter</Link><div><strong>404</strong><h1>ページが見つかりません</h1><p>URLが変更されたか、ページが削除された可能性があります。</p><Link to="/" className="lp-button primary">トップへ戻る <Icon name="arrow"/></Link></div></main>}
