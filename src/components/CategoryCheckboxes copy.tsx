import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchCategoryFlat } from "../redux/slice/categorySlice";
import { ChevronDown, ChevronRight, FolderOpen } from "lucide-react";

interface Props {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export default function CategoryCheckboxes({ selectedIds, onChange }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { flat: categories, loading } = useSelector(
    (state: RootState) => state.categories,
  );
  console.log("CATEGORIES 👉", categories);

  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoryFlat());
    }
  }, [categories.length, dispatch]);

  const getChildren = (id: number) =>
    categories.filter((c) => c.parentId === id);

  const getAllDescendants = (id: number): number[] => {
    const children = getChildren(id);
    let ids: number[] = [];
    children.forEach((child) => {
      ids.push(child.id);
      ids = ids.concat(getAllDescendants(child.id));
    });
    return ids;
  };

  const getParent = (id: number) =>
    categories.find((c) => c.id === id)?.parentId;

  const toggle = (id: number) => {
    const descendants = getAllDescendants(id);

    if (selectedIds.includes(id)) {
      onChange(
        selectedIds.filter((sid) => sid !== id && !descendants.includes(sid)),
      );
    } else {
      let newIds = [...selectedIds, id, ...descendants];

      // auto select parents
      let parent = getParent(id);
      while (parent) {
        newIds.push(parent);
        parent = getParent(parent);
      }

      onChange([...new Set(newIds)]);
    }
  };

  const isIndeterminate = (id: number) => {
    const descendants = getAllDescendants(id);
    const selectedChildren = descendants.filter((d) => selectedIds.includes(d));

    return (
      selectedChildren.length > 0 &&
      selectedChildren.length < descendants.length
    );
  };

  const toggleCollapse = (id: number) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const rootCategories = categories.filter((c) => c.parentId === null);

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2.5">
        <span className="text-xs font-semibold text-gray-500 uppercase">
          Select Categories
        </span>

        {selectedIds.length > 0 && (
          <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-600">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      {/* Tree */}
      <div className="max-h-64 divide-y divide-gray-50 overflow-y-auto">
        {rootCategories.map((cat) => (
          <CategoryNode
            key={cat.id}
            category={cat}
            level={0}
            selectedIds={selectedIds}
            toggle={toggle}
            collapsed={collapsed}
            toggleCollapse={toggleCollapse}
            getChildren={getChildren}
            isIndeterminate={isIndeterminate}
          />
        ))}
      </div>

      {/* Footer */}
      {selectedIds.length > 0 && (
        <div className="border-t bg-pink-50 px-4 py-2">
          <p className="text-xs text-pink-600">
            <span className="font-semibold">
              {selectedIds.length} categor
              {selectedIds.length !== 1 ? "ies" : "y"}
            </span>{" "}
            selected:{" "}
            {selectedIds
              .map((id) => categories.find((c) => c.id === id)?.title)
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

/* ✅ Separate component (this fixes your error) */

function CategoryNode({
  category,
  level,
  selectedIds,
  toggle,
  collapsed,
  toggleCollapse,
  getChildren,
  isIndeterminate,
}: any) {
  const children = getChildren(category.id);
  const hasChildren = children.length > 0;
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate(category.id);
    }
  }, [selectedIds]);

  return (
    <div>
      <div
        className="flex cursor-pointer items-center gap-2 px-4 py-2.5 hover:bg-pink-50"
        style={{ paddingLeft: 16 + level * 18 }}
        onClick={() =>
          hasChildren ? toggleCollapse(category.id) : toggle(category.id)
        }
      >
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={selectedIds.includes(category.id)}
          onChange={() => toggle(category.id)}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 accent-pink-500"
        />

        {hasChildren && (
          <FolderOpen size={14} className="shrink-0 text-indigo-400" />
        )}

        <span className="flex-1 text-sm text-gray-700">{category.title}</span>

        {hasChildren && (
          <span className="text-gray-400">
            {collapsed[category.id] ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </span>
        )}
      </div>

      {hasChildren && !collapsed[category.id] && (
        <div>
          {children.map((child: any) => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              selectedIds={selectedIds}
              toggle={toggle}
              collapsed={collapsed}
              toggleCollapse={toggleCollapse}
              getChildren={getChildren}
              isIndeterminate={isIndeterminate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
