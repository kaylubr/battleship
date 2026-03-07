import './styles.css';
import GameController from './controllers/GameController.js';

const retryButton = document.querySelector('#retry-link-button');

let game = new GameController();
game.run();

retryButton.addEventListener('click', () => {
  game = new GameController();
  game.run();
  retryButton.style.display = 'none';
});