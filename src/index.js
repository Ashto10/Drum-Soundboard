import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentClip: 'SoundBox 1.0',
      hasPower: true,
      volume: 0.8
    };
    this.updateDisplay = this.updateDisplay.bind(this);
    this.togglePower = this.togglePower.bind(this);
    this.updateVolume = this.updateVolume.bind(this);

    this.sfxFolder = "https://www.gustavoguarino.com/projects/drum-machine/sfx/";
    this.clipList = [{ key: 'q', nameOfClip: 'Clap', srcOfClip: this.sfxFolder + 'clap.mp3'},
                     { key: 'w', nameOfClip: 'Clave', srcOfClip: this.sfxFolder + 'clave.mp3'},
                     { key: 'e', nameOfClip: 'Crash', srcOfClip: this.sfxFolder + 'crash.mp3'},
                     { key: 'a', nameOfClip: 'Hi-hat A', srcOfClip: this.sfxFolder + 'hihat1.mp3'},
                     { key: 's', nameOfClip: 'Hi-hat B', srcOfClip: this.sfxFolder + 'hihat2.mp3'},
                     { key: 'd', nameOfClip: 'Kick', srcOfClip: this.sfxFolder + 'kick.mp3'},
                     { key: 'z', nameOfClip: 'Rim', srcOfClip: this.sfxFolder + 'rim.mp3'},
                     { key: 'x', nameOfClip: 'Snare A', srcOfClip: this.sfxFolder + 'snare1.mp3'},
                     { key: 'c', nameOfClip: 'Snare B', srcOfClip: this.sfxFolder + 'snare2.mp3'}];
  }

  updateDisplay(clipToPlay) {
    this.setState({currentClip: clipToPlay});
  }

  togglePower() {
    this.setState({
      hasPower: !this.state.hasPower,
      currentClip: this.state.hasPower ? this.state.currentClip : 'SoundBox 1.0'
    });
  }

  updateVolume(event) {
    this.setState({volume: event.target.value});
  }

  render() {
    return (
      <div id="drum-machine" className={this.state.hasPower ? '' : 'powered-off'}>
        <div id="left-side">
          <div id="drum-pad-container">
            { this.clipList.map((clip, index) => {
              return (
                <DrumPad key={index} clipInfo={clip} updateDisplay={this.updateDisplay} hasPower={this.state.hasPower} volume={this.state.volume}/>
              )
            }) }
          </div>
        </div>
        <div id="right-side">
          <div id="display-container">
            <div id="display">{this.state.currentClip}</div>
          </div>
          <div id="power-outer" onClick={this.togglePower}>
            <div id="power">Power</div>
          </div>
          <input type="range" id="volume" min="0" max="1" step=".02" onChange={this.updateVolume}/>
        </div>
      </div>
    );
  }
}

class DrumPad extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false
    }

    this.interval = null
    this.audioObject = null;
    this.handleKeyInput = this.handleKeyInput.bind(this);
    this.playClip = this.playClip.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyInput);
    this.audioObject= document.getElementById(this.props.clipInfo.key);
    this.audioObject.preload = "auto";
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyInput);
  }

  handleKeyInput(event) {
    if (this.props.clipInfo.key === event.key) {
      this.playClip();
    }
  }

  playClip() {
    if (!this.props.hasPower) { return; }

    this.audioObject.pause();
    this.audioObject.currentTime = 0;

    this.audioObject.play();

    this.setState({active: true});
    this.interval = setInterval(() => {
      this.setState({active: false});
    }, 500)

    this.props.updateDisplay(this.props.clipInfo.nameOfClip);
  }

  render() {
    // By updating the volume in render, clips can change their volumes mid-play
    if (this.audioObject) {
      this.audioObject.volume = this.props.volume;
    }

    let showKey;
    if (typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1) {
      showKey = <div className="key">{this.props.clipInfo.key}</div>;
    }

    return (
      <div
        className={`drum-pad-outer ${this.state.active ? 'pressed' : ''}`}
        onClick={this.playClip}>
        <div className="drum-pad" id={this.props.clipInfo.nameOfClip}>
          <div className="clip-name">{this.props.clipInfo.nameOfClip}</div>
          <div className="key">{this.props.clipInfo.key}</div>
          <showKey />
          <audio className="clip" src={this.props.clipInfo.srcOfClip} id={this.props.clipInfo.key}></audio>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));