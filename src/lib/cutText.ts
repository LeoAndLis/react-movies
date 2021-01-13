function cutText(text: string): string {
  if (text.length <= 150) {
    return text;
  }

  const result = text.slice(0, 150);
  const spaceIndex = result.lastIndexOf(' ');
  return `${result.slice(0, spaceIndex)}...`;
}

export default cutText;
