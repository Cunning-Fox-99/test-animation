import React from 'react';
import { Player } from '@remotion/player';
import WaveAnimation from './WaveAnimation';

const App = () => {
  return (
      <div className="App">
        <Player
            component={WaveAnimation}
            durationInFrames={150}
            compositionWidth={800}
            compositionHeight={200}
            fps={30}
            autoPlay={true}
            style={{ width: '100%' }}
        />
      </div>
  );

};

export default App