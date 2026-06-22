/**
 * Parses a raw CSV string into an array of row arrays.
 * Handles quoted fields that may contain commas or newlines.
 */
function parseCsvText(text) {
  const rows = []
  let currentRow = []
  let currentField = ''
  let insideQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"'
        i++ // skip escaped quote
      } else if (char === '"') {
        insideQuotes = false
      } else {
        currentField += char
      }
    } else {
      if (char === '"') {
        insideQuotes = true
      } else if (char === ',') {
        currentRow.push(currentField.trim())
        currentField = ''
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentField.trim())
        rows.push(currentRow)
        currentRow = []
        currentField = ''
        i++ // skip \n
      } else if (char === '\n') {
        currentRow.push(currentField.trim())
        rows.push(currentRow)
        currentRow = []
        currentField = ''
      } else {
        currentField += char
      }
    }
  }

  // Push last field/row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim())
    rows.push(currentRow)
  }

  return rows
}

/**
 * Composable that provides CSV parsing utilities.
 * Parses CSV text and maps rows to objects using header columns.
 *
 * @param {string} csvText - Raw CSV string
 * @param {string[]} columnNames - Names to assign to each column index
 * @returns {Object[]} Array of objects keyed by columnNames
 */
export function useCsvParser() {
  /**
   * @param {string} csvText
   * @param {string[]} columnNames - e.g. ['ticker', 'companyName']
   * @param {number[]} columnIndices - which CSV column indices to map, e.g. [0, 1]
   * @returns {Object[]}
   */
  function parse(csvText, columnNames, columnIndices) {
    const rows = parseCsvText(csvText)
    const results = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const obj = {}
      let hasData = false

      for (let j = 0; j < columnNames.length; j++) {
        const colIdx = columnIndices[j]
        const value = row[colIdx] || ''
        obj[columnNames[j]] = value
        if (value) hasData = true
      }

      if (hasData) {
        results.push(obj)
      }
    }

    return results
  }

  return { parse }
}
