import { Edge, Node } from 'reactflow';
import { Table } from './Table';

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
  table: Table;
};

export type { Workflow };
