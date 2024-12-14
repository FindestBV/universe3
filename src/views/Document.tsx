import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useGetDocumentByIdQuery } from '@/services/documents/documentApi';
import { Toolbar } from '@/components/toolbar';
import DocumentSkeleton from '@/components/document-skeleton';

export const Document: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const { data: fetchedDocument } = useGetDocumentByIdQuery(id, {
    refetchOnMountOrArgChange: false,
  });

  const renderConnectedObjects = fetchedDocument && Object.entries(fetchedDocument?.connectedObjects).map((o, i) => {
    return <div key={i}><a href={o[1].url}>{o[1]?.name}</a></div>;
  });

  useEffect(() => {
    if (fetchedDocument) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 250); // 2.5 seconds

      // Clean up the timer to prevent memory leaks
      return () => clearTimeout(timer);
    }
  }, [fetchedDocument]);

  return (
    <>
      {isLoading ? (
        <DocumentSkeleton />
      ) : (
        <div className="flex flex-col w-auto h-screen">

          <>
            <header className="documentCrud">
              <Toolbar />
            </header>

            <div className="flex flex-col w-full h-full max-sm:px-4 p-12">
              <h1 className="text-xl text-black font-black mb-2">
                {fetchedDocument?.title || "Document"}
              </h1>
              <p><span className="text-black font-black">Document ID:</span> {id}</p>
              <p><span className="text-black font-black">Type: </span> {fetchedDocument?.type || "Document"}</p>
              <br />
              <p className="text-black">{fetchedDocument?.abstract}</p>
              <br />
              <h4 className='font-black'>Connected Objects:</h4>
              {renderConnectedObjects}
            </div>
          </>

        </div>
      )}
    </>
  );
};

export default Document;