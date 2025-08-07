# CSS Organization

This folder contains the organized CSS files for the portfolio website. The styles have been broken down into logical components for better maintainability and organization.

## File Structure

### CSS Main Entry Point

- **`main.css`** - Main stylesheet that imports all component stylesheets in the correct order

### Component Stylesheets

- **`base.css`** - Global styles, body styles, and transition utilities
- **`navigation.css`** - Navbar, nav controls, and navigation link styles
- **`footer.css`** - Footer bar, controls, clear queue button, and footer icons
- **`landing.css`** - Landing page layout, profile image, and description
- **`projects.css`** - Project cards, grid layout, and project-specific styles
- **`resume.css`** - Resume container, header, sections, and content styles
- **`comments.css`** - Falling comments, animations, and comments page styles
- **`responsive.css`** - Media queries for mobile and tablet responsive design

## Import Order

The import order in `main.css` is important for CSS specificity and dependencies:

1. **base.css** - Global styles and utilities (load first)
2. **navigation.css** - Navigation components
3. **footer.css** - Footer components
4. **landing.css** - Landing page styles
5. **projects.css** - Project page styles
6. **resume.css** - Resume page styles
7. **comments.css** - Comments page styles
8. **responsive.css** - Media queries (load last for proper override)

## Maintenance Guidelines

### Adding New Styles

1. **Component-specific styles** should go in the appropriate component file
2. **Global styles** should go in `base.css`
3. **Responsive styles** should go in `responsive.css`
4. **New components** should get their own file if they're substantial

To do

- blog
  - notes, things ive learned, trips
- photos
  - albums, highlights, etc
- optimize mobile
  - scrolling nav bar
  - dynamically sized components
- setup backend
  - reading tables
  - comments
- Admin tools for reading
  - add books and reviews in browser -> CRUD
  - edit book tile info
- reading page
  - ranking/sorting
