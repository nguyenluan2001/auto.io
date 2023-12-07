import { Edge, Node } from 'reactflow';

type Workflow = {
  id: string;
  uuid: string;
  name: string;
  description: string;
  tableId: number;
  config: any;
  nodes?: Node[];
  edges?: Edge[];
  flows: any;
};

export type { Workflow };
