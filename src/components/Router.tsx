import {
  ReactNode,
  useContext,
  useState,
  createContext,
  useEffect,
} from 'react';

const defaultData = {
  path: '',
  push: (path: string, replace: boolean) => {},
  pop: () => {},
};

const RouterContext = createContext(defaultData);
export const useRouter = () => useContext(RouterContext);

type RouterProps = { children: ReactNode };
export const Router = ({ children }: RouterProps) => {
  const [path, setPath] = useState('/');

  const pop = () => window.history.back();
  const push = (_path: string, replace = false) => {
    if (_path === path) return;
    if (replace) window.history.replaceState({}, '', _path);
    else window.history.pushState({}, '', _path);
    setPath(_path);
  };

  useEffect(() => {
    const _path = decodeURI(window.location.pathname);
    if (_path != path) setPath(_path);

    const handleRouterPop = () => {
      const _path = decodeURI(window.location.pathname);
      setPath(_path);
    };

    window.addEventListener('popstate', handleRouterPop);
    return () => {
      window.removeEventListener('popstate', handleRouterPop);
    };
  }, []);

  return (
    <RouterContext.Provider value={{ path, push, pop }}>
      {children}
    </RouterContext.Provider>
  );
};

type RouteProps = { path: string; component?: ReactNode; children?: ReactNode };

export const Route = ({ path, component, children }: RouteProps) => {
  const router = useContext(RouterContext);
  return <>{router.path === path ? children || component : null}</>;
};
