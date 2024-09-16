import Dexie, { EntityTable } from 'dexie';
import { IEdge } from 'models/Edge';
import { Workflow } from 'models/Workflow';
import { Node } from 'reactflow';

export interface IFlowHistory {
  id: string;
  uuid: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: IEdge[];
}

const db = new Dexie('autoflow') as Dexie & {
  flows: EntityTable<IFlowHistory, 'id'>;
};
db.version(1).stores({
  flows: '++id, uuid, name, description, nodes, edges', // Primary key and indexed props
});

const setHistory = async (data: IFlowHistory): Promise<string> => {
  return db.flows.add(data);
};
const getHistory = async (id: string): Promise<IFlowHistory | undefined> => {
  return db.flows.get({ id });
};
export { db, setHistory, getHistory };
