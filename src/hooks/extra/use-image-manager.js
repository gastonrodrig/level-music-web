import { useState, useEffect, useCallback } from "react";

export const useImageManager = (watch, setValue) => {
  const [previews, setPreviews] = useState([]);

  const urlsToFiles = useCallback(async (urls) => {
    const files = await Promise.all(
      (urls ?? []).map(async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();
        const filename = (url.split("/").pop() || "image").trim();
        return new File([blob], filename, { type: blob.type });
      })
    );
    return files;
  }, []);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const localUrls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...localUrls]);
    const current = watch("images") || [];
    const currentArr = Array.isArray(current) ? current : Array.from(current);
    const updated = [...currentArr, ...files];
    setValue("images", updated, { shouldValidate: true, shouldDirty: true });
  };

  const handleRemoveImage = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    const current = watch("images") || [];
    const currentArr = Array.isArray(current) ? current : Array.from(current);
    const filtered = currentArr.filter((_, i) => i !== index);
    setValue("images", filtered, { shouldValidate: true, shouldDirty: true });
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (typeof url === "string" && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  return {
    previews,
    setPreviews,
    urlsToFiles,
    handleImagesChange,
    handleRemoveImage,
  };
};