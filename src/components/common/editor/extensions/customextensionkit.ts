import { CustomBlockquote } from "./CustomBlockquote";
import { CustomFileHandler } from "./CustomFileHandler";
import { CustomImage } from "./CustomImage";
import { CustomTable } from "./CustomTable";
import { IntakeSheetNodeExtension } from "./IntakeSheetNodeExtension";
import { RatingMarkExtension } from "./RatingMarkExtension";
import { SlashExtension } from "./SlashExtension";

export const CustomExtensionsKit = [
  SlashExtension,
  CustomTable,
  CustomImage,
  CustomBlockquote,
  CustomFileHandler,
  RatingMarkExtension,
  IntakeSheetNodeExtension,
];
