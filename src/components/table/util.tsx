import React from 'react'
import * as ReactDomServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

export const extractText = (data: unknown[]) => {
  if (!Array.isArray(data)) return data

  const elementToString = (element: React.ReactNode) => {
    return ReactDomServer.renderToStaticMarkup(
      <StaticRouter location={''}>{element}</StaticRouter>
    ).replace(/<[^>]+>/g, '')
  }

  const tabularData = []
  for (const row of data) {
    if (!Array.isArray(row)) {
      tabularData.push(row)
    } else {
      const newRow = []
      for (const cell of row) {
        let value = cell
        if (Array.isArray(cell)) {
          value = cell.map((item) => elementToString(item)).join(' / ')
        } else if (typeof cell === 'object') {
          value = elementToString(cell)
        }

        newRow.push(value)
      }
      tabularData.push(newRow)
    }
  }
  return tabularData
}
