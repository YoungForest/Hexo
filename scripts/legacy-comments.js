'use strict';

const fs = require('node:fs');
const path = require('node:path');

const archivePath = path.join(hexo.base_dir, 'source', '_data', 'legacy-comments.json');
const archive = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
const isEnglish = String(hexo.config.root || '/').startsWith('/en');

const copy = isEnglish ? {
  title: 'Archived comments',
  badge: 'Read-only',
  countLabel: 'archived comments',
  note: 'Preserved from Disqus as static history. Continue the conversation below.'
} : {
  title: '历史评论',
  badge: '只读归档',
  countLabel: '条历史评论',
  note: '由 Disqus 迁移并静态保存；新的讨论请在下方继续。'
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function commentTree(comments) {
  const roots = [];
  const stack = [];
  comments.forEach((comment, index) => {
    const requestedDepth = Math.max(0, Math.min(4, Number(comment.depth) || 0));
    const depth = Math.min(requestedDepth, stack.length);
    const node = { comment, index, replies: [] };
    if (depth === 0) roots.push(node);
    else stack[depth - 1].replies.push(node);
    stack[depth] = node;
    stack.length = depth + 1;
  });
  return roots;
}

function avatarTone(author) {
  let hash = 0;
  for (const character of String(author ?? '')) {
    hash = (hash * 31 + character.codePointAt(0)) % 6;
  }
  return hash;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat(isEnglish ? 'en' : 'zh-CN', {
    year: 'numeric',
    month: isEnglish ? 'short' : 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

function renderCommentList(nodes, replies = false) {
  const listClass = replies ? 'legacy-comment__replies' : 'legacy-comments__list';
  const items = nodes.map(({ comment, index, replies: childReplies }) => {
    const author = String(comment.author || '?').trim();
    const initial = Array.from(author)[0] || '?';
    const message = escapeHtml(comment.message).replace(/\r\n?|\n/g, '<br>');
    const authorId = `legacy-comment-${index + 1}-author`;
    const children = childReplies.length ? renderCommentList(childReplies, true) : '';
    return `<li class="legacy-comment-item">
      <article class="legacy-comment" aria-labelledby="${authorId}">
        <span class="legacy-comment__avatar legacy-comment__avatar--${avatarTone(author)}" aria-hidden="true">${escapeHtml(initial)}</span>
        <div class="legacy-comment__content">
          <header class="legacy-comment__meta">
            <div class="legacy-comment__author" id="${authorId}" role="heading" aria-level="3">${escapeHtml(author)}</div>
            <time datetime="${escapeHtml(comment.created_at)}" title="${escapeHtml(comment.created_at_label)}">${escapeHtml(formatDate(comment.created_at))}</time>
          </header>
          <div class="legacy-comment__body">${message}</div>
        </div>
      </article>${children}
    </li>`;
  }).join('');
  return `<ol class="${listClass}">${items}</ol>`;
}

function renderComments(comments) {
  const countLabel = `${comments.length} ${copy.countLabel}`;

  return `<section class="legacy-comments" aria-labelledby="legacy-comments-title" aria-describedby="legacy-comments-note">
    <header class="legacy-comments__header">
      <div class="legacy-comments__title" id="legacy-comments-title" role="heading" aria-level="2">${copy.title}<span class="legacy-comments__count" aria-label="${countLabel}">${comments.length}</span></div>
      <span class="legacy-comments__badge">${copy.badge}</span>
    </header>
    <p class="legacy-comments__note" id="legacy-comments-note">${copy.note}</p>
    ${renderCommentList(commentTree(comments))}
  </section>`;
}

hexo.extend.filter.register('after_post_render', data => {
  if (String(data.content || '').includes('class="legacy-comments"')) return data;
  const pagePath = String(data.path || '').replace(/index\.html$/, '');
  const comments = archive.posts?.[pagePath]?.comments;
  if (!Array.isArray(comments) || comments.length === 0) return data;
  data.content += renderComments(comments);
  return data;
}, 99);
