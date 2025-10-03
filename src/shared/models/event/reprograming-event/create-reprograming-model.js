export const createReprogramingModel = (f) => ({
  event_id: f.event_id,
  new_date: new Date(f.new_start_time),
  new_start_time: new Date(f.new_start_time),
  new_end_time: new Date(f.new_end_time),
  reason: f.reason,
});