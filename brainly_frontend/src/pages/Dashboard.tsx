import { useState } from "react";
import "../App.css";
import { Button } from "../components/ui/Button";
import CreateContentModel from "../components/ui/CreateContentModel";
import { Menu } from "lucide-react"; 

import Plusicon from "../icon/Plusicon";
import Share from "../icon/Share";
import Card from "../components/ui/Card";
import Sidebar from "../components/ui/Sidebar";
import useContent from "../hooks/useContent";


import axiosInstance from "../utiils/axiosConfig";
import { useFilter } from "../hooks/FilterContext";

function Dashboard() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [modalOpen, setModalOpen] = useState(true);
  const [reload, setReload] = useState(0);

  const token = localStorage.getItem("token");

  const { contents, loading, error } = useContent(reload);

  const { filter } = useFilter();

  const handleContentAdded = () => {
    setReload((prev) => prev + 1); // Triggers content re-fetch
    setModalOpen(false); // Close the modal
  };

  const handleDelete = (contentId: string) => {
    setReload((prev) => prev + 1);
  };

  const filteredContents = contents.filter((content) =>
    filter === "all" ? true : content.type === filter
  );

  const [isMobileOpen, setIsMobileOpen] = useState(false);


  return (
    <>
      <Sidebar isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)}/>

      <div className="sm:hidden p-4 flex justify-end fixed top-6 left-3 z-50 h-16">
      {!isMobileOpen && ( 
        <button onClick={() => setIsMobileOpen(true)}
           className="p-2  rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
           >
          <Menu className="pb-2" size={28} />
        </button>
       )}
      </div>

      <div className={`
       
        min-h-screen 
        bg-gray-100 
         px-4 pb-4  
        ${isMobileOpen ? 'pt-4' : 'pt-4'} 
        sm:pt-4 
        sm:ml-72
        transition-all duration-300 ease-in-out
      `}>

        <div className={modalOpen ? "relative z-[60]" : ""}>
          <CreateContentModel open={modalOpen} onClose={handleContentAdded} />
        </div>
        

        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-end-safe mt-5 gap-5 ">
            <Button
              startIcon={<Plusicon size="md" />}
              size="sm"
              variant="secondary"
              text="Add Content"
              onClick={() => {
                setModalOpen(true);
              }}
            />

            <Button
              startIcon={<Share size="md" />}
              size="sm"
              variant="primary"
              text="Share"
              onClick={async () => {
                const response = await axiosInstance.post(
                  `${BACKEND_URL}/api/v1/brain/share`,
                  {
                    share: true,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

               
                const shareUrl = `${window.location.origin}${response.data.hash}`;
                alert(shareUrl);
              }}
            />
          </div>
          <div className="w-full h-px bg-purple-500 my-6"></div>

          <div className="flex flex-wrap gap-6 "
          style={{ justifyContent: "flex-start" }} >
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error loading content</p>}

            {!loading &&
              !error &&
              contents
                .filter((item) => filter === "all" || item.type === filter)
                .map(({ type, link, title, _id }) => (
                 
                    <Card key={_id} _id={_id} title={title} type={type} link={link} onDelete={handleDelete} />
                  
                ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
