import Share from "../../icon/Share";
import { useEffect } from "react";
import { getTwitterEmbedLink, getYouTubeEmbedUrl } from "./EmbedUtils";
import Delete from "../../icon/Delete";
import axiosInstance from "../../utiils/axiosConfig";


import toast from "react-hot-toast";

const token = localStorage.getItem("token");

export interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
  _id: string;
  onDelete?: (id: string) => void;
}

const Card = ({ title, link, type, _id, onDelete }: CardProps) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    if (type === "twitter") {
      
      if ((window as any).twttr && (window as any).twttr.widgets) {
        (window as any).twttr.widgets.load();
      } else {
        
      }
    }
  }, [link, type]);

  
  const youtubeEmbedUrl = type === "youtube" ? getYouTubeEmbedUrl(link) : null;
  const twitterLink = type === "twitter" ? getTwitterEmbedLink(link) : "";

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`${BACKEND_URL}/api/v1/content`, {
        
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          contentId: _id, 
        },
      });

      if (response.status === 200) {
        toast.success("Deleted successfully");
        onDelete?.(_id);
      } else {
        toast.error("Failed to delete:", response.data.message);
      }
    } catch (error: any) {
      console.error(
        "Error deleting content:",
        error?.response?.data || error.message
      );
    }
  };

  return (
    <div className=" bg-white rounded-md shadow-md border p-4 border-gray-300 w-85 h-fit overflow-hidden">
      {/*Header*/}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
          
          {title}
        </div>
        <div className="flex items-center  gap-2 text-gray-500">
          <div className="pr-2">
            <a href={link} target="_blank">
              <Share size="md" />
            </a>
          </div>
          
          {onDelete && (
          <div className="pr-2" onClick={handleDelete}>
            <Delete size="md" />
          </div>
          )}

        </div>
      </div>
      {/*content*/}
      <div>
        <div className=" w-full"></div>
        {type === "youtube" && youtubeEmbedUrl && (
          <iframe
            className="w-full aspect-video rounded-md overflow-hidden "
            src={youtubeEmbedUrl}
            title={title || "YouTube video player"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}

       
        {type === "youtube" && !youtubeEmbedUrl && (
          <p className="text-red-500 text-sm">
            Could not display YouTube video. Link might be invalid or not
            embeddable:{" "}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {link}
            </a>
          </p>
        )}

        {type === "twitter" && twitterLink && (
          <div className="w-full  max-w-full">
            <blockquote className="twitter-tweet w-full ">
              <p lang="en" dir="ltr">
                Loading tweet...
              </p>
              <a href={twitterLink}>Tweet by {title || "User"}</a>
            </blockquote>
          </div>
        )}
        {/* Show a message if Twitter link is invalid */}
        {type === "twitter" && !twitterLink && (
          <p className="text-red-500 text-sm">
            Could not display Tweet. Link might be invalid:{" "}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {link}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;
