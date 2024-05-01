import { type ApiSearchResponse } from "../types/Data";

const searchData = async (search: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_HOST}/api/users?query=${search}`
    );

    if (!response.ok) {
      throw new Error("Error searching user");
    }

    const data = await response.json();

    return data as ApiSearchResponse;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return { data: [], message: error.message };
    }

    return { data: [], message: "Error uploading file" };
  }
};

export { searchData };
