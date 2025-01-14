import React, { useState } from "react";

const COLOR_CARD_NAMES = [
  { category: "Neutral", name: "Neutral", key: "#d4d4d8", shade: "200" },
  { category: "Primary", name: "Primary", key: "#3b82f6", shade: "500" },
  { category: "Secondary", name: "Secondary", key: "#22d3ee", shade: "500" },
  { category: "Alternative", name: "Alternative", key: "#a78bfa", shade: "500" },
  { category: "Success", name: "Success", key: "#22c55e", shade: "500" },
  { category: "Warning", name: "Warning", key: "#facc15", shade: "500" },
  { category: "Danger", name: "Danger", key: "#ef4444", shade: "500" },
];

export const ColorCards = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter colors by category
  const filteredColors =
    activeCategory === "All"
      ? COLOR_CARD_NAMES
      : COLOR_CARD_NAMES.filter((color) => color.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          "All",
          "Neutral",
          "Primary",
          "Secondary",
          "Alternative",
          "Success",
          "Warning",
          "Danger",
        ].map((category) => (
          <button
            key={category}
            className={`rounded-md border px-4 py-2 text-sm font-medium ${
              activeCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Color Cards */}
      <article className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredColors.map(({ name, key, shade, category }) => (
          <ColorCard
            key={name}
            colorName={name}
            colorHex={key}
            colorShade={shade}
            category={category}
          />
        ))}
      </article>
    </div>
  );
};

const ColorCard = ({ colorName, colorHex, colorShade }) => {
  return (
    <section className="flex flex-col overflow-hidden rounded-lg border bg-gray-50 shadow">
      {/* Color Swatch */}
      <div
        className="h-24 w-full"
        style={{ backgroundColor: colorHex }}
        aria-label={`Color swatch for ${colorName} ${colorShade}`}
      ></div>
      {/* Card Content */}
      <dl className="p-4">
        <div className="mb-2 px-2">
          <dt className="text-sm font-medium text-gray-500">Name:</dt>
          <dd className="text-sm font-semibold text-gray-800">{`${colorName} ${colorShade}`}</dd>
        </div>
        <div className="mb-2 px-2">
          <dt className="text-sm font-medium text-gray-500">Hex:</dt>
          <dd className="p-0 text-sm font-semibold text-gray-800">{colorHex}</dd>
        </div>
      </dl>
    </section>
  );
};

export default ColorCards;
