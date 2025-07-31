create table "public"."date_options" (
    "id" uuid not null default uuid_generate_v4(),
    "event_id" uuid not null,
    "date" date not null,
    "time" time without time zone,
    "created_at" timestamp with time zone not null default now()
);


create table "public"."events" (
    "id" uuid not null default uuid_generate_v4(),
    "title" text not null,
    "description" text,
    "host_name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."participants" (
    "id" uuid not null default uuid_generate_v4(),
    "event_id" uuid not null,
    "name" text not null,
    "created_at" timestamp with time zone not null default now()
);


create table "public"."participation_responses" (
    "id" uuid not null default uuid_generate_v4(),
    "participant_id" uuid not null,
    "date_option_id" uuid not null,
    "status" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now()
);


CREATE UNIQUE INDEX date_options_event_id_date_time_key ON public.date_options USING btree (event_id, date, "time");

CREATE UNIQUE INDEX date_options_pkey ON public.date_options USING btree (id);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE INDEX idx_date_options_event_id ON public.date_options USING btree (event_id);

CREATE INDEX idx_participants_event_id ON public.participants USING btree (event_id);

CREATE INDEX idx_participation_responses_date_option_id ON public.participation_responses USING btree (date_option_id);

CREATE INDEX idx_participation_responses_participant_id ON public.participation_responses USING btree (participant_id);

CREATE UNIQUE INDEX participants_event_id_name_key ON public.participants USING btree (event_id, name);

CREATE UNIQUE INDEX participants_pkey ON public.participants USING btree (id);

CREATE UNIQUE INDEX participation_responses_participant_id_date_option_id_key ON public.participation_responses USING btree (participant_id, date_option_id);

CREATE UNIQUE INDEX participation_responses_pkey ON public.participation_responses USING btree (id);

alter table "public"."date_options" add constraint "date_options_pkey" PRIMARY KEY using index "date_options_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."participants" add constraint "participants_pkey" PRIMARY KEY using index "participants_pkey";

alter table "public"."participation_responses" add constraint "participation_responses_pkey" PRIMARY KEY using index "participation_responses_pkey";

alter table "public"."date_options" add constraint "date_options_event_id_date_time_key" UNIQUE using index "date_options_event_id_date_time_key";

alter table "public"."date_options" add constraint "date_options_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE not valid;

alter table "public"."date_options" validate constraint "date_options_event_id_fkey";

alter table "public"."participants" add constraint "participants_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE not valid;

alter table "public"."participants" validate constraint "participants_event_id_fkey";

alter table "public"."participants" add constraint "participants_event_id_name_key" UNIQUE using index "participants_event_id_name_key";

alter table "public"."participation_responses" add constraint "participation_responses_date_option_id_fkey" FOREIGN KEY (date_option_id) REFERENCES date_options(id) ON DELETE CASCADE not valid;

alter table "public"."participation_responses" validate constraint "participation_responses_date_option_id_fkey";

alter table "public"."participation_responses" add constraint "participation_responses_participant_id_date_option_id_key" UNIQUE using index "participation_responses_participant_id_date_option_id_key";

alter table "public"."participation_responses" add constraint "participation_responses_participant_id_fkey" FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE not valid;

alter table "public"."participation_responses" validate constraint "participation_responses_participant_id_fkey";

alter table "public"."participation_responses" add constraint "participation_responses_status_check" CHECK ((status = ANY (ARRAY['available'::text, 'maybe'::text, 'unavailable'::text]))) not valid;

alter table "public"."participation_responses" validate constraint "participation_responses_status_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."date_options" to "anon";

grant insert on table "public"."date_options" to "anon";

grant references on table "public"."date_options" to "anon";

grant select on table "public"."date_options" to "anon";

grant trigger on table "public"."date_options" to "anon";

grant truncate on table "public"."date_options" to "anon";

grant update on table "public"."date_options" to "anon";

grant delete on table "public"."date_options" to "authenticated";

grant insert on table "public"."date_options" to "authenticated";

grant references on table "public"."date_options" to "authenticated";

grant select on table "public"."date_options" to "authenticated";

grant trigger on table "public"."date_options" to "authenticated";

grant truncate on table "public"."date_options" to "authenticated";

grant update on table "public"."date_options" to "authenticated";

grant delete on table "public"."date_options" to "service_role";

grant insert on table "public"."date_options" to "service_role";

grant references on table "public"."date_options" to "service_role";

grant select on table "public"."date_options" to "service_role";

grant trigger on table "public"."date_options" to "service_role";

grant truncate on table "public"."date_options" to "service_role";

grant update on table "public"."date_options" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."participants" to "anon";

grant insert on table "public"."participants" to "anon";

grant references on table "public"."participants" to "anon";

grant select on table "public"."participants" to "anon";

grant trigger on table "public"."participants" to "anon";

grant truncate on table "public"."participants" to "anon";

grant update on table "public"."participants" to "anon";

grant delete on table "public"."participants" to "authenticated";

grant insert on table "public"."participants" to "authenticated";

grant references on table "public"."participants" to "authenticated";

grant select on table "public"."participants" to "authenticated";

grant trigger on table "public"."participants" to "authenticated";

grant truncate on table "public"."participants" to "authenticated";

grant update on table "public"."participants" to "authenticated";

grant delete on table "public"."participants" to "service_role";

grant insert on table "public"."participants" to "service_role";

grant references on table "public"."participants" to "service_role";

grant select on table "public"."participants" to "service_role";

grant trigger on table "public"."participants" to "service_role";

grant truncate on table "public"."participants" to "service_role";

grant update on table "public"."participants" to "service_role";

grant delete on table "public"."participation_responses" to "anon";

grant insert on table "public"."participation_responses" to "anon";

grant references on table "public"."participation_responses" to "anon";

grant select on table "public"."participation_responses" to "anon";

grant trigger on table "public"."participation_responses" to "anon";

grant truncate on table "public"."participation_responses" to "anon";

grant update on table "public"."participation_responses" to "anon";

grant delete on table "public"."participation_responses" to "authenticated";

grant insert on table "public"."participation_responses" to "authenticated";

grant references on table "public"."participation_responses" to "authenticated";

grant select on table "public"."participation_responses" to "authenticated";

grant trigger on table "public"."participation_responses" to "authenticated";

grant truncate on table "public"."participation_responses" to "authenticated";

grant update on table "public"."participation_responses" to "authenticated";

grant delete on table "public"."participation_responses" to "service_role";

grant insert on table "public"."participation_responses" to "service_role";

grant references on table "public"."participation_responses" to "service_role";

grant select on table "public"."participation_responses" to "service_role";

grant trigger on table "public"."participation_responses" to "service_role";

grant truncate on table "public"."participation_responses" to "service_role";

grant update on table "public"."participation_responses" to "service_role";

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participation_responses_updated_at BEFORE UPDATE ON public.participation_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


