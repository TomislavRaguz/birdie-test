import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Events {
  @PrimaryColumn()
  id!: string;

  @Column()
  payload!: string;

  @Column()
  alertId!: string;

  @Column()
  taskInstanceId!: string;

  @Column()
  visitId!: string;

  @Column()
  caregiverId!: string;

  @Column()
  payloadAsText!: string;

  @Column()
  rejectedEventId!: string;

  @Column()
  observationEventId!: string;

  @Column()
  timestamp!: string;

  @Column()
  eventType!: string;

  @Column()
  careRecipientId!: string;
}

/*
table DDL
CREATE TABLE `events` (
  `payload` json NOT NULL,
  `alert_id` char(36) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`payload`,'$.alert_id'))) VIRTUAL,
  `task_instance_id` char(255) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`payload`,'$.task_instance_id'))) VIRTUAL,
  `visit_id` char(36) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`payload`,'$.visit_id'))) VIRTUAL,
  `caregiver_id` char(36) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`payload`,'$.caregiver_id'))) VIRTUAL,
  `payload_as_text` text COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`payload`,'$'))) VIRTUAL,
  `rejected_event_id` char(255) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`payload`,'$.rejected_event_id'))) VIRTUAL,
  `observation_event_id` char(255) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`payload`,'$.observation_event_id'))) VIRTUAL,
  `timestamp` varchar(50) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`payload`,'$.timestamp'))) VIRTUAL,
  `id` char(36) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`payload`,'$.id'))) VIRTUAL,
  `event_type` varchar(50) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`payload`,'$.event_type'))) VIRTUAL,
  `care_recipient_id` char(36) COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (json_unquote(json_extract(`payload`,'$.care_recipient_id'))) VIRTUAL,
  KEY `idx_events_alert_id` (`alert_id`),
  KEY `idx_events_task_instance_id` (`task_instance_id`),
  KEY `idx_events_visit_id` (`visit_id`),
  KEY `idx_caregiver_id` (`caregiver_id`),
  KEY `idx_events_rejected_event_id` (`rejected_event_id`),
  KEY `idx_events_observation_event_id` (`observation_event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci

payload - raw json NOT_NULL
alert_id char char(36)
task_instance_id char(255)
visit_id char(36)
caregiver_id char(36)
payload_as_text text
rejected_event_id char(255)
observation_event_id char(255)
timestamp char(50)
id char(36)
event_type varchar(50)
care_recipient_id char(36)

payload - raw json NOT_NULL
alert_id char char(36)
task_instance_id char(255)


payload_as_text text
rejected_event_id char(255)
observation_event_id char(255)

id char(36)

payload_as_text text
care_recipient_id char(36) - 3 distinct care recipients
caregiver_id char(36) - 44 distinct caregivers
visit_id char(36) - 231 distinct visits
event_type varchar(50) - 26 distinct types
timestamp char(50)

SELECT VERSION(); using MySQL 5.7.33
now we setup it locally

now lets find out more about event types
SELECT DISTINCT(event_type) FROM events;
this gives us  event types

1: alert_qualified
2: alert_raised
3: catheter_observation
4: check_in
5: check_out
6: concern_raised
7: fluid_intake_observation
8: food_intake_observation
9: general_observation
10: incontinence_pad_observation
11: medication_schedule_created
12: medication_schedule_updated
13: mental_health_observation
14: mood_observation
15: no_medication_observation_received
16: physical_health_observation
17: regular_medication_maybe_taken
18: regular_medication_not_taken
19: regular_medication_partially_taken
20: regular_medication_taken
21: task_completed
22: task_completion_reverted
23: task_schedule_created
24: toilet_visit_recorded
25: visit_cancelled
26: visit_completed


*/
