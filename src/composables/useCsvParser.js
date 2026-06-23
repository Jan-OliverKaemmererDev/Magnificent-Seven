/**
 * Processes a character inside a quoted CSV field.
 * Handles escaped quotes (doubled "") and closing quotes.
 * @param {string} char - The current character.
 * @param {string} nextChar - The next character in the input.
 * @param {string} currentField - The field content accumulated so far.
 * @returns {{ field: string, insideQuotes: boolean, skip: boolean }}
 */
function handleQuotedChar(char, nextChar, currentField) {
  if (char === '"' && nextChar === '"') {
    return { field: currentField + '"', insideQuotes: true, skip: true };
  }
  if (char === '"') {
    return { field: currentField, insideQuotes: false, skip: false };
  }
  return { field: currentField + char, insideQuotes: true, skip: false };
}

/**
 * Processes a character outside a quoted CSV field.
 * Handles field delimiters, line breaks, and regular characters.
 * @param {string} char - The current character.
 * @param {string} nextChar - The next character in the input.
 * @param {string} currentField - The field content accumulated so far.
 * @param {string[]} currentRow - The current row of parsed fields.
 * @param {string[][]} rows - All completed rows.
 * @returns {{ field: string, row: string[], insideQuotes: boolean, skip: boolean }}
 */
function handleUnquotedChar(char, nextChar, currentField, currentRow, rows) {
  if (char === '"') {
    return { field: currentField, row: currentRow, insideQuotes: true, skip: false };
  }
  if (char === ',') {
    currentRow.push(currentField.trim());
    return { field: '', row: currentRow, insideQuotes: false, skip: false };
  }
  if (char === '\r' && nextChar === '\n') {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
    return { field: '', row: [], insideQuotes: false, skip: true };
  }
  if (char === '\n') {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
    return { field: '', row: [], insideQuotes: false, skip: false };
  }
  return { field: currentField + char, row: currentRow, insideQuotes: false, skip: false };
}

/**
 * Parses a raw CSV string into a two-dimensional array of row arrays.
 * Handles quoted fields that may contain commas or newlines.
 * @param {string} text - The raw CSV text to parse.
 * @returns {string[][]} A two-dimensional array where each inner array is a row of field strings.
 */
function parseCsvText(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (insideQuotes) {
      const result = handleQuotedChar(char, nextChar, currentField);
      currentField = result.field;
      insideQuotes = result.insideQuotes;
      if (result.skip) i++;
    } else {
      const result = handleUnquotedChar(char, nextChar, currentField, currentRow, rows);
      currentField = result.field;
      currentRow = result.row;
      insideQuotes = result.insideQuotes;
      if (result.skip) i++;
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }
  return rows;
}

/**
 * Composable that provides CSV parsing utilities.
 * Parses CSV text and maps rows to objects using header columns.
 * @returns {{ parse: function }} An object containing the parse function.
 */
export function useCsvParser() {
  /**
   * Parses CSV text and maps selected columns to named object properties.
   * @param {string} csvText - The raw CSV string to parse.
   * @param {string[]} columnNames - Names to assign to each selected column (e.g. ['ticker', 'companyName']).
   * @param {number[]} columnIndices - CSV column indices to extract (e.g. [0, 1]).
   * @returns {Object[]} Array of objects keyed by columnNames, excluding empty rows.
   */
  function parse(csvText, columnNames, columnIndices) {
    const rows = parseCsvText(csvText);
    const results = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const obj = {};
      let hasData = false;
      for (let j = 0; j < columnNames.length; j++) {
        const value = row[columnIndices[j]] || '';
        obj[columnNames[j]] = value;
        if (value) hasData = true;
      }
      if (hasData) results.push(obj);
    }
    return results;
  }

  return { parse };
}
