import { Placement, Props } from "tippy.js";

import React from "react";

export interface TooltipProps {
  children?: string | React.ReactNode;
  enabled?: boolean;
  title?: string;
  shortcut?: string[];
  tippyOptions?: Omit<Partial<Props>, "content">;
  content?: React.ReactNode;
}

export interface TippyProps {
  "data-placement": Placement;
  "data-reference-hidden"?: string;
  "data-escaped"?: string;
}
