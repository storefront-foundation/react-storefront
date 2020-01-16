export const windowLocationMock = (pathname = '/', search = '', hash = '', ...others) => {
  jest
    .spyOn(window, 'location', 'get')
    .mockReturnValue({ pathname: pathname, search: search, hash: hash, others })
}

export const historyMock = (replaceState = jest.fn(), pushState = jest.fn(), ...others) => {
  jest.spyOn(window, 'history', 'get').mockReturnValue({
    replaceState,
    pushState,
    others,
  })
}

export const eventListenersMock = map => {
  jest.spyOn(window, 'addEventListener').mockImplementation((event, cb) => {
    map[event] = cb
  })
}
