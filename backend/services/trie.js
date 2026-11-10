class CropTrie {
  constructor() {
    this.root = { children: new Map(), end: false, aliases: [] };
  }
  normalize(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }
  insert(word, aliasId) {
    const key = this.normalize(word);
    if (!key) return;
    let node = this.root;
    for (const ch of key) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), end: false, aliases: [] });
      node = node.children.get(ch);
    }
    node.end = true;
    if (aliasId !== undefined) node.aliases.push(String(aliasId));
  }
  search(prefix) {
    const term = this.normalize(prefix);
    if (!term) return [];
    let node = this.root;
    for (const ch of term) {
      node = node.children.get(ch);
      if (!node) return [];
    }
    const res = [];
    this.collect(node, term, res, 10);
    return res;
  }
  collect(node, text, result, limit) {
    if (result.length >= limit) return;
    if (node.end) result.push({ label: text, aliases: node.aliases });
    for (const [ch, child] of Array.from(node.children.entries()).sort(([a], [b]) => a.localeCompare(b))) {
      this.collect(child, text + ch, result, limit);
      if (result.length >= limit) break;
    }
  }
}
module.exports = { CropTrie };
