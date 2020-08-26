import csso from 'csso'

export default function minifyStyles(css) {
  return csso.minify(css).css
}
