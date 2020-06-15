import { red, green, blue, grey, teal, orange, purple } from '@material-ui/core/colors'
const color = c => c.toString().replace(/\#/, '')

const colors = {
  red: { background: color(red[500]), foreground: 'ffffff' },
  green: { background: color(green[500]), foreground: 'ffffff' },
  blue: { background: color(blue[500]), foreground: 'ffffff' },
  grey: { background: color(grey[300]), foreground: color(grey[600]) },
  teal: { background: color(teal[500]), foreground: 'ffffff' },
  orange: { background: color(orange[500]), foreground: 'ffffff' },
  purple: { background: color(purple[500]), foreground: 'ffffff' },
  black: { background: color(grey[800]), foreground: 'ffffff' },
}

export default colors

export function colorForId(id) {
  const keys = Object.keys(colors)
  const index = id % keys.length
  return keys[index]
}

export function indexForColor(color) {
  return Object.keys(colors).indexOf(color)
}
