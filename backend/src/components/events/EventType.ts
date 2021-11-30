//Generated via script
interface BirdieBaseEvent {
  payload: string;
  id: string;
  timestamp: string;
  event_type: string;
  care_recipient_id: string;
}

interface FluidIntakeObservationEvent extends BirdieBaseEvent {
  event_type: 'fluid_intake_observation';
  fluid: string;
  observed: string;
  visit_id: string;
  caregiver_id: string;
  consumed_volume_ml: number;
}

interface TaskCompletedEvent extends BirdieBaseEvent {
  event_type: 'task_completed';
  visit_id: string;
  caregiver_id: string;
  task_instance_id: string;
  task_schedule_id: string;
  task_definition_id: string;
  task_schedule_note: string;
  task_definition_description: string;
}

interface PhysicalHealthObservationEvent extends BirdieBaseEvent {
  event_type: 'physical_health_observation';
  note: string;
  visit_id: string;
  caregiver_id: string;
}

interface VisitCompletedEvent extends BirdieBaseEvent {
  event_type: 'visit_completed';
  visit_id: string;
  caregiver_id: string;
}

interface CheckOutEvent extends BirdieBaseEvent {
  event_type: 'check_out';
  visit_id: string;
  caregiver_id: string;
}

interface MoodObservationEvent extends BirdieBaseEvent {
  event_type: 'mood_observation';
  mood: string;
  visit_id: string;
  caregiver_id: string;
  note?: string;
}

interface RegularMedicationTakenEvent extends BirdieBaseEvent {
  event_type: 'regular_medication_taken';
  visit_id: string;
  caregiver_id: string;
  medication_type?: string;
  task_instance_id: string;
  note?: string;
  medication_failure_reason?: string;
}

interface AlertRaisedEvent extends BirdieBaseEvent {
  event_type: 'alert_raised';
  alert_id: string;
  observation_event_id: string;
  caregiver_id?: string;
}

interface NoMedicationObservationReceivedEvent extends BirdieBaseEvent {
  event_type: 'no_medication_observation_received';
  medication_type?: string;
  task_instance_id: string;
  expected_dose_timestamp?: string;
}

interface IncontinencePadObservationEvent extends BirdieBaseEvent {
  event_type: 'incontinence_pad_observation';
  visit_id: string;
  navigation: string;
  screenProps: string;
  caregiver_id: string;
  observations: string;
  pad_condition: string;
  note?: string;
}

interface CheckInEvent extends BirdieBaseEvent {
  event_type: 'check_in';
  visit_id: string;
  caregiver_id: string;
}

interface GeneralObservationEvent extends BirdieBaseEvent {
  event_type: 'general_observation';
  note: string;
  media: string;
  visit_id: string;
  caregiver_id: string;
}

interface RegularMedicationNotTakenEvent extends BirdieBaseEvent {
  event_type: 'regular_medication_not_taken';
  note: string;
  visit_id: string;
  caregiver_id: string;
  medication_type?: string;
  task_instance_id: string;
  medication_failure_reason: string;
}

interface FoodIntakeObservationEvent extends BirdieBaseEvent {
  event_type: 'food_intake_observation';
  meal: string;
  note: string;
  visit_id: string;
  caregiver_id: string;
}

interface TaskCompletionRevertedEvent extends BirdieBaseEvent {
  event_type: 'task_completion_reverted';
  visit_id: string;
  caregiver_id: string;
  task_instance_id: string;
  task_schedule_id: string;
  task_definition_id: string;
  task_schedule_note: string;
  task_definition_description: string;
}

interface MentalHealthObservationEvent extends BirdieBaseEvent {
  event_type: 'mental_health_observation';
  note: string;
  visit_id: string;
  caregiver_id: string;
}

interface MedicationScheduleUpdatedEvent extends BirdieBaseEvent {
  event_type: 'medication_schedule_updated';
  note: string;
  type: string;
  rrule: string;
  user_id: string;
  dose_size: string;
  medical_product_id: string;
  medication_schedule_id: string;
}

interface VisitCancelledEvent extends BirdieBaseEvent {
  event_type: 'visit_cancelled';
  visit_id: string;
  caregiver_id: string;
}

interface RegularMedicationMaybeTakenEvent extends BirdieBaseEvent {
  event_type: 'regular_medication_maybe_taken';
  note: string;
  visit_id: string;
  caregiver_id: string;
  task_instance_id: string;
  medication_failure_reason: string;
}

interface MedicationScheduleCreatedEvent extends BirdieBaseEvent {
  event_type: 'medication_schedule_created';
  note: string;
  type: string;
  rrule: string;
  user_id: string;
  dose_size: string;
  medical_product_id: string;
  medication_schedule_id: string;
}

interface AlertQualifiedEvent extends BirdieBaseEvent {
  event_type: 'alert_qualified';
  alert_id: string;
  caregiver_id: string;
  alert_severity: string;
}

interface TaskScheduleCreatedEvent extends BirdieBaseEvent {
  event_type: 'task_schedule_created';
  note: string;
  rrule: string;
  caregiver_id: string;
  task_schedule_id: string;
  task_definition_id: string;
}

interface ConcernRaisedEvent extends BirdieBaseEvent {
  event_type: 'concern_raised';
  note: string;
  severity: string;
  visit_id: string;
  navigation: string;
  screenProps: string;
  caregiver_id: string;
  observations: string;
}

interface RegularMedicationPartiallyTakenEvent extends BirdieBaseEvent {
  event_type: 'regular_medication_partially_taken';
  note: string;
  visit_id: string;
  caregiver_id: string;
  medication_type: string;
  task_instance_id: string;
  medication_failure_reason: string;
}

interface CatheterObservationEvent extends BirdieBaseEvent {
  event_type: 'catheter_observation';
  note: string;
  visit_id: string;
  volume_ml: string;
  caregiver_id: string;
}

interface ToiletVisitRecordedEvent extends BirdieBaseEvent {
  event_type: 'toilet_visit_recorded';
  note: string;
  observed: string;
  visit_id: string;
  visit_type: string;
  visit_count: number;
  caregiver_id: string;
}

export type BirdieEvent =
  | FluidIntakeObservationEvent
  | TaskCompletedEvent
  | PhysicalHealthObservationEvent
  | VisitCompletedEvent
  | CheckOutEvent
  | MoodObservationEvent
  | RegularMedicationTakenEvent
  | AlertRaisedEvent
  | NoMedicationObservationReceivedEvent
  | IncontinencePadObservationEvent
  | CheckInEvent
  | GeneralObservationEvent
  | RegularMedicationNotTakenEvent
  | FoodIntakeObservationEvent
  | TaskCompletionRevertedEvent
  | MentalHealthObservationEvent
  | MedicationScheduleUpdatedEvent
  | VisitCancelledEvent
  | RegularMedicationMaybeTakenEvent
  | MedicationScheduleCreatedEvent
  | AlertQualifiedEvent
  | TaskScheduleCreatedEvent
  | ConcernRaisedEvent
  | RegularMedicationPartiallyTakenEvent
  | CatheterObservationEvent
  | ToiletVisitRecordedEvent;
