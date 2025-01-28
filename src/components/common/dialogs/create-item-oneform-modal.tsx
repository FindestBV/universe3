import DocumentIcon from "@/assets/document.svg";
import EntityIcon from "@/assets/entity.svg";
import QueryIcon from "@/assets/query.svg";
import StudyIcon from "@/assets/study.svg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useState } from "react";
import { useTranslation } from "react-i18next";

type CreateItemType = {
  type: string;
  desc: string;
  icon: string;
};

export const CreateItemModal: React.FC = () => {
  const { t } = useTranslation();

  // Step management state
  const [selectedItem, setSelectedItem] = useState<CreateItemType | null>(null);

  // Array of items with their details
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

  // Function to render fields based on selected type
  const renderFields = () => {
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case "Study":
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">{t("studyDetails")}</h3>
            <input type="text" placeholder={t("studyName")} className="rounded-md border p-2" />
            <textarea placeholder={t("studyDescription")} className="h-32 rounded-md border p-2" />
          </div>
        );

      case "Entity":
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">{t("entityDetails")}</h3>
            <input type="text" placeholder={t("entityName")} className="rounded-md border p-2" />
            <textarea placeholder={t("entityDescription")} className="h-32 rounded-md border p-2" />
          </div>
        );

      case "Document":
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">{t("documentDetails")}</h3>
            <input type="text" placeholder={t("enterDOIorURL")} className="rounded-md border p-2" />
          </div>
        );

      case "Query":
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">{t("queryDetails")}</h3>
            <input type="text" placeholder={t("queryName")} className="rounded-md border p-2" />
            <textarea placeholder={t("queryDescription")} className="h-32 rounded-md border p-2" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="createNewButton bg-blue-500 uppercase hover:bg-blue-600"
          variant="secondary"
        >
          {t("createNew")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="h-[80vh] max-w-6xl overflow-hidden bg-white"
        style={{ maxHeight: "70%", maxWidth: "80%" }}
      >
        <div className="flex h-full w-full flex-col items-start gap-6">
          <div className="header">
            <h2 className="pl-2 text-2xl font-black">{t("createNew")}</h2>
          </div>

          {/* Step 1: Render Item Selection */}
          {!selectedItem && (
            <div className="flex w-full gap-4">
              {createItems.map((item) => (
                <div
                  key={item.type}
                  className="cursor-pointer rounded-md border p-4 hover:bg-gray-100"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <h3 className="text-lg font-bold">{item.type}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Render Fields for Selected Item */}
          {selectedItem && (
            <div className="flex w-full flex-col gap-4">
              {renderFields()}

              <div className="flex justify-end gap-4">
                <Button variant="secondary" onClick={() => setSelectedItem(null)}>
                  {t("goBack")}
                </Button>
                <Button className="bg-blue-500 text-white hover:bg-blue-600">{t("create")}</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItemModal;
