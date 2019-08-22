/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import SearchResultsModelBase, { FacetModelBase } from '../../src/model/SearchResultsModelBase'
import SubcategoryModelBase from '../../src/model/SubcategoryModelBase'

describe('SearchResultsModelBase', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  describe('toggleFilter', () => {
    it('adds a filter', () => {
      const results = SearchResultsModelBase.create()
      const facet = FacetModelBase.create({ name: 'Red', code: 'red' })
      results.toggleFilter(facet)
      expect(results.filters).toEqual(['red'])
      expect(results.filtersChanged).toBe(true)
    })

    it('removes a filter', () => {
      const results = SearchResultsModelBase.create({
        filters: ['red', 'green']
      })
      const facet = FacetModelBase.create({ name: 'Red', code: 'red' })
      results.toggleFilter(facet)
      expect(results.filters).toEqual(['green'])
      expect(results.filtersChanged).toBe(true)
    })
  })

  describe('filtersChanged', () => {
    it('should be false by default', () => {
      const results = SearchResultsModelBase.create()
      expect(results.filtersChanged).toBe(false)
    })

    it('should be mutable via setFiltersChanged()', () => {
      const results = SearchResultsModelBase.create()
      results.setFiltersChanged(true)
      expect(results.filtersChanged).toBe(true)
      results.setFiltersChanged(false)
      expect(results.filtersChanged).toBe(false)
    })
  })

  describe('addItems', () => {
    it('should replace items when page=0', () => {
      const results = SubcategoryModelBase.create({
        id: '1',
        loadingMore: true,
        page: 0,
        items: [{ id: '1' }]
      })

      results.addItems([{ id: '2' }, { id: '3' }])

      expect(results.loadingMore).toBe(false)
      expect(results.items.map(i => i.id)).toEqual(['2', '3'])
    })

    it('should append to existing items and set loadingMore to false', () => {
      const results = SubcategoryModelBase.create({
        id: '1',
        loadingMore: true,
        page: 1,
        items: [{ id: '1' }]
      })

      results.addItems([{ id: '2' }, { id: '3' }])

      expect(results.loadingMore).toBe(false)
      expect(results.items.map(i => i.id)).toEqual(['1', '2', '3'])
    })
  })

  describe('showMore', () => {
    it('should fetch more records from the server and add them to existing records', async () => {
      global.fetch.mockResponse(
        JSON.stringify({
          items: [{ id: '2' }, { id: '3' }]
        })
      )

      const results = SubcategoryModelBase.create({
        id: '1',
        loadingMore: true,
        items: [{ id: '1' }]
      })

      global.window = {
        location: {
          pathname: '/s/1',
          search: '?filters[0]=red'
        }
      }

      await results.showMore()

      expect(results.loadingMore).toBe(false)
      expect(results.items.map(i => i.id)).toEqual(['1', '2', '3'])
    })
  })

  describe('hasMoreItems', () => {
    it('should return true when items.length < total', () => {
      const model = SubcategoryModelBase.create({
        id: '1',
        items: [{ id: '1' }, { id: '2' }],
        total: 10
      })

      expect(model.hasMoreItems).toBe(true)
    })
    it('should return true when page < numberOfPages - 1', () => {
      const model = SubcategoryModelBase.create({
        id: '1',
        page: 1,
        numberOfPages: 3
      })

      expect(model.hasMoreItems).toBe(true)
    })
    it('should return false when items.length = total', () => {
      const model = SubcategoryModelBase.create({
        id: '1',
        items: [{ id: '1' }, { id: '2' }],
        total: 2
      })

      expect(model.hasMoreItems).toBe(false)
    })
    it('should return false when page = numberOfPages - 1', () => {
      const model = SubcategoryModelBase.create({
        id: '1',
        page: 1,
        numberOfPages: 2
      })

      expect(model.hasMoreItems).toBe(false)
    })

    it('should return false when neither total nor numberOfPages are specified', () => {
      const model = SubcategoryModelBase.create({
        id: '1'
      })

      expect(model.hasMoreItems).toBe(false)
    })
  })

  describe('showPage', () => {
    it('should replace facet groups if defined', async () => {
      global.fetch.mockResponse(
        JSON.stringify({
          items: [{ id: '2' }, { id: '3' }],
          facetGroups: [{ name: 'foo' }]
        })
      )

      const results = SearchResultsModelBase.create()

      await results.showPage(1)

      expect(results.items.map(i => i.id)).toEqual(['2', '3'])
      expect(results.facetGroups.map(i => i.name)).toEqual(['foo'])
    })
  })
})
