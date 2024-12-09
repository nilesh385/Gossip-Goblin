import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  children: React.ReactNode;
  content: string | Array<string> | any;
};

export default function ToolTip_({ children, content }: Props) {
  return (
    <div>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </div>
  );
}
