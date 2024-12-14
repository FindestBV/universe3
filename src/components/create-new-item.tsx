import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type NewItem = {
  type: string;
  desc: string;
  icon?: React.ReactNode;
};

export const CreateNewItem = ({ type, desc, icon }: NewItem) => {
  return (
    <Card className="w-auto">
      <CardHeader
        className={`flex flex-col justify-between space-y-2 p-8 min-h-[250px] ${type}`}
      >
        <div className="flex items-center gap-4">
          {/* Use the passed icon or fallback to default SVG */}
          {icon ? (
            <div className="w-[30px]">{icon}</div>
          ) : (
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="book-open-reader"
              className={`svg-inline--fa fa-book-open-reader w-[30px] ${type}`}
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M160 96a96 96 0 1 1 192 0A96 96 0 1 1 160 96zm80 152l0 264-48.4-24.2c-20.9-10.4-43.5-17-66.8-19.3l-96-9.6C12.5 457.2 0 443.5 0 427L0 224c0-17.7 14.3-32 32-32l30.3 0c63.6 0 125.6 19.6 177.7 56zm32 264l0-264c52.1-36.4 114.1-56 177.7-56l30.3 0c17.7 0 32 14.3 32 32l0 203c0 16.4-12.5 30.2-28.8 31.8l-96 9.6c-23.2 2.3-45.9 8.9-66.8 19.3L272 512z"
              ></path>
            </svg>
          )}
          <CardTitle>{type}</CardTitle>
        </div>
        <p>{desc}</p>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className="text-[11px] uppercase">
                Title
              </Label>
              <Input
                id="name"
                placeholder="Name of your project"
                className="w-full py-2 pl-2 border border-gray-300 rounded-sm shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {type && (type === "study" || type === "entity") ? (
              <div className="flex flex-col space-y-1.5">
                <Label
                  htmlFor="framework"
                  className="text-[11px] uppercase"
                >
                  {type} type
                </Label>
                <Select>
                  <SelectTrigger
                    id="framework"
                    className="bg-white text-black border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="bg-white text-black border border-gray-300 rounded-md shadow-md"
                  >
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="sveltekit">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button>Create {type}</Button>
      </CardFooter>
    </Card>
  );
};

export default CreateNewItem;
