import { useState, useCallback } from "react";
import { storage } from "@/services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import logger from "@/utils/logger";

export function useImageUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);

  const uploadImage = useCallback(async (file, folder = "oficina_images") => {
    if (!file) {
      setUploadError("Nenhum arquivo selecionado para upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setDownloadURL(null);

    const storageRef = ref(storage, `${folder}/${file.name}-${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        logger.debug(`Upload está ${progress.toFixed(2)}% concluído`);
      },
      (error) => {
        logger.error("Erro no upload:", error);
        setUploadError(`Falha no upload da imagem: ${error.message}`);
        setIsUploading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setDownloadURL(url);
          setIsUploading(false);
          logger.info("Upload de imagem concluído. URL:", url);
        } catch (error) {
          logger.error("Erro ao obter URL de download:", error);
          setUploadError(`Falha ao obter URL da imagem: ${error.message}`);
          setIsUploading(false);
        }
      }
    );
  }, []);

  return { uploadImage, uploadProgress, isUploading, uploadError, downloadURL, setDownloadURL, setUploadError, setUploadProgress };
}