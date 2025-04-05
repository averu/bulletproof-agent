import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

interface Props {
  sortType: {
    sortType: "createdAt" | "title" | null;
    sortOrder: "asc" | "desc" | "none";
  };
  setSortType: (sortType: "createdAt" | "title") => void;
  targetType: "createdAt" | "title";
  label: string;
  isActive: boolean;
}

export const SortButton: React.FC<Props> = ({
  sortType,
  setSortType,
  targetType,
  label,
  isActive,
}) => {
  const handleClick = () => {
    setSortType(targetType);
  };

  let Icon;
  if (sortType.sortType !== targetType || sortType.sortOrder === "none") {
    Icon = FaSort;
  } else if (sortType.sortOrder === "asc") {
    Icon = FaSortUp;
  } else {
    Icon = FaSortDown;
  }

  return (
    <div
      className="flex items-center cursor-pointer p-1 rounded"
      onClick={handleClick}
    >
      <span className={`mr-1 ${isActive ? "font-bold" : ""}`}>{label}</span>
      <Icon className="inline-block" />
    </div>
  );
};
