const data = [
  {
    title: "Day of the Dragon",
    author: "Richard A. Knaak",
    quantity: 10,
    unit_price: 9,
    total_value: null,
  },
  {
    title: "A Wizard of Earthsea",
    author: "Ursula K. Le Guin",
    quantity: null,
    unit_price: 10,
    total_value: 40,
  },
  {
    title: "Homeland",
    author: "Robert A. Salvatore",
    quantity: 8,
    unit_price: null,
    total_value: 96,
  },
  {
    title: "Canticle",
    author: "Robert A. Salvatore",
    quantity: 13,
    unit_price: 23,
    total_value: null,
  },
  {
    title: "Gamedec. Granica rzeczywistości",
    author: "Marcin Przybyłek",
    quantity: null,
    unit_price: 25,
    total_value: 50,
  },
  {
    title: "The Night Has Come",
    author: "Stephen King",
    quantity: 30,
    unit_price: null,
    total_value: 900,
  },
  {
    title: "The Sphinx",
    author: "Graham Masterton",
    quantity: 3,
    unit_price: null,
    total_value: 300,
  },
  {
    title: "Charnel House",
    author: "Graham Masterton",
    quantity: null,
    unit_price: 20,
    total_value: 60,
  },
  {
    title: "The Devils of D-Day",
    author: "Graham Masterton",
    quantity: 10,
    unit_price: 16,
    total_value: null,
  },
];

const metadataOperations = [
  {
    id: "author",
    type: "string",
    label: "Author",
  },
  {
    id: "titles",
    type: "string",
    label: "Titles",
  },

  {
    id: "total_quantity",
    type: "number",
    label: "Total Quantity",
  },
  {
    id: "total_revenue",
    type: "number",
    label: "Total Revenue",
  },
  {
    id: "avg_quantity",
    type: "number",
    label: "Avg Quantity",
  },
  {
    id: "avg_unit_price",
    type: "number",
    label: "Avg Unit Price",
  },
];

const searchInputElement = document.body.querySelector("input.search-input");
const searchButtonElement = document.body.querySelector("button.search-go");
const searchResetElement = document.body.querySelector("button.search-reset");

const columnHideElement = document.body.querySelector("button.column-hide");
const columnShowElement = document.body.querySelector("button.column-show");
const columnResetElement = document.body.querySelector("button.column-reset");

const markButtonElement = document.body.querySelector("button.function-mark");
const fillButtonElement = document.body.querySelector("button.function-fill");
const countButtonElement = document.body.querySelector("button.function-count");
const computeTotalsButtonElement = document.body.querySelector(
  "button.function-totals"
);
const resetFunctionButtonElement = document.body.querySelector(
  "button.function-reset"
);

class Grid {
  constructor() {
    this.data = data;
    this.metadata = metadataOperations;

    // HINT: below map can be useful for view operations ;))
    this.dataViewRef = new Map();

    this.authorOccurrences = new Map();
    this.calculateAuthorOccurrences();

    this.sumAuthorQuantity();
    this.removeDuplicateAuthors();
    this.calculateTotalRevenue();
    this.calculateAvgQuantity();
    this.calculateAvgPrice();
    Object.freeze(this.data);
    Object.freeze(this.metadata);

    this.render();
    this.live();
  }

  render() {
    this.table = document.createElement("table");

    this.head = this.table.createTHead();
    this.body = this.table.createTBody();

    this.renderHead();
    this.renderBody();

    document.body.append(this.table);
  }

  renderHead() {
    const row = this.head.insertRow();

    for (const column of this.metadata) {
      const cell = row.insertCell();

      cell.innerText = column.label;
    }
  }

  renderBody() {
    for (const dataRow of this.data) {
      const row = this.body.insertRow();

      for (const column of this.metadata) {
        const cell = row.insertCell();
        cell.classList.add(column.type);

        switch (column.id) {
          case "author":
            cell.innerText = dataRow.author;
            break;
          case "titles":
            cell.innerText = dataRow.authorBooks || 0;
            break;

          case "total_quantity":
            cell.innerText = dataRow.totalQuantity || 0;
            break;
          case "total_revenue":
            cell.innerText = dataRow.totalRevenue || 0;
            break;

          case "avg_quantity":
            cell.innerText = dataRow.avgQuantity || 0;
            break;
          case "avg_unit_price":
            cell.innerText = dataRow.avgUnitPrice || 0;
            break;

          default:
            cell.innerText = dataRow[column.id];
            break;
        }
      }

      this.dataViewRef.set(dataRow, row);
    }
  }

  // Data operations

