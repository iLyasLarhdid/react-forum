//import Home from './Home';
import{BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Login from './components/login';
import { UserContext } from './hooks/UserContext';
import { useState, Suspense, lazy } from 'react';
import { useCookies } from 'react-cookie';
// import CommentList from './components/Comments/CommentList';
// import Logout from './components/Logout';
import NavBar from './components/NavBar';
// import Signup from './components/signup';
// import ForumDetails from './components/Posts/PostsList';
// import Profile from './components/Profiles/Profile';
import { QueryClient, QueryClientProvider } from 'react-query';

const Home = lazy(()=>import ('./Home'));
const Logout = lazy(()=>import ('./components/Logout'));
const Signup = lazy(()=>import ('./components/signup'));
const ForumDetails = lazy(()=>import ('./components/Posts/PostsList'));
const Profile = lazy(()=>import ('./components/Profiles/Profile'));
const Login = lazy(()=>import ('./components/login'));
const CommentList = lazy(()=>import ('./components/Comments/CommentList'));
const Messages = lazy(()=>import ('./components/messages/Messages'));

function App() {
  const [cookies,] = useCookies([]);
  const [role, setRole] = useState(cookies.principal_role);
  const queryClient = new QueryClient();
  return (<>
  <Router>
  <QueryClientProvider client={queryClient}>   
  <UserContext.Provider value={[role,setRole]}>
    {role && <NavBar/>}
      <Switch>
        <Route exact path="/">
          <Suspense fallback={<div>loading..</div>}>
            <Home/>
          </Suspense>
        </Route>
        <Route exact path="/forums/:id">
        <Suspense fallback={<div>loading..</div>}>
          <ForumDetails/>
        </Suspense>
        </Route>
        <Route exact path="/posts/:id">
        <Suspense fallback={<div>loading..</div>}>
          <CommentList/>
        </Suspense>
        </Route>
        <Route exact path="/signup">
        <Suspense fallback={<div>loading..</div>}>
          <Signup/>
        </Suspense>
        </Route>
        <Route exact path="/profile/:id">
        <Suspense fallback={<div>loading..</div>}>
          <Profile/>
        </Suspense>
        </Route>
        <Route exact path="/messenger">
          <Suspense fallback={<div>loading..</div>}>
            <Messages/>
          </Suspense>
        </Route>
        <Route exact path="/login">
        <Suspense fallback={<div>loading..</div>}>
          <Login/>
        </Suspense>
        </Route>
        <Route exact path="/logout">
        <Suspense fallback={<div>loading..</div>}>
          <Logout/>
        </Suspense>
        </Route>
      </Switch>
    </UserContext.Provider>
    </QueryClientProvider>
    </Router>
    </>
  );
}

export default App;
