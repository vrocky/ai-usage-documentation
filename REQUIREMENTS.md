# Docker Registry UI - Requirements Document

## Overview
This document outlines the requirements for the Docker Registry UI project. The UI provides a user-friendly interface to interact with a Docker Registry v2, allowing users to browse, search, and manage container images.

## Functional Requirements


2. **Repository Browsing**
1. **Repository Browsing**
   - List all repositories available in the connected Docker registry.
   - Display repository details, including tags and image metadata.

3. **Image Tag Management**
   - List all tags for a selected repository.
   - Show details for each tag (e.g., image size, creation date, digest).
   - Option to delete tags/images (with confirmation prompt).


4. **Search Functionality** (UI only, not implemented initially)
   - The UI will include a search bar for repositories and tags, but the search functionality will not be active in the initial release.

5. **Image Details**
   - Display image layers and their sizes.
   - Show Dockerfile or configuration if available.

6. **User Interface**
   - Responsive and modern UI (desktop and mobile support).
   - Take UI/UX inspiration from Docker Hub for layout, navigation, and user experience.
   - Clear navigation between repositories, tags, and image details.
   - Error handling and user feedback for failed operations.

7. **Configuration**
   - Allow setting the registry endpoint via environment variable or config file.
   - Support for proxy settings if required.

8. **Security**
   - Secure handling of credentials (do not store passwords in plain text).


## Non-Functional Requirements

- **Performance:** UI should load repository/tag lists quickly, even for large registries.
- **Accessibility:** Follow accessibility best practices for web applications.
- **Documentation:** Provide clear setup and usage instructions.
- **Testing:** Include unit and integration tests for core features.

## Optional Features

- Support for multiple registries.
- Activity/audit log for image/tag deletions.
- Role-based access control (RBAC).
- Integration with CI/CD pipelines for image promotion.

## Out of Scope

- Building or pushing images (UI is for browsing and management only).
- Registry deployment/installation (assumes registry is already running).

## Technical Stack
- **Framework:** React with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS and SCSS
- **Dependency Injection:** InversifyJS
- **State Management:** React Context and Hooks (No external state management library)
- **API Communication:** Axios with a custom proxy server

---

_Last updated: July 28, 2025_
