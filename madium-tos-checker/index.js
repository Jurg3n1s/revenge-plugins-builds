(function() {
  const patcher = typeof vendetta !== 'undefined' ? vendetta.patcher : 
                  typeof revenge !== 'undefined' ? revenge.patcher : null;
  const metro = typeof vendetta !== 'undefined' ? vendetta.metro : 
                typeof revenge !== 'undefined' ? revenge.metro : null;

  if (!patcher || !metro) return;

  const React = metro.common?.React || metro.findByProps?.('createElement');
  const messageComponents = metro.findByProps?.('ChannelMessage');

  if (!messageComponents?.ChannelMessage) return;

  patcher.after('ChannelMessage', messageComponents, (args, res) => {
    const message = args?.[0]?.message;
    if (!message?.content) return res;

    const lower = message.content.toLowerCase();
    const violations = [];

    if (/\b(krnl|synapse|fluxus|arceus|scriptware|xeno|evon)\b/.test(lower))
      violations.push('Competitor tool mentioned');
    if (/\b(kys|kill your?self)\b/.test(lower))
      violations.push('Harassment');
    if (/\b(trump|biden|maga)\b/.test(lower))
      violations.push('Political topic');
    if (/\b(key system|work\.ink|linkvertise)\b/.test(lower))
      violations.push('Key system script');
    if (/\b(ban evad|mute evad)\b/.test(lower))
      violations.push('Ban evasion');
    if (/\b(check out my (tool|executor|hub))\b/.test(lower))
      violations.push('Self promotion');

    if (!violations.length) return res;

    if (res?.props?.children) {
      const warning = React.createElement('div', {
        style: { background: 'rgba(255,165,0,0.15)', borderLeft: '3px solid #FFA500', borderRadius: 4, padding: '3px 8px', marginBottom: 4, fontSize: 12, color: '#FFA500', fontWeight: 600 }
      }, `⚠️ ${violations.join(', ')}`);
      res.props.children = React.createElement(React.Fragment, null, warning, res.props.children);
    }
    return res;
  });
})();
