module.exports = (string) => {
  const exp = /^[a-z0-9_-]+$/i;
  return string.match(exp);
}