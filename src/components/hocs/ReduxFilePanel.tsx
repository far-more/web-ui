import { FilePanel, FilePanelActions } from "~/src/components/panels/FilePanel/FilePanel";
import { setActivePanel, setPanelData } from "~/src/features/panels/panelsSlice";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useAppDispatch, useAppSelector } from "~/src/store";
import { useFarMoreHost } from "~/src/contexts/farMoreHostContext";

type ReduxFilePanelProps = { id: string };
type ReduxFilePanelActions = FilePanelActions;

export const ReduxFilePanel = forwardRef<ReduxFilePanelActions, ReduxFilePanelProps>(({ id }, ref) => {
  const dispatch = useAppDispatch();
  const isActive = useAppSelector((state) => state.panels.active === id);
  const { path, items } = useAppSelector((state) => state.panels.states[id]);
  const panelRef = useRef<FilePanelActions>(null);
  useImperativeHandle(ref, () => ({ focus: () => panelRef.current?.focus() }));
  const host = useFarMoreHost();
  useEffect(() => {
    host.fs.listDir(path).then((entries) => {
      dispatch(setPanelData({ id, path, items: entries }));
    });
  }, [dispatch, host, id, path]);
  return (
    <FilePanel
      ref={panelRef}
      showCursorWhenBlurred={isActive}
      onFocus={() => dispatch(setActivePanel(id))}
      items={items}
      title={path}
      view={{
        type: "condenced",
        columnDef: { field: "name", name: "Name" },
      }}
    />
  );
});