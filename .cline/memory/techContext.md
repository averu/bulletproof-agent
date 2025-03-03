# 技術コンテキスト

## 使用されている技術

### コア技術

1. **React**

   - バージョン: 18.x
   - フック API の活用
   - Suspense とコンカレントモード
   - サーバーコンポーネントのサポート

2. **TypeScript**

   - 静的型付け
   - 型推論と型チェック
   - インターフェースと型定義
   - ジェネリクスの活用

3. **Vite**

   - 高速な開発サーバー
   - ES モジュールベースの HMR
   - ビルド最適化
   - プラグインエコシステム

4. **React Query / TanStack Query**

   - データフェッチングとキャッシュ
   - サーバー状態管理
   - 自動再取得と更新
   - ミューテーション処理

5. **Zod**

   - スキーマ検証
   - ランタイム型チェック
   - 型推論との連携
   - API レスポンスの検証

6. **React Router**
   - 宣言的なルーティング
   - ネストされたルート
   - ルートパラメータとクエリパラメータ
   - ローダーとアクション

### 状態管理

1. **Jotai**

   - プリミティブで柔軟なアトムベースの状態管理
   - React のコンテキストと Suspense との統合
   - 細かい粒度の再レンダリング最適化
   - 非同期アトムと派生アトムのサポート
   - デバッグツールとデベロッパーエクスペリエンス

2. **Context API**
   - コンポーネント間の状態共有
   - プロバイダーパターン
   - 機能ごとのコンテキスト分割

### テスト技術

1. **Vitest**

   - Vite と同じ設定を共有
   - Jest 互換 API
   - 高速な実行時間
   - Watch モードと UI
   - ファイルのコロケーションをサポート

2. **Testing Library**

   - ユーザー中心のテスト
   - クエリとインタラクション
   - アクセシビリティ優先のセレクタ
   - スクリーンとユーザーイベント

3. **MSW (Mock Service Worker)**
   - API モック
   - サービスワーカーベースのインターセプト
   - リアルなネットワークリクエスト
   - テスト環境での再利用

### スタイリング

1. **TailwindCSS**

   - ユーティリティファーストアプローチ
   - カスタマイズ可能な設計システム
   - パージとパフォーマンス最適化
   - ダークモードサポート

2. **Styled Components / Emotion**
   - CSS-in-JS
   - 動的スタイリング
   - テーマのサポート
   - コンポーネントベースの設計

### ビルドとツール

1. **ESLint**

   - コード品質と一貫性
   - TypeScript 統合
   - カスタムルールとプラグイン
   - 自動修正機能

2. **Prettier**

   - 一貫したコードフォーマット
   - エディタ統合
   - Git フック連携

3. **Husky + lint-staged**

   - Git フックの自動化
   - コミット前の検証
   - 段階的なリンティングとフォーマット

4. **GitHub Actions**
   - CI/CD パイプライン
   - 自動テストと検証
   - コード品質チェック
   - 自動デプロイ

## 開発環境のセットアップ

### 必要なツール

1. **Node.js のインストール**

   ```bash
   # nvm の使用を推奨
   nvm install 18
   nvm use 18

   # または直接インストール
   # https://nodejs.org/
   ```

2. **pnpm のインストール**

   ```bash
   npm install -g pnpm
   ```

3. **エディタ設定**

   - VSCode + 拡張機能の推奨
   - 設定例:

     ```json
     {
       "editor.formatOnSave": true,
       "editor.defaultFormatter": "esbenp.prettier-vscode",
       "editor.codeActionsOnSave": {
         "source.fixAll.eslint": true
       },
       "typescript.tsdk": "node_modules/typescript/lib",
       "tailwindCSS.includeLanguages": {
         "typescript": "javascript",
         "typescriptreact": "javascript"
       },
       "vitest.enable": true,
       "vitest.commandLine": "pnpm test"
     }
     ```

4. **プロジェクトのセットアップ**

   ```bash
   # リポジトリのクローン
   git clone <repository-url>
   cd <repository-directory>

   # 依存関係のインストール
   pnpm install

   # 開発サーバーの起動
   pnpm dev
   ```

### 開発ワークフロー

1. **新しいコンポーネントの作成**

   ```bash
   # コンポーネントの生成
   pnpm generate component MyComponent
   ```

2. **テストの実行**

   ```bash
   # すべてのテストの実行
   pnpm test

   # 特定のテストの実行
   pnpm test MyComponent

   # Watch モードでのテスト
   pnpm test:watch

   # UI モードでのテスト
   pnpm test:ui

   # カバレッジレポートの生成
   pnpm test:coverage
   ```

3. **リントとフォーマット**

   ```bash
   # リント
   pnpm lint

   # リントの自動修正
   pnpm lint:fix

   # フォーマット
   pnpm format
   ```

4. **ビルドと確認**

   ```bash
   # プロダクションビルド
   pnpm build

   # ビルド結果のプレビュー
   pnpm preview
   ```

## プロジェクト構造とコロケーション

```plaintext
src/
├── assets/            # 静的アセット
├── components/        # 共有コンポーネント
│   ├── Elements/      # 基本的なUI要素
│   │   ├── Button/
│   │   │   ├── Button.tsx           # コンポーネント実装
│   │   │   ├── Button.test.tsx      # コンポーネントテスト（コロケーション）
│   │   │   └── index.ts             # エクスポート
│   ├── Form/          # フォームコンポーネント
│   └── Layout/        # レイアウトコンポーネント
├── config/            # アプリケーション設定
├── features/          # 機能モジュール
│   └── users/
│       ├── api/                      # API 関連
│       │   ├── getUsers.ts           # APIリクエスト関数
│       │   ├── getUsers.test.ts      # APIテスト（コロケーション）
│       │   └── index.ts              # エクスポート
│       ├── components/               # 機能固有のコンポーネント
│       │   ├── UserList/
│       │   │   ├── UserList.tsx      # コンポーネント
│       │   │   ├── UserList.test.tsx # テスト（コロケーション）
│       │   │   └── index.ts          # エクスポート
│       ├── hooks/                    # カスタムフック
│       │   ├── useUsers.ts           # フック
│       │   ├── useUsers.test.ts      # フックテスト（コロケーション）
│       │   └── index.ts              # エクスポート
│       ├── routes/                   # ルート定義
│       ├── stores/                   # 状態管理（Jotai atoms）
│       │   ├── userAtoms.ts          # アトム定義
│       │   ├── userAtoms.test.ts     # アトムテスト（コロケーション）
│       │   └── index.ts              # エクスポート
│       ├── types/                    # 型定義
│       └── utils/                    # ユーティリティ関数
│           ├── formatUser.ts         # ユーティリティ
│           ├── formatUser.test.ts    # テスト（コロケーション）
│           └── index.ts              # エクスポート
├── hooks/             # グローバルなカスタムフック
├── lib/               # サードパーティライブラリのラッパー
├── providers/         # コンテキストプロバイダー
├── routes/            # アプリケーションルート
├── stores/            # グローバルなJotai atoms
│   ├── auth/                       # 認証関連のアトム
│   │   ├── authAtoms.ts            # 認証アトム
│   │   ├── authAtoms.test.ts       # アトムテスト（コロケーション）
│   │   └── index.ts                # エクスポート
│   ├── ui/                         # UI状態のアトム
│   │   ├── uiAtoms.ts              # UIアトム
│   │   ├── uiAtoms.test.ts         # アトムテスト（コロケーション）
│   │   └── index.ts                # エクスポート
├── test/              # テストユーティリティ
│   ├── mocks/         # モックデータとハンドラー
│   └── utils/         # テストヘルパー
├── types/             # グローバルな型定義
└── utils/             # ユーティリティ関数
    ├── formatters/              # フォーマッター関数
    │   ├── date.ts              # 日付フォーマッター
    │   ├── date.test.ts         # テスト（コロケーション）
    │   └── index.ts             # エクスポート
    └── validation/              # バリデーション関数
        ├── email.ts             # メールバリデーション
        ├── email.test.ts        # テスト（コロケーション）
        └── index.ts             # エクスポート
```

### ディレクトリの説明

1. **assets/**

   - アプリケーションで使用される静的アセット
   - 画像、アイコン、フォント等
   - SVG コンポーネントとして使用するものも含む

2. **components/**

   - アプリケーション全体で再利用可能な共通コンポーネント
   - 機能に依存しない純粋な UI コンポーネント
   - 各コンポーネントはそれぞれ独自のディレクトリを持ち、実装、テスト、インデックスファイルを含む

3. **config/**

   - アプリケーション設定
   - 環境変数の型定義
   - 機能フラグ
   - テーマ設定

4. **features/**

   - 機能別にモジュール化されたコード
   - 各機能は独自のコンポーネント、API、フック、ストア、型を持つ
   - ドメイン駆動設計の境界コンテキストに類似
   - 各ファイルのテストはコロケーションパターンで同じディレクトリに配置

5. **hooks/**

   - アプリケーション全体で使用されるカスタムフック
   - 各フックのテストは同じディレクトリに配置

6. **lib/**

   - サードパーティライブラリのラッパー
   - クライアントの抽象化
   - 依存性の分離と交換可能性の確保

7. **providers/**

   - アプリケーション全体のコンテキストプロバイダー
   - Jotai プロバイダー、クエリプロバイダー、認証プロバイダー等

8. **routes/**

   - アプリケーションのルート定義
   - ルーターの設定
   - レイアウトとページの構成

9. **stores/**

   - グローバルな Jotai アトム
   - 機能横断的な状態管理
   - アトムファミリーと派生アトム

10. **test/**

    - テスト用のユーティリティとヘルパー
    - テストフィクスチャーとファクトリ
    - テスト用のモックサーバー設定

11. **types/**

    - グローバルな型定義
    - 型拡張
    - 型ユーティリティ

12. **utils/**
    - 純粋な関数のユーティリティ
    - ヘルパー関数
    - 各ユーティリティのテストはコロケーションパターンで同じディレクトリに配置

## Vitest とコロケーションの考慮事項

1. **ファイルのコロケーション**

   - テストファイルを実装ファイルと同じディレクトリに配置
   - 命名規則: `*.test.ts` または `*.test.tsx`
   - より密接な関連性とメンテナンスの容易さ

2. **Vitest の設定**

   ```typescript
   // vitest.config.ts
   import { defineConfig } from "vitest/config";
   import react from "@vitejs/plugin-react";
   import tsconfigPaths from "vite-tsconfig-paths";

   export default defineConfig({
     plugins: [react(), tsconfigPaths()],
     test: {
       globals: true,
       environment: "jsdom",
       setupFiles: ["./src/test/setup.ts"],
       include: ["src/**/*.test.{ts,tsx}"],
       coverage: {
         reporter: ["text", "json", "html"],
         exclude: ["src/types/**", "src/**/*.d.ts", "src/test/**"],
       },
     },
   });
   ```

3. **テスト自動検出**

   - ファイル名パターンによる自動検出
   - glob パターン: `src/**/*.test.{ts,tsx}`
   - 特定のディレクトリ構造に依存しない柔軟な検出

4. **コロケーションの利点**

   - 実装とテストの密接な関係性
   - 変更時の影響範囲の明確化
   - 関連するコードの発見可能性向上
   - リファクタリング時の同時移動が容易

5. **コロケーションのベストプラクティス**
   - テストファイルは実装ファイルと同じディレクトリに配置
   - 関連するモックやフィクスチャーも同じディレクトリに配置可能
   - テストとソースコードの同期を維持
   - `index.ts` ファイルを使用してパブリック API をエクスポート

## 技術的制約

1. **React の制約**

   - レンダリングパフォーマンスの最適化
   - 副作用の管理
   - 深いコンポーネントツリーでのプロップドリル
   - サーバーコンポーネントの制限

2. **パフォーマンスの制約**

   - 初期ロード時間の最適化
   - バンドルサイズの管理
   - メモ化と再レンダリングの最小化
   - ビルド時間の最適化

3. **テストの制約**
   - コンポーネントの分離テスト
   - グローバル状態を持つコンポーネントのテスト
   - 非同期操作のテスト
   - ユーザーインタラクションのシミュレーション

## 依存関係

### 主要な依存関係

1. **コア**

   - `react`: UI 構築のコアライブラリ
   - `react-dom`: DOM レンダリング
   - `react-router-dom`: ルーティング
   - `@tanstack/react-query`: データフェッチング
   - `jotai`: 状態管理
   - `zod`: 検証

2. **UI コンポーネント**

   - `@headlessui/react`: アクセシブルな UI 要素
   - `@radix-ui/react-*`: プリミティブコンポーネント
   - `react-hook-form`: フォーム管理

3. **テスト**
   - `vitest`: テストランナー
   - `@testing-library/react`: コンポーネントテスト
   - `@testing-library/user-event`: ユーザーイベントシミュレーション
   - `msw`: API モック
   - `@testing-library/jest-dom`: DOM マッチャー

### 依存関係管理

1. **パッケージマネージャとして pnpm を使用**

   - 高速なインストール
   - ディスク効率の良いストレージ
   - 厳格な依存関係管理

2. **バージョン管理**

   - セマンティックバージョニングの遵守
   - `pnpm-lock.yaml` によるロック
   - 定期的な依存関係の更新

3. **依存関係のグルーピング**
   - ビルド依存関係
   - 開発依存関係
   - プロダクション依存関係
   - ピアー依存関係

## 技術的な意思決定

1. **Vite の採用理由**

   - 高速な開発サーバー
   - ES モジュールネイティブアプローチ
   - 最小限の設定
   - プラグインエコシステム

2. **Vitest の採用理由**

   - Vite との統合
   - Jest 互換 API
   - パフォーマンスと開発者体験
   - ファイルコロケーションのサポート
   - 高速な実行時間と並列テスト

3. **コロケーションパターンの採用理由**

   - テストと実装の近接性
   - コードの発見可能性の向上
   - 関連するコードの結合度の強化
   - リファクタリングの容易さ

4. **機能ベースのフォルダ構造の採用理由**

   - 関連するコードの共同配置
   - モジュール境界の明確化
   - スケーラビリティの向上
   - チーム間の協業の促進

5. **TanStack Query の採用理由**

   - サーバー状態とクライアント状態の分離
   - キャッシュと再検証の最適化
   - エラー処理とローディング状態の一元管理
   - データの依存関係の管理

6. **Jotai の採用理由**

   - プリミティブなアトムベースのアプローチ
   - 細かい粒度の再レンダリング最適化
   - React Suspense との統合
   - デバッグとデベロッパーエクスペリエンス
   - Recoil に似た API と小さなバンドルサイズ
   - 派生アトムによる状態の合成

7. **Zod の採用理由**
   - ランタイム型検証
   - TypeScript との統合
   - スキーマベースの検証
   - エラーメッセージの明確さ

## Jotai を使用した状態管理戦略

1. **アトムの設計原則**

   - 単一責任の原則に従う
   - 最小限のプリミティブアトム
   - 派生アトムによる状態の合成
   - 非同期アトムの適切な使用

2. **アトムの分類**

   - プリミティブアトム: 基本的な状態
   - 派生アトム: 他のアトムから計算された状態
   - 非同期アトム: 非同期操作を含む状態
   - アトムファミリー: 動的に生成されるアトム

3. **アトムのスコープ**

   - グローバルアトム: アプリケーション全体
   - 機能アトム: 特定の機能内
   - コンポーネントアトム: 特定のコンポーネント内
   - 一時的アトム: 一時的な状態

4. **アトムのパターン**

   ```typescript
   // stores/auth/authAtoms.ts
   import { atom } from "jotai";
   import { atomWithStorage } from "jotai/utils";

   // プリミティブアトム（永続化）
   export const tokenAtom = atomWithStorage<string | null>("auth-token", null);

   // 派生アトム
   export const isAuthenticatedAtom = atom((get) => get(tokenAtom) !== null);

   // 非同期アトム
   export const userProfileAtom = atom(async (get) => {
     const token = get(tokenAtom);
     if (!token) return null;

     // API呼び出し
     const response = await fetch("/api/me", {
       headers: { Authorization: `Bearer ${token}` },
     });

     if (!response.ok) {
       throw new Error("Failed to fetch user profile");
     }

     return await response.json();
   });
   ```

5. **テスト戦略**
   - アトムの単体テスト
   - アトムを使用するコンポーネントのテスト
   - モックアトムの作成と使用

## テスト戦略

1. **コンポーネントテスト**

   - 分離された単体テスト
   - ユーザー中心のインタラクション
   - アクセシビリティのチェック
   - スナップショットテスト（限定的に）

2. **統合テスト**

   - 複数のコンポーネントの相互作用
   - データフローのテスト
   - ルーティングと画面遷移

3. **E2E テスト**

   - クリティカルなユーザーフロー
   - フォーム送信と検証
   - エラー状態とエッジケース

4. **テストの原則**
   - 実装ではなく動作をテスト
   - テストピラミッドのバランス
   - CI/CD パイプラインとの統合
   - 開発者フィードバックループの最適化

## パフォーマンス最適化

1. **レンダリング最適化**

   - コンポーネントのメモ化
   - 仮想化リスト
   - レンダリングのバッチ処理
   - コード分割とレイジーローディング

2. **ビルド最適化**

   - ツリーシェイキング
   - バンドルサイズの分析と最適化
   - 画像とアセットの最適化
   - プリロードとプリフェッチ

3. **ランタイム最適化**
   - キャッシュ戦略
   - サービスワーカーとオフライン対応
   - ウェブワーカーでの重い処理
   - メモリリークの防止
