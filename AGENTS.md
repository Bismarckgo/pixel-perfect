<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep Casa presentation-only until real device integrations exist; disconnected device controls remain disabled so the UI never reports simulated actions.
- Keep home-screen installation manifest-only, with metadata in the root head and icons in public; app-shell caching is excluded until offline use is explicitly requested to avoid stale previews.
- Keep Hoy's primary view limited to Donna, current focus, day agenda and weather; other sections retain their own routes so simplifying Home does not duplicate data or alter verified screens.
