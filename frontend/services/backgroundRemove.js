import axios from "axios";

export const removeBackground = async (imageUrl) => {
  const apiKey = "3mBSLzshWbPMHqnqJBDGmCP2";
  const url = "https://api.remove.bg/v1.0/removebg";

  try {
    const formData = new FormData();
    formData.append("image_url", imageUrl);

    const response = await axios.post(url, formData, {
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "multipart/form-data",
      },
      responseType: "arraybuffer",
    });

    const base64 = Buffer.from(response.data, "binary").toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("❌ Remove.bg error response:", error.response?.data);
    console.error("❌ Remove.bg status code:", error.response?.status);
    console.error("❌ Remove.bg headers:", error.response?.headers);
    throw new Error("Background removal failed");
  }
};
