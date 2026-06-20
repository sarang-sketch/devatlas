# Requirements Document

## Introduction

DevAtlas is a developer platform that unifies structured, interactive learning roadmaps with a curated directory of free developer tools and resources. It addresses two recurring developer problems: not knowing what to learn next, and not knowing which tools, platforms, APIs, hosting providers, databases, or AI services to adopt.

A user selects a career path and receives a complete visual roadmap. Each stage of the roadmap links to free learning resources, practice platforms, project suggestions, recommended free tools, deployment platforms, and career resources. Alongside roadmaps, DevAtlas provides a categorized free-tools library, a tool comparison system, a project hub, a personalized learning-path generator, and an optional account dashboard for progress tracking.

The Minimum Viable Product (MVP) is a client-rendered web application built with React, TypeScript, Next.js, Tailwind CSS, Framer Motion, and Shadcn UI. All content is sourced from static JSON data files bundled with the application; no server-side backend or database is required for the MVP. Account and progress data is persisted in the browser using local storage.

Tagline: "Your complete map to becoming a developer."

## Glossary

- **DevAtlas**: The complete web application described by this document.
- **System**: Shorthand for DevAtlas when no more specific component is named.
- **Career_Path**: A named developer specialization with an associated roadmap. The supported set is Frontend, Backend, Full Stack, Mobile, AI Engineer, ML Engineer, Data Scientist, DevOps, Cloud, Cybersecurity, Game Dev, and Blockchain.
- **Roadmap**: An ordered, visually connected graph of Roadmap_Nodes representing the recommended learning sequence for one Career_Path.
- **Roadmap_Node**: A single skill or topic within a Roadmap. Each node exposes up to six resource sections: Learn, Practice, Build, Use, Deploy, and Career.
- **Roadmap_Renderer**: The component that displays a Roadmap as visually connected nodes and handles node interaction.
- **Tool**: A free or free-tier developer product, service, platform, API, database, or resource listed in DevAtlas.
- **Tool_Card**: The visual representation of a single Tool, showing its name, description, free-tier details, category, website link, alternatives, and tags.
- **Tools_Library**: The categorized directory of all Tools.
- **Tool_Category**: A classification grouping for Tools. The supported set is AI, Hosting, Databases, Analytics, Auth, Storage, Monitoring, CI/CD, APIs, Design, Productivity, Testing, Security, and Open Source.
- **Search_Engine**: The component that performs global search across all content types and returns results.
- **Recommendation_Engine**: The component that selects Tools and resources relevant to the Roadmap or Career_Path a user is viewing.
- **Project**: A buildable practice exercise with a skill level, description, required skills, estimated completion time, recommended technology stack, and learning outcomes.
- **Project_Hub**: The component that lists and filters Projects.
- **Skill_Level**: A difficulty classification for a Project. The supported set is Beginner, Intermediate, Advanced, and Production-grade.
- **Comparison_View**: The component that displays a side-by-side feature comparison of two or more Tools.
- **Path_Generator**: The component that produces a personalized Roadmap from user-selected goal, available time, and current skill level.
- **Dashboard**: The optional account area that displays a user's tracked progress, saved Tools, and bookmarked resources.
- **Local_Store**: The browser local-storage mechanism used to persist account and progress data on the user's device.
- **Navigation_Bar**: The persistent top navigation component containing primary links and the search control.

## Requirements

### Requirement 1: Homepage

**User Story:** As a visitor, I want a homepage that immediately communicates what DevAtlas offers and where to start, so that I can begin exploring within seconds.

#### Acceptance Criteria

1. WHEN a visitor opens the homepage, THE DevAtlas SHALL display a hero section containing the headline "Master Any Developer Path".
2. WHEN the homepage is displayed, THE DevAtlas SHALL display a roadmap visualization in the hero section and SHALL begin the visualization's entrance animation within 100 milliseconds of the hero section becoming visible.
3. WHEN a visitor hovers over or activates a node within the hero roadmap visualization, THE DevAtlas SHALL provide a visible response to that interaction within 100 milliseconds.
4. WHEN the homepage is displayed, THE DevAtlas SHALL display a primary call-to-action labeled "Explore Roadmaps" and a secondary call-to-action labeled "Discover Free Tools".
5. WHEN a visitor activates the "Explore Roadmaps" call-to-action, THE DevAtlas SHALL navigate to the roadmaps listing.
6. WHEN a visitor activates the "Discover Free Tools" call-to-action, THE DevAtlas SHALL navigate to the Tools_Library.
7. IF the hero roadmap visualization fails to load, THEN THE DevAtlas SHALL display a static fallback image in the hero section and SHALL continue to display the headline and both call-to-action controls.

