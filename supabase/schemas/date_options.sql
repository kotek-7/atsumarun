-- Date options table (日程選択肢)
CREATE TABLE date_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (), -- 日程選択肢の一意識別子
  event_id UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE, -- 所属するイベントのID（外部キー）
  date DATE NOT NULL, -- イベント開催候補日（必須）
  time TIME, -- イベント開催候補時刻（任意）
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW (), -- 日程選択肢作成日時
  UNIQUE (event_id, date, time) -- 同じイベント内で同じ日時は重複不可
);