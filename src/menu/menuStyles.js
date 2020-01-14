export default theme => ({
  drawer: {
    zIndex: theme.zIndex.modal + 20,
    display: 'flex',
    flexDirection: 'column',
    borderTop: `${theme.headerHeight}px solid transparent`,
    'body.moov-safari &': {
      // Turning off momentum scrolling on iOS here to fix frozen body issue
      // Source: https://moovweb.atlassian.net/browse/PRPL-342
      '-webkit-overflow-scrolling': 'auto',
    },
  },

  list: {
    flex: 'none',
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: '100%',
    padding: 0,
  },

  listPadding: {
    padding: 0,
  },

  header: {
    position: 'absolute',
    left: '10px',
    top: '12px',
  },

  icon: {
    marginRight: '0',
    width: 24,
  },

  headerText: {
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: theme.typography.body1.fontSize,
  },

  bodyWrap: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    transition: 'all ease-out .2s',
    maxHeight: '100%',
  },

  hidden: {
    display: 'none',
  },

  visible: {
    display: 'block',
  },

  link: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
  },

  leaf: {
    textTransform: 'none',
    ...theme.typography.body1,
  },

  drawerFixed: {
    top: 0,
    height: '100vh',
    borderTop: 'none',
  },
})
