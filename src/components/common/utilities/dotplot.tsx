/**
 * DOTPLOT - CUSTOM TIP TAP (WIP)
 * @component
 *
 * @returns {JSX.Element} The rendered DOTPLOT component.
 */

const topics = [
  "Welding Techniques and Residual Stresses",
  "Non-Destructive Techniques Based on Eddy Current Testing",
  "Fabric Defect Detection in Industrial Applications",
  "Applications of Infrared Thermography in Non-Destructive Testing",
  "Advances in Friction Stir Welding and Processing",
];

const institutions = [
  "Harbin Institute of Technology",
  "Osaka University",
  "Shanghai Jiao Tong University",
  "University of Toronto",
  "Zhejiang University",
  "Xi'an Jiaotong University",
  "French National Centre for Scientific Research",
  "Chinese Academy of Sciences",
];

const dataPoints = [
  { topic: 0, institution: 0, size: 20, type: "education" },
  { topic: 0, institution: 1, size: 25, type: "education" },
  { topic: 0, institution: 2, size: 18, type: "education" },
  { topic: 1, institution: 0, size: 12, type: "education" },
  { topic: 1, institution: 3, size: 15, type: "education" },
  { topic: 2, institution: 2, size: 10, type: "education" },
  { topic: 2, institution: 4, size: 8, type: "education" },
  { topic: 3, institution: 5, size: 14, type: "government" },
  { topic: 3, institution: 6, size: 22, type: "government" },
  { topic: 3, institution: 7, size: 10, type: "government" },
  { topic: 4, institution: 0, size: 25, type: "education" },
  { topic: 4, institution: 1, size: 20, type: "education" },
  { topic: 4, institution: 2, size: 15, type: "education" },
];

const DotPlot = () => {
  return (
    <div className="flex w-full items-center justify-center overflow-auto bg-gray-900 p-6 text-white">
      <div className="relative min-h-[550px]">
        <h2 className="mb-4 text-center text-2xl font-medium">
          Publication Counts by Topic and Institution Type
        </h2>

        {/* Legend */}
        <div className="mt-0 flex items-start justify-end gap-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-[#006A86] opacity-80" />
            <span className="text-sm">Education</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-red-500 opacity-80" />
            <span className="text-sm">Government</span>
          </div>
        </div>

        <div className="flex items-start">
          {/* Y-axis labels (Topics) - Tightly placed */}
          <div className="flex flex-col items-end pr-3">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="flex h-10 items-center whitespace-nowrap text-xs font-medium"
              >
                {topic}
              </div>
            ))}
          </div>

          {/* Main plot area */}
          <div className="relative">
            <div
              className="relative mx-auto"
              style={{
                minWidth: `${institutions.length * 55}px`,
                height: `${topics.length * 40}px`,
              }}
            >
              {/* Grid */}
              {topics.map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="absolute left-0 right-0 border-t border-gray-700/30"
                  style={{ top: `${rowIndex * 40 + 20}px` }}
                />
              ))}
              {institutions.map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="absolute bottom-0 top-0 border-l border-gray-700/30"
                  style={{ left: `${(colIndex + 0.5) * 55}px` }} // Fix alignment
                />
              ))}

              {/* Dots */}
              {dataPoints.map((point, index) => (
                <div
                  key={index}
                  className={`absolute rounded-full opacity-80 ${
                    point.type === "education" ? "bg-[#006A86]" : "bg-red-500"
                  }`}
                  style={{
                    width: `${point.size}px`,
                    height: `${point.size}px`,
                    top: `${point.topic * 40 + 20}px`,
                    left: `${(point.institution + 0.5) * 55}px`, // Center dots
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>

            {/* X-axis labels (Institutions) - Rotated 45 degrees & aligned correctly */}
            <div className="relative mt-2 flex justify-center">
              {institutions.map((institution, index) => (
                <div
                  key={institution}
                  className="absolute origin-top-left rotate-45 whitespace-nowrap text-xs font-medium"
                  style={{
                    width: "55px",
                    textAlign: "center",
                    left: `${(index + 0.5) * 55}px`, // Align with grid
                  }}
                >
                  {institution}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DotPlot;