  calculateAvgPrice() {
    const authorAvgPrice = {};

    for (const dataRow of data) {
      const author = dataRow.author;
      const unit = dataRow.unit_price || 0;

      if (author) {
        if (!authorAvgPrice[author]) {
          authorAvgPrice[author] = {
            totalPrice: 0,
            bookCount: 0,
          };
        }

        authorAvgPrice[author].totalPrice += unit;
        authorAvgPrice[author].bookCount++;
      }
    }

    for (const dataRow of data) {
      const author = dataRow.author;

      if (author) {
        const stats = authorAvgPrice[author];
        const { totalPrice, bookCount } = stats;

        dataRow.totalPrice = totalPrice;
        if (bookCount > 0) {
          dataRow.avgUnitPrice = dataRow.avgUnitPrice = parseFloat(
            (totalPrice / bookCount).toFixed(2)
          );
        } else {
          dataRow.avgUnitPrice = 0;
        }
      }
    }
  }

  calculateAvgQuantity() {
    const authorStats = {};

    for (const dataRow of data) {
      const author = dataRow.author;
      const quantity = dataRow.quantity || 0;
      const unitPrice = dataRow.unit_price || 0;

      if (author) {
        if (!authorStats[author]) {
          authorStats[author] = {
            totalQuantity: 0,
            bookCount: 0,
          };
        }

        authorStats[author].totalQuantity += quantity;
        authorStats[author].bookCount++;
      }
    }

    for (const dataRow of data) {
      const author = dataRow.author;

      if (author) {
        const stats = authorStats[author];
        const { totalQuantity, bookCount } = stats;

        dataRow.totalQuantity = totalQuantity;
        if (bookCount > 0) {
          dataRow.avgQuantity = dataRow.avgQuantity = parseFloat(
            (totalQuantity / bookCount).toFixed(2)
          );
        } else {
          dataRow.avgQuantity = 0;
        }
      }
    }
  }

  removeDuplicateAuthors() {
    const uniqueAuthors = {};

    this.data = this.data.filter((dataRow) => {
      const author = dataRow.author;

      if (author && !uniqueAuthors[author]) {
        uniqueAuthors[author] = true;
        return true;
      }

      return false;
    });
  }

  sumAuthorQuantity() {
    const authorQuantity = {};

    for (const dataRow of this.data) {
      const author = dataRow.author;
      const quantity = dataRow.quantity;

      if (author) {
        if (authorQuantity[author]) {
          authorQuantity[author] += quantity;
        } else {
          authorQuantity[author] = quantity;
        }
      }
    }

    for (const dataRow of this.data) {
      const author = dataRow.author;

      if (author && dataRow.totalQuantity === undefined) {
        dataRow.totalQuantity = authorQuantity[author];
      }
    }
  }

  calculateTotalRevenue() {
    const authorRevenue = {};

    for (const dataRow of data) {
      const author = dataRow.author;
      const quantity = dataRow.quantity || 0;
      const unit = dataRow.unit_price || 0;

      if (author && quantity && unit) {
        const revenue = quantity * unit;

        if (authorRevenue[author]) {
          authorRevenue[author] += revenue;
        } else {
          authorRevenue[author] = revenue;
        }
      }
    }

    for (const dataRow of data) {
      const author = dataRow.author;

      if (author) {
        dataRow.totalRevenue = authorRevenue[author] || 0;
      }
    }
  }

  calculateAuthorOccurrences() {
    const authorOccurrences = {};

    for (const dataRow of this.data) {
      const author = dataRow.author;

      if (author) {
        if (authorOccurrences[author]) {
          authorOccurrences[author]++;
        } else {
          authorOccurrences[author] = 1;
        }
      }
    }

    for (const dataRow of this.data) {
      const author = dataRow.author;

      if (author) {
        dataRow.authorBooks = authorOccurrences[author];
      }
    }
  }

  live() {
    searchInputElement.addEventListener("input", this.onSearchGo.bind(this));

    searchButtonElement.addEventListener("click", this.onSearchGo.bind(this));
    searchInputElement.addEventListener(
      "keydown",
      this.onSearchChange.bind(this)
    );
    searchResetElement.addEventListener("click", this.onSearchReset.bind(this));

    columnHideElement.addEventListener(
      "click",
      this.onColumnHideClick.bind(this)
    );
    columnShowElement.addEventListener(
      "click",
      this.onColumnShowClick.bind(this)
    );
    columnResetElement.addEventListener("click", this.onColumnReset.bind(this));

    markButtonElement.addEventListener(
      "click",
      this.onMarkEmptyClick.bind(this)
    );
    fillButtonElement.addEventListener(
      "click",
      this.onFillTableClick.bind(this)
    );
    countButtonElement.addEventListener(
      "click",
      this.onCountEmptyClick.bind(this)
    );
    computeTotalsButtonElement.addEventListener(
      "click",
      this.onComputeTotalsClick.bind(this)
    );
    resetFunctionButtonElement.addEventListener(
      "click",
      this.onFunctionsResetClick.bind(this)
    );
  }

