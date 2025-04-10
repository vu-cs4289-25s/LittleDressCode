import { Share } from "react-native";

export const useShare = () => {
  const shareItem = async ({ type, id }) => {
    try {
      const deepLink = `closetapp://${type}/${id}`;
      await Share.share({
        message: `Check out this ${
          type === "closet" ? "clothing item" : type
        }!\n${deepLink}`,
      });
    } catch (error) {
      console.error("Error sharing deep link:", error);
    }
  };

  return { shareItem };
};
