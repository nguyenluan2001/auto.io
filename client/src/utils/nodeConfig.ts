import BreakLoop from '@/components/nodeConfig/BreakLoop';
import EventClick from '@/components/nodeConfig/EventClick';
import Form from '@/components/nodeConfig/Form';
import GetText from '@/components/nodeConfig/GetText';
import LoopData from '@/components/nodeConfig/LoopData';
import NewTab from '@/components/nodeConfig/NewTab';
import Trigger from '@/components/nodeConfig/Trigger';

const config: Record<string, any> = {
  trigger: Trigger,
  'new-tab': NewTab,
  'event-click': EventClick,
  form: Form,
  'get-text': GetText,
  'loop-data': LoopData,
  'break-loop': BreakLoop,
};
export { config };
