import { Edge } from 'reactflow';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { generateNode } from '@/utils/generateNode';

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
const convertFlow = ({ nodes, edges }) => {
  const map = new Map();
  const nodeObjects = nodes?.reduce((pre, current) => {
    return {
      ...pre,
      [current?.id]: current,
    };
  }, {});
  for (const edge of edges) {
    if (!map.has(edge?.source)) {
      map.set(edge?.source, nodeObjects?.[edge?.source]);
    }
    map.set(edge?.target, nodeObjects?.[edge?.target]);
  }
  return [...map.values()];
};
const useFlow = create((set, get) => ({
  nodes: initialNodes,
  edges: [],
  flows: [],
  selectedNode: null,
  setNodes: (cb) => set((state) => ({ nodes: cb(state.nodes) })),
  // setEdges: (eds: Edge[]) => set((state) => ({ edges: eds })),
  setEdges: (cb) =>
    set((state) => {
      const newEdges = cb(state.edges);
      const flows = convertFlow({ nodes: state.nodes, edges: newEdges });
      return { edges: newEdges, flows };
    }),
  setSelectedNode: (node) => {
    set((state) => ({ selectedNode: node }));
  },
  updateNodeInformation: (data) => {
    console.log('🚀 ===== useFlow ===== data:', data);
    const { selectedNode, nodes, edges } = get();
    console.log('🚀 ===== useFlow ===== edges:', edges);
    console.log('🚀 ===== useFlow ===== selectedNode:', selectedNode);
    const newNodes = nodes?.map((node) => {
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
