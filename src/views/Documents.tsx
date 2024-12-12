import { useState } from 'react';
import { useGetSavedDocumentsQuery } from '../services/documents/documentApi';
import { CardContent } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { DocumentCard } from '@/components/document-card';
import { ListPagination } from "@/components/list-pagination";
import { Loader } from 'lucide-react';

export const Documents: React.FC = () => {
    const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [documentsPerPage, setDocumentsPerPage] = useState(12);
    const [tempLoading, setTempLoading] = useState(false); // Temporary loading state
    
    // React Query fetch
    const { data, isLoading, isError, error, refetch } = useGetSavedDocumentsQuery(
        { page: currentPage, limit: documentsPerPage },
        { refetchOnMountOrArgChange: true }
    );

    const totalPages = data ? Math.ceil(data.totalCount / documentsPerPage) : 1;

    const handlePageChange = (page: number) => setCurrentPage(page);
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    const handleSelectAll = (checked: boolean) => {
        if (checked && data) {
            setSelectedDocs(new Set(data.documents.map((doc) => doc.id)));
        } else {
            setSelectedDocs(new Set());
        }
    };

    const handleSelectDoc = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedDocs);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedDocs(newSelected);
    };

    const handleDocumentsPerPageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value, 10);
        setDocumentsPerPage(value);
        setCurrentPage(1); // Reset to first page

        // Show the loader for at least 500ms
        setTempLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTempLoading(false);

        refetch(); // Trigger re-fetch
    };


    return (
        <div className="flex flex-col w-full h-full max-sm:px-4">
            <div className="flex w-full justify-between items-center">
                <h1 className="text-black font-black text-xl">Documents</h1>
                <div className="w-full sm:w-1/2 md:w-1/4 flex flex-col items-end">
                    <label htmlFor="documentsPerPage" className="block text-sm font-black text-gray-700 mb-2 text-right">
                        Documents per Page
                    </label>
                    <select
                        id="documentsPerPage"
                        value={documentsPerPage}
                        onChange={handleDocumentsPerPageChange}
                        className="border p-2 mb-2 rounded w-full sm:w-1/2 md:w-full focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={25}>25</option>
                        <option value={20}>20</option>
                        <option value={15}>15</option>
                        <option value={10}>10</option>
                        <option value={5}>5</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg mb-4">
                <Checkbox
                    id="select-all"
                    checked={data ? selectedDocs.size === data.documents.length : false}
                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                    Select All ({selectedDocs.size} of {documentsPerPage || 0} total)
                </label>
            </div>
            {tempLoading ?? <p>LOADING</p>}
            <CardContent>
                {isError && <div className="text-red-600">Error loading documents: {JSON.stringify(error)}</div>}
                {isLoading && <Loader className="animate-spin" />}
                {data && (
                    <div>
                        <div className="space-y-4 mb-8">
                            {data.documents.slice(0, documentsPerPage).map((doc) => (
                                <DocumentCard
                                    key={doc.id}
                                    {...doc}
                                    isSelected={selectedDocs.has(doc.id)}
                                    onSelect={handleSelectDoc}
                                />
                            ))}
                        </div>
                        <ListPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onNextPage={handleNextPage}
                            onPreviousPage={handlePreviousPage}
                        />
                    </div>
                )}
            </CardContent>
        </div>
    );
};

export default Documents;
