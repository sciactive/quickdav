type GamePadState = {
  axes: number[];
  buttons: GamepadButton[];
};

const AxisMap: { [k: string]: { [k: number]: string } } = {
  standard: {
    0: 'LHor',
    1: 'LVer',
    2: 'RHor',
    3: 'RVer',
  },
  '': {
    0: 'LHor',
    1: 'LVer',
    2: 'RHor',
    3: 'RVer',
    4: 'RT',
    5: 'LT',
    6: 'DHor',
    7: 'DVer',
  },
};

const ButtonMap: { [k: string]: { [k: number]: string } } = {
  standard: {
    0: 'A',
    1: 'B',
    2: 'X',
    3: 'Y',
    4: 'LB',
    5: 'RB',
    6: 'LT',
    7: 'RT',
    8: 'Select',
    9: 'Start',
    10: 'LS',
    11: 'RS',
    12: 'Up',
    13: 'Down',
    14: 'Left',
    15: 'Right',
    16: 'Special',
  },
  '': {
    0: 'A',
    1: 'B',
    3: 'X',
    4: 'Y',
    6: 'LB',
    7: 'RB',
    8: 'LT',
    9: 'RT',
    10: 'Select',
    11: 'Start',
    12: 'Special',
    13: 'LS',
    14: 'RS',
  },
};

type AxisCallback = (event: { value: number; changedRegion: boolean }) => void;
type ButtonCallback = (event: { pressed: boolean }) => void;

class GamePad {
  gamepads: Gamepad[];
  states: GamePadState[];
  connected = false;

  axisEvents: {
    LHor: AxisCallback[];
    LVer: AxisCallback[];
    RHor: AxisCallback[];
    RVer: AxisCallback[];
    RT: AxisCallback[];
    LT: AxisCallback[];
  } = {
    LHor: [],
    LVer: [],
    RHor: [],
    RVer: [],
    RT: [],
    LT: [],
  };

  buttonEvents: {
    A: ButtonCallback[];
    B: ButtonCallback[];
    X: ButtonCallback[];
    Y: ButtonCallback[];
    LB: ButtonCallback[];
    RB: ButtonCallback[];
    LT: ButtonCallback[];
    RT: ButtonCallback[];
    Select: ButtonCallback[];
    Start: ButtonCallback[];
    LS: ButtonCallback[];
    RS: ButtonCallback[];
    Up: ButtonCallback[];
    Down: ButtonCallback[];
    Left: ButtonCallback[];
    Right: ButtonCallback[];
    Special: ButtonCallback[];
  } = {
    A: [],
    B: [],
    X: [],
    Y: [],
    LB: [],
    RB: [],
    LT: [],
    RT: [],
    Select: [],
    Start: [],
    LS: [],
    RS: [],
    Up: [],
    Down: [],
    Left: [],
    Right: [],
    Special: [],
  };

  constructor() {
    this.gamepads = navigator
      .getGamepads()
      .filter((pad) => pad != null) as Gamepad[];
    this.states = this.gamepads.map(this.convertPadToState);

    window.addEventListener('gamepadconnected', (event) => {
      this.gamepads.splice(event.gamepad.index, 0, event.gamepad);
      this.states.splice(
        event.gamepad.index,
        0,
        this.convertPadToState(event.gamepad),
      );
      this.connected = true;
    });

    window.addEventListener('gamepaddisconnected', (event) => {
      delete this.gamepads[event.gamepad.index];
      delete this.states[event.gamepad.index];
      this.connected = this.gamepads.length > 0;
    });

    this.scheduleLoop();
  }

  convertPadToState(pad: Gamepad): GamePadState {
    return {
      axes: pad.axes.map((axis) => parseInt(`${axis}`)),
      buttons: pad.buttons.map((but) => ({
        pressed: but.pressed,
        touched: but.touched,
        value: but.value,
      })),
    };
  }

  scheduleLoop() {
    window.setTimeout(() => this.runLoop(), 60);
  }

  runLoop() {
    this.gamepads = navigator
      .getGamepads()
      .filter((pad) => pad != null) as Gamepad[];

    for (let i = 0; i < this.gamepads.length; i++) {
      const state = this.convertPadToState(this.gamepads[i]);
      const previousState = this.states[i];
      const amap = AxisMap[this.gamepads[i].mapping];
      const bmap = ButtonMap[this.gamepads[i].mapping];

      // Check axes.
      for (let j = 0; j < state.axes.length; j++) {
        if (state.axes[j] !== previousState.axes[j]) {
          if (amap[j] === 'DHor') {
            if (state.axes[j] === -1 || previousState.axes[j] === -1) {
              this.fireButtonEvent('Left', state.axes[j] === -1);
            } else {
              this.fireButtonEvent('Right', state.axes[j] === 1);
            }
          } else if (amap[j] === 'DVer') {
            if (state.axes[j] === -1 || previousState.axes[j] === -1) {
              this.fireButtonEvent('Up', state.axes[j] === -1);
            } else {
              this.fireButtonEvent('Down', state.axes[j] === 1);
            }
          } else {
            this.fireAxisEvent(
              amap[j],
              state.axes[j],
              (state.axes[j] < 0 && previousState.axes[j] >= 0) ||
                (state.axes[j] > 0 && previousState.axes[j] <= 0) ||
                (state.axes[j] === 0 && previousState.axes[j] !== 0),
            );
          }
          console.log(`Axis ${amap[j]} moved. Value = ${state.axes[j]}.`);
        }
      }

      // Check buttons.
      for (let j = 0; j < state.buttons.length; j++) {
        if (state.buttons[j].pressed !== previousState.buttons[j].pressed) {
          this.fireButtonEvent(bmap[j], state.buttons[j].pressed);
          console.log(
            `Button ${bmap[j]} changed pressed state. Value = ${state.buttons[j].pressed}.`,
          );
        }

        if (state.buttons[j].touched !== previousState.buttons[j].touched) {
          console.log(
            `Button ${bmap[j]} changed touched state. Value = ${state.buttons[j].touched}.`,
          );
        }

        if (state.buttons[j].value !== previousState.buttons[j].value) {
          console.log(
            `Button ${bmap[j]} changed value state. Value = ${state.buttons[j].value}.`,
          );
        }
      }

      // Update state.
      this.states[i] = state;
    }

    this.scheduleLoop();
  }

  onAxis(axis: keyof GamePad['axisEvents'], callback: AxisCallback) {
    this.axisEvents[axis].push(callback);

    return () => {
      const idx = this.axisEvents[axis].indexOf(callback);

      if (idx > -1) {
        this.axisEvents[axis].splice(idx, 1);
      }
    };
  }

  fireAxisEvent(axis: string, value: number, changedRegion: boolean) {
    if (!(axis in this.axisEvents)) {
      return;
    }

    for (let callback of this.axisEvents[axis as keyof GamePad['axisEvents']]) {
      callback({ value, changedRegion });
    }
  }

  onButton(button: keyof GamePad['buttonEvents'], callback: ButtonCallback) {
    this.buttonEvents[button].push(callback);

    return () => {
      const idx = this.buttonEvents[button].indexOf(callback);

      if (idx > -1) {
        this.buttonEvents[button].splice(idx, 1);
      }
    };
  }

  fireButtonEvent(button: string, pressed: boolean) {
    if (!(button in this.buttonEvents)) {
      return;
    }

    for (let callback of this.buttonEvents[
      button as keyof GamePad['buttonEvents']
    ]) {
      callback({ pressed });
    }
  }
}

export default new GamePad();
