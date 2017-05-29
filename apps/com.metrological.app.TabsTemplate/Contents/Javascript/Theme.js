// Set the theme
Theme.set( {
  BaseGlow: {
    styles: {
      color: '#F1F1F1',
      backgroundColor: 'transparent'
    }
  },
  BaseFocus: {
    styles: {
      backgroundColor: '#5F429C'
    }
  },
  ControlTabPipeButton: {
    focused: {
      styles: {
        backgroundColor: '#5F429C'
      }
    },
    selected: {
      styles: {
        backgroundColor: 'rgba( 129, 1, 177, 0.4 )'
      }
    }
  },
  ControlTabStripButton: {
    focused: {
      styles: {
        backgroundColor: '#5F429C'
      }
    },
    selected: {
      styles: {
        backgroundColor: 'rgba( 129, 1, 177, 0.4 )'
      }
    }
  },
  'CustomTab .ControlTabPipeButton': {
    normal: {
      styles: {
        width: 200,
        height: 70,
        border: 0,
        borderRadius: 0,
        backgroundColor: 'transparent',
        fontSize: 35
      }
    },
    focused: {
      styles: {
        borderBottom: '5px solid #5F429C'
      }
    },
    selected: {
      styles: {
        borderBottom: '5px solid orange'
      }
    }
  }
} );
