# Prototype Design Tools Setup Guide
## Authentication UI/UX Prototyping Environment

**Component**: Authentication UI Components  
**Purpose**: Setup guide for creating HTML prototypes and mockups  
**Phase**: Dev-Step 3.2 Preparation  

---

## 🎨 Prototyping Tool Selection

### Primary Tools Comparison

| Tool | Purpose | Pros | Cons | Cost |
|------|---------|------|------|------|
| **Figma** | High-fidelity mockups | Collaborative, web-based, component library | Learning curve | Free tier available |
| **HTML/CSS/JS** | Interactive prototypes | Real code, accurate behavior | Time-intensive | Free |
| **Tailwind UI** | Rapid HTML prototyping | Production-ready components | Requires license | $149 one-time |
| **Sketch** | Mac-based design | Industry standard, plugins | Mac only | $99/year |
| **Adobe XD** | Interactive prototypes | Animation support | Subscription model | $9.99/month |

### Recommended Stack
1. **Figma** - For initial wireframes and design system
2. **HTML/Tailwind** - For interactive prototypes
3. **CodePen/CodeSandbox** - For quick iterations and sharing

---

## 🚀 Quick Start Setup

### Option 1: HTML/Tailwind Prototype Setup

#### Step 1: Initialize Project
```bash
# Create prototype directory
mkdir auth-ui-prototypes
cd auth-ui-prototypes

# Initialize npm project
npm init -y

# Install dependencies
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npm install -D @tailwindcss/forms @tailwindcss/typography
npm install -D live-server

# Initialize Tailwind
npx tailwindcss init -p
```

#### Step 2: Configure Tailwind
```javascript
// tailwind.config.js
module.exports = {
  content: ["./**/*.html"],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#0F4C81',
        'medical-green': '#00A859',
        'tcm-gold': '#D4AF37',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

#### Step 3: Create Base Template
```html
<!-- base-template.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medical Platform - Authentication Prototype</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'medical-blue': '#0F4C81',
                        'medical-green': '#00A859',
                        'tcm-gold': '#D4AF37',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50">
    <!-- Prototype content here -->
</body>
</html>
```

#### Step 4: Package.json Scripts
```json
{
  "scripts": {
    "dev": "live-server --port=3001 --host=localhost --watch=**/*.html,**/*.css",
    "build-css": "tailwindcss -i ./src/styles.css -o ./dist/styles.css --watch"
  }
}
```

---

## 🎨 Figma Setup

### Workspace Organization
```
Medical Platform Authentication
├── 📁 Components
│   ├── Buttons
│   ├── Forms
│   ├── Inputs
│   └── Alerts
├── 📁 Screens
│   ├── Login
│   ├── Register
│   ├── Password Reset
│   └── MFA
├── 📁 User Flows
│   ├── TCM Practitioner Flow
│   ├── Pharmacy Flow
│   └── Admin Flow
└── 📁 Design System
    ├── Colors
    ├── Typography
    └── Spacing
```

### Figma Plugins for Medical UI
- **Stark** - Accessibility checking
- **Able** - Color contrast checker  
- **Autoflow** - User flow arrows
- **Content Reel** - Realistic medical data
- **Figma to HTML** - Code export

---

## 📐 Component Library Structure

### Authentication Components Needed

#### 1. Input Components
```
/components/inputs/
├── text-input.html
├── password-input.html
├── email-input.html
├── select-role.html
├── checkbox.html
└── radio-group.html
```

#### 2. Button Components
```
/components/buttons/
├── primary-button.html
├── secondary-button.html
├── link-button.html
├── icon-button.html
└── loading-button.html
```

#### 3. Form Components
```
/components/forms/
├── login-form.html
├── register-form.html
├── password-reset-form.html
├── mfa-form.html
└── role-select-form.html
```

#### 4. Feedback Components
```
/components/feedback/
├── error-message.html
├── success-message.html
├── loading-spinner.html
├── progress-indicator.html
└── tooltip.html
```

---

## 🏥 Medical Platform Design System

### Color Palette
```css
/* Primary Colors */
--medical-blue: #0F4C81;    /* Trust, Professional */
--medical-green: #00A859;   /* Health, Success */
--tcm-gold: #D4AF37;       /* TCM Traditional */

/* Neutral Colors */
--gray-900: #111827;       /* Text primary */
--gray-600: #4B5563;       /* Text secondary */
--gray-400: #9CA3AF;       /* Borders */
--gray-100: #F3F4F6;       /* Backgrounds */

