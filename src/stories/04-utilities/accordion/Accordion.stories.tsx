import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/ui/Accordion",
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: "Accordion component using ShadCN.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Base: Story = {
  render: () => (
    <div className="baseAccordion">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>
            This is the content for Item 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>
            This is the content for Item 2. Sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <Accordion type="multiple">
      <AccordionItem value="item-1">
        <AccordionTrigger>Collapsible Item 1</AccordionTrigger>
        <AccordionContent>
          This is the content for Collapsible Item 1. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Collapsible Item 2</AccordionTrigger>
        <AccordionContent>
          This is the content for Collapsible Item 2. Sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithCustomStyling: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="bg-blue-50">
        <AccordionTrigger className="text-blue-500 hover:underline">
          Custom Styled Item 1
        </AccordionTrigger>
        <AccordionContent>
          Custom styled content for Item 1. Tailor this content to fit your design needs.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="bg-green-50">
        <AccordionTrigger className="text-green-500 hover:underline">
          Custom Styled Item 2
        </AccordionTrigger>
        <AccordionContent>
          Custom styled content for Item 2. Leverage Tailwind to design your components.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