### Requirement 2: Primary Navigation

**User Story:** As a user, I want consistent navigation and an always-available search, so that I can move between sections from any page.

#### Acceptance Criteria

1. THE Navigation_Bar SHALL display links to Roadmaps, Free Tools, Learning Paths, Projects, Resources, Compare Tools, and Community.
2. WHILE a user scrolls the page content, THE Navigation_Bar SHALL remain fixed and visible at the top of the viewport.
3. THE Navigation_Bar SHALL display a search control on every page.
4. WHEN a user activates a Navigation_Bar link, THE DevAtlas SHALL navigate to the section identified by that link and SHALL visually indicate the link corresponding to the current section as active.
5. WHEN a user activates the search control, THE Navigation_Bar SHALL open the Search_Engine query input with input focus.
6. WHERE the viewport width is below 768 pixels, THE Navigation_Bar SHALL present its links through a collapsible menu control that is collapsed by default.
7. WHILE the viewport width is below 768 pixels, WHEN a user activates the collapsible menu control, THE Navigation_Bar SHALL toggle the visibility of the navigation links between shown and hidden.

### Requirement 3: Global Search

**User Story:** As a user, I want to search across all content from one place, so that I can find a roadmap, skill, technology, tool, database, API, hosting provider, AI service, or learning resource quickly.

#### Acceptance Criteria

1. THE Search_Engine SHALL index Roadmaps, Roadmap_Nodes, technologies, Tools, databases, APIs, hosting providers, AI services, and learning resources.
2. WHEN a user enters a search query of at least two characters and at most 100 characters, THE Search_Engine SHALL, within 300 milliseconds, display every indexed item whose name or tags contain the query text as a case-insensitive substring.
3. WHEN the Search_Engine displays results, THE Search_Engine SHALL group the results by content type.
4. WHEN the Search_Engine displays a result, THE Search_Engine SHALL show that result's name and its content type.
5. WHEN a user activates a search result, THE DevAtlas SHALL navigate to the page for the selected result.
6. IF a user enters a search query of fewer than two characters, THEN THE Search_Engine SHALL withhold result display and SHALL display no results list.
7. IF a search query returns no matches, THEN THE Search_Engine SHALL display a no-results message that includes the submitted query text.

### Requirement 4: Career Path Catalog

**User Story:** As a learner, I want to browse the available career paths, so that I can choose the specialization I want to pursue.

#### Acceptance Criteria

1. THE DevAtlas SHALL provide exactly twelve Career_Paths — Frontend, Backend, Full Stack, Mobile, AI Engineer, ML Engineer, Data Scientist, DevOps, Cloud, Cybersecurity, Game Dev, and Blockchain — SHALL display a Roadmap for each, and SHALL provide no other Career_Paths.
2. WHEN a user opens the roadmaps listing, THE DevAtlas SHALL display all twelve Career_Paths, each with its name and a description of at most 200 characters.
3. WHEN a user selects a Career_Path, THE DevAtlas SHALL open the Roadmap for that Career_Path.
4. IF a selected Career_Path's Roadmap fails to load, THEN THE DevAtlas SHALL display an error message indicating the Roadmap could not be loaded and SHALL retain the roadmaps listing with the other Career_Paths selectable.

### Requirement 5: Interactive Roadmap Experience

**User Story:** As a learner, I want each roadmap stage to show what to learn, practice, build, use, deploy with, and how to advance my career, so that I have a complete plan at every step.

#### Acceptance Criteria

