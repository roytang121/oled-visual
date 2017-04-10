import React from 'react'
import '../styles/index.scss'

import Map from './test_data'

import { Layer, Rect, Stage, Group } from 'react-konva'

const ppiToGridSize = (ppi) => {
  return (normalise((2.54 * 0.01) / ppi)).toFixed(1)
}

const ppiToSppi = (ppi) => {
  return (ppi / Math.sqrt(2)).toFixed(1)
}

const normalise = (um) => {
  return um * 1000000
}

export default class App extends React.Component {
  constructor (props) {
    super(props)

    const INIT_PPI = 1000
    const GRID_SIZE = ppiToGridSize(INIT_PPI)

    this.state = {
      map: Map,
      canvasSize: {width: GRID_SIZE * 10 * 2, height: GRID_SIZE * 10 * 2},
      colorSize: {
        r: GRID_SIZE,
        g: GRID_SIZE,
        b: GRID_SIZE
      },
      ppi: INIT_PPI,
      sppi: {
        r: ppiToSppi(INIT_PPI),
        g: INIT_PPI,
        b: ppiToSppi(INIT_PPI)
      },
      gridSize: GRID_SIZE
    }
  }

  _getColorSize (color) {
    if (color) { return this.state.colorSize[color] * 2 }
    else { return this.state.gridSize * 2 }
  }

  _renderRect (x, y, color) {
    const blockSize = this._getColorSize(color)
    const GRID_SIZE = this.state.gridSize
    return (
      <Group
        x={x}
        y={y}
        width={GRID_SIZE * 2}
        height={GRID_SIZE * 2}>
        <Rect
          x={0}
          y={0}
          width={GRID_SIZE * 2}
          height={GRID_SIZE * 2}
          fill={'transparent'}
          />
        <Rect
          x={GRID_SIZE - blockSize / 2}
          y={GRID_SIZE - blockSize / 2}
          width={blockSize}
          height={blockSize}
          fill={this._mapColorKeyToHex(color)}
          opacity={0.7}
          stroke={color ? 'white' : null}
          />
      </Group>
    )
  }

  _mapColorKeyToHex (key) {
    switch (key) {
      case 'r': return 'red'
      case 'g': return 'green'
      case 'b': return 'blue'
      default: return 'transparent'
    }
  }

  _handlePPIChange (event) {
    const ppi = event.target.value
    const GRID_SIZE = ppiToGridSize(ppi)

    const canvasDimension = Math.min(Math.max(GRID_SIZE * 10 * 2, 500), 2000)
    this.setState({
      canvasSize: {width: canvasDimension, height: canvasDimension},
      ppi: ppi,
      sppi: {
        r: ppiToSppi(ppi),
        g: ppi,
        b: ppiToSppi(ppi)
      },
      colorSize: {
        r: GRID_SIZE,
        g: GRID_SIZE,
        b: GRID_SIZE
      },
      gridSize: GRID_SIZE
    })
  }

  _handleRGBChange (event) {
    const input = event.target
    let newSize = {...this.state.colorSize}
    newSize[input.name] = input.value
    this.setState({
      colorSize: newSize
    })
    console.info(event.target)
  }

  _calculateCenterCoord () {
    const estimatedHeight = Math.sqrt(Math.pow(this.state.gridSize, 2) * 2) * 4
    const estimatedWidth = Math.sqrt(Math.pow(this.state.gridSize, 2) * 2) * 6
    return {
      x: this.state.canvasSize.width / 2 - estimatedWidth,
      // x: 0,
      y: estimatedHeight * 2
    }
  }

  render () {
    const GRID_SIZE = this.state.gridSize
    return (
      <div style={styles.container}>
        <h1>OLED Mask Pattern Program</h1>
        <Stage
          width={this.state.canvasSize.width}
          height={this.state.canvasSize.height}>
          <Layer rotation={-45} x={this._calculateCenterCoord().x} y={this._calculateCenterCoord().y}>
            {
              this.state.map.map((row, j) => {
                return row.map((item, i) => {
                  return this._renderRect(i * GRID_SIZE * 2, j * GRID_SIZE * 2, item)
                })
              })
            }
          </Layer>
        </Stage>

        <div style={styles.controlPanelContainer}>
          <form style={styles.controlPanel}>
            <div style={styles.controlRow}>
              <label>PPI </label><input name='r' type='text' placeholder={this.state.ppi} value={this.state.ppi} onChange={this._handlePPIChange.bind(this)} />
            </div>
            <div style={styles.controlRow}>
              <label>R: </label><input name='r' type='text' placeholder={this.state.sppi.r} value={this.state.sppi.r} disabled />
            </div>
            <div style={styles.controlRow}>
              <label>G: </label><input name='g' type='text' placeholder={this.state.sppi.g} value={this.state.sppi.g} disabled />
            </div>
            <div style={styles.controlRow}>
              <label>B: </label><input name='b' type='text' placeholder={this.state.sppi.b} value={this.state.sppi.b} disabled />
            </div>
          </form>

          <form style={styles.controlPanel}>
            <div>Pixel Dimension (µm)</div>
            <div style={styles.controlRow}>
              <label>R: </label><input name='r' type='text' placeholder={this.state.colorSize.r} value={this.state.colorSize.r} onChange={this._handleRGBChange.bind(this)} />
            </div>
            <div style={styles.controlRow}>
              <label>G: </label><input name='g' type='text' placeholder={this.state.colorSize.g} value={this.state.colorSize.g} onChange={this._handleRGBChange.bind(this)} />
            </div>
            <div style={styles.controlRow}>
              <label>B: </label><input name='b' type='text' placeholder={this.state.colorSize.b} value={this.state.colorSize.b} onChange={this._handleRGBChange.bind(this)} />
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  canvasContainer: {
    backgroundColor: 'lightGrey'
  },
  controlPanelContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'stretch'
  },
  controlPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 50
  },
  controlRow: {
    display: 'flex',
    flexDirection: 'row'
  }
}
