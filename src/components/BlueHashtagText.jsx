
export function BlueHashtagText({ originalText }) {
  if (!originalText) {
    return null;
  }
  const words = originalText.split(" ");
  return (
    <p>
      {words.map((word, index) => {
        if (word.startsWith("#")) {
          return (
            <span key={index} style={{
              color: "blue",
              fontWeight: "600",
              fontSize: "1.2rem",
            }}  >
              {word + " "}
            </span>
          );
        } else {
          return (
            <span key={index} style={{
              color: "rgba(0, 119, 234,0.9)",
              fontWeight: "600",
              fontSize: "1.1rem",
            }}  >
              {word + " "}
            </span>
          );
        }
      })}
    </p>
  );
};