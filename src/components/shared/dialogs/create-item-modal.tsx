import DocumentIcon from "@/assets/document.svg";
import EntityIcon from "@/assets/entity.svg";
import QueryIcon from "@/assets/query.svg";
import StudyIcon from "@/assets/study.svg";
import { CreateNewItem } from "@/components/shared/cards/create-new-item";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useTranslation } from "react-i18next";

// Define a type for your items
type CreateItemType = {
  type: string;
  desc: string;
  icon: string;
};

const CreateItemModal: React.FC = () => {
  // Array of items with their details
  const { t } = useTranslation();
  const createItems: CreateItemType[] = [
    {
      type: "Study",
      desc: "Create a workspace to gather and present acquired knowledge and insights from your technical or scientific research studies.",
      icon: <img src={StudyIcon} alt="Study Icon" />,
    },
    {
      type: "Entity",
      desc: "Create an encyclopedia-style page within your Universe, focusing on a specific entity like a technology, material, or company.",
      icon: <img src={EntityIcon} alt="Entity Icon" />,
    },
    {
      type: "Document",
      desc: "Manually add a scientific article, patent or webpage directly into your inbox by providing the DOI, patent number or URL.",
      icon: <img src={DocumentIcon} alt="Document Icon" />,
    },
    {
      type: "Query",
      desc: "Create a query in order to search through millions of documents.",
      icon: <img src={QueryIcon} alt="Query Icon" />,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="">
          <Button
            className="createNewButton bg-blue-500 uppercase hover:bg-blue-600"
            variant="secondary"
          >
            {t("createNew")}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent
        className="h-[80vh] max-w-6xl overflow-hidden bg-white"
        style={{ maxHeight: "70%", maxWidth: "80%" }}
      >
        <div className="flex h-full w-full flex-col items-start gap-6">
          <div className="header">
            <h2 className="pl-2 text-2xl font-black">{t("createNew")}</h2>
          </div>
          <div className="flex w-full gap-1">
            {createItems.map((item) => (
              <div key={item.type} className="createNewItemCard">
                <CreateNewItem type={item.type} desc={item.desc} icon={item.icon} />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItemModal;
