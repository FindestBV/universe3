import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";

import { FC, useCallback } from "react";

const IntakeSheetComponent: FC<NodeViewProps> = ({ node, updateAttributes }) => {
  const handleConfirm = useCallback(() => {
    const today = new Date().toLocaleDateString();
    updateAttributes({
      confirmed: true,
      confirmedBy: "ronan.oleary@findest.eu", // Static or replace with dynamic data
      date: today,
    });
  }, [updateAttributes]);

  const handleUnconfirm = useCallback(() => {
    updateAttributes({
      confirmed: false,
      confirmedBy: "",
      date: "",
    });
  }, [updateAttributes]);

  return (
    <NodeViewWrapper className={"intakeSheet"} contentEditable={false}>
      {!node.attrs.confirmed ? (
        <div className={"card"}>
          <p>
            Please press "Accept" if the intake sheet matches the required criteria. Otherwise,
            leave a comment.
          </p>
          <button className={"confirmButton"} onClick={handleConfirm}>
            Accept
          </button>
        </div>
      ) : (
        <div className={"card"}>
          <p>
            Intake sheet confirmed by {node.attrs.confirmedBy} on {node.attrs.date}.
          </p>
          <button className={"unconfirmButton"} onClick={handleUnconfirm}>
            Remove Confirmation
          </button>
        </div>
      )}
    </NodeViewWrapper>
  );
};

export default IntakeSheetComponent;
