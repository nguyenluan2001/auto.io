import Dexie, { EntityTable } from 'dexie';
import { Workflow } from 'models/Workflow';

const db = new Dexie('autoflow') as Dexie & {
  flows: EntityTable<Workflow, 'id'>;
};
db.version(1).stores({
  flows:
    '++id, uuid, name, description, tableId, config, nodes, edges, flows, latestFlow, table', // Primary key and indexed props
});
export { db };