1. WHEN a user opens a Roadmap, THE Roadmap_Renderer SHALL display the Roadmap_Nodes connected by directed connectors that order the nodes from the first to the last skill in the recommended learning sequence.
2. WHEN a user selects a Roadmap_Node, THE Roadmap_Renderer SHALL display that node's Learn, Practice, Build, Use, Deploy, and Career sections within 100 milliseconds.
3. WHEN a user views the Learn section of a Roadmap_Node, THE DevAtlas SHALL display the associated courses, documentation, videos, and articles as activatable links.
4. WHEN a user views the Practice section of a Roadmap_Node, THE DevAtlas SHALL display the associated challenges, exercises, and coding platforms as activatable links.
5. WHEN a user views the Build section of a Roadmap_Node, THE DevAtlas SHALL display the associated Project suggestions.
6. WHEN a user views the Use section of a Roadmap_Node, THE DevAtlas SHALL display the recommended free Tools for that node.
7. WHEN a user views the Deploy section of a Roadmap_Node, THE DevAtlas SHALL display the associated deployment platforms as activatable links.
8. WHEN a user views the Career section of a Roadmap_Node, THE DevAtlas SHALL display the associated interview, resume, and job resources as activatable links.
9. IF a section of a Roadmap_Node contains no items, THEN THE Roadmap_Renderer SHALL display that section with a placeholder message stating that no content is available.
10. WHEN a user activates a resource link within a Roadmap_Node section, THE DevAtlas SHALL open that resource's external website in a new browser tab.
11. IF a resource link fails to open, THEN THE DevAtlas SHALL display an error message indicating the link could not be opened and SHALL preserve the current Roadmap_Node view.
12. IF a selected Roadmap_Node's section content cannot be displayed within 100 milliseconds, THEN THE Roadmap_Renderer SHALL display a loading indicator for that section until its content becomes available.

### Requirement 6: Free Tools Library

**User Story:** As a developer, I want a categorized directory of free developer tools, so that I can discover and evaluate options for my project.

#### Acceptance Criteria

1. THE Tools_Library SHALL organize Tools under the following Tool_Categories: AI, Hosting, Databases, Analytics, Auth, Storage, Monitoring, CI/CD, APIs, Design, Productivity, Testing, Security, and Open Source.
2. WHEN a Tool_Card is displayed, THE DevAtlas SHALL show the Tool's name, description, free-tier details, Tool_Category, and website link, and SHALL show the Tool's alternatives and tags where the Tool defines them.
3. WHEN the Tools_Library opens with no filters selected, THE Tools_Library SHALL display all Tools.
4. WHEN a user activates a Tool_Card's website link, THE DevAtlas SHALL open the Tool's external website in a new browser tab and SHALL leave the Tools_Library view open and unchanged.
5. IF the Tool's external website fails to open, THEN THE DevAtlas SHALL display an error message stating that the link could not be opened and SHALL leave the Tools_Library view open and unchanged.
6. WHEN a user selects one or more Tool_Category or tag filters, THE Tools_Library SHALL display only the Tools whose Tool_Category is among the selected categories and that carry every selected tag.
7. IF a filter combination matches no Tools, THEN THE Tools_Library SHALL display a no-results message and a control to clear the active filters.
8. WHEN a user activates the clear-filters control, THE Tools_Library SHALL remove all active filters and SHALL display all Tools.
9. IF the Tools_Library fails to load its Tools, THEN THE DevAtlas SHALL display an error message indicating the Tools could not be loaded and SHALL continue to display the Tools_Library controls.

### Requirement 7: Context-Aware Recommendations

**User Story:** As a learner, I want tool recommendations tailored to the roadmap I am viewing, so that I use the right tools for my chosen path.

#### Acceptance Criteria

1. WHEN a user views a Roadmap, THE Recommendation_Engine SHALL display a recommendations section listing every free Tool whose tags match that Roadmap's Career_Path, showing at least each listed Tool's name.
2. WHILE a user views the Frontend Roadmap, THE Recommendation_Engine SHALL include every Tool tagged for frontend development among its recommendations.
3. WHILE a user views the AI Engineer Roadmap, THE Recommendation_Engine SHALL include every Tool tagged for artificial-intelligence development among its recommendations.
4. WHEN the Recommendation_Engine displays a recommended Tool, THE Recommendation_Engine SHALL provide a control that navigates to that Tool's Tool_Card.
5. IF a Roadmap's Career_Path has no Tools whose tags match it, THEN THE Recommendation_Engine SHALL omit the recommendations section for that Roadmap.

### Requirement 8: Project Hub

**User Story:** As a learner, I want project ideas organized by difficulty, so that I can practice skills at a level that matches my ability.

#### Acceptance Criteria

1. THE Project_Hub SHALL classify each Project under exactly one Skill_Level among Beginner, Intermediate, Advanced, and Production-grade.
2. WHEN a Project is displayed, THE DevAtlas SHALL show the Project's description, required skills, estimated completion time, recommended technology stack, and learning outcomes.
3. WHEN a user selects a Skill_Level filter, THE Project_Hub SHALL display only the Projects classified under the selected Skill_Level and SHALL exclude all Projects classified under any other Skill_Level.
4. WHEN no Skill_Level filter is selected, THE Project_Hub SHALL display all Projects regardless of Skill_Level.
5. IF the selected Skill_Level filter matches no Projects, THEN THE Project_Hub SHALL display a no-results message and a control to clear the active filter.
6. WHEN a user selects a Project from a Roadmap_Node Build section, THE DevAtlas SHALL open that Project's detail view.

