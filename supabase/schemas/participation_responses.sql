-- Participation responses table (参加回答)
CREATE TABLE participation_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (), -- 参加回答の一意識別子
  participant_id UUID NOT NULL REFERENCES participants (id) ON DELETE CASCADE, -- 回答者の参加者ID（外部キー）
  date_option_id UUID NOT NULL REFERENCES date_options (id) ON DELETE CASCADE, -- 回答対象の日程選択肢ID（外部キー）
  status TEXT NOT NULL CHECK (status IN ('available', 'maybe', 'unavailable')), -- 参加可否状況（available: 参加可能, maybe: 検討中, unavailable: 参加不可）
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW (), -- 回答作成日時
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW (), -- 回答最終更新日時
  UNIQUE (participant_id, date_option_id) -- 1人の参加者が1つの日程選択肢に対して1つの回答のみ
);