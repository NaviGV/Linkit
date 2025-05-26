import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosPublic from "../utiils/axiosPublic";

import Card from "../components/ui/Card";


export default function SharedView() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const { shareId  } = useParams();
  const [data, setData] = useState<{ username: string; content: any[] } | null>(null);
  const [error, setError] = useState("");

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPublic.get(`${BACKEND_URL}/api/v1/brain/${shareId}`);
        setData(response.data);
      } catch (err: any) {
        console.error("Axios error:", err);
        setError("Link is invalid or expired");
      }
    };

    fetchData();
  }, [shareId]);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading...</div>;



  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4 ">
      <h1 className= "text-xl font-bold mb-5 p-5 bg-cyan-300">{data.username}'s Shared Content</h1>
      <div className="w-full h-px bg-purple-500 my-6"></div>
      <div className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.content.map((item) => (
        <Card
          key={item._id}
          _id={item._id}
          title={item.title}
          link={item.link}
          type={item.type}
         
        />
      ))}
    </div>
    </div>
  );
}
