/**
 * src/components/customerPortal/ScreenshotUploader/ScreenshotUploader.jsx
 * ----------------------------------------------------------------------------
 * Optional screenshot attachment for the feedback form (README: "optional
 * screenshots securely via multipart/form-data").
 *
 * Props:
 *   - onFileSelected: (file: File | null) => void
 *
 * Implementation notes:
 *   - TODO: enforce a max file size (e.g. 5MB) and accepted types
 *     (image/png, image/jpeg) client-side before calling onFileSelected,
 *     showing a toast/error if rejected.
 *   - TODO: show a small thumbnail preview of the selected image.
 * ----------------------------------------------------------------------------
 */
import React, { useState } from "react";
import styles from "./ScreenshotUploader.module.css";

export default function ScreenshotUploader({ onFileSelected }) {
  const [fileName, setFileName] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    onFileSelected(file);
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="screenshot">
        Attach a screenshot (optional)
      </label>
      <input
        id="screenshot"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleChange}
      />
      {fileName && <span className={styles.fileName}>{fileName}</span>}
    </div>
  );
}
