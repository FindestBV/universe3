
import { StudiesIndex } from "@/components/studies-index";
import { ListPagination } from "@/components/list-pagination";


export const Queries = () => (
    <div className="flex flex-col w-full h-ful max-sm:px-4">
        <div className="flex w-full justify-between items-center">
            <h1 className="text-black font-black text-xl">Queries</h1>
            <div className="flex">
            <ListPagination />   
            </div>  
        </div>
        <StudiesIndex />
        <div className="py-4 w-full">
            <ListPagination />     
        </div>  
    </div>
);

export default Queries;