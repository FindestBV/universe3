// node_modules
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

// Components

type TEditableInputProps = {
  inputTitle?: string;
  value: string;
  setValue: (newValue: string) => void;
  placeholder?: string;
  className?: string;
  onDoubleClick?: () => void;
  shouldAutoGrow?: boolean;
  shouldAutoFocus?: boolean;
  handleFocus?: () => void;
  handleBlur?: () => void;
  showFullTitleOnHoverOnTooltip?: boolean;
};

export const EditableInput: FC<TEditableInputProps> = ({
  inputTitle,
  value,
  setValue,
  placeholder,
  className,
  onDoubleClick,
  shouldAutoGrow,
  shouldAutoFocus,
  handleFocus,
  handleBlur,
  showFullTitleOnHoverOnTooltip,
}: TEditableInputProps) => {
  // State
  const [editingValue, setEditingValue] = useState<string>(value);
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const [referenceElement, setReferenceElement] = useState<HTMLInputElement | null>(null);
  // Ref
  const inputRef = useRef<HTMLInputElement>(null);

  // Logic
  useEffect(() => {
    if (shouldAutoGrow && inputRef.current) {
      const temporaryWidth = "10px";
      const extraSpace = 16;
      // Set width to temporaryWidth to get the scrollWidth
      inputRef.current.style.width = temporaryWidth;
      // Set the width to actual width + add extra space for the cursor
      inputRef.current.style.width = `${inputRef.current.scrollWidth + extraSpace}px`;
    }
  }, [editingValue, shouldAutoGrow]);

  useEffect(() => {
    setEditingValue(value);
  }, [value]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue: string = event.target.value;
    setEditingValue(newValue);
    setValue(newValue);
  };

  const handleOnMouseEnter = () => {
    const isTooltipNeeded =
      inputRef.current && inputRef.current.scrollWidth > inputRef.current.clientWidth;
    if (!isTooltipNeeded) {
      return;
    }
    setIsTooltipOpen(true);
  };

  const handleOnMouseLeave = () => {
    setIsTooltipOpen(false);
  };

  // const ref = useMergeRefs([(node: HTMLInputElement) => setReferenceElement(node), inputRef]);

  // Render
  return (
    <>
      <input
        // ref={ref}
        title={inputTitle}
        className={`${className ? className : ""}`}
        type="text"
        aria-label="editable text"
        placeholder={placeholder}
        value={editingValue}
        autoFocus={shouldAutoFocus}
        onChange={onChange}
        onDoubleClick={onDoubleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={showFullTitleOnHoverOnTooltip ? handleOnMouseEnter : undefined}
        onMouseLeave={showFullTitleOnHoverOnTooltip ? handleOnMouseLeave : undefined}
      />
      {showFullTitleOnHoverOnTooltip && editingValue && (
        <Tooltip referenceEl={referenceElement} isOpen={isTooltipOpen} tooltipText={editingValue} />
      )}
    </>
  );
};
