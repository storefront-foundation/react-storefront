import React from 'react'
import ResponsiveTiles from '../../src/ResponsiveTiles'

export default { title: 'ResponsiveTiles' }

const data = [
  { color: 'red', textColor: 'white', label: 'Tile 1' },
  { color: 'black', textColor: 'white', label: 'Tile 2' },
  { color: 'blue', textColor: 'white', label: 'Tile 3' },
  { color: 'skyblue', textColor: 'black', label: 'Tile 4' },
  { color: 'purple', textColor: 'white', label: 'Tile 5' },
  { color: 'yellow', textColor: 'black', label: 'Tile 6' },
  { color: 'gray', textColor: 'white', label: 'Tile 7' },
  { color: 'lime', textColor: 'black', label: 'Tile 8' },
  { color: 'pink', textColor: 'black', label: 'Tile 9' },
  { color: 'aquamarine', textColor: 'black', label: 'Tile 10' },
  { color: 'orange', textColor: 'black', label: 'Tile 11' },
  { color: 'indigo', textColor: 'white', label: 'Tile 12' },
]

export const defaults = () => (
  <ResponsiveTiles>
    {data.map(item => (
      <div
        key={item.label}
        style={{
          height: 150,
          backgroundColor: item.color,
          color: item.textColor,
          display: 'flex',
          fontFamily: 'Arial',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {item.label}
      </div>
    ))}
  </ResponsiveTiles>
)
