export default class KanbanAPI {
  static getItems(columnId) {
    const column = read().find((column) => column.id == columnId);

    if (!column) {
      return [];
    }
    return column.items;
  }

  // INSERT ITEM
  static insertItem(columnId, content) {
    const data = read();
    const column = data.find((column) => column.id == columnId);
    const item = {
      id: Math.floor(Math.random() * 100000),
      content,
    };

    // CHECK IF THE COLUMN EXISTS
    if (!column) {
      throw new Error("Column does not exist.");
    }

    // IF EVERTHING GOES WELL
    column.items.push(item);
    save(data);

    return item;
  }

  // UPDATE
  static updateItem(itemId, newProps) {
    const data = read();
    const [item, currentColumn] = (() => {
      for (const column of data) {
        const item = column.items.find((item) => item.id == itemId);

        if (item) {
          return [item, column];
        }
      }
    })();
    if (!item) {
      throw new Error("Item not found.");
    }

    item.content =
      newProps.content === undefined ? item.content : newProps.content;
    // console.log(item, currentColumn);
    // UPDATE COLUMN AND POSITION
    if (newProps.columnId !== undefined && newProps.position !== undefined) {
      const targetColumn = data.find(
        (column) => column.id == newProps.columnId
      );
      if (!targetColumn) {
        throw new Error("Targer column not found.");
      }

      // DELETE THE ITEM FROM IT'S CURRENT COLUMN
      currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

      // MOVE ITEM INTO IT'S NEW COLUMN AND POSITION
      targetColumn.items.splice(newProps.position, 0, item);
    }

    save(data);
  }

  // DLETE ITEM
  static deleteItem(itemId) {
    const data = read();

    for (const column of data) {
      const item = column.items.find((item) => item.id == itemId);

      if (item) {
        // OTHERWISE
        column.items.splice(column.items.indexOf(item), 1);
      }
    }
    save(data);
  }
}

function read() {
  const json = localStorage.getItem("kanban-data");

  // IF IS THE FIRST TIME THE USER IS USING THE KANBAN BOARD IN THEIR BROWSER WE CAN RETURN THE DEFAULT DATA
  if (!json) {
    return [
      {
        id: 1,
        items: [],
      },
      {
        id: 2,
        items: [],
      },
      {
        id: 3,
        items: [],
      },
    ];
  }

  return JSON.parse(json);
}

// SAVE
// DATA = WHAT FUNCTION(READ) RETURNS
function save(data) {
  localStorage.setItem("kanban-data", JSON.stringify(data));
}
