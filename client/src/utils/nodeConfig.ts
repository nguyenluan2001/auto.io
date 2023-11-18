import EventClick from '@/components/nodeConfig/EventClick';
import Form from '@/components/nodeConfig/Form';
import GetText from '@/components/nodeConfig/GetText';
import NewTab from '@/components/nodeConfig/NewTab';
import Trigger from '@/components/nodeConfig/Trigger';

const config = {
  trigger: Trigger,
  'new-tab': NewTab,
  'event-click': EventClick,
  form: Form,
  'get-text': GetText,
};
export { config };
