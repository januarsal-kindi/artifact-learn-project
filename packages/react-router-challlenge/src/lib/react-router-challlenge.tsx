import {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from 'react';

import './App.css';

// User stories
// 1. As a user, I want to navigate between different pages (Home, About, Contact) using links.
// 2. As a user, I want to see the content of the page change when
//    I click on a link without reloading the page.
// 3. As a user, I want to be able to pass initial data to the About page
//    and see it rendered when I navigate to that page.

// Router ----
type RouterProps = {
  children: ReactNode;
};

const RouterContext = createContext({
  currentPath: '',
  setCurrentPath: (path: string) => {
    console.log(path);
  },
});

const RouterContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const setPath = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  return (
    <RouterContext.Provider
      value={{
        currentPath,
        setCurrentPath: setPath,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

function Router(props: RouterProps) {
  return <RouterContextProvider>{props.children}</RouterContextProvider>;
}
// ----

// Route ----
type RouteProps<T = unknown> = {
  path: string;
  initialData?: T;
  children: ReactNode | ((data: T | undefined) => ReactNode);
};

function Route<T>(props: RouteProps<T>) {
  const { currentPath } = useContext(RouterContext);

  const isMatch = props.path === currentPath;

  if (isMatch) {
    console.log(props.path, props.children);
    if (typeof props.children === 'function') {
      return props?.children(props.initialData);
    }

    return <>{props.children}</>;
  }
}
// ----

// Link ----
function Link(props: { to: string; children: ReactNode }) {
  const { setCurrentPath } = useContext(RouterContext);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setCurrentPath(props.to);
    e.preventDefault();
  };

  return <a onClick={onClick}>{props.children}</a>;
}
// -----------

// -----------
const Home = () => <h1>Home</h1>;
const About = (props: { name: string }) => (
  <div>
    <h1>About</h1>
    <p>{props.name}</p>
  </div>
);
const Contact = () => <h1>Contact</h1>;

// -----------

const App = () => {

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/about" initialData={{ name: 'Hanif' }}>
        {(data) => {
          return <About name={data?.name || 'No name'} />;
        }}
      </Route>
      <Route path="/contact">
        <Contact />
      </Route>
    </Router>
  );
};

export default App;
