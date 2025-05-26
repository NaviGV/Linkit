import { Menu } from "lucide-react";
import { useFilter } from "../../hooks/FilterContext";
import Everything from "../../icon/Everything";
import Logo from "../../icon/Logo";
import Twitter from "../../icon/Twitter";
import YoutubeIcon from "../../icon/YoutubeIcon";
import SidebarItem from "./SidebarItem";
import { useState } from "react";

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

type FilterType = "all" | "twitter" | "youtube";

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { filter, setFilter } = useFilter();

  const handleClick = (value: FilterType) => {
    setFilter(value);
    onCloseMobile();
  };

  return (
    <>
      {/* Hamburger icon for mobile view */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 sm:hidden"
          onClick={onCloseMobile}
        />
      )}
      {/* sidebar */}
      <div
        className={`
    fixed top-0 left-0 h-full w-72 bg-white z-50 border-none transition-transform duration-300 ease-in-out
    ${
      isMobileOpen ? "translate-x-0" : "-translate-x-full"
    } sm:translate-x-0 sm:block
  `}
      >
        <div className="flex justify-center  p-10 gap-2 items-center bg-cyan-300 pb-5">
          <div>
            <Logo />
          </div>

          <h1 className="text-4xl">Brainly</h1>
        </div>
        <div className="pt-4 pl-4 bg-cyan-300 h-full">
          <SidebarItem
            text="Twitter"
            icon={<Twitter />}
            selected={filter === "twitter"}
            onClick={() => handleClick("twitter")}
          />
          <SidebarItem
            text="Youtube"
            icon={<YoutubeIcon />}
            selected={filter === "youtube"}
            onClick={() => handleClick("youtube")}
          />
          <SidebarItem
            text="All"
            icon={<Everything size="lg" />}
            selected={filter === "all"}
            onClick={() => handleClick("all")}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
