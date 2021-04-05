import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import { authenticate } from "./store/session";
import Home from './components/Home'
import ArtistPage from "./components/ArtistPage";
import Artists from './components/Artists';
import Player from './components/Player'
import * as songActions from './store/songs'
import * as artistActions from './store/artists'
import * as artistPageActions from './store/artists'


function App() {
  const dispatch = useDispatch()
  const [authenticated, setAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const artists = useSelector(state => Object.values(state.artists))
  const {artist_id} = useParams()

  const [currentSong, setCurrentSong] = useState(null)
  const [q, setQ] = useState([])

  useEffect(() => {
    (async() => {
      const user = await dispatch(authenticate());
      if (!user.errors) {
        setAuthenticated(true);
      }
      setLoaded(true);
      dispatch(songActions.getSongs())
      dispatch(artistActions.getArtists())
      // dispatch(artistPageActions.getArtistSongs(artist_id))
    })();
  }, [setAuthenticated, dispatch]);

if (!loaded) {
    return null;
}

  return (
    <BrowserRouter>
      <NavBar
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
      />
      <Switch>
        <Route path="/login"
               exact={true}
               authenticated={authenticated}
               setAuthenticated={setAuthenticated}>
          <LoginForm
               authenticated={authenticated}
               setAuthenticated={setAuthenticated}
          />
        </Route>
        <Route path="/sign-up"
               exact={true}>
          <SignUpForm
               authenticated={authenticated}
              setAuthenticated={setAuthenticated} />
        </Route>

          <ProtectedRoute path = {`/artists/:artist_id`}
                exact={true}
                authenticated={authenticated}
                currentSong = {currentSong}
                setCurrentSong = {setCurrentSong}>
            <ArtistPage />
          </ProtectedRoute>
          <ProtectedRoute path="/"
                exact={true}
                authenticated={authenticated}
                setAuthenticated={setAuthenticated}
                >
            <Home
                currentSong = {currentSong}
                setCurrentSong = {setCurrentSong}/>
          </ProtectedRoute>
      </Switch>
      <Player currentSong = {currentSong}
              setCurrentSong = {setCurrentSong}
              q = {q}
              setQ = {setQ}/>
    </BrowserRouter>
  );
}

export default App;
