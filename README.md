# AI Chat Assistant

A beautiful, modern AI chat application built with Next.js, TypeScript, and Tailwind CSS. Chat with various AI language models using free Hugging Face APIs.

## ✨ Features

- 🤖 **Multiple AI Models**: DialoGPT, BlenderBot, and more
- 💬 **Real-time Chat**: Instant responses with typing indicators
- 🎨 **Beautiful UI**: Modern design with Tailwind CSS
- 🔒 **Privacy First**: API tokens stored locally in your browser
- 📱 **Responsive**: Works perfectly on all devices
- 🆓 **Free to Use**: Uses free Hugging Face Inference API
- ⚡ **Fast**: Built with Next.js 14 and optimized for performance

## 🚀 Quick Start

### 1. Get Your Free API Token

1. Create a free account at [Hugging Face](https://huggingface.co/join)
2. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Create a new token with "Read" permissions
4. Copy the token for use in the app

### 2. Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-chat)

1. Click the "Deploy with Vercel" button
2. Connect your GitHub account
3. Deploy the project
4. Open your deployed app and enter your API token

### 3. Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-chat

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel
- **AI API**: Hugging Face Inference API

## 🎯 Available Models

- **DialoGPT Medium**: Microsoft's conversational AI
- **DialoGPT Large**: Larger version with better responses
- **BlenderBot 400M**: Facebook's conversational AI

## 📁 Project Structure

```
ai-chat/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Main page
│   ├── components/
│   │   ├── ApiSetup.tsx         # Token setup
│   │   └── ChatInterface.tsx    # Chat interface
│   ├── lib/
│   │   ├── api.ts               # API utilities
│   │   └── utils.ts             # Helper functions
│   └── types/
│       └── index.ts             # TypeScript types
├── next.config.js               # Next.js config
├── tailwind.config.js           # Tailwind config
├── package.json                 # Dependencies
└── README.md                    # Documentation
```

## 🔧 Configuration

### Customization

- **Add Models**: Edit `src/lib/api.ts`
- **Styling**: Modify Tailwind classes or `src/app/globals.css`
- **Components**: Customize in `src/components/`

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Other Platforms

- **Netlify**: Works with default settings
- **Railway**: Deploy with one click
- **Render**: Static site deployment

## 🛠️ Development

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid API token"**

   - Verify your Hugging Face token
   - Ensure it has "Read" permissions

2. **Rate limits**

   - Wait between requests
   - Try different models

3. **Build errors**
   - Run `npm run lint`
   - Check TypeScript errors

## 🔒 Privacy & Security

- ✅ API tokens stored locally in browser
- ✅ No data collection or tracking
- ✅ Direct API calls to Hugging Face
- ✅ Open source code

## 📜 License

MIT License - feel free to use this project for any purpose.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Ready to chat with AI? Deploy now! 🚀**
