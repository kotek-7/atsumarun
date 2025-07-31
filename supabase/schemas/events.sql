-- Events table (イベント)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (), -- イベントの一意識別子
  title TEXT NOT NULL, -- イベントのタイトル（必須）
  description TEXT, -- イベントの詳細説明（任意）
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW (), -- イベント作成日時
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW () -- イベント最終更新日時
);