import React from "react";
import styles from "./Text.css";

export function Truncate({ children }) {
  return (
    <div className="truncate-ellipsis">
      <span>{children}</span>
    </div>
  );
}
