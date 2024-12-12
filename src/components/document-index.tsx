/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export const DocumentIndex = () => {
  // Sample documents data
  const documents = [
    { id: 1, title: "Document 1", content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos pariatur nam odio recusandae consequuntur! Voluptatum numquam reiciendis vitae sunt quos.." },
    { id: 2, title: "Document 2", content: "In sapien ex, gravida quis quam id, condimentum elementum eros. Phasellus ut velit et lectus vulputate tristique ut vitae sapien. Nam dolor nulla, blandit a quam eget, accumsan aliquam nunc. " },
    { id: 3, title: "Document 3", content: "Morbi ac lectus vel elit porta maximus. Mauris fermentum vestibulum risus, in eleifend eros consequat ut. Ut orci lorem, blandit sed auctor eu, scelerisque id ante." },
    { id: 4, title: "Document 4", content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos pariatur nam odio recusandae consequuntur! Voluptatum numquam reiciendis vitae sunt quos.." },
    { id: 5, title: "Document 5", content: "In sapien ex, gravida quis quam id, condimentum elementum eros. Phasellus ut velit et lectus vulputate tristique ut vitae sapien. Nam dolor nulla, blandit a quam eget, accumsan aliquam nunc. " },
    { id: 6, title: "Document 6", content: "Morbi ac lectus vel elit porta maximus. Mauris fermentum vestibulum risus, in eleifend eros consequat ut. Ut orci lorem, blandit sed auctor eu, scelerisque id ante." },
  ];

  const [selectedDocs, setSelectedDocs] = useState(new Set());

  const handleSelectAll = (checked: any) => {
    if (checked) {
      setSelectedDocs(new Set(documents.map(doc => doc.id)));
    } else {
      setSelectedDocs(new Set());
    }
  };

  const handleSelectDoc = (docId: unknown, checked: string | boolean) => {
    const newSelected = new Set(selectedDocs);
    if (checked) {
      newSelected.add(docId);
    } else {
      newSelected.delete(docId);
    }
    setSelectedDocs(newSelected);
  };

  return (
    <div className="w-full mx-auto max-sm:px-4">
      {/* Header with select all checkbox */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg mb-4">
        <Checkbox
          id="select-all"
          checked={selectedDocs.size === documents.length}
          onCheckedChange={handleSelectAll}
        />
        <label 
          htmlFor="select-all"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Select All Documents ({selectedDocs.size} of {documents.length} selected)
        </label>
      </div>

      {/* Document cards list */}
      <div className="w-full max-w-full mx-auto space-y-4 p-4">
        {documents.map((doc) => (
          <div key={doc.id} className="flex gap-4 items-start">
           
            <div className="pt-4">
              <Checkbox
                id={`doc-${doc.id}`}
                checked={selectedDocs.has(doc.id)}
                onCheckedChange={(checked) => handleSelectDoc(doc.id, checked)}
              />
            </div>
            <Card className="w-full bg-slate-100">
            <a href={`/library/documents/${doc.id}`}>
              <CardHeader>
                <CardTitle className="text-black">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <p className="text-black">{doc.content}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Link</Button>
                <Button variant="default">Save</Button>
              </CardFooter>
              </a>
            </Card>
           
          </div>
        ))}
      </div>

      {/* Selected items actions */}
      {selectedDocs.size > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <p className="mb-2">{selectedDocs.size} items selected</p>
          <div className="flex gap-2">
            <Button variant="outline" className="text-white">Bulk Action</Button>
            <Button 
              variant="default"
              onClick={() => setSelectedDocs(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentIndex;