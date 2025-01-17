import { AiTone, AiToneOption } from "@/components/BlockEditor/types";
import { Button } from "@/components/ui/Button";
import { DropdownButton } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icon";
import { Panel, PanelHeadline } from "@/components/ui/Panel";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import { Toolbar } from "@/components/ui/Toolbar";
import { AiStorage, tryParseToTiptapHTML } from "@/extensions/Ai/index";
import { tones } from "@/lib/constants";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { NodeViewProps, NodeViewWrapper, useEditorState } from "@tiptap/react";
import { v4 as uuid } from "uuid";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export interface DataProps {
  text: string;
  tone?: AiTone;
  textUnit?: string;
  textLength?: string;
}

// TODO rewrite this component to use the new Ai extension features
export const AiWriterView = ({ editor, node, getPos, deleteNode }: NodeViewProps) => {
  const { isLoading, generatedText, error } = useEditorState({
    editor,
    selector: (ctx) => {
      const aiStorage = ctx.editor.storage.ai as AiStorage;
      return {
        isLoading: aiStorage.state === "loading",
        generatedText: aiStorage.response,
        error: aiStorage.error,
      };
    },
  });

  const [data, setData] = useState<DataProps>({
    text: "",
    tone: undefined,
  });
  const currentTone = tones.find((t) => t.value === data.tone);
  const textareaId = useMemo(() => uuid(), []);

  const generateText = useCallback(() => {
    if (!data.text) {
      toast.error("Please enter a description");

      return;
    }

    editor.commands.aiTextPrompt({
      text: data.text,
      insert: false,
      tone: data.tone,
      stream: true,
      format: "rich-text",
    });
  }, [data.text, data.tone, editor]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const insert = useCallback(() => {
    const from = getPos();
    const to = from + node.nodeSize;
    editor.chain().focus().aiAccept({ insertAt: { from, to }, append: false }).run();
  }, [editor, getPos, node.nodeSize]);

  const discard = useCallback(() => {
    deleteNode();
  }, [deleteNode]);

  const onTextAreaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData((prevData) => ({ ...prevData, text: e.target.value }));
  }, []);

  const onUndoClick = useCallback(() => {
    setData((prevData) => ({ ...prevData, tone: undefined }));
  }, []);

  const createItemClickHandler = useCallback((tone: AiToneOption) => {
    return () => {
      setData((prevData) => ({ ...prevData, tone: tone.value }));
    };
  }, []);

  return (
    <NodeViewWrapper data-drag-handle>
      <Panel noShadow className="w-full">
        <div className="flex flex-col p-1">
          {generatedText && (
            <>
              <PanelHeadline>Preview</PanelHeadline>
              <div
                className="relative mb-4 ml-2.5 max-h-[14rem] overflow-y-auto border-l-4 border-neutral-100 bg-white px-4 text-base text-black dark:border-neutral-700 dark:bg-black dark:text-white"
                dangerouslySetInnerHTML={{
                  __html: tryParseToTiptapHTML(generatedText, editor) ?? "",
                }}
              />
            </>
          )}
          <div className="flex flex-row items-center justify-between gap-1">
            <PanelHeadline asChild>
              <label htmlFor={textareaId}>Prompt</label>
            </PanelHeadline>
          </div>
          <Textarea
            id={textareaId}
            value={data.text}
            onChange={onTextAreaChange}
            placeholder={"Tell me what you want me to write about."}
            required
            className="mb-2"
          />
          <div className="flex flex-row items-center justify-between gap-1">
            <div className="flex w-auto justify-between gap-1">
              <Dropdown.Root>
                <Dropdown.Trigger asChild>
                  <Button variant="tertiary">
                    <Icon name="Mic" />
                    {currentTone?.label || "Change tone"}
                    <Icon name="ChevronDown" />
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Portal>
                  <Dropdown.Content side="bottom" align="start" asChild>
                    <Surface className="min-w-[12rem] p-2">
                      {!!data.tone && (
                        <>
                          <Dropdown.Item asChild>
                            <DropdownButton
                              isActive={data.tone === undefined}
                              onClick={onUndoClick}
                            >
                              <Icon name="Undo2" />
                              Reset
                            </DropdownButton>
                          </Dropdown.Item>
                          <Toolbar.Divider horizontal />
                        </>
                      )}
                      {tones.map((tone) => (
                        <Dropdown.Item asChild key={tone.value}>
                          <DropdownButton
                            isActive={tone.value === data.tone}
                            onClick={createItemClickHandler(tone)}
                          >
                            {tone.label}
                          </DropdownButton>
                        </Dropdown.Item>
                      ))}
                    </Surface>
                  </Dropdown.Content>
                </Dropdown.Portal>
              </Dropdown.Root>
            </div>
            <div className="flex w-auto justify-between gap-1">
              {generatedText && (
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  onClick={discard}
                >
                  <Icon name="Trash" />
                  Discard
                </Button>
              )}
              {generatedText && (
                <Button variant="ghost" onClick={insert} disabled={!generatedText}>
                  <Icon name="Check" />
                  Insert
                </Button>
              )}
              <Button
                variant="primary"
                onClick={generateText}
                style={{ whiteSpace: "nowrap" }}
                disabled={isLoading}
              >
                {generatedText ? <Icon name="Repeat" /> : <Icon name="Sparkles" />}
                {generatedText ? "Regenerate" : "Generate text"}
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </NodeViewWrapper>
  );
};
