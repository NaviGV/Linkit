import type { ReactElement } from "react";

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
  selected: boolean;
  onClick: () => void;
}

const SidebarItem = ({ text, icon, selected, onClick }: SidebarItemProps) => {
  return (
     <div
      onClick={onClick}
      className={`flex items-center gap-5 pl-4 p-3 cursor-pointer rounded-md m-2 transition duration-200 ${
        selected ? "bg-white text-black font-semibold shadow" : "hover:bg-sidebar-300"
      }`}
    >
      <div>{icon}</div>
      <div>{text}</div>
    </div>
  );
};

export default SidebarItem;
