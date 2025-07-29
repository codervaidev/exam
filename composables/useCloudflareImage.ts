import { useFetch } from "#app";
import axios from "axios";

const state = reactive({
  progress: 0,
  image: "",
});

export function useCloudflareImage() {
  const { progress } = toRefs(state);

  const uploadImage = async (file: File, folder: string = "") => {
    try {
      const fileName = `${folder}${file.name.split(".")[0]}_${Math.floor(Math.random() * 1000)}_${Date.now()}`;

        // @ts-ignore
      const { uploadUrl, imageUrl } = await getUploadUrl(
        fileName,
        file.type,
        file.size
      );
      await axios.put(uploadUrl, file, {
        onUploadProgress: (progressEvent) => {
          state.progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent?.total ?? 1)
          );
        },
      });
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const getUploadUrl = async (
    fileName: string,
    fileType: string,
    fileSize: number
  ) => {
    const response = await $fetch("/api/shared/signed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: { fileName, fileType, fileSize },
    });
    // @ts-ignore
    return response;
  };

  const deleteImage = async (imageUrl: string) => {
    try {
      await $fetch("/api/shared/removes3", {
        method: "DELETE",
        body: {
          url: imageUrl,
        },
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  };

  return {
    progress,
    uploadImage,
    deleteImage,
  };
}
