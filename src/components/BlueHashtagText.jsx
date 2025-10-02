import { parrotTextDarkBlue } from "../styles/colors";
import DOMPurify from "dompurify";

export function BlueHashtagText({ originalText }) {
  if (!originalText) return null;

  const words = originalText.split(" ");
  const formattedText = words
    .map((word) => {
      const isHashtag = word.startsWith("#");
      return `<span style="color: ${isHashtag ? "blue" : parrotTextDarkBlue}; font-size: ${isHashtag ? "1.2rem" : "1.1rem"}; font-weight:${isHashtag ? "600" : ""} ">${word}</span>`;
    })
    .join(" ");

  return <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formattedText) }} />;
}
