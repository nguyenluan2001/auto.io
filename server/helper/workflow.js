const convertFlow = ({ nodes, edges }) => {
  const map = new Map();
  const nodeObjects = nodes?.reduce((pre, current) => ({
      ...pre,
      [current?.id]: current,
    }), {});
  for (const edge of edges) {
    if (!map.has(edge?.source)) {
      map.set(edge?.source, nodeObjects?.[edge?.source]);
    }
    map.set(edge?.target, nodeObjects?.[edge?.target]);
  }
  return [...map.values()];
};
module.exports={convertFlow}