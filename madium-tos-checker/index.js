const findByProps = vendetta.metro.findByProps;
const after = vendetta.patcher.after;
const React = vendetta.metro.common.React;

let unpatch;

export default {
  onLoad() {
    const Messages = findByProps("sendMessage", "editMessage");
    if (!Messages) return;

    unpatch = after("sendMessage", Messages, (args) => {
      const content = args[1]?.content;
      if (!content) return;
      
      const lower = content.toLowerCase();
      const violations = [];

      if (/\b(krnl|synapse|fluxus|arceus|scriptware|xeno|evon)\b/.test(lower))
        violations.push("Competitor tool");
      if (/\b(kys|kill your?self)\b/.test(lower))
        violations.push("Harassment");
      if (/\b(trump|biden|maga)\b/.test(lower))
        violations.push("Political topic");
      if (/\b(key system|work\.ink)\b/.test(lower))
        violations.push("Key system");
      if (/\b(ban evad|mute evad)\b/.test(lower))
        violations.push("Ban evasion");

      if (violations.length) {
        vendetta.ui.toasts.showToast(
          `⚠️ Rule violation: ${violations.join(", ")}`,
          vendetta.ui.toasts.ToastPosition.TOP
        );
      }
    });
  },

  onUnload() {
    unpatch?.();
  }
};
