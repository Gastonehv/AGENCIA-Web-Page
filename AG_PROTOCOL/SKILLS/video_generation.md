# AG SKILL: REMOTION (PROGRAMMATIC VIDEO)

## PHILOSOPHY
Video is not just media; it is data visualization over time.
We use code to generate video because it scales. One template = 1,000 personalized videos.
**CAPITALIZATION ANGLE:** Automated content creation for ads, social media, and client deliverables.

## MANDATORY TECH STACK
- **Library:** `remotion`
- **Renderer:** `@remotion/renderer` (Server-side rendering)
- **Component Model:** Functional React Components.

## RULES OF ENGAGEMENT

### 1. Composition
- Always define `width`, `height`, `fps`, and `durationInFrames` explicitly.
- Use `useCurrentFrame()` to drive animations based on time.
- Use `interpolate()` to map frame numbers to animation values (opacity, scale, x/y).

### 2. Performance in Video
- Remotion renders frame by frame. Logic can be heavy, but it must be deterministic.
- **Randomness:** NEVER use `Math.random()` directly. Use `random()` from `remotion` with a seed, so the video renders identically every time.

### 3. Dynamic Data
- All variable content (text, images, colors) must be passed as `props` (inputProps).
- Create a `schema` (zod) for the input props to ensure data integrity before rendering.

### 4. Integration with Web
- Do not bloat the main website bundle with the video renderer.
- Run Remotion in a separate root or a dedicated route (`/video-studio`) or a serverless function.

## SNIPPET: BASIC VIDEO COMPONENT
```tsx
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

export const WelcomeAd = ({ title }: { title: string }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = interpolate(frame, [0, 30], [0.8, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
      <h1 style={{ opacity, transform: `scale(${scale})`, color: 'white' }}>
        {title}
      </h1>
    </AbsoluteFill>
  );
};
```
