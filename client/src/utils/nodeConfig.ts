import BreakLoop from '@/components/nodeConfig/BreakLoop';
import EventClick from '@/components/nodeConfig/EventClick';
import Form from '@/components/nodeConfig/Form';
import GetAttribute from '@/components/nodeConfig/GetAttribute';
import GetText from '@/components/nodeConfig/GetText';
import LoopData from '@/components/nodeConfig/LoopData';
import NewTab from '@/components/nodeConfig/NewTab';
import Repeat from '@/components/nodeConfig/Repeat';
import SaveAsset from '@/components/nodeConfig/SaveAsset';
import Scroll from '@/components/nodeConfig/Scroll';
import Trigger from '@/components/nodeConfig/Trigger';

const config: Record<string, any> = {
  trigger: Trigger,
  'new-tab': NewTab,
  'event-click': EventClick,
  form: Form,
  'get-text': GetText,
  'loop-data': LoopData,
  'break-loop': BreakLoop,
  repeat: Repeat,
  'get-attribute': GetAttribute,
  scroll: Scroll,
  'save-asset': SaveAsset,
};
export { config };
