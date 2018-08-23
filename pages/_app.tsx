import NextApp, {Container} from 'next/app'
import {createContext} from 'react'
import {Helmet} from 'react-helmet'
import {Provider as ThemeProvider} from 'rebass'
import * as io from 'socket.io-client'
import {injectGlobal} from 'styled-components'

export const SocketContext = createContext(null)

export const UserContext = createContext(null)

const theme = {
  colors: {
    blackTrans: 'rgba(0, 0, 0, 0.8)',
  }
}

injectGlobal`
  html { height: 100% }
  body { 
    height: 100%; min-height: 100%;
    margin: 0;
    padding: 0;
  }
  #__next, #__next > div, #__next > div > div { 
    height: 100%; min-height: 100% 
  }
`

interface Props {
  componentProps: any,
}

class App extends NextApp<Props> {
  static async getInitialProps ({Component, ctx}) {
    return {
      componentProps: Component.getInitialProps ? await Component.getInitialProps(ctx) : {},
    }
  }

  state = {
    socket: null,
    user: null,
  }

  componentDidMount () {
    this.setState({...this.state, socket: io()})
  }

  componentWillUnmount () {
    this.state.socket.close()
  }

  render () {
    return <Container>
      <Helmet>
        <title>Sarah❤Ethan</title>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <meta property='og:title' content='Sarah❤Ethan' />
        <meta property='og:type' content='website' />
        <meta property='og:image' content='/static/images/sarah-coffee-hand-up.jpg' />
        <meta property='og:url' content='http://sarahandethan.live' />
      </Helmet>

      <SocketContext.Provider value={this.state.socket}>
        <UserContext.Provider value={this.state.user}>
          <ThemeProvider theme={theme}>
            <this.props.Component {...this.props.componentProps} />
          </ThemeProvider>
        </UserContext.Provider>
      </SocketContext.Provider>
    </Container>
  }
}

export default App