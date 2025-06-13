import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import * as RadioGroup from "@radix-ui/react-radio-group";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface Column {
  id: string;
  title: string;
  visible: boolean;
}

interface TableSettings {
  rowHeight: "compact" | "default" | "relaxed";
  showBorders: boolean;
  stripedRows: boolean;
}

interface TableSettingsProps {
  columns: Column[];
  settings: TableSettings;
  onColumnsChange: (columns: Column[]) => void;
  onSettingsChange: (settings: TableSettings) => void;
}

const rowHeightOptions = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "relaxed", label: "Relaxed" },
] as const;

const SortableItem = ({ column, onVisibleChange }: { column: Column; onVisibleChange?: (id: string, visible: boolean) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 py-2 hover:bg-slate-800/50 rounded-sm"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-4 w-4 text-slate-400 hover:text-slate-300" />
      </div>
      <Switch 
        id={column.id} 
        checked={column.visible}
        onCheckedChange={(checked) => onVisibleChange?.(column.id, checked)}
      />
      <Label htmlFor={column.id} className="flex-1 text-slate-200">
        {column.title}
      </Label>
    </div>
  );
};

SortableItem.displayName = "SortableItem";

export function TableSettings({
  columns,
  settings,
  onColumnsChange,
  onSettingsChange,
}: TableSettingsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.id === active.id.toString());
      const newIndex = columns.findIndex((col) => col.id === over.id.toString());
      onColumnsChange(arrayMove(columns, oldIndex, newIndex));
    }
  };

  const handleVisibilityChange = (id: string, visible: boolean) => {
    const updatedColumns = columns.map((col) =>
      col.id === id ? { ...col, visible } : col
    );
    onColumnsChange(updatedColumns);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={columns} strategy={verticalListSortingStrategy}>
            {columns.map((column) => (
              <SortableItem 
                key={column.id} 
                column={column} 
                onVisibleChange={handleVisibilityChange}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div className="border-t pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showBorders">Show borders</Label>
            <Switch
              id="showBorders"
              checked={settings.showBorders}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...settings, showBorders: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="stripedRows">Striped rows</Label>
            <Switch
              id="stripedRows"
              checked={settings.stripedRows}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...settings, stripedRows: checked })
              }
            />
          </div>
          <div className="space-y-2 pt-2 border-t">
            <Label>Row Height</Label>
            <RadioGroup.Root
              className="flex gap-2"
              value={settings.rowHeight}
              onValueChange={(value: "compact" | "default" | "relaxed") =>
                onSettingsChange({ ...settings, rowHeight: value })
              }
            >
              {rowHeightOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <RadioGroup.Item
                    value={option.value}
                    id={option.value}
                    className="peer h-4 w-4 rounded-full border border-slate-500 bg-transparent text-slate-200 ring-offset-background focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-slate-200 data-[state=checked]:bg-slate-200"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-slate-900" />
                    </RadioGroup.Indicator>
                  </RadioGroup.Item>
                  <Label
                    htmlFor={option.value}
                    className="pl-2 text-sm font-normal text-slate-200"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
