import { Component } from 'preact';
import './Game.css';
import AtcView from '../AtcView/AtcView';
import GameStore from '../../stores/GameStore';
import { GameMessages } from '../../components/GameMessages/GameMessages';

class Game extends Component {
  constructor(props) {
    super();
    this.name = 'default'
    this.setRoot = el => {
      this.root = el;
      GameStore.setSvgEl(el);
    }
  }

  componentWillMount() {
    if (GameStore.started) return;
    else GameStore.startMap(this.name);
  }

  render() {
    return (
      <div ref={this.setRoot} className="Game">
        <div id="atc-game">
          <AtcView />
        </div>
      </div>
    );
  }
}

export default Game;
