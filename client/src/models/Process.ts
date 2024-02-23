import { Workflow } from './Workflow';

export type Process = {
  id: number;
  uuid: string;
  pid: string;
  createdAt: Date;
  updatedAt: Date;
  status: Status;
  duration: number;
  workflow: Workflow;
};
type Status = 'SUCCESS' | 'FAILED' | 'CANCELED' | 'RUNNING';
