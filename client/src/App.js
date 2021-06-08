import React, { useEffect, createContext, useReducer, useContext } from 'react'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import { reducer, intialState } from "./reducers/userReducer"
import './App.css';
import Navbar from "./components/navbar"
import Login from "./components/screens/login"
import Signup from "./components/screens/signup"
export const UserContext= createContext()
const Routing = () => {
  const history = useHistory()
  const {state,dispatch}=useContext(UserContext)
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      dispatch({type:"USER",payload:user})
      if(history.location.pathname.startsWith("/login")||history.location.pathname.startsWith("/signup"))history.push("/home")
    }
    else {

    }
  }, [])

  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
    </Switch>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, intialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
