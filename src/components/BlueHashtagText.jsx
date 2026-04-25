import { parrotTextDarkBlue } from "../styles/colors";
import DOMPurify from "dompurify";

export function BlueHashtagText({ originalText, isDarkMode = false }) {
  if (!originalText) return null;

  const textColor = isDarkMode ? "rgba(255,255,255,0.85)" : parrotTextDarkBlue;
  const hashtagColor = isDarkMode ? "#7ec8e3" : "blue";

  const words = originalText.split(" ");
  const formattedText = words
    .map((word) => {
      const isHashtag = word.startsWith("#");
      return `<span style="color: ${isHashtag ? hashtagColor : textColor}; font-size: ${isHashtag ? "1.2rem" : "1.1rem"}; font-weight: 600; font-family: Nunito, sans-serif; line-height: 1.65rem; letter-spacing: 0.015em;">${word}</span>`;
    })
    .join(" ");

  return <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formattedText) }} />;
}
