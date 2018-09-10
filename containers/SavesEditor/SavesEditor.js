import { Component } from 'preact';
import { history } from '../../index';
import { route } from 'preact-router';
import './SavesEditor.css';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { saveAs } from 'file-saver';
import { saveState, loadState } from '../../lib/persistance';

class SavesEditor extends Component {
  constructor(props) {
    super();

    this.state = {
      json: '',
      saveName: '',
      saves: loadState().games,
      editingObj: null,
      debouncing: false,
    };
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  handleInputChanged = e => {
    const saveName = e.target.value;
    const save = this.state.saves[saveName] || null;
    this.setState({
      saveName,
      json: save !== null ? JSON.stringify(save, null, 4) : '',
    });
  }

  handleJsonTextareaInput = e => {
    const json = e.target.value;
    this.setState({
      debouncing: true,
      json,
    });
    this.parseTextareaJsonDebounced(json);
  }

  parseTextareaJsonDebounced = debounce(json => {
    this.setState({ debouncing: false });
    try {
      const obj = JSON.parse(json);
      this.setState(prevstate => {
        prevstate.warningMessage = null;
        prevstate.infoMessage = null,
          prevstate.editingObj = obj;
        return prevstate;
      });
    }
    catch (err) {
      this.setState({
        warningMessage: err.message,
        infoMessage: null,
        editingObj: null,
      });
    }
  }, 500);

  handleSaveClick = e => {
    if (this.state.editingObj === null) return alert('Please submit valid a valid save file');
    const saves = this.state.saves;
    saves[this.state.saveName] = this.state.editingObj;
    this.setState({
      saves,
    });
    let gamePersistance = loadState();
    gamePersistance.games = saves;
    saveState(gamePersistance);
    alert('Saved file to local storage');
  }

  handleCopy = () => {
    this.setState({
      infoMessage: 'Savefile copied to clipboard.'
    });
  }

  handleSaveFileClick = () => {
    saveAs(new Blob([this.state.json], {
      type: 'application/json'
    }), `savefile ${this.state.saveName.trim()}.json`)
  }

  readFromFile = e => {
    var reader = new FileReader();
    const _this = this;
    reader.onload = function () {
      
      _this.setState({
        json: reader.result
      })
    };
    reader.readAsText(e.target.files[0]);
  }

  render() {
    return (
      <div className="SavesEditor">
        <div className="panel">
          <h1>SavesEditor</h1>
          <select onInput={this.handleInputChanged}>
            <option value="">Choose Save:</option>
            {Object.keys(this.state.saves).map((key, i) =>
              <option key={i} value={key} selected={this.state.saves[key] === this.state.save}>{key}</option>
            )}
          </select><br /><br />
          <textarea onInput={this.handleJsonTextareaInput} className="line-nums" style="height: 300px!important;" value={this.state.json} />
          <div className="warning-message">{this.state.warningMessage}&nbsp;</div>
          <div className="info-message">{this.state.infoMessage}&nbsp;</div>
          <p>
            <button onClick={this.handleSaveFileClick} disabled={this.state.debouncing || this.state.json === ''}>Save to File</button>
            <input onChange={this.readFromFile} id="saveseditor" className="inputfile" type="file" accept=".json" disabled={this.state.saveName === ''} />
            <label for="saveseditor">Open File</label>
            <CopyToClipboard text={this.state.json}
              onCopy={this.handleCopy}>
              <button disabled={this.state.debouncing || this.state.json === ''}>Copy to Clipboard</button>
            </CopyToClipboard>
          </p>
          <button disabled={this.state.debouncing || this.state.editingObj === null} onClick={this.handleSaveClick}>{this.state.debouncing ? <FaSpinner className="spinner" /> : <FaPaperPlane />} Save</button>
        </div>
      </div >
    );
  }
}

export default SavesEditor;

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
