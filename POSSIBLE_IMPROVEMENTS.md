## Short description

At first, webpack configuration was set with all basic loaders and two different environments (prod here not doing anything specific, dev responsible for hot reloading on localhost).

Eslint, Prettier, Husky and Typescript were also set.
Git repository was initialized, Ts-loader set to analize code on every commit and not allow commiting if any typescript/eslint errors are in the code.
No need for Babel as old browsers were not supposed to be supported.

Project was build using React v.17 with functional components only.
App.jtx component serves as the main component, normally router and global state provider would be setup there.

Folder structure:

- pages - main structural components,not really reusable, render many other components in them, usually should have own route path. Here theres only one - Articles.tsx
- components - resusable structural components, can be rendered in many places across the application
- assets - icons, pictures and other media is kept in there
- utils - utility functions and hooks.

Component creating rules:

- folder name lowercase
- Component.tsx file name uppercase
- functional component uppercase, same as the filename, exported as default
- index.tsx file that exports the component as default - shorter import paths

Global CSS stylesheets (pure .css files, no preprocessors) were chosen as a way to style components (for simplicity - no additional libraries or loaders needed).
There is a reset.css file present to reset the default styles different browsers apply on elements.
More general styles as well as CSS variables are kept in index.css file in src folder - they are ment to be used across entire application.
More specific styles that only affect certain components are kept in the same folder as the component, and have the same name with .css suffix.
A loosely BEM-inspired naming convention is applied for classNames to make the styles understandable and easy to extend/modify.

No request is made by default to the API, only after user chooses one or two categories.
There is one utility function, getDateInMiliseconds, that allows converting of unusual date format provided by API to number value, making it easy to compare for sorting elements.

## Possible improvements

1. Some sort of caching of API responses to limit number of requests and prevent server overload, maybe with a timeout that will only allow new API calls 1 minut after the previous call to the same endpoint?
2. In a real project changes would be commited to feature branch which would be merged after pull request to a dev branch that is deployed to development server, and only then a production release (PR for merging dev and main branch) would be done.
3. Commits should probably be done more often, and a commit-linter could be enforced so that commit messages have a certain format, maybe more descriptive, telling if the commit is a fix of bug, a feature, a test, refactor or other
4. Another styling solution might be applied, depending on team preferences - SCSS with modules, JSS, Tailwind, maybe more robust approach like Material UI. All have ups and downs though, current solution is not bad in my opinion
5. Add @-aliases to popular absolute paths in tsconfig to make imports cleaner
6. Maybe refactor Webpack config to one file
7. Articles.tsx is still fine in size but could be refactored - logic for fetching data could be extracted to a useFetch hook, maybe Axios would be more comfortable if project grows in future
8. Performance optimizations, consider memoization with useMemo/useCallback/React.memo ? Not an issue on such a small project though
9. Add more media query breakpoints...
10. Add Storybook for interactive documentation of basic components
11. Configure Jest, write some simple unit tests (although one big integration test would be fine for such a small application)
12. Consider E2E testing framework like Playwright and write simple end to end test
13. Add subtle animations?
14. Not a problem here but a real API probably stores a lot of articles, so some kind of list virtualization, lazy loading or pagination strategy should be introduced not to bloat the DOM and kill performance
