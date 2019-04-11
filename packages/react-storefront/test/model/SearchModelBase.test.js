/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import SearchModelBase, { ResultsGroupModel } from '../../src/model/SearchModelBase'

describe('SearchModelBase', () => {
  let model

  beforeEach(() => {
    model = SearchModelBase.create()
  })

  it('should submit when setText is called with a non blank string', () => {
    model.submit = jest.fn()
    model.setText('foo')
    expect(model.submit).toHaveBeenCalledWith('foo')
    expect(model.text).toBe('foo')
    expect(model.loading).toBe(true)
    model.setText('')
    expect(model.submit).not.toHaveBeenCalledWith('')
    expect(model.text).toBe('')
    expect(model.loading).toBe(false)
  })

  it('should submit only when minimum string length is provided', () => {
    model = SearchModelBase.create({ minimumTextLength: 3 })
    model.submit = jest.fn()
    model.setText('f')
    expect(model.submit).not.toHaveBeenCalledWith('f')
    model.setText('fo')
    expect(model.submit).not.toHaveBeenCalledWith('fo')
    model.setText('foo')
    expect(model.submit).toHaveBeenCalledWith('foo')
  })

  it('should show and hide when toggle is called', () => {
    model.toggle(true)
    expect(model.show).toBe(true)
    model.toggle(false)
    expect(model.show).toBe(false)
  })

  it('setGroups should set groups', () => {
    const groups = [
      {
        caption: 'Foo',
        results: [
          {
            text: 'text',
            url: 'http://example.com',
            thumbnail: '/foo/bar.png',
            thumbnailHeight: 120,
            thumbnailWidth: 120,
          },
        ],
      },
    ]

    model.setGroups(groups)
    expect(model.groups.toJSON()).toEqual(groups)
  })
})

describe('ResultsGroupModel', () => {
  it('should have thumbnails==true when a result contains a thumbnail', () => {
    const model = ResultsGroupModel.create({
      caption: 'Foo',
      results: [{ text: 'Foo', url: '/foo', thumbnail: '/foo/bar.png' }],
    })

    expect(model.thumbnails).toBe(true)
  })

  it('should have thumbnails==false when a result contains a thumbnail', () => {
    const model = ResultsGroupModel.create({
      caption: 'Foo',
      results: [{ text: 'Foo', url: '/foo' }],
    })

    expect(model.thumbnails).toBe(false)
  })
})
