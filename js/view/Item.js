import DropZone from "./DropZone.js";
import KanbanAPI from "../api/kanbanAPI.js";

export default class Item {
  constructor(id, content) {
    const bottomDropZone = DropZone.createDropZone();

    this.elements = {};
    this.elements.root = Item.createRoot();
    this.elements.input = this.elements.root.querySelector(
      ".kanban__item-input"
    );

    this.elements.root.dataset.id = id;
    this.elements.input.textContent = content;
    this.content = content;
    this.elements.root.appendChild(bottomDropZone);

    const onBlur = () => {
      const newContent = this.elements.input.textContent.trim();

      if (newContent == this.content) {
        return;
      }

      // OTHERWISE
      this.content = newContent;
      KanbanAPI.updateItem(id, {
        content: this.content,
      });

      console.log(this.content);
      console.log(newContent);
    };

    // WHEN THE USER CLICKS AWAY FROM THE INPUT FIELD RUN THE ON BLUR FUNCTION

    this.elements.input.addEventListener("blur", onBlur);

    // WHEN THE USER DOUBLE CLICKS ON AN ITEM RUN THIS FUNCTION
    this.elements.root.addEventListener("dblclick", () => {
      const check = confirm("Are you sure you want to delete this item?");

      if (check) {
        KanbanAPI.deleteItem(id);

        this.elements.input.removeEventListener("blur", onBlur);
        // REMOVE THE CHILD ELEMENT OF THIS ITEM
        this.elements.root.parentElement.removeChild(this.elements.root);
      }
    });
    // DRAG AND DROP
    this.elements.root.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", id);
    });

    //
    this.elements.input.addEventListener("drop", (e) => {
      e.preventDefault();
    });
  }

  static createRoot() {
    const range = document.createRange();

    range.selectNode(document.body);

    return range.createContextualFragment(`
           <div class="kanban__item" draggable="true">
                <div class="kanban__item-input" contenteditable></div>
           </div>
        `).children[0];
  }
}
