// Types
import { TButtonType } from "@/types/types";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { FC, LegacyRef } from "react";

import { Button } from "../ui/button";

type TFindestButtonProps = {
  id?: string;
  title?: string;
  type?: "button" | "submit" | "reset";
  extraClassName?: string;
  isColorless?: boolean;
  isSmallSize?: boolean;
  leftIconName?: regularIconDefinition | solidIconDefinition;
  rightIconName?: regularIconDefinition | solidIconDefinition;
  onClick?: () => void;
  isDisabled?: boolean;
  buttonType?: TButtonType;
  styleProps?: ("noWrap" | "textTransformNone" | "noPadding" | "fullWidth" | "justifyCenter")[];
  children?: React.ReactNode;
  titleAttribute?: string;
  ref?: LegacyRef<HTMLButtonElement> | undefined;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  isLoading?: boolean;
};

export const FindestButton: FC<TFindestButtonProps> = ({
  id,
  title,
  type,
  extraClassName,
  isColorless,
  isSmallSize,
  leftIconName,
  rightIconName,
  onClick,
  isDisabled,
  buttonType,
  children,
  titleAttribute,
  styleProps,
  ref,
  onMouseOver,
  onMouseOut,
  isLoading,
}: TFindestButtonProps) => {
  const getClassName = (): string => {
    const classNameList = ["findestButton py-4"];
    if (extraClassName) classNameList.push(extraClassName);
    if (isColorless) classNameList.push("colorless");
    if (isSmallSize) classNameList.push("small");
    if (isDisabled) classNameList.push("disabled");
    if (isLoading) classNameList.push("isLoading");
    if (buttonType) classNameList.push("button");
    if (!title && !children) classNameList.push("iconOnly");

    if (leftIconName) classNameList.push("hasLeftIcon");
    if (rightIconName) classNameList.push("hasRightIcon");

    if (styleProps) {
      styleProps.forEach((prop) => {
        classNameList.push(styles[prop]);
      });
    }

    return classNameList.join(" ");
  };

  return (
    <Button
      disabled={isDisabled}
      type={type ?? "button"}
      id={id}
      onClick={onClick}
      className={getClassName()}
      title={titleAttribute ? titleAttribute : ""}
      ref={ref}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {/* <ArrowLeft icon={leftIconName} className={"leftIcon"} /> */}
      {title}
      {children}
      <ArrowRight icon={rightIconName} className={"rightIcon"} />
    </Button>
  );
};
