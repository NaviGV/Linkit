import { useEffect, useState } from "react";



import axiosInstance from "../utiils/axiosConfig";
import toast from "react-hot-toast";

interface Content {
  _id: string;
title: string;
  type:  "youtube" | "twitter";
  link: string;
}

const useContent = (reloadTrigger: any) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

  


    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`${BACKEND_URL}/api/v1/content`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setContents(response.data.content); 
        
      } catch (err:any) {
        toast.error("Error fetching content:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reloadTrigger]);

  return { contents, loading, error };
};

export default useContent;
