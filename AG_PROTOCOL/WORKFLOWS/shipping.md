# AG WORKFLOW: DEPLOY & SHIP

## PRE-FLIGHT CHECKLIST
Before pushing to production (`main` branch), AG must verify:

1.  **Lighthouse Audit:**
    - Performance > 90? (If not, optimize images/scripts).
    - SEO > 90? (Meta tags present?).
    - Best Practices > 90?

2.  **Responsiveness:**
    - Does it break on 320px (iPhone SE)?
    - Does it break on 4K monitors?

3.  **Console Zero:**
    - No red errors in the browser console.
    - No "key prop missing" warnings.

## DEPLOYMENT PIPELINE
1.  Commit changes to `dev` or feature branch.
2.  Push to GitHub.
3.  Vercel/Netlify automatically builds.
4.  **VERIFY THE PREVIEW URL.** Do not merge until you click the preview.
5.  Merge to `main`.

## EMERGENCY ROLLBACK
If production breaks:
1.  Revert the merge commit: `git revert -m 1 <commit-hash>`
2.  Push immediately.
3.  Fix locally, then try again.
