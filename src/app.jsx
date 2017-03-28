import React from 'react'
import '../styles/index.scss'

import Map from './test_data'

import { Layer, Rect, Stage, Group } from 'react-konva'

const GRID_SIZE = 50

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      map: Map,
      canvasSize: {width: 500, height: 500},
      colorSize: {
        r: 30,
        g: 50,
        b: 50
      }
    }
  }

  _renderRect (x, y, color) {
    const blockSize = this.state.colorSize[color]
    return (
      <Group
        x={x}
        y={y}
        width={GRID_SIZE}
        height={GRID_SIZE}>
        <Rect
          x={0}
          y={0}
          width={GRID_SIZE}
          height={GRID_SIZE}
          fill={'transparent'}
          />
        <Rect
          x={GRID_SIZE / 2 - blockSize / 2}
          y={GRID_SIZE / 2 - blockSize / 2}
          width={this.state.colorSize[color]}
          height={this.state.colorSize[color]}
          fill={this._mapColorKeyToHex(color)}
          />
      </Group>
    )
  }

  _mapColorKeyToHex (key) {
    switch (key) {
      case 'r': return 'red'
      case 'g': return 'green'
      case 'b': return 'blue'
      default: return 'grey'
    }
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

  render () {
    return (
      <div style={styles.container}>
        <h1>OLed</h1>
        <Stage
          width={this.state.canvasSize.width}
          height={this.state.canvasSize.height}>
          <Layer rotation={45} x={this.state.canvasSize.width / 2} y={this.state.canvasSize.height / 4}>
            {
              this.state.map.map((row, j) => {
                return row.map((item, i) => {
                  return this._renderRect(i * GRID_SIZE, j * GRID_SIZE, item)
                })
              })
            }
          </Layer>
        </Stage>

        <form style={styles.controlPanel}>
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
  controlPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  controlRow: {
    display: 'flex',
    flexDirection: 'row'
  }
}
