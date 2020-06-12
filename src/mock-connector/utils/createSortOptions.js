export default function createSortOptions() {
  return [
    { name: 'Price - Lowest', code: 'price_asc' },
    { name: 'Price - Highest', code: 'price_desc' },
    { name: 'Most Popular', code: 'pop' },
    { name: 'Highest Rated', code: 'rating' },
  ]
}
