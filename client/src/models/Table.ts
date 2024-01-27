type Table = {
  id: number;
  name: string;
  columns: Column[];
};
type Column = {
  id: number;
  name: string;
  data_type: string;
};
export type { Table, Column };
