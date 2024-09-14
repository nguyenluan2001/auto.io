import { CSSProperties } from 'react';
import { Edge, Position, SmoothStepEdgeProps } from 'reactflow';

export interface IEdge extends SmoothStepEdgeProps {
  isHovered: boolean;
}
