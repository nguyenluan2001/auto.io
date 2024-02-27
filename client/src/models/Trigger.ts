export type Trigger = {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  is_active: boolean;
  interval: number;
  delay: number;
  expression: string;
  next_run: Date;
  type: string;
  database_id?: number;
};
