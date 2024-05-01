import { type ApiUploadResponse } from "../types/Data";

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/files`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error uploading file");
    }

    const data = await response.json();

    return data as ApiUploadResponse;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return { data: [], message: error.message };
    }

    return { data: [], message: "Error uploading file" };
  }
};

export { uploadFile };
