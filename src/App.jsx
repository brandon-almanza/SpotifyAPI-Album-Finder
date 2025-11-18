import "./App.css";
import SpotifyIcon from "./assets/Spotify_icon.png";
import {
  FormControl,
  InputGroup,
  Container,
  Button,
  Card,
  Row,
} from "react-bootstrap";
import { useState, useEffect } from "react";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  async function search() {
    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    // Get Artist
    const artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    // Get Artist Albums
    await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums?include_groups=album&market=US&limit=50",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        setAlbums(data.items);
      });
  }

  return (
    <>
    <main className="app-main">
      <img src={SpotifyIcon} alt="Spotify Icon" width={120} height={120} />
      <h1 className="title">Spotify Album Finder</h1>
    </main>

      <Container>
        <InputGroup>
          <FormControl
            placeholder="Search For Artist"
            type="input"
            aria-label="Search for an Artist"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
            className="search-input"
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>

      <Container>
        <Row className="albums-row">
          {albums.map((album) => {
            return (
              <Card key={album.id} className="album-card">
                <Card.Img width={200} src={album.images[0].url} className="album-img" />
                <Card.Body>
                  <Card.Title className="album-title">
                    {album.name}
                  </Card.Title>
                  <Card.Text className="album-text">
                    Release Date: <br /> {album.release_date}
                  </Card.Text>
                    <Button href={album.external_urls.spotify} className="album-link">
                      Album Link
                    </Button>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>

      <footer>
        <p className="footer-text">&copy; 2025 Brandon Argenal Almanza</p>
      </footer>
    </>
  );
}

export default App;