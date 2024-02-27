import Cronjob from '@/components/schedule/Cronjob';
import Interval from '@/components/schedule/Interval';
import OnASpecificDate from '@/components/schedule/OnASpecificDate';

const TRIGGER_CONFIG = {
  INTERVAL: {
    title: 'Interval',
    component: Interval,
  },
  CRON_JOB: {
    title: 'Cron job',
    component: Cronjob,
  },
  ON_A_SPECIFIC_DATE: {
    title: 'On a specific date',
    component: OnASpecificDate,
  },
};
export { TRIGGER_CONFIG };
