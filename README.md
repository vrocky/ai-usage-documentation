# AI Experiment: docker-registry-v2-ui

This repository documents an AI-driven experiment where the task assigned to the AI was to build a Docker Registry v2 UI using React, TypeScript, and Vite.

## About the Experiment

- **Objective:** Evaluate the effectiveness and workflow of using advanced AI (Gemini 2.5 Pro and GitHub Copilot) to develop a real-world web application from scratch.
- **Task:** The AI was instructed to create a user interface for Docker Registry v2, including proxy setup, Docker integration, and UI features.
- **Process:** All major steps, code, and configuration were generated or guided by the AI, with minimal manual intervention.

## Results & Documentation

- For detailed setup, usage, and technical documentation, please check the internal docs and the project blog.
- Blog: [https://medium.com/@vinitsiriya](https://medium.com/@vinitsiriya)
- See [AI-USAGE.md](./AI-USAGE.md) for stats, screenshots, and a summary of the AI's involvement.

---

_This project serves as a case study for AI-assisted software development._

# Docker Registry UI

A modern, user-friendly UI for browsing and managing images in a Docker V2 Registry. This project is built with React, TypeScript, Vite, and Tailwind CSS, taking inspiration from Docker Hub for a clean and intuitive user experience.

## Features

- **Repository Browsing:** View all repositories in your registry.
- **Tag Management:** List, view details for, and delete image tags.
- **Image Details:** Inspect image layers, configuration, and history.
- **Pagination:** Efficiently browse repositories with many tags.
- **Search:** Client-side search for repositories and tags.
- **Dark/Light Mode:** Switch between themes for your viewing preference.
- **Responsive Design:** Usable on both desktop and mobile devices.

## Setup and Installation

### Prerequisites

- Node.js (v18 or newer)
- A running Docker V2 Registry instance.
  - For deletion to work, the registry must be started with `REGISTRY_STORAGE_DELETE_ENABLED=true`.

### Running the Application

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd docker-registry-v2-ui
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure the Registry Proxy:**
    The application uses a Node.js proxy server to communicate with the Docker Registry. By default, it assumes your registry is at `http://localhost:5000`.

    If your registry is at a different URL, create a `.env` file in the project root and set the `REGISTRY_URL` variable:
    ```
    # .env
    REGISTRY_URL=http://your-registry-host:port
    ```

4.  **Start the proxy server and the UI:**
    This project uses two parallel processes. It's recommended to run them in separate terminal windows.

    -   **Terminal 1: Start the proxy server:**
        ```bash
        npm run proxy
        ```

    -   **Terminal 2: Start the Vite development server:**
        ```bash
        npm run dev
        ```

5.  **Open the application:**
    Navigate to `http://localhost:5173` (or the port specified by Vite) in your browser.

## Available Scripts

- `npm run dev`: Starts the Vite development server for the UI.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the source code.
- `npm run preview`: Serves the production build locally.
- `npm run proxy`: Starts the Node.js proxy server.
