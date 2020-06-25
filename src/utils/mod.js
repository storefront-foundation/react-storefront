// Helper modulus function used in carousel logic
export default function mod(index, count) {
  const q = index % count
  return q < 0 ? q + count : q
}
