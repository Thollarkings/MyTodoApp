# TodoApp

## Overview

TodoApp is a modern, responsive, and feature-rich task management application designed to help users organize their daily tasks efficiently. Built with a focus on user experience, it provides a seamless way to add, track, and manage your to-do list across different platforms.

## Features

*   **Task Management:** Easily add new tasks with titles and optional descriptions.
*   **Status Toggling:** Mark tasks as complete or incomplete with a single tap.
*   **Task Editing:** Modify existing task titles and descriptions.
*   **Task Deletion:** Remove individual tasks or multiple selected tasks.
*   **Drag-and-Drop Reordering:** Intuitive reordering of tasks to prioritize your list.
*   **Filtering Options:** View all tasks, active tasks, or completed tasks.
*   **Batch Operations:** Select multiple tasks for bulk deletion.
*   **Responsive Design:** Adapts to various screen sizes, providing a consistent experience on web and mobile.
*   **Persistent Storage:** Tasks are stored and synchronized using Convex, ensuring your data is always up-to-date.

## Technologies Used

*   **Frontend:**
    *   [React Native](https://reactnative.dev/)
    *   [Expo](https://expo.dev/) (for development and build tooling)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Styled Components](https://styled-components.com/) (for styling)
    *   [react-native-draggable-flatlist](https://github.com/computerjazz/react-native-draggable-flatlist) (for drag-and-drop functionality)
*   **Backend:**
    *   [Convex](https://www.convex.dev/) (for real-time database and serverless functions)

## Setup and Installation

Follow these steps to get the TodoApp running on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
*   [Convex CLI](https://docs.convex.dev/get-started/setup-cli) (`npm install -g convex-cli`)

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd TodoApp
    ```
    (Replace `<repository-url>` with the actual URL of your GitHub repository.)

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Convex:**
    *   If you don't have a Convex project linked, run:
        ```bash
        npx convex init
        ```
        Follow the prompts to link to an existing Convex project or create a new one.
    *   Deploy your Convex functions:
        ```bash
        npx convex deploy
        ```

4.  **Run the migration (one-time):**
    If you have existing todos without position data, run the migration script. This can be done by temporarily uncommenting the `migratePositions()` call in `app/index.tsx` (as per previous instructions) or by calling the mutation directly from your Convex dashboard.

5.  **Start the Expo development server:**
    ```bash
    npx expo start
    ```
    This will open a new tab in your browser with the Expo Dev Tools. You can then:
    *   Scan the QR code with your phone (using the Expo Go app) to run on a physical device.
    *   Run on an Android emulator or iOS simulator.
    *   Run directly in your web browser.

## Usage

*   **Adding a Task:** Use the input field at the top to type your task and press Enter or the Add button.
*   **Editing a Task:** Tap the edit icon (pencil) on a task to enter edit mode. Make your changes and tap "Save".
*   **Marking Complete/Incomplete:** Tap the checkbox next to a task to toggle its completion status.
*   **Reordering Tasks:** Long-press and drag a task to change its position in the list.
*   **Filtering Tasks:** Use the "All", "Active", and "Completed" buttons at the bottom to filter your view.
*   **Deleting a Single Task:** Tap on a task to select it, then tap the "Delete" button that appears.
*   **Batch Deletion:** Select multiple tasks using the radio buttons (which appear when you select the first task), then use the "Delete Selected" button.

## Contributing

Contributions are welcome! If you have suggestions for improvements or find any bugs, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Credits

Developed by: **Omotola Oyeniyi**  
HNG13 Slack Username: **thollarkings**