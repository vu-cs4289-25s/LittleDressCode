import { Buffer } from "buffer";

export const removeBackground = async (imageUrl) => {
  const apiKey = "3mBSLzshWbPMHqnqJBDGmCP2";
  const url = "https://api.remove.bg/v1.0/removebg";

  try {
    const formData = new FormData();
    formData.append("image_url", imageUrl);
    formData.append("size", "preview");

    console.log("🧪 Sending image to remove.bg with fetch:", imageUrl);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBuffer = await response.arrayBuffer();
      const errorText = new TextDecoder().decode(errorBuffer);
      console.error("❌ remove.bg fetch failed:", errorText);
      throw new Error("Remove.bg fetch failed");
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    console.log("✅ remove.bg success");
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("❌ removeBackground fetch error:", error);
    throw new Error("Background removal failed");
  }
};
