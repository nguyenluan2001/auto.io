const convertFlow = ({ nodes, edges }: { nodes: any[]; edges: any[] }) => {
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
export { convertFlow };
