export default function createMenu() {
  const items = []

  for (let i = 1; i <= 5; i++) {
    items.push(createCategoryItem(i))
  }

  return {
    items,
    header: 'header',
    footer: 'footer',
  }
}

function createCategoryItem(i) {
  const items = []

  for (let j = 1; j <= 5; j++) {
    items.push(createSubcategoryItem(j))
  }

  return {
    text: `Category ${i}`,
    items,
  }
}

function createSubcategoryItem(i) {
  const items = []

  for (let j = 1; j <= 5; j++) {
    items.push(createProductItem(j))
  }

  return {
    text: `Subcategory ${i}`,
    href: `/s/[...categorySlug]`,
    as: `/s/${i}`,
    expanded: i === 1,
    items,
  }
}

function createProductItem(i) {
  return {
    text: `Product ${i}`,
    href: `/p/[productId]`,
    as: `/p/${i}`,
  }
}
