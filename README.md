# PromptsReader Chrome Extension

A modern Chrome extension that provides quick access to your personal prompt library stored in a public GitHub repository. Built with React, TypeScript, and the Plasmo framework.

![PromptsReader Demo](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Features

- **📁 GitHub Integration**: Connects to your public GitHub repository to fetch prompt files
- **🔍 Smart Search**: Filter prompts by filename with real-time search
- **📋 One-Click Copy**: Copy prompts to clipboard with a single click
- **🏷️ Auto-Tagging**: Folder names automatically become tags for better organization
- **💾 Smart Caching**: 24-hour local cache for improved performance
- **🌙 Modern UI**: Clean, responsive design with dark/light mode support
- **⚡ Fast Access**: Quick popup interface for instant prompt access
- **🔄 Auto-Refresh**: Manual refresh capability to get latest prompts

## 🚀 Supported File Types

- `.md` - Markdown files
- `.txt` - Plain text files  
- `.xml` - XML files

## 📦 Installation

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/PromptsReader.git
   cd PromptsReader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Load extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `build/chrome-mv3-dev` folder

### Production Build

1. **Build the extension**
   ```bash
   npm run build
   ```

2. **Package for distribution**
   ```bash
   npm run build:zip
   ```

## ⚙️ Configuration

1. **Open the extension options page**
   - Right-click the extension icon → "Options"
   - Or click the settings icon in the popup

2. **Configure your GitHub repository**
   - Enter your public GitHub repository URL (e.g., `https://github.com/username/my-prompts`)
   - Click "Test Connection" to verify the repository is accessible
   - Save your settings

3. **Start using your prompts**
   - Click the extension icon to open the popup
   - Search and copy prompts as needed
   - Use the refresh button to get latest updates

## 🏗️ Architecture

### Core Technologies

- **Framework**: [Plasmo](https://docs.plasmo.com/) for Chrome extension development
- **UI**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Custom React hooks with Chrome storage
- **API**: GitHub REST API (unauthenticated)

### Project Structure

```
PromptsReader/
├── components/ui/          # shadcn/ui components
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── docs/                   # Project documentation
├── .github/workflows/      # CI/CD automation
├── popup.tsx              # Main extension popup
├── options.tsx            # Settings/options page
├── background.ts          # Service worker background script
└── style.css             # Global styles
```

### Data Flow

1. **Background Script**: Handles GitHub API calls, caching, and message passing
2. **usePrompts Hook**: Manages prompt data state and cache interaction
3. **UI Components**: Display prompts with search, copy, and navigation features
4. **Chrome Storage**: Local caching with 24-hour expiration

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production version
- `npm run build:zip` - Build and package as ZIP
- `npm run clean` - Clear Plasmo cache

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (if configured)
- **CI/CD**: Automated testing and building via GitHub Actions

### Adding Features

1. **UI Components**: Add new components in `components/ui/`
2. **API Integration**: Extend `background.ts` for new data sources
3. **Hooks**: Create custom hooks in `hooks/` directory
4. **Styling**: Use Tailwind CSS classes and shadcn/ui components

## 🛡️ Security & Privacy

- **No Authentication Required**: Uses GitHub's public API only
- **Local Storage**: All data cached locally in Chrome storage
- **No External Services**: Direct GitHub API communication only
- **Minimal Permissions**: Only requests necessary Chrome permissions
- **Open Source**: Full source code available for audit

## 📊 Performance

- **Smart Caching**: 24-hour cache reduces API calls
- **Lazy Loading**: Prompts loaded on-demand
- **Optimized Bundle**: Minimal extension size
- **Fast Search**: Client-side filtering for instant results

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and build**
   ```bash
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## 📋 Requirements

- **Chrome Browser**: Version 88+ (Manifest V3 support)
- **Node.js**: Version 16+ for development
- **GitHub Repository**: Public repository with prompt files
- **Internet Connection**: Required for initial setup and refresh

## 🐛 Troubleshooting

### Common Issues

1. **Extension won't load**
   - Ensure all dependencies are installed: `npm install`
   - Try clearing the cache: `npm run clean`
   - Rebuild the extension: `npm run build`

2. **Can't connect to repository**
   - Verify the repository URL is correct
   - Ensure the repository is public
   - Check your internet connection

3. **Prompts not showing**
   - Check if your repository contains supported file types (`.md`, `.txt`, `.xml`)
   - Try refreshing the prompts using the refresh button
   - Check the browser console for error messages

### Getting Help

- **Issues**: Report bugs on [GitHub Issues](https://github.com/your-username/PromptsReader/issues)
- **Discussions**: Join conversations in [GitHub Discussions](https://github.com/your-username/PromptsReader/discussions)
- **Documentation**: Check the `docs/` directory for detailed documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Plasmo**: Amazing framework for modern Chrome extensions
- **shadcn/ui**: Beautiful and accessible UI components
- **GitHub API**: Reliable and fast content delivery
- **Tailwind CSS**: Utility-first CSS framework
- **React**: Powerful UI library

## 📈 Roadmap

- [ ] Support for private repositories (with authentication)
- [ ] Custom keyboard shortcuts
- [ ] Prompt categories and advanced filtering
- [ ] Export/import functionality
- [ ] Sync across devices
- [ ] Prompt templates and variables
- [ ] Integration with other code repositories (GitLab, Bitbucket)

---

**Made with ❤️ by [Roman Khalnepes](https://github.com/yomudogly)**

*Star ⭐ this repository if you find it useful!*
