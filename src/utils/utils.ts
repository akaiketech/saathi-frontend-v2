export const generateSessionId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
export const generateUUID = (text:string, length = 10) => {
  // Remove punctuation and lowercase the text
  text = text.replace(/[^a-zA-Z\s]/g, '').toLowerCase();

  // Create a random string with the same length as the original text
  let randomText = '';
  for (let i = 0; i < length; i++) {
    randomText += String.fromCharCode(Math.floor(Math.random() * 26) + 97); // Generate lowercase letters (a-z)
  }

  // Combine the random string with the original text characters at random positions
  let uniqueText = '';
  for (let i = 0; i < length; i++) {
    if (Math.random() < 0.5) {
      uniqueText += randomText[i];
    } else {
      uniqueText += text[i] || randomText[i]; // Use a random character if the original text is shorter
    }
  }

  return uniqueText;
}

export const uint8ArrayToBase64 = (bytes: Uint8Array) => {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};
