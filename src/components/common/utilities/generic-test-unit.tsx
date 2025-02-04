import { useEffect, useState } from "react";

export const GenericTestUnit = () => {
  const [loaded, setLoaded] = useState(false); // Tracks loading state
  const [editableContent, setEditableContent] = useState("LOADED AFTER INTERVAL"); // Editable content

  // Simulates loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true); // After 2.5 seconds, mark as loaded
    }, 2500);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  // Handle content changes
  const handleChange = (event) => {
    setEditableContent(event.target.value); // Update state with user input
  };

  return (
    <div>
      {loaded ? (
        <input
          type="text"
          value={editableContent}
          onChange={handleChange} // Update content on change
          className="editable-input"
        />
      ) : (
        <div>Loading...</div> // Show loading state
      )}
    </div>
  );
};

export default GenericTestUnit;
