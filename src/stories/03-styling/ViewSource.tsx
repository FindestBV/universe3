interface ViewSourceProps {
  pkg?: "design-system" | "icons" | "primitives";
  path: string;
  branch?: string;
}

const ViewSource = ({ pkg = "design-system", path, branch = "main" }: ViewSourceProps) => {
  if (!path) {
    console.warn("ViewSource requires a path prop to be passed.");
    return null;
  }

  let href: string;

  if (pkg === "icons") {
    href = `https://github.com/Findest/design-system/tree/${branch}/packages/${pkg}/assets/${path}`;
  } else {
    href = `https://github.com/Findest/design-system/tree/${branch}/packages/${pkg}/src/${path}`;
  }

  return (
    <a
      style={{ marginTop: 16 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline hover:text-blue-700"
    >
      View source
    </a>
  );
};

export { ViewSource };
export type { ViewSourceProps };
