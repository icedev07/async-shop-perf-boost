// Utility intentionally unused by routes (candidate should refactor)
function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

module.exports = { mean };