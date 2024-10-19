import React from "react";

const Skeleton = ({ height = "20px", width = "100%", borderRadius = "4px" }) => {
  return (
    <div
      style={{
        height,
        width,
        borderRadius,
        backgroundColor: "#444444", // You can adjust this color for the skeleton effect
        animation: "pulse 1.5s infinite",
      }}
    />
  );
};

export default Skeleton;