/* Semantic Colors */
--error: #DC2626;          /* Error states */
--warning: #F59E0B;        /* Warnings */
--success: #10B981;        /* Success states */
--info: #3B82F6;          /* Information */
```

### Typography Scale
```css
/* Font Family */
--font-primary: 'Inter', system-ui, sans-serif;
--font-medical: 'Source Sans Pro', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px - minimum for medical */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
```

### Spacing System
```css
/* Consistent 8px grid */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
```

---

## 🔨 HTML Prototype Templates

### Login Form Prototype
```html
<!-- prototypes/login-basic.html -->
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <!-- Logo/Header -->
        <div>
            <h1 class="text-center text-3xl font-bold text-medical-blue">
                Medical Prescription Platform
            </h1>
            <p class="mt-2 text-center text-sm text-gray-600">
                Secure login for healthcare professionals
            </p>
        </div>
        
        <!-- Form -->
        <form class="mt-8 space-y-6" action="#" method="POST">
            <!-- Role Selection -->
            <div>
                <label class="block text-sm font-medium text-gray-700">
                    I am a...
                </label>
                <div class="mt-2 space-y-2">
                    <label class="flex items-center">
                        <input type="radio" name="role" value="tcm" class="mr-2">
                        <span>TCM Practitioner</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="role" value="pharmacy" class="mr-2">
                        <span>Pharmacy Staff</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="role" value="admin" class="mr-2">
                        <span>Administrator</span>
                    </label>
                </div>
            </div>
            
            <!-- Email Input -->
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <input type="email" id="email" name="email" required
                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
            </div>
            
            <!-- Password Input -->
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input type="password" id="password" name="password" required
                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
            </div>
            
            <!-- Remember Me & Forgot -->
            <div class="flex items-center justify-between">
                <label class="flex items-center">
                    <input type="checkbox" class="mr-2">
                    <span class="text-sm">Remember me</span>
                </label>
                <a href="#" class="text-sm text-medical-blue hover:underline">
                    Forgot password?
                </a>
            </div>
            
            <!-- Submit Button -->
            <button type="submit" 
                    class="w-full py-2 px-4 bg-medical-blue text-white rounded-md hover:bg-blue-700">
                Sign in securely
            </button>
        </form>
        
        <!-- Security Indicators -->
        <div class="mt-4 text-center text-xs text-gray-500">
            🔒 Secured connection | HIPAA Compliant | 
            <a href="#" class="underline">Privacy Policy</a>
        </div>
    </div>
</div>
```

---

## 🧪 Prototype Testing Setup

### Local Testing Environment
```bash
# Start local server
npm run dev

# Access prototypes at:
# http://localhost:3001/prototypes/login-basic.html
# http://localhost:3001/prototypes/register-multi-step.html
# http://localhost:3001/prototypes/mfa-setup.html
```

### Remote Testing Setup
1. **GitHub Pages**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Add authentication prototypes"
   git push origin main
   
   # Enable GitHub Pages in settings
   # Access at: https://[username].github.io/auth-prototypes/
   ```

2. **Netlify Drop**
   - Drag and drop folder at https://app.netlify.com/drop
   - Get instant preview URL
   - Share with stakeholders

3. **CodeSandbox**
   - Import GitHub repo
   - Live preview with hot reload
   - Collaborative editing

---

## 📱 Responsive Testing Tools

### Browser DevTools Setup
```javascript
// Device presets for testing
const devices = [
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPad', width: 810, height: 1080 },
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Medical Tablet', width: 1024, height: 768 }
];
```

### Testing Checklist
- [ ] Mobile portrait (320px - 414px)
- [ ] Mobile landscape (568px - 896px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Touch interactions
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

---

## 🔄 Version Control for Prototypes

### Git Structure
```
auth-ui-prototypes/
├── .gitignore
├── README.md
├── package.json
├── /prototypes/
│   ├── /v1-basic/
│   ├── /v2-enhanced/
│   └── /v3-final/
├── /components/
├── /assets/
└── /docs/
```

### Branching Strategy
```bash
main
├── feature/login-form
├── feature/registration-flow
├── feature/mfa-implementation
└── feature/role-based-ui
```

### Prototype Versioning
- **v1**: Basic HTML structure
- **v2**: Styling and interactions
- **v3**: User feedback incorporated
- **v4**: Final production-ready

---

## 📚 Resources and References

### Design Resources
- [Tailwind UI Components](https://tailwindui.com/)
- [HeadlessUI](https://headlessui.dev/)
- [Medical Icons - Healthicons](https://healthicons.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Code Libraries
```html
<!-- CDN Links for Prototyping -->
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
```

### Accessibility Testing
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## ✅ Setup Checklist

### Initial Setup
- [ ] Choose primary prototyping tool
- [ ] Install required software/dependencies
- [ ] Create project structure
- [ ] Set up version control
- [ ] Configure development environment

### Design System
- [ ] Define color palette
- [ ] Set typography scale
- [ ] Create spacing system
- [ ] Build component library
- [ ] Document design decisions

### Prototype Development
- [ ] Create base templates
- [ ] Build authentication forms
- [ ] Add responsive breakpoints
- [ ] Implement interactions
- [ ] Test accessibility

### Testing Preparation
- [ ] Set up local testing
- [ ] Configure remote preview
- [ ] Prepare device testing
- [ ] Create feedback collection method
- [ ] Schedule user testing sessions

---

**Document Status**: Ready for Implementation  
**Next Steps**: Create initial prototypes for Dev-Step 3.2  
**Owner**: Frontend Lead  
**Last Updated**: 2025-08-30