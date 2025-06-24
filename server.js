const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Anthropic = require('@anthropic-ai/sdk');
const { requireAuth } = require('./middleware/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `あなたは美容比較サイト（美容サロン・クリニック・サービスの比較検討サイト）専門のカスタマーサポート返信AIです。

## 返信ルール
- 文字数：150-250文字
- 構成：感謝・受け止め → 改善策 → 品質向上への決意
- トーン：中立、公正、ユーザーファースト
- 特定サロンの擁護や批判は避ける
- 比較サイト運営者としての責任感を示す

## 出力形式
返信文のみを出力してください。余計な説明は不要です。`;

// Protected routes - require authentication
app.get('/', requireAuth, (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Public routes
app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: 'public' });
});

app.get('/landing', (req, res) => {
  res.sendFile('landing.html', { root: 'public' });
});

app.post('/api/generate-reply', requireAuth, async (req, res) => {
  try {
    const { review } = req.body;

    if (!review) {
      return res.status(400).json({ error: 'レビューが入力されていません' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `以下のネガティブレビューに対して、美容比較サイト運営者として適切な返信を生成してください。\n\nレビュー内容：\n${review}`
        }
      ]
    });

    const replyText = response.content[0].text.trim();
    const characterCount = replyText.length;

    res.json({
      reply: replyText,
      characterCount: characterCount
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: '返信の生成中にエラーが発生しました' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});