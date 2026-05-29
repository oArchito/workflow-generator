# HR Workflow Designer

link: https://workflow-generator-lemon.vercel.app/

A complete, production-quality React application for building, editing, and simulating modular HR workflows. Built with a clean, minimal design reminiscent of modern SaaS platforms (like Linear and Notion).


## 🚀 Key Features

1. **Workflow Canvas (React Flow)**
   - Drag-and-drop node creation from a component palette.
   - Distinct, specialized node types: `Start`, `Task`, `Approval`, `Automated Step`, and `End`.
   - Smooth zoom, pan, and intuitive node/edge connection and deletion.
   - Interactive selection outlines and subtle visual states.

2. **Dynamic Node Configuration Panel**
   - Renders modular, controlled forms using React Hook Form, customized for each node type:
     - **Start Node**: Title, dynamic key-value metadata.
     - **Task Node**: Title (required), description, assignee, due date, dynamic custom fields.
     - **Approval Node**: Title, Approver Role (Manager, HRBP, Director), auto-approve threshold.
     - **Automated Step Node**: Dynamic actions list fetched from a simulated API (e.g. *Send Email*, *Generate Document*), rendering custom parameter inputs accordingly.
     - **End Node**: End message, and boolean toggle to generate a final summary report.
   - Synchronizes node values with the canvas and state store in real-time.

3. **Workflow Simulation & Graph Validation**
   - Validates the workspace graph before running simulations:
     - Check for missing/multiple `Start` nodes.
     - Check for missing `End` nodes.
     - Check for disconnected nodes.
     - Performs Depth First Search (DFS) to detect cyclic workflows.
   - Simulated async runner logs step-by-step state changes during execution.

4. **Premium UX Elements**
   - Minimalist neutral palette with subtle shadows, rounded cards, and responsive sidebar drawers.
   - Features support for JSON export, Mini-map navigation, and canvas controls.

---

## 🛠️ Tech Stack

- **React 19** & **Vite** (Build Tool)
- **TypeScript** for strict type safety
- **Tailwind CSS v4** (Modern styling engine using CSS variables and utility injections)
- **React Flow (@xyflow/react)** for custom nodes, drag-and-drop interaction, and graph layouts
- **Zustand** for lightweight, centralized state management
- **React Hook Form** for dynamic, type-safe form schema handling

---

## 🏗️ Architecture & Folder Structure

```text
src/
├── api/             # Mock API layer representing fetch/simulation endpoints
├── components/      # UI components split by feature concern
│   ├── canvas/      # React Flow Canvas integration and canvas background
│   ├── forms/       # Sub-forms for Start, Task, Approval, Automated, and End nodes
│   ├── nodes/       # Custom React Flow Node components inheriting a BaseNode wrapper
│   ├── panels/      # Right-side configuration & bottom Simulation drawer
│   └── sidebar/     # Left component drag-palette
├── hooks/           # Custom React hooks containing decoupled business logic
├── store/           # Zustand store holding active nodes, edges, and logs
├── types/           # Strongly typed model/data contracts
├── utils/           # Helper scripts (e.g. DFS validation, cycle checks)
├── App.tsx          # Master layout composition
└── index.css        # Tailwind v4 globals & custom theme definitions
```

### Decoupled UI & Logic
The layout states, node array operations, and simulation updates are stored inside a centralized Zustand slice (`useWorkflowStore.ts`). Node editing fields are bound directly to specialized components in the configuration panel using `react-hook-form` to ensure performant state updates without unnecessary global canvas re-renders.

---

## ⚙️ Running Locally

Follow these commands from the root directory:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Dev Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

---

## 🎨 Design Decisions & Trade-offs

- **Tailwind CSS v4 & PostCSS Configuration**: The application leverages the newest Tailwind v4 features. The theme configuration is kept directly inside `src/index.css` via custom CSS variables under the `@theme` directive, removing the need for a separate Javascript-based config file.
- **Dynamic Form Handling**: Using `useForm<any>` for the configuration panel accommodates the highly dynamic, polymorphic structure of the different node variants, ensuring custom fields and metadata elements append and remove smoothly.
- **Cycle Detection & Path Validation**: Before executing a simulation run, we execute custom DFS traversal checks inside `utils/validation.ts` to identify loop structures early, alerting the user about invalid graph cycles immediately.
