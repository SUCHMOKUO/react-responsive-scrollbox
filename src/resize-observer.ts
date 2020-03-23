export default new ResizeObserver((entries) => {
  for (const entry of entries) {
    entry.target.dispatchEvent(
      new CustomEvent("resize", {
        bubbles: false,
      })
    );
  }
});
