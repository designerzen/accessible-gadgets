import './components/index';
import { renderApp } from './app';
import './style.css';

renderApp(document.querySelector<HTMLDivElement>('#app')!, document.body.dataset.component);
