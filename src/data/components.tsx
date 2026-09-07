import type { ReactNode } from 'react';
import Button from '../components/atoms/Button';
import Typography from '../components/atoms/Typography';
import ArticlePreview from '../components/molecules/ArticlePreview';
import ArticlePreviewList from '../components/organisms/ArticlePreviewList';

export type ComponentCategory = 'Atoms' | 'Molecules' | 'Organisms';
export type ComponentItem = { slug: string; name: string; category: ComponentCategory; description: string; tags: string[]; updated: string; code: string; preview: (compact?: boolean) => ReactNode };

const article = { id: '01', title: 'A calmer way to build interfaces', summary: 'Compose polished screens from small, reusable decisions.', date: '2026.09.07' };

export const components: ComponentItem[] = [
  { slug: 'button', name: 'Button', category: 'Atoms', description: '操作の起点になる、アクセシブルな基本ボタン。', tags: ['action', 'form'], updated: 'たった今', code: `<Button type="button" onClick={handleClick}>\n  プロジェクトを作成\n</Button>`, preview: () => <Button>プロジェクトを作成</Button> },
  { slug: 'typography', name: 'Typography', category: 'Atoms', description: '見出しから注釈まで一貫した文字組みを提供。', tags: ['text', 'foundation'], updated: '2日前', code: `<Typography variant="h2">\n  Make something clear.\n</Typography>`, preview: compact => <Typography variant={compact ? 'body' : 'h2'}>Make something clear.</Typography> },
  { slug: 'article-preview', name: 'ArticlePreview', category: 'Molecules', description: '記事の要点と日付をひとまとまりで表示。', tags: ['content', 'card'], updated: '3日前', code: `<ArticlePreview article={{\n  id: '01',\n  title: 'A calmer way to build',\n  summary: 'Compose from reusable parts.',\n  date: '2026.09.07'\n}} />`, preview: () => <ArticlePreview article={article}/> },
  { slug: 'article-preview-list', name: 'ArticlePreviewList', category: 'Organisms', description: '複数の記事カードを読みやすいリストに構成。', tags: ['content', 'list'], updated: '5日前', code: `<ArticlePreviewList articles={articles} />`, preview: compact => <ArticlePreviewList articles={compact ? [article] : [article, { ...article, id: '02', title: 'Design systems that stay useful', date: '2026.09.04' }]}/> },
];

export const categoryLabel: Record<ComponentCategory, string> = { Atoms: '原子', Molecules: '分子', Organisms: '構成' };
