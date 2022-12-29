import Column from "./Column.js";

export default class Kanban {
  // REFERS TO THE DIV WITH A CLASS (KANBAN) IN THE HTML
  constructor(root) {
    this.root = root;

    Kanban.columns().forEach((column) => {
      // TODO: CREATE AN INSTANCE OF COLUMN CLASS
      const columnView = new Column(column.id, column.title);

      this.root.appendChild(columnView.elements.root);
    });
  }

  // RETURN AN ARRAY WITH EVERY SINGLE COLUMN AND IT'S NAME OR TITLE
  static columns() {
    return [
      {
        id: 1,
        title: "Not started",
      },
      {
        id: 2,
        title: "In progress",
      },
      {
        id: 3,
        title: "Done",
      },
    ];
  }
}
