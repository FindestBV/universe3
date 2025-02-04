// node_modules
import FileHandler from "@tiptap-pro/extension-file-handler";
// Helpers
import { ImageHelperSingleton, INSERT_IMAGE_COMMAND } from "Helpers";
// Types
import { TImageDTO } from "Types";

export const CustomFileHandler = FileHandler.configure({
  allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  onDrop: (editor, files, pos) => {
    if (!editor.storage.objectEdited) return;

    files.forEach(async (file) => {
      const newImage: TImageDTO | undefined = await ImageHelperSingleton.addImageToObjectAsync(
        file,
        editor.storage.objectEdited.id,
        editor.storage.objectEdited.objectType,
        "",
      );

      if (!newImage) return;

      INSERT_IMAGE_COMMAND.action(editor, {
        image: file,
        imageId: newImage.id,
        nodePos: pos,
      });
    });
  },
  onPaste: (editor, files) => {
    if (!editor.storage.objectEdited) return;

    files.forEach(async (file) => {
      const newImage: TImageDTO | undefined = await ImageHelperSingleton.addImageToObjectAsync(
        file,
        editor.storage.objectEdited.id,
        editor.storage.objectEdited.objectType,
        "",
      );

      if (!newImage) return;

      INSERT_IMAGE_COMMAND.action(editor, {
        image: file,
        imageId: newImage.id,
      });
    });
  },
});
