-- Indexes for performance
CREATE INDEX idx_date_options_event_id ON date_options (event_id);
CREATE INDEX idx_participants_event_id ON participants (event_id);
CREATE INDEX idx_participation_responses_participant_id ON participation_responses (participant_id);
CREATE INDEX idx_participation_responses_date_option_id ON participation_responses (date_option_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column () RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();
CREATE TRIGGER update_participation_responses_updated_at BEFORE UPDATE ON participation_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();