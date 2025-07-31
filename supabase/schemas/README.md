# Database Schema for atsumarun

スケジュール調整アプリ「atsumarun」のデータベーススキーマ定義

## Files

### Schema Files

- `extensions.sql` - 必要な拡張機能の有効化
- `events.sql` - eventsテーブル
- `date_options.sql` - date_optionsテーブル
- `participants.sql` - participantsテーブル
- `participation_responses.sql` - participation_responsesテーブル
- `indexes_triggers.sql` - インデックスとトリガー

### Seed File

- `../seed.sql` - サンプルデータ（開発・テスト用）

## Schema Overview

### Core Tables

1. **events** - イベント情報
   - イベントタイトル、説明、主催者名

2. **date_options** - 日程選択肢
   - 各イベントに対する複数の日程候補（日付 + 時刻）

3. **participants** - 参加者
   - 各イベントへの参加者一覧

4. **participation_responses** - 参加回答
   - 参加者 × 日程選択肢の参加状況（○△×）

### Data Flow

```
Event Creation Flow:
Events → Date Options

Participation Flow:
Events → Participants → Participation Responses ←→ Date Options

Results Analysis:
Events → Date Options ←→ Participation Responses ←→ Participants
```

## Usage

### Using Supabase CLI (推奨)

`supabase/config.toml`で実行順序が設定済みです：

```bash
# スキーマを適用
supabase db reset

# または
supabase start
```

### 手動実行の場合

```sql
-- apply schema files in order
\i extensions.sql
\i events.sql
\i date_options.sql
\i participants.sql
\i participation_responses.sql
\i indexes_triggers.sql

-- load sample data (optional) 
\i ../seed.sql
```

### 設定ファイル

`supabase/config.toml`の設定：
- `db.migrations.schema_paths` - スキーマファイルの実行順序
- `db.seed.sql_paths` - サンプルデータの自動投入
- 依存関係のある順序で自動実行
- 外部キー制約を考慮した順序

### RLS (Row Level Security) について

RLS ポリシーはスキーマファイルではなく versioned migration で管理しています：

- **理由**: `supabase db diff` でポリシー変更が正しく検出されない場合があるため
- **場所**: `supabase/migrations/20240131000000_setup_rls_policies.sql`
- **内容**: 開発用の基本ポリシー（全操作許可）

将来認証機能を追加する際は、新しい migration でポリシーを更新してください。

## Key Features

- uuid primary keys for all tables
- foreign key constraints with cascade delete
- unique constraints to prevent duplicates
- indexes for query performance
- updated_at triggers for audit trail
- row level security enabled (basic policies)
- check constraints for participation status values
