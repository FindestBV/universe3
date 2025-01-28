import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Bot, Folder, type LucideIcon, Microscope } from "lucide-react";

import AdvancedSearchModal from "../../dialogs/advanced-search-modal";
import AskIgorModal from "../../dialogs/ask-igor";
import GenerateReport from "../../dialogs/generate-report-modal";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        Igor <sup>AI</sup> Search
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem key={"advancedSearch"}>
          <SidebarMenuButton asChild>
            <a href={"/queries"}>
              <Microscope size="24" />
              <span>Advanced Search</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem key={"q-and-a"}>
          <SidebarMenuButton asChild>
            <AdvancedSearchModal />
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem key={"generate-report"}>
          <SidebarMenuButton asChild>
            <GenerateReport
              leftContent={undefined}
              rightContent={undefined}
              onClose={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
