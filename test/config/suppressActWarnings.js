export default function suppressActWarnings() {
  const spy = jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (!args[0].includes('Warning: An update to %s inside a test was not wrapped in act')) {
      consoleError(...args)
    }
  })
  return () => spy.mockRestore()
}
