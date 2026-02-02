# AG PROTOCOL: 02_WORKFLOW

## DEVELOPMENT MINDSET: "CAPITALIZE"

### 1. The Conversion Filter
Before writing a feature, ask: **"Does this help sell?"**
- *Cool 3D cube?* -> Only if it highlights a service.
- *Long loading screen?* -> TRASH. It kills bounce rate.
- *Complex nav?* -> SIMPLIFY. The path to "Contact Us" must be zero-friction.

### 2. "A Como De Lugar" (Whatever It Takes)
- If a library is broken, patch it.
- If a feature is too heavy, fake it with a video or sprite sheet.
- Results matter more than "pure" code.

### 3. Error Handling
- Never show a raw error stack to a user.
- Fail gracefully. If WebGL crashes, fallback to a killer CSS layout immediately.

### 4. Git Hygiene
- Commits must be descriptive.
- Feature branches for risky experiments.
- **NEVER** push broken builds to main.
