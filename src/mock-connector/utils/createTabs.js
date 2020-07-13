export default function createTabs() {
  const tabs = []
  const subcategories = []

  for (let i = 1; i <= 3; i++) {
    subcategories.push({ as: `/s/${i}`, href: '/s/[...categorySlug]', text: `Subcategory ${i}` })
  }

  for (let i = 1; i <= 10; i++) {
    tabs.push({
      as: `/s/${i}`,
      href: '/s/[...categorySlug]',
      text: `Category ${i}`,
      items: subcategories,
    })
  }

  return tabs
}
