# Componenter

コンポーネントを実際の見た目で探し、組み合わせ、Reactコードとして持ち帰るためのUIワークスペースです。

## ローカル起動

```bash
npm install
npm run dev
```

## 現在使える機能

- コンポーネント辞書（検索・カテゴリ絞り込み・単体プレビュー・コード表示）
- ビジュアルUIビルダー（追加・編集・並び替え・レスポンシブプレビュー）
- Reactコード生成とコピー
- ブラウザへの自動保存
- Button / Card / Badgeの本格的なビジュアル作成（寸法、余白、色、グラデーション、文字、境界線、影）
- サンドボックス化されたHTML/CSS直接編集とレスポンシブプレビュー
- hover / active / rotate / scale / transition / keyframes / `::before` / `::after` のモーション編集
- クリック時の状態切替・文字切替・カウントと、サンドボックス化されたJavaScript直接編集
- 公開・非公開を選べるユーザーコンポーネント
- 全ユーザー向けコミュニティ、いいね、人気順のおすすめ
- オンボーディングガイド、Firebase / GitHub / Cloudflare設定画面

## Firebase / GitHub

`.env.example` を `.env.local` にコピーし、Firebase Consoleの値を設定します。Firebase AuthenticationでGitHubプロバイダ、Firestoreを有効化してください。Firestoreには `firestore.rules` を適用します。未設定時もローカル保存で全機能を試せます。

GitHubログイン後はビルダーの内容と作成コンポーネントがユーザー単位でFirestoreへ同期され、設定画面から非公開リポジトリを作成できます。公開コンポーネントはコミュニティへ掲載され、非公開コンポーネントは本人だけが読み取れます。リポジトリ作成にはFirebase Authentication側のGitHub OAuth Appへ `repo` スコープが必要です。

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- SPA fallback: Cloudflare Pagesの標準挙動で `index.html` にフォールバック
