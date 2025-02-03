// node_modules
import { Text } from "@tiptap/extension-text";
import { JSONContent, Mark } from "@tiptap/react";
// Enums
import { ObjectTypeEnum } from "Enums";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    rating: {
      setRating: (options: {
        rating: number;
        sourceId: string;
        sourceType: ObjectTypeEnum;
        targetId: string;
        ratersCount: number;
        isRatingNeeded: boolean;
      }) => ReturnType;
    };
  }
}

export const RatingMarkExtension = Mark.create({
  name: "rating",
  inclusive: false,
  addAttributes() {
    return {
      rating: {
        default: 0,
      },
      sourceId: {
        default: null,
      },
      sourceType: {
        default: 0,
      },
      targetId: {
        default: null,
      },
      ratersCount: {
        default: 0,
      },
      isRatingNeeded: {
        default: false,
      },
      class: {
        default: "rating",
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        class: `ratingsWrapper ${HTMLAttributes.isRatingNeeded ? "rating-needed" : ""}`,
      },
      ["span", HTMLAttributes, 0],
    ];
  },
  addCommands() {
    return {
      setRating:
        (options) =>
        ({ commands }) => {
          return commands.insertContent(
            getRatingContent(
              options.rating,
              options.sourceId,
              options.sourceType,
              options.targetId,
              options.ratersCount,
              options.isRatingNeeded,
            ),
          );
        },
    };
  },
});

export const getRatingContent = (
  rating: number,
  sourceId: string,
  sourceType: ObjectTypeEnum,
  targetId: string,
  ratersCount: number,
  isRatingNeeded: boolean,
): JSONContent => {
  return {
    type: Text.name,
    marks: [
      {
        type: RatingMarkExtension.name,
        attrs: {
          rating,
          sourceId,
          sourceType,
          targetId,
          ratersCount,
          isRatingNeeded,
        },
      },
    ],
    text: `${ratersCount}`,
  };
};