### Requirement 9: Tool Comparison System

**User Story:** As a developer, I want to compare tools side by side, so that I can choose the best option for my needs.

#### Acceptance Criteria

1. WHEN a user selects between two and four Tools to compare, THE Comparison_View SHALL display the selected Tools side by side in a comparison table.
2. WHEN the Comparison_View displays a comparison, THE Comparison_View SHALL include rows for free-tier details, database support, authentication support, storage support, realtime support, pricing, and learning curve.
3. IF a compared Tool lacks a value for a comparison row, THEN THE Comparison_View SHALL display a placeholder indicating the value is unavailable for that Tool.
4. WHEN a user removes a Tool from the Comparison_View and at least two Tools remain selected, THE Comparison_View SHALL update the table to exclude the removed Tool.
5. IF a user attempts to add a Tool to the Comparison_View while four Tools are already selected, THEN THE Comparison_View SHALL withhold the addition and SHALL display a message indicating that a maximum of four Tools can be compared.
6. IF removing a Tool from the Comparison_View would leave fewer than two selected Tools, THEN THE Comparison_View SHALL exclude the removed Tool and SHALL display a message indicating that at least two Tools are required for a comparison.

### Requirement 10: Learning Path Generator

**User Story:** As a learner, I want a personalized roadmap based on my goal, available time, and skill level, so that I receive a plan suited to my situation.

#### Acceptance Criteria

1. WHEN a user opens the Path_Generator, THE Path_Generator SHALL request a learning goal selected from the supported Career_Paths, the available time as a whole number of hours per week, and the current Skill_Level selected from Beginner, Intermediate, Advanced, and Production-grade.
2. WHEN a user submits a goal, an available time between 1 and 80 hours per week, and a current Skill_Level, THE Path_Generator SHALL, within 2 seconds, generate a personalized Roadmap containing milestones, recommended Projects, learning resources, recommended Tools, and deployment recommendations.
3. WHERE the user's current Skill_Level is provided, THE Path_Generator SHALL exclude every milestone classified below the provided Skill_Level from the generated Roadmap.
4. IF the user submits the Path_Generator without selecting a goal, THEN THE Path_Generator SHALL display a validation message identifying the goal as required and SHALL withhold generation until a goal is selected.
5. IF the user submits the Path_Generator without selecting a current Skill_Level, THEN THE Path_Generator SHALL display a validation message identifying the Skill_Level as required and SHALL withhold generation until a Skill_Level is selected.
6. IF the user submits an available time that is not a whole number between 1 and 80 hours per week, THEN THE Path_Generator SHALL display a validation message identifying the valid range and SHALL withhold generation until a valid available time is provided.

### Requirement 11: Account and Progress Dashboard

**User Story:** As a returning user, I want to track my progress and save items, so that I can resume learning and revisit useful tools and resources.

#### Acceptance Criteria

1. WHERE a user has created an account, WHEN the user opens the Dashboard, THE Dashboard SHALL display the user's completed skills, completed Roadmaps, saved Tools, and bookmarked resources.
2. WHEN a user marks a Roadmap_Node as completed, THE System SHALL record the completion in the Local_Store.
3. WHEN a user saves a Tool or bookmarks a resource, THE System SHALL record the saved item in the Local_Store.
4. WHEN a user opens the Dashboard, THE Dashboard SHALL display, for each Roadmap the user has started, a progress visualization showing the percentage from 0 to 100 of that Roadmap's Roadmap_Nodes that the user has marked completed.
5. WHILE no account exists, THE DevAtlas SHALL allow full access to Roadmaps, the Tools_Library, Projects, and the Path_Generator without requiring an account.
6. WHEN a user returns to DevAtlas in the same browser, THE System SHALL restore the user's tracked progress and saved items from the Local_Store.
7. WHEN a user unmarks a completed Roadmap_Node, removes a saved Tool, or removes a bookmarked resource, THE System SHALL delete the corresponding record from the Local_Store.
8. IF recording a completion or a saved item to the Local_Store fails, THEN THE System SHALL display an error message indicating the item could not be saved and SHALL retain the current session's tracked progress and saved items.
9. IF the user's tracked data cannot be read from the Local_Store when the user returns, THEN THE Dashboard SHALL display an empty state indicating that no progress or saved items are available.

