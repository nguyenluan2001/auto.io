import { Node, Position } from 'reactflow';

export interface ICustomNodeProps {
  id: string;
  data: {
    description: string;
    key: string;
    selected: string;
    title: string;
    icon: {
      body: string;
      weight: number;
      height: number;
    };
  };
  dragHandle?: boolean;
  type?: string;
  selected?: boolean;
  isConnectable?: boolean;
  zIndex?: number;
  xPos: number;
  yPos: number;
  dragging: boolean;
  targetPosition?: Position;
  sourcePosition?: Position;
}
