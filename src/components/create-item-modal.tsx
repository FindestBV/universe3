import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "./ui/button";
  
  const CreateItemModal: React.FC = () => {
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div>
          <Button className=" bg-blue-500 hover:bg-blue-600" variant="secondary">Create New</Button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-6xl h-[80vh] bg-white">
          <div className="w-full h-full flex items-start">
            
            <ul className="flex gap-2">
              <li>Study</li>
              <li>Entity</li>
              <li>Document</li>
              <li>Query</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default CreateItemModal;
  