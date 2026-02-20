import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchCategoryFlat } from "../redux/slice/categorySlice";
import { ChevronDown, ChevronRight, FolderOpen } from "lucide-react";
import { useState } from "react";

interface Props {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export default function CategoryCheckboxes({ selectedIds, onChange }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { flat: categories, loading } = useSelector(
    (state: RootState) => state.categories,
  );

  // Track which parent sections are collapsed
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoryFlat());
    }
  }, []);

  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((cid) => cid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const toggleCollapse = (id: number) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const parents = categories.filter((c) => c.parentId === null);
  const getChildren = (parentId: number) =>
    categories.filter((c) => c.parentId === parentId);

  if (loading) {
    return <p className="text-sm text-gray-400">Loading categories...</p>;
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        No categories available. Ask an admin to create some first.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2.5">
        <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Select Categories
        </span>
        {selectedIds.length > 0 && (
          <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-600">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      {/* Category Tree */}
      <div className="max-h-64 divide-y divide-gray-50 overflow-y-auto">
        {parents.map((parent) => {
          const subs = getChildren(parent.id);
          const isCollapsed = collapsed[parent.id];
          const hasChildren = subs.length > 0;

          return (
            <div key={parent.id}>
              {/* Parent Row */}
              <div
                className={`flex items-center gap-2 px-4 py-2.5 ${
                  hasChildren
                    ? "cursor-pointer bg-gray-50 hover:bg-gray-100"
                    : "cursor-pointer hover:bg-pink-50"
                }`}
                onClick={() =>
                  hasChildren ? toggleCollapse(parent.id) : toggle(parent.id)
                }
              >
                {/* Checkbox — only shown if no children */}
                {!hasChildren && (
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(parent.id)}
                    onChange={() => toggle(parent.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 accent-pink-500"
                  />
                )}

                {/* Folder icon for parents with children */}
                {hasChildren && (
                  <FolderOpen size={14} className="shrink-0 text-indigo-400" />
                )}

                <span
                  className={`flex-1 text-sm font-semibold ${
                    hasChildren
                      ? "text-gray-600"
                      : "text-gray-700 hover:text-pink-500"
                  }`}
                >
                  {parent.title}
                </span>

                {/* Collapse toggle */}
                {hasChildren && (
                  <span className="text-gray-400">
                    {isCollapsed ? (
                      <ChevronRight size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </span>
                )}
              </div>

              {/* Children — shown unless collapsed */}
              {hasChildren && !isCollapsed && (
                <div className="bg-white">
                  {subs.map((child) => (
                    <label
                      key={child.id}
                      className="flex cursor-pointer items-center gap-3 py-2 pr-4 pl-10 hover:bg-pink-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(child.id)}
                        onChange={() => toggle(child.id)}
                        className="h-4 w-4 accent-pink-500"
                      />
                      <span
                        className={`text-sm ${
                          selectedIds.includes(child.id)
                            ? "font-semibold text-pink-600"
                            : "text-gray-600"
                        }`}
                      >
                        {child.title}
                      </span>
                      {selectedIds.includes(child.id) && (
                        <span className="ml-auto text-xs text-pink-400">✓</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer — selected summary */}
      {selectedIds.length > 0 && (
        <div className="border-t border-gray-100 bg-pink-50 px-4 py-2">
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
