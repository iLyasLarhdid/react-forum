import Home from './Home';
import{BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/login';
import { UserContext } from './hooks/UserContext';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import CommentList from './components/Comments/CommentList';
import Logout from './components/Logout';
import NavBar from './components/NavBar';
import Signup from './components/signup';
import ForumDetails from './components/Posts/PostsList';
import Profile from './components/Profiles/Profile';
import { QueryClient, QueryClientProvider } from 'react-query';

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
          <Home/>
        </Route>
        <Route exact path="/forums/:id">
          <ForumDetails/>
        </Route>
        <Route exact path="/posts/:id">
          <CommentList/>
        </Route>
        <Route exact path="/signup">
          <Signup/>
        </Route>
        <Route exact path="/profile/:id">
          <Profile/>
        </Route>
        <Route exact path="/login">
          <Login/>
        </Route>
        <Route exact path="/logout">
          <Logout/>
        </Route>
      </Switch>
    </UserContext.Provider>
    </QueryClientProvider>
    </Router>
    </>
  );
}

export default App;
