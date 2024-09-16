import { isEmpty } from 'lodash';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface IHistory {
  ids: string[];
  undo: string[];
  redo: string[];
  currentId: string | undefined | null;
  addHistoryId: (id: string) => void;
  onUndo: () => void;
  onRedo: () => void;
}

const useHistory = create<IHistory>()(
  devtools(
    (set) => ({
      ids: [],
      undo: [],
      redo: [],
      currentId: '',
      addHistoryId: (id: string) => {
        console.log('id', id);
        set(
          (pre) => ({
            ids: [...pre.ids, id],
            undo: [...pre.undo, ...(pre.currentId ? [pre.currentId] : [])],
            currentId: id,
          }),
          undefined,
          {
            type: 'SET_HISTORY_IDS',
            payload: id,
          }
        );
      },
      onUndo: () => {
        set(
          (pre: any) => {
            const undo = [...pre.undo];
            if (isEmpty(undo)) return pre;
            const currentId = undo.pop();
            return {
              ...pre,
              currentId,
              undo,
              redo: [...pre.redo, pre.currentId],
            };
          },
          undefined,
          {
            type: 'HISTORY_UNDO',
          }
        );
      },
      onRedo: () => {
        set(
          (pre: any) => {
            const redo = [...pre.redo];
            if (isEmpty(redo)) return pre;
            const currentId = redo.pop();
            return {
              ...pre,
              currentId,
              undo: [...pre.undo, pre.currentId],
              redo,
            };
          },
          undefined,
          {
            type: 'HISTORY_REDO',
          }
        );
      },
    }),
    {
      name: 'HISTORY',
    }
  )
);
export { useHistory };
