-- Participants table (参加者)
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (), -- 参加者の一意識別子
  event_id UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE, -- 参加するイベントのID（外部キー）
  name TEXT NOT NULL, -- 参加者の名前（必須）
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW (), -- 参加者登録日時
  UNIQUE (event_id, name) -- 同じイベント内で同じ名前は重複不可
);