import { Edge } from 'reactflow';
import { create } from 'zustand';
import { generateNode } from '@/utils/generateNode';
import { convertFlow } from '@/utils/flow';

// const initialNodes = [
//   {
//     id: uuidv4(),
//     data: { title: 'Trigger', key: 'trigger' },
//     position: { x: 0, y: 0 },
//     type: 'customNode',
//   },
//   // {
//   //   id: uuidv4(),
//   //   data: { label: 'New tab', name: 'new-tab', url: 'https://devnoob.id.vn' },
//   //   position: { x: 0, y: 200 },
//   //   type: 'customNode',
//   // },
//   // {
//   //   id: uuidv4(),
//   //   data: {
//   //     label: 'Form',
//   //     name: 'form',
//   //     selector: '#APjFqb',
//   //     value: 'Puppeteer',
//   //   },
//   //   position: { x: 200, y: 200 },
//   //   type: 'customNode',
//   // },
//   // {
//   //   id: uuidv4(),
//   //   data: {
//   //     label: 'Form',
//   //     name: 'form',
//   //     selector: '#APjFqb',
//   //     value: 'Puppeteer',
//   //   },
//   //   position: { x: 400, y: 200 },
//   //   type: 'customNode',
//   // },
//   // {
//   //   id: uuidv4(),
//   //   data: {
//   //     label: 'Click element',
//   //     name: 'event-click',
//   //     selector: '#menu > li:nth-child(1) > a',
//   //   },
//   //   position: { x: 600, y: 200 },
//   //   type: 'customNode',
//   // },
// ];
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
  table: null,
  uuid: '',
  nodes: initialNodes,
  edges: [],
  flows: [],
  selectedNode: null,
  latestFlow: null,
};
const useFlow = create((set, get) => ({
  ...initialState,
  reset: () => {
    set(initialState);
  },
  // === NODE ===
  setNodes: (nodes: Node[]) =>
    set((state: any) => {
      return { nodes };
    }),
  addNode: (cb: (value: Node[]) => void) =>
    set((state: any) => ({ nodes: cb(state.nodes) })),
  deleteNode: (nodeId: string) =>
    set((state: any) => {
      const newNodes = state.nodes?.filter(
        (node: Node & { id: string }) => node?.id !== nodeId
      );
      const flows = convertFlow({ nodes: newNodes, edges: state.edges });
      return { nodes: newNodes, flows };
    }),
  // === EDGE ===
  setEdges: (edges: Edge[]) =>
    set((state: any) => {
      return { edges };
    }),
  addEdge: (cb: (edges: any[]) => void) =>
    set((state: any) => {
      const newEdges = cb(state.edges) as unknown as any[];
      const flows = convertFlow({ nodes: state.nodes, edges: newEdges });
      return { edges: newEdges, flows };
    }),

  // === WORKFLOW ===
  setWorkflow: (nodes: Node[], edges: Edge[]) =>
    set((state: any) => {
      const flows = convertFlow({ nodes, edges });
      return { flows, latestFlow: flows };
    }),
  setSelectedNode: (node: Node) => {
    set((state: any) => ({ selectedNode: node }));
  },
  setName: (name: string) => set(() => ({ name })),
  setDescription: (description: string) => set(() => ({ description })),
  setConnectTable: (table: any) => set(() => ({ table })),
  setUUID: (uuid: string) => set(() => ({ uuid })),
  updateNodeInformation: (data: any) => {
    console.log('🚀 ===== useFlow ===== data:', data);
    const { selectedNode, nodes, edges } = get() as any;
    console.log('🚀 ===== useFlow ===== edges:', edges);
    console.log('🚀 ===== useFlow ===== selectedNode:', selectedNode);
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
    console.log('🚀 ===== newNodes ===== newNodes:', newNodes);
    const newFlows = convertFlow({ nodes: newNodes, edges });
    console.log('🚀 ===== useFlow ===== newFlows:', newFlows);
    set(() => ({
      nodes: newNodes,
      flows: newFlows,
    }));
  },
}));
export { useFlow };