  onSearchGo(event) {
    const inputValue = searchInputElement.value.toLowerCase();

    for (const [dataRow, row] of this.dataViewRef.entries()) {
      let rowText = "";

      for (const column of this.metadata) {
        const cellValue = dataRow[column.id];
        const cellText = String(cellValue).toLowerCase();
        rowText += cellText + " ";
      }

      if (rowText.includes(inputValue)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
    console.error(`Searching...`);
  }

  onSearchChange(event) {
    console.error(`Search button pressed...`);
  }

  onSearchReset(event) {
    searchInputElement.value = "";
    for (const [dataRow, row] of this.dataViewRef.entries()) {
      row.style.display = "";
    }
    console.error(`Resetting search...`);
  }

  onColumnHideClick(event) {
    const visibleColumns = Array.from(this.head.rows[0].cells);

    console.log(visibleColumns);
    for (const cell of visibleColumns) {
      if (cell.style.display !== "none") {
        const columnIndex = cell.cellIndex;
        cell.style.display = "none";
        this.hideColumnData(columnIndex);
        break;
      }
    }

    console.error(`Hiding first visible column from the left...`);
  }

  hideColumnData(columnIndex) {
    for (const row of this.body.rows) {
      row.cells[columnIndex].style.display = "none";
    }
  }

  onColumnShowClick(event) {
    const visibleColumns = Array.from(this.head.rows[0].cells);

    for (const cell of visibleColumns) {
      if (cell.style.display == "none") {
        const columnIndex = cell.cellIndex;
        cell.style.display = "";
        this.showColumnData(columnIndex);
        break;
      }
    }

    console.error(`Showing first hidden column from the left...`);
  }

  showColumnData(columnIndex) {
    for (const row of this.body.rows) {
      row.cells[columnIndex].style.display = "";
    }
  }

  onColumnReset(event) {
    const columns = Array.from(this.head.rows[0].cells);
    columns.forEach((column) => {
      column.style.display = "";
      this.showColumnData(column.cellIndex);
    });

    console.error(`Resetting column visibility...`);
  }

  onMarkEmptyClick(event) {
    //every row
    const rows = Array.from(this.body.rows);

    rows.forEach((row) => {
      //children
      Array.from(row.cells).forEach((cell) => {
        if (cell.textContent.trim() === "") {
          cell.style.border = "1px solid red";
        }
      });
    });

    console.error(`Marking empty cells...`);
  }

  onFillTableClick(event) {
    const rows = Array.from(this.dataViewRef.values());

    rows.forEach((row) => {
      const quantityColumnIndex = this.metadata.findIndex(
        (column) => column.id === "quantity"
      );
      const unitPriceColumnIndex = this.metadata.findIndex(
        (column) => column.id === "unit_price"
      );
      const totalColumnIndex = this.metadata.findIndex(
        (column) => column.id === "total_value"
      );

      const quantityCell = row.cells[quantityColumnIndex];
      const unitPriceCell = row.cells[unitPriceColumnIndex];
      const totalCell = row.cells[totalColumnIndex];

      const quantityValue = parseFloat(quantityCell.textContent);
      const unitPriceValue = parseFloat(unitPriceCell.textContent);
      const totalPriceValue = parseFloat(totalCell.textContent);
      switch (true) {
        case quantityCell.textContent === "":
          quantityCell.textContent =
            parseInt(totalCell.textContent) /
            parseInt(unitPriceCell.textContent);
          break;
        case unitPriceCell.textContent === "":
          unitPriceCell.textContent =
            parseInt(totalCell.textContent) /
            parseInt(quantityCell.textContent);
          break;
        case totalCell.textContent === "":
          totalCell.textContent =
            parseInt(quantityCell.textContent) *
            parseInt(unitPriceCell.textContent);
          break;
      }
    });

    console.error(`Filling empty cells with data...`);
  }

  onCountEmptyClick(event) {
    const rows = Array.from(this.body.rows);
    let counter = 0;
    rows.forEach((row) => {
      Array.from(row.cells).forEach((cell) => {
        if (cell.textContent.trim() === "") {
          counter++;
        }
      });
    });

    alert("Found " + counter + " empty cells.");

    console.error(`Counting amount of empty cells...`);
  }

  onComputeTotalsClick(event) {
    let sum = 0;
    let columnName = "-1";
    const visibleColumns = [];

    for (let i = 0; i < this.metadata.length; i++) {
      const cell = this.head.rows[0].cells[i];

      if (cell.style.display !== "none") {
        const columnId = this.metadata[i].id;
        columnName = this.metadata[i].label;
        console.log(columnName);
        visibleColumns.push(columnId);
      }
    }

    for (const [dataRow, row] of this.dataViewRef.entries()) {
      const cell = row.cells[visibleColumns.length - 1];

      if (
        cell &&
        cell.textContent.trim() !== "" &&
        row.style.display != "none"
      ) {
        const numericValue = parseInt(cell.textContent);
        sum += numericValue;
      }
    }

    alert("Sum of " + columnName + " " + sum);

    console.error(`Computing summary totals...`);
  }
}

new Grid();
