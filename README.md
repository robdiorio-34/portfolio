# Portfolio Website

Getting around to making a barebones portfolio so I can show recruiters my niche music taste, unique
hobbies (like running), and passion projects.

## 🚀 Features

### Core Pages

- **Landing Page** - Introduction and overview
- **Projects** - Showcase of technical projects and work
- **Resume** - Professional experience and skills
- **Comments** - Interactive falling comments with queue system

### Interactive Features

- **Dark/Light Mode Toggle** - Persistent theme preference with smooth transitions
- **Falling Comments System** - Interactive comment display with queue management
- **Responsive Design** - web-first approach with adaptive layouts

### Technical Highlights

- **Modular CSS Architecture** - Organized stylesheets for maintainability
- **Component-Based Structure** - Reusable navbar and footer components
- **Local Storage Integration** - Persistent user preferences
- **Asynchronous Loading** - Dynamic component loading for better performance

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Storage**: Local Storage for user preferences
- **Architecture**: Component-based with modular CSS

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── index.html              # Main landing page
│   ├── pages/                  # Sub-pages
│   │   ├── projects.html       # Projects showcase
│   │   ├── resume.html         # Professional resume
│   │   └── comments.html       # Interactive comments
│   ├── components/             # Reusable HTML components
│   │   ├── navbar.html         # Navigation bar
│   │   ├── footer.html         # Footer with controls
│   │   └── dark-toggle.html    # Theme toggle component
│   ├── scripts/                # JavaScript files
│   │   ├── main.js             # Core functionality & component loading
│   │   ├── falling-comments.js # Interactive comments system
│   │   └── dark-mode-init.js   # Theme initialization
│   ├── styles/                 # Modular CSS architecture
│   │   ├── main.css            # Main stylesheet (imports all others)
│   │   ├── base.css            # Global styles and utilities
│   │   ├── navigation.css      # Navbar and navigation styles
│   │   ├── footer.css          # Footer and control styles
│   │   ├── landing.css         # Home page specific styles
│   │   ├── projects.css        # Projects page styles
│   │   ├── resume.css          # Resume page styles
│   │   ├── comments.css        # Comments and animations
│   │   ├── responsive.css      # Media queries and mobile styles
│   │   └── README.md           # CSS architecture documentation
│   └── assets/                 # Images and other static assets
└── README.md                   # This file
```

### Modifying Styles

The CSS is organized into modular files:

- `base.css` - Global styles and utilities
- `navigation.css` - Navbar and navigation
- `footer.css` - Footer and controls
- Page-specific files for individual page styles
- `responsive.css` - Mobile and responsive design

### Adding New Features

- JavaScript files go in `public/scripts/`
- Components go in `public/components/`
- Assets go in `public/assets/`

## 🔧 Key Features Explained

### Dark Mode System

- Uses CSS custom properties for theme switching
- Persistent preference storage in localStorage
- Smooth transitions between themes
- Automatic theme detection on page load

### Falling Comments

- Interactive comment display system
- Queue management with clear functionality
- Responsive positioning to prevent cutoff
- Local storage for comment persistence

### Component Loading

- Dynamic loading of navbar and footer components
- Smart path resolution for different page locations
- Fallback handling for component loading failures

## 📝 To Do

- Comments

  - light backend to aggregate all comments ever written and display most common words
  - NLP sentiment analysis to conditionally color comments
  - Secret keystroke activated feature

- Reading page

  - Connect good reads
  - Add posts with my book notes

- Certifications

  - Link AWS certs

- Projects
  - Add site links to tiles
  - Add preview pic of projects in tiles
