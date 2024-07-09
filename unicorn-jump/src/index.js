// javascript
   import React from 'react';
   import ReactDOM from 'react-dom';
   import './index.css'; // Import the CSS file here
  //  import '../dist/output.css';
   import Game from './Game';

   ReactDOM.render(
     <React.StrictMode>
       <Game onGameOver={(score) => alert(`Game Over! Score: ${score}`)} />
     </React.StrictMode>,
     document.getElementById('root')
   );