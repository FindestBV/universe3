import { useParams } from 'react-router';
// import { DocumentData } from '../types/types'; // Create a type for document data if needed for TypeScript
import { useGetDocumentByIdQuery } from '@/services/documents/documentApi';

export const Document: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    // const location = useLocation();
    // const document = location.state as DocumentData;

    // @ts-expect-error abd
    const { data: fetchedDocument } = useGetDocumentByIdQuery(id, {
      refetchOnMountOrArgChange: false, // Prevents automatic refetching
    });

    console.log('fetched', fetchedDocument?.connectedObjects);

    // it's because this isn't linked with useNavigate

    const renderConnectedObjects = fetchedDocument && Object.entries(fetchedDocument?.connectedObjects).map((o, i) => {
      // @ts-expect-error ass
      return <div key={i}><a href={o[1].url}>{o[1]?.name}</a></div>;
    });

    // Render the full document data if available
    return (
        <div className="flex flex-col w-full h-full max-sm:px-4">
            <div className="flex flex-col w-auto h-screen">
                <h1 className="text-xl text-black font-black mb-2"> {fetchedDocument?.title || "Document"}</h1>
                <p><span className="text-black font-black">Document ID:</span> {id}</p>
                <p><span className="text-black font-black">Type: </span> {fetchedDocument?.type || "Document"}</p>
                <br/>
                <p className="text-black">{fetchedDocument?.abstract}</p>
                <br />
                <h4 className='font-black'>Connected Objects:</h4>
                {renderConnectedObjects}
            </div>
        </div>
    );
};

export default Document; 