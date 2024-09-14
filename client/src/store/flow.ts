import { Edge, Node } from 'reactflow';
import { create } from 'zustand';
import { Table } from 'models/Table';
import { IEdge } from 'models/Edge';
import { generateNode } from '@/utils/generateNode';
import { convertFlow } from '@/utils/flow';

const initialNodes = [
  generateNode({
    type: 'trigger',
    position: { x: 0, y: 0 },
  }),
];
const initialEdges = [{ id: '1-2', source: '1', target: '2' }];
const initialState = {
  name: '',
  description: '',
  table: null as Table | null,
  uuid: '',
  nodes: initialNodes as Node[],
  edges: [] as IEdge[],
  flows: [] as Node[],
  selectedNode: null as Node | null,
  latestFlow: [] as Node[],
};

type IInitialState = typeof initialState;

interface IFlowStore extends IInitialState {
  reset: () => void;
  setNodes: (nodes: Node[]) => void;
  addNode: (callback: (nodes: Node[]) => Node[]) => void;
  deleteNode: (nodeId: string) => void;
  setEdges: (edges: IEdge[]) => void;
  addEdge: (callback: (edges: Edge[]) => Edge[]) => void;
  setWorkflow: (nodes: Node[], edges: Edge[]) => void;
  setSelectedNode: (node: Node | null) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setConnectTable: (table: Table) => void;
  setUUID: (uuid: string) => void;
  updateNodeInformation: (data: Node) => void;
}
const useFlow = create<IFlowStore>((set, get) => ({
  ...initialState,
  reset: () => {
    set(initialState);
  },
  // === NODE ===
  setNodes: (nodes: Node[]) => set({ nodes }),
  addNode: (cb: (value: Node[]) => Node[]) =>
    set((state: IInitialState) => ({ nodes: cb(state.nodes) })),
  deleteNode: (nodeId: string) =>
    set((state: IInitialState) => {
      const newNodes = state.nodes?.filter(
        (node: Node & { id: string }) => node?.id !== nodeId
      );
      const flows = convertFlow({ nodes: newNodes, edges: state.edges });
      return { nodes: newNodes, flows };
    }),
  // === EDGE ===
  setEdges: (edges: IEdge[]) => set({ edges }),
  addEdge: (cb: (edges: any[]) => void) =>
    set((state: any) => {
      const newEdges = cb(state.edges) as unknown as any[];
      const flows = convertFlow({ nodes: state.nodes, edges: newEdges });
      return { edges: newEdges, flows };
    }),

  // === WORKFLOW ===
  setWorkflow: (nodes: Node[], edges: Edge[]) => {
    const flows = convertFlow({ nodes, edges });
    set({ flows, latestFlow: flows });
  },
  setSelectedNode: (node: Node | null) => {
    set({ selectedNode: node });
  },
  setName: (name: string) => set({ name }),
  setDescription: (description: string) => set({ description }),
  setConnectTable: (table: Table) => set({ table }),
  setUUID: (uuid: string) => set({ uuid }),
  updateNodeInformation: (data: Node) => {
    const { selectedNode, nodes, edges } = get() as any;
    const newNodes = nodes?.map((node: any) => {
      if (node?.id === selectedNode?.id) {
        return {
          ...node,
          data: {
            ...node?.data,
            ...data,
          },
        };
      }
      return node;
    });
    const newFlows = convertFlow({ nodes: newNodes, edges });
    set({
      nodes: newNodes,
      flows: newFlows,
    });
  },
}));
export { useFlow };
