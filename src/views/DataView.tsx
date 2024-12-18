import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router";

export const DataView = () => {
  const navigate = useNavigate();

  return (
    <div className="dataView">
      <div>
        <h2>Placeholder for Data View</h2>
        <p>Nothing here yet. WIP</p>
      </div>
      <div>
        <Button
          onClick={() => navigate(-1)}
          className="bg-blue-500 uppercase text-white hover:bg-blue-600"
        >
          Go back
        </Button>
      </div>
    </div>
  );
};

export default DataView;
