const MAX_SIZE = 1080;

export function resizeImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      if (width <= MAX_SIZE && height <= MAX_SIZE) {
        resolve(file);
        return;
      }
      const scale = Math.min(MAX_SIZE / width, MAX_SIZE / height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(new File([blob], file.name, { type: "image/jpeg" })),
        "image/jpeg",
        0.85
      );
    };
    img.src = url;
  });
}
