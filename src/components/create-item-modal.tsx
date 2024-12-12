import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { CreateNewItem } from "@/components/create-new-item";

import StudyIcon from '@/assets/study.svg';
import Document from '@/assets/document.svg'
import Entity from '@/assets/entity.svg'
import QueryIcon from '@/assets/query.svg';

// Define a type for your items
type CreateItemType = {
type: string;
desc: string;
icon: string;
};

const CreateItemModal: React.FC = () => {
// Array of items with their details
const createItems: CreateItemType[] = [
  {
    type: "Study", 
    desc: "Create a workspace to gather and present acquired knowledge and insights from your technical or scientific research studies.",
    icon: <img src={StudyIcon} alt="Study Icon" />
  },
  {
    type: "Entity", 
    desc: "Create an encyclopedia-style page within your Universe, focusing on a specific entity like a technology, material, or company.",
    icon: <img src={Entity} alt="Entity Icon" />
  },
  {
    type: "Document", 
    desc: "Manually add a scientific article, patent or webpage directly into your inbox by providing the DOI, patent number or URL.",
    icon: <img src={Document} alt="Document Icon" />
  },
  {
    type: "Query", 
    desc: "Create a query in order to search through millions of documents.",
    icon: <img src={QueryIcon} alt="Query Icon" />
  }
];

return (
  <Dialog>
    <DialogTrigger asChild>
      <div className="">
        <Button className="createNewButton bg-blue-500 hover:bg-blue-600 uppercase" variant="secondary">Create New</Button>
      </div>
    </DialogTrigger>
    <DialogContent className="max-w-6xl h-[80vh] bg-white overflow-hidden" style={{ maxHeight: "70%", maxWidth: "80%"}}>
      <div className="w-full h-full flex flex-col gap-6 items-start">
        <div className="header">
          <h2 className="pl-2 font-black text-2xl">Create New</h2>
        </div>
        <div className="flex w-full gap-2">
          {createItems.map((item) => (
            <div key={item.type} className="createNewItemCard">
              <CreateNewItem 
                type={item.type} 
                desc={item.desc} 
                icon={item.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  </Dialog>
  );
};

export default CreateItemModal;