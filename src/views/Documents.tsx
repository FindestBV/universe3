import { useState } from 'react';
import { useGetSavedDocumentsQuery } from '../services/documents/documentApi';
import { CardContent } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { DocumentCard } from '@/components/document-card';
import { ListPagination } from "@/components/list-pagination";
import { Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Documents: React.FC = () => {
    const { t } = useTranslation();
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
        <div className="flex flex-col w-full h-full max-sm:px-4 py-[10px] px-12">
    
            <div className="flex items-center justify-between gap-4 rounded-lg mb-2">
                <div>
                    <Checkbox
                        id="select-all"
                        checked={data ? selectedDocs.size === data.documents.length : false}
                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                        className="ml-4"
                    />
                    <label htmlFor="select-all" className="text-sm font-medium pl-4">
                        Select All ({selectedDocs.size} of {documentsPerPage || 0} total)
                    </label>
                </div>

                <div className="flex w-[30%]">
                    <button type="button" id="radix-:r28:" aria-haspopup="menu" aria-expanded="false" data-state="closed" className="bg-gray p-4 rounded-md flex w-full items-end justify-end">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg> Add Filter</button><nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center"><ul className="flex flex-row items-center gap-1"><li className=""><a className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pl-2.5" aria-label="Go to previous page" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-left h-4 w-4"><path d="m15 18-6-6 6-6"></path></svg></a></li><li className=""><a className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pr-2.5" aria-label="Go to next page" href="#" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-right h-4 w-4"><path d="m9 18 6-6-6-6"></path></svg></a></li></ul></nav>
                        <div className="w-full sm:w-1/2 md:w-1/4 flex flex-col items-end">
                            <label htmlFor="documentsPerPage" className="text-sm font-black text-gray-700 mb-2 text-right hidden">
                                Documents per Page
                            </label>
                        <select
                            id="documentsPerPage"
                            value={documentsPerPage}
                            onChange={handleDocumentsPerPageChange}
                            className="border p-2 mt-2 mb-2 rounded width-[55%] focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={25}>25</option>
                            <option value={20}>20</option>
                            <option value={15}>15</option>
                            <option value={10}>10</option>
                            <option value={5}>5</option>
                        </select>
                    </div>
                </div>
            </div>
            {tempLoading ?? <p>LOADING</p>}
            <CardContent className="p-0">
                {isError && <div className="text-red-600">Error loading documents: {JSON.stringify(error)}</div>}
                {isLoading && <Loader className="animate-spin" />}
                {data && (
                    <div>

                        {data.documents.slice(0, documentsPerPage).map((doc) => (
                            <DocumentCard
                                key={doc.id}
                                {...doc}
                                isSelected={selectedDocs.has(doc.id)}
                                onSelect={handleSelectDoc}
                            />
                        ))}

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
