import { Component } from 'preact';
import './Home.css';
import SavedGamesOpen from '../../components/SavedGamesOpen/SavedGamesOpen';
import { mapNames } from '../../lib/map';
import { Link, route } from 'preact-router';
import GameStore from '../../stores/GameStore';
import Settings from '../../components/Settings/Settings';
import { router } from '../../index';
import { upcase } from '../../lib/util';

class Home extends Component {
  constructor(props) {
    super();
    this.state = {
      mapname: mapNames[0],
    };

    this.handleMapSelectionChange = this.handleMapSelectionChange.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
  }

  componentWillMount() {
    router.on('change', () => this.setState({}));
  }

  componentWillUnmount() {

  }

  handleMapSelectionChange(e) {
    this.setState({ mapname: e.target.value });
  }

  handleReturnToGame() {
    route('/game');
  }

  handleStartClick() {
    if (GameStore.started) {
      const force = confirm('Another game is already playing. Make sure you have saved your progress. Do you want to continue?');
      if (force) {
        GameStore.stop();
      } else {
        return;
      }
    }
    GameStore.startMap(this.state.mapname);
    route('/game');
  }

  render() {
    return (
      <div className="home" style="background-color: #194850">
        <div className="abs-container">
          {GameStore.started ? <button onClick={this.handleReturnToGame}>Return to Game</button> : null}
        </div>
        <div className="panel" >
          <h1>ATC Manager 2</h1>
          <div style="padding: 30px 20px;">
            ATC Manager 2 is a web based air traffic control game. Manage airspace of busy airports like Schiphol or Heathrow in a realistic simulator.
            <br /><br />Check out the <a title="Android App" href="https://play.google.com/store/apps/details?id=com.EchoSierraStudio.ATCManager&hl=en_US">App</a> for mobile.
          </div>
        </div>
        <div className="panel">
          <SavedGamesOpen />
        </div>
        <div className="panel">
          <h2 className="mb">Start</h2>
          <span className="mb">Area:</span>
          <select className="mb" onInput={this.handleMapSelectionChange}>
            {mapNames.map(name =>
              <option selected={name === this.state.mapname} value={name}>{upcase(name)}</option>
            )}
          </select>
          <Settings />
          <button onClick={this.handleStartClick}>Start</button>
        </div>
        <div className="panel" style={{padding: 3}}>
          <Link href="/editor/save-editor">
            <div class="block-outer">
              <div class="block-inner">
                Saves Editor
              </div>
            </div>
          </Link>
          <Link href="/editor/airplane-editor">
            <div class="block-outer">
              <div class="block-inner">
                Airplanes Editor
              </div>
            </div>
          </Link>
          <Link href="/editor/operator-editor">
            <div class="block-outer">
              <div class="block-inner">
                Operator Editor
              </div>
            </div>
          </Link>
          <a target="_blank" href="https://www.reddit.com/r/ATCManager2">
            <div class="block-outer">
              <div class="block-inner">
                Subreddit<br />
                (external)
              </div>
            </div>
          </a>
        </div>
      </div>
    );
  }
}

export default Home;
