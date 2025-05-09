import { parrotTextDarkBlue } from "../styles/colors";

export function BlueHashtagText({ originalText }) {
  if (!originalText) {
    return null;
  }
  const words = originalText.split(" ");
  const formattedText = words
    .map((word) => {
      const isHashtag = word.startsWith("#");
      // return `<span style="color: ${isHashtag ? "blue" : "rgba(0, 119, 234,0.9)"}; font-weight: 600; font-size: ${isHashtag ? "1.2rem" : "1.1rem"};">${word}</span>`;
      return `<span style="color: ${isHashtag ? "blue" : parrotTextDarkBlue}; font-size: ${isHashtag ? "1.2rem" : "1.1rem"}; font-weight:${isHashtag ? "600" : ""} ">${word}</span>`;
    })
    .join(" ");

  return <p dangerouslySetInnerHTML={{ __html: formattedText }} />;
}