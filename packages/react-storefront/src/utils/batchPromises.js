/**
 * @param {*} batchSize The number of promises to run concurrently
 * @param {*} thenArr 
 * @param {*} fn 
 */
export default function(batchSize, thenArr, fn) {
  return Promise.resolve(thenArr).then(arr => {
    return arr
      .map((_, i) => {
        return i % batchSize ? [] : arr.slice(i, i + batchSize);
      })
      .map(group => res => {
        return Promise.all(group.map(fn)).then(r => {
          return res.concat(r);
        });
      })
      .reduce((chain, work) => chain.then(work), Promise.resolve([]));
  });
};
