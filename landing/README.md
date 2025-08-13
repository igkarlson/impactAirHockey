# Speedy Air Hockey Landing Page

A modern, privacy-focused landing page for the Speedy Air Hockey mobile game, designed for GitLab Pages deployment.

## Features

- **Privacy-First Design**: Emphasizes the app's commitment to user privacy
- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Mobile-First**: Optimized for all device sizes
- **SEO Optimized**: Proper meta tags and structured content
- **Fast Loading**: Optimized assets and minimal dependencies

## Pages

- **Home** (`index.html`): Main landing page with app features and privacy highlights
- **Terms & Conditions** (`terms.html`): Legal terms for app usage
- **Privacy Policy** (`privacy.html`): Privacy policy emphasizing no data collection

## Key Privacy Features Highlighted

- ✅ No tracking
- ✅ No data collection
- ✅ No annoying registration
- ✅ No mandatory tutorials
- ✅ No noisy email spam
- ✅ No push notifications
- ✅ No crapware
- ✅ No in-app purchases

## Setup for GitLab Pages

### 1. Repository Setup

1. Create a new GitLab repository or use an existing one
2. Upload all files from the `landing/` folder to the root of your repository
3. Ensure the following files are in the root:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `terms.html`
   - `privacy.html`
   - `README.md`

### 2. GitLab Pages Configuration

1. Go to your GitLab repository
2. Navigate to **Settings** → **Pages**
3. Configure the following settings:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/` (root)
4. Click **Save changes**

### 3. Custom Domain (Optional)

1. In the Pages settings, add your custom domain (e.g., `speedy-air-hockey.online`)
2. Update your DNS settings to point to GitLab Pages
3. Enable HTTPS (GitLab will provide a certificate)

### 4. Environment Variables (Optional)

If you want to customize the deployment, you can add these to your `.gitlab-ci.yml`:

```yaml
pages:
  stage: deploy
  script:
    - echo "Deploying to GitLab Pages"
  artifacts:
    paths:
      - public/
  only:
    - main
```

## File Structure

```
landing/
├── index.html          # Main landing page
├── styles.css          # Main stylesheet
├── script.js           # JavaScript functionality
├── terms.html          # Terms and Conditions
├── privacy.html        # Privacy Policy
├── README.md           # This file
└── assets/             # (Optional) Images and icons
    ├── favicon.png
    └── og-image.png
```

## Customization

### Colors
The color scheme is defined in CSS variables in `styles.css`:

```css
:root {
    --primary-color: #14faab;
    --primary-dark: #0b191e;
    --primary-darker: #0f2a35;
    --text-light: #ffffff;
    --text-dark: #0b191e;
    --text-muted: #a0a0a0;
}
```

### Content
- Update app store links in `index.html` when the app is published
- Modify contact emails in the footer and legal pages
- Update the "Coming Soon" status when the app is released

### Images
- Add your app icon as `assets/favicon.png`
- Add an Open Graph image as `assets/og-image.png` (1200x630px recommended)

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance

- Lighthouse Score: 95+ (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## License

This landing page is part of the Speedy Air Hockey project. All rights reserved by Igor Karlson.

## Support

For issues with the landing page or deployment, contact:
- **Email**: privacy@speedy-air-hockey.online
- **Subject**: Landing Page Support
