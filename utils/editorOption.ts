import ImageUploader from "quill-image-uploader";

export const editorOptions = {
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["formula", "link", "image"],
    ],
  },
  placeholder: "Insert your text here",
  theme: "snow",
};

export const modules = {
  name: "imageUploader",
  module: ImageUploader,
  options: {
    upload: async (file) => {
      try {
        const { uploadUrl, imageUrl } = await getUploadUrl(
          file.name,
          file.type,
          file.size
        );

        const response = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
        });

        if (!response.ok) {
          throw new Error("Image upload failed");
        }

        return imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error; // Ensure that the error is properly propagated
      }
    },
  },
};

const getUploadUrl = async (fileName, fileType, fileSize) => {
  const response = await $fetch("/api/upload", {
    method: "POST",
    body: { fileName, fileType, fileSize },
  });
  return response;
};
