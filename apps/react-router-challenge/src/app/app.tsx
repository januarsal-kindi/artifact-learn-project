// Uncomment this line to use CSS modules
// import styles from './app.module.scss';
import NxWelcome from './nx-welcome';
import  {RouterChallenge} from 'react-router-challlenge'

export function App() {
  return (
    <div>
      <RouterChallenge />
      {/* Uncomment the line below to use NxWelcome component */}
      {/* <NxWelcome title="react-router-challenge" /> */}
      {/* Uncomment the line below to use CSS modules */}
      {/* <h1 className={styles.title}>Welcome to React Router Challenge!</h1> */}
      {/* <NxWelcome title="react-router-challenge" /> */}
    </div>
  );
}

export default App;
