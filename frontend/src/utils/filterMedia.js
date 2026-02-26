/**
 * Filters media items by tag, type, and search query
 * @param {Array} items - media items array (from API)
 * @param {string} selectedTag
 * @param {string} searchQuery
 */
export function filterMedia(items = [], selectedTag = "All", searchQuery = "") {
  const normalizedTag = selectedTag.trim().toLowerCase();
  const normalizedSearch = searchQuery.trim().toLowerCase();

  const TYPES = ["graphic", "video", "uidesign", "logos"];

  return items.filter((item) => {
    const itemType = item.type?.toLowerCase() || "";
    const itemTags = item.tags || [];

    // 1️⃣ Type filter
    const typeMatch =
      normalizedTag === "all" ||
      (TYPES.includes(normalizedTag)
        ? itemType === normalizedTag
        : true);

    // 2️⃣ Tag filter
    const tagMatch =
      normalizedTag === "all" ||
      (!TYPES.includes(normalizedTag)
        ? itemTags.some(
            (tag) => tag.toLowerCase() === normalizedTag
          )
        : true);

    // 3️⃣ Search filter
    const searchMatch =
      !normalizedSearch ||
      itemType.includes(normalizedSearch) ||
      itemTags.some((tag) =>
        tag.toLowerCase().includes(normalizedSearch)
      );

    return typeMatch && tagMatch && searchMatch;
  });
}