### Requirement 12: Visual Design and Interaction Quality

**User Story:** As a user, I want a polished, modern, and consistent interface, so that the product feels trustworthy and pleasant to use.

#### Acceptance Criteria

1. THE DevAtlas SHALL apply a single typography scale, color palette, spacing scale, and component style set uniformly across all pages, and SHALL apply the light theme by default when no theme selection is stored.
2. WHILE a user has selected dark mode, THE DevAtlas SHALL render all pages using the dark theme palette.
3. WHEN a user selects a theme, THE System SHALL store the selected theme in the Local_Store.
4. WHEN a user interacts with an interactive element, THE DevAtlas SHALL provide a visible state change, such as a hover, focus, active, or loading state, on that element within 100 milliseconds.
5. THE DevAtlas SHALL provide a theme selection control that allows a user to switch between the light theme and dark mode.
6. WHEN a user returns to DevAtlas in the same browser, THE System SHALL apply the theme stored in the Local_Store.
7. IF storing the theme selection to the Local_Store fails, THEN THE DevAtlas SHALL apply the selected theme for the current session and SHALL display an indication that the theme selection could not be saved.

### Requirement 13: Responsiveness and Accessibility

**User Story:** As a user on any device or assistive technology, I want the interface to adapt and be operable, so that I can use DevAtlas regardless of how I access it.

#### Acceptance Criteria

1. WHERE the viewport width is between 320 and 1920 pixels, THE DevAtlas SHALL present a layout with no horizontal scrolling of primary content.
2. WHILE any interactive element holds focus, THE DevAtlas SHALL display a visible focus indicator on that element regardless of whether the user is using a keyboard or a pointing device.
3. THE DevAtlas SHALL provide a text alternative for every non-text content element that conveys information.
4. THE DevAtlas SHALL maintain a contrast ratio of at least 4.5 to 1 between text and its background for text smaller than 18 point, or smaller than 14 point when bold.
5. THE DevAtlas SHALL maintain a contrast ratio of at least 3 to 1 between text and its background for text of at least 18 point, or at least 14 point when bold.
6. WHEN a user operates DevAtlas using only a keyboard, THE DevAtlas SHALL make every interactive element reachable and activatable through keyboard input, and SHALL allow focus to move away from any focused element using only keyboard input.

### Requirement 14: Performance and Search Engine Optimization

**User Story:** As a visitor, I want pages to load quickly and be discoverable through search engines, so that I can reach and use DevAtlas efficiently.

#### Acceptance Criteria

1. WHEN a visitor requests any public page route on a connection of at least 5 Mbps downstream bandwidth, THE DevAtlas SHALL render the page's primary content, comprising its main heading and above-the-fold layout, within 2.5 seconds of the request.
2. THE DevAtlas SHALL provide a unique title between 1 and 60 characters and a unique meta description between 50 and 160 characters for every public page route.
3. THE DevAtlas SHALL provide server-rendered or statically generated markup for every public page route to support search-engine indexing.
4. THE DevAtlas SHALL expose a sitemap listing every public page route and excluding non-public routes.
5. IF a public page route defines neither a title nor a meta description, THEN THE DevAtlas SHALL apply a default title and a default meta description to that route.

### Requirement 15: Static Content Data Model

**User Story:** As a maintainer, I want all platform content sourced from structured static data, so that the MVP requires no backend and content can be updated by editing data files.

#### Acceptance Criteria

1. THE DevAtlas SHALL load all Roadmaps, Roadmap_Nodes, Tools, Projects, and learning resources from static JSON data files bundled with the application.
2. THE DevAtlas SHALL operate without a server-side backend or external database for all content described in Requirements 1 through 11.
3. IF a referenced data file cannot be retrieved or cannot be parsed, THEN THE DevAtlas SHALL display an error message identifying the affected section and SHALL continue to render the remaining sections of the page with their already-loaded content.
4. IF a data entry does not conform to the supported schema, THEN THE DevAtlas SHALL omit that entry and SHALL continue to display the conforming entries.
5. WHEN content that conforms to the supported schema is added to a static JSON data file, THE DevAtlas SHALL display the added content on next load without requiring changes to any file other than the static JSON data files.
