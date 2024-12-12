import React from "react";

export const renderProseMirrorContent = (node: any): React.ReactNode => {
  if (!node) return null;

  switch (node.type) {
    case "doc":
    case "paragraph":
      return (
        <p>
          {node.content?.map((child: any, index: number) => (
            <React.Fragment key={index}>
              {renderProseMirrorContent(child)}
            </React.Fragment>
          ))}
        </p>
      );

    case "text":
      if (node.marks) {
        return node.marks.map((mark: any, index: number) => {
          switch (mark.type) {
            case "link":
              return (
                <a
                  key={index}
                  href={mark.attrs?.href}
                  target={mark.attrs?.target || "_self"}
                  rel={mark.attrs?.rel || ""}
                >
                  {node.text}
                </a>
              );
            case "bold":
              return <strong key={index}>{node.text}</strong>;
            default:
              return node.text; // Fallback to plain text
          }
        });
      }
      return node.text; // Plain text without marks

    case "heading":
      const HeadingTag = `h${node.attrs?.level || 1}`;
      return (
        <HeadingTag id={node.attrs?.id || undefined}>
          {node.content?.map((child: any, index: number) => (
            <React.Fragment key={index}>
              {renderProseMirrorContent(child)}
            </React.Fragment>
          ))}
        </HeadingTag>
      );

    default:
      return null; // Handle unexpected or unsupported node types
  }
};

export default renderProseMirrorContent;