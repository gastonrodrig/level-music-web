import { useState, useEffect, useCallback } from "react";

export const useImageManager = (watch, setValue, options = {}) => {
  const { onDeleteExistingPhoto } = options;

  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]); 
  const [files, setFiles] = useState([]); 

  // Convertir URLs en Files (modo edición)
  const urlsToFiles = useCallback(async (urls) => {
    const files = await Promise.all(
      (urls ?? []).map(async (url) => {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          const filename = (url.split("/").pop() || "image").trim();
          return new File([blob], filename, { type: blob.type });
        } catch {
          return null;
        }
      })
    );
    return files.filter(Boolean);
  }, []);

  // Inicializar imágenes existentes
  const initExisting = useCallback((images) => {
    if (Array.isArray(images)) {
      setExistingImages(images);
    }
  }, []);

  // Manejar nuevas imágenes
  const handleImagesChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const localUrls = newFiles.map((f) => URL.createObjectURL(f));

    setPreviews((prev) => [...prev, ...localUrls]);
    setFiles((prev) => [...prev, ...newFiles]);

    const current = watch("images") || [];
    const currentArr = Array.isArray(current) ? current : Array.from(current);
    const updated = [...currentArr, ...newFiles];
    setValue("images", updated, { shouldValidate: true, shouldDirty: true });

    if (options.fieldPath) {
      setValue(options.fieldPath, updated, { shouldValidate: true, shouldDirty: true });
    }
  };

  // Eliminar imagen nueva
  const handleRemoveImage = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));

    const current = watch("images") || [];
    const currentArr = Array.isArray(current) ? current : Array.from(current);
    const filtered = currentArr.filter((_, i) => i !== index);
    setValue("images", filtered, { shouldValidate: true, shouldDirty: true });

    if (options.fieldPath) {
      setValue(options.fieldPath, filtered, { shouldValidate: true, shouldDirty: true });
    }
  };

  // Eliminar imagen existente (de BD)
  const handleRemoveExisting = (imageId) => {
    const updated = existingImages.filter((img) => img._id !== imageId);
    setExistingImages(updated);
    if (onDeleteExistingPhoto) onDeleteExistingPhoto(imageId);
    if (options.fieldPath) {
      setValue(options.fieldPath, updated, { shouldValidate: true, shouldDirty: true });
    }
  };

  // Limpieza de blobs
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
    files,
    existingImages,
    initExisting,
    urlsToFiles,
    handleImagesChange,
    handleRemoveImage,
    handleRemoveExisting,
  };
};
