let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
let wave = document.getElementById("wave");
let randomIcon = document.querySelector(".fa-random");

let curr_track = document.createElement("audio");

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const apiConfig = {
    clientId: "41258572",
    baseUrl: "https://api.jamendo.com/v3.0",
};

const genres = ["rock", "pop", "jazz", "classical", "electronic"];

// Função atualizada para buscar por gênero
async function fetchJamendoTracks(limit = 10, genre = "", offset = 0) { // Aumentei o limite padrão para 10
    try {
        let url = `${apiConfig.baseUrl}/tracks/?client_id=${apiConfig.clientId}&format=json&limit=${limit}&orderby=popularity_total&offset=${offset}`;
        if (genre) {
            url += `&tags=${genre}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return data.results.map((track) => ({
            img: track.image,
            name: track.name,
            artist: track.artist_name,
            music: track.audio,
            id: track.id,
        }));
    } catch (error) {
        console.error("Erro ao buscar músicas do Jamendo:", error);
        return [];
    }
}

let music_list = [];

// Adicione esta função de inicialização
async function initializePlayer() {
    try {
        // Altere o limite aqui para o número de músicas que você quer carregar inicialmente
        music_list = await fetchJamendoTracks(10); // Exemplo: Carrega 10 músicas inicialmente
        if (music_list.length > 0) {
            loadTrack(track_index);
        } else {
            console.error("Não foi possível carregar músicas do Jamendo");
        }
    } catch (error) {
        console.error("Erro ao inicializar o player:", error);
    }
}

initializePlayer();

function loadTrack(track_index) {
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent =
        "Playing music " + (track_index + 1) + " of " + music_list.length;

    updateTimer = setInterval(setUpdate, 1000);

    curr_track.addEventListener("ended", nextTrack);
    random_bg_color();
}

function random_bg_color() {
    let hex = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
    ];
    let a;

    function populate(a) {
        for (let i = 0; i < 6; i++) {
            let x = Math.round(Math.random() * 14);
            let y = hex[x];
            a += y;
        }
        return a;
    }
    let Color1 = populate("#");
    let Color2 = populate("#");
    var angle = "to right";

    let gradient =
        "linear-gradient(" + angle + "," + Color1 + ", " + Color2 + ")";
    document.body.style.background = gradient;
}
function reset() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}
function randomTrack() {
    isRandom ? pauseRandom() : playRandom();
}
function playRandom() {
    isRandom = true;
    randomIcon.classList.add("randomActive");
}
function pauseRandom() {
    isRandom = false;
    randomIcon.classList.remove("randomActive");
}
function repeatTrack() {
    let current_index = track_index;
    loadTrack(current_index);
    playTrack();
}
function playpauseTrack() {
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack() {
    curr_track.play();
    isPlaying = true;
    track_art.classList.add("rotate");
    wave.classList.add("loader");
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove("rotate");
    wave.classList.remove("loader");
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
function nextTrack() {
    if (track_index < music_list.length - 1 && isRandom === false) {
        track_index += 1;
    } else if (track_index < music_list.length - 1 && isRandom === true) {
        let random_index = Number.parseInt(Math.random() * music_list.length);
        track_index = random_index;
    } else {
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}
function prevTrack() {
    if (track_index > 0) {
        track_index -= 1;
    } else {
        track_index = music_list.length - 1;
    }
    loadTrack(track_index);
    playTrack();
}
function seekTo() {
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}
function setVolume() {
    curr_track.volume = volume_slider.value / 100;
}
function setUpdate() {
    let seekPosition = 0;
    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(
            curr_track.currentTime - currentMinutes * 60
        );
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(
            curr_track.duration - durationMinutes * 60
        );

        if (currentSeconds < 10) {
            currentSeconds = "0" + currentSeconds;
        }
        if (durationSeconds < 10) {
            durationSeconds = "0" + durationSeconds;
        }
        if (currentMinutes < 10) {
            currentMinutes = "0" + currentMinutes;
        }
        if (durationMinutes < 10) {
            durationMinutes = "0" + durationMinutes;
        }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

const FAVORITES_KEY = "musicPlayerFavorites";

// Funções para gerenciar favoritos
function getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

function addToFavorites(track) {
    const favorites = getFavorites();
    if (!favorites.some((fav) => fav.id === track.id)) {
        favorites.push(track);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

function removeFromFavorites(trackId) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter((track) => track.id !== trackId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
}

let currentPage = 1;
const tracksPerPage = 4; // Isso ainda define quantos são carregados por clique em "carregar mais"

async function loadMoreTracks() {
    const offset = (currentPage) * tracksPerPage; // Ajustado para buscar a próxima página corretamente
    const newTracks = await fetchJamendoTracks(tracksPerPage, "", offset);
    music_list = [...music_list, ...newTracks];
    currentPage++;
    updatePlaylist();
}

function updatePlaylist() {
    // Atualize a exibição da playlist aqui
    // Se você tiver uma lista visível de músicas, este é o lugar para atualizá-la
    now_playing.textContent = `Playing music ${track_index + 1} of ${
        music_list.length
    }`;
}

document.getElementById('genre-select').addEventListener('change', async (e) => {
    const genre = e.target.value;
    currentPage = 0; // Resetar currentPage ao mudar o gênero
    // Para carregar um novo conjunto de músicas para o gênero, talvez você queira mais de 4 inicialmente.
    // Ajuste o primeiro parâmetro de fetchJamendoTracks conforme sua necessidade para o carregamento por gênero.
    music_list = await fetchJamendoTracks(10, genre); // Exemplo: Carrega 10 músicas do gênero selecionado
    track_index = 0;
    loadTrack(track_index);
});

// Certifique-se de que o botão 'load-more' exista no seu HTML
// Por exemplo: <button id="load-more">Carregar Mais Músicas</button>
document.getElementById('load-more').addEventListener('click', loadMoreTracks);

document.getElementById('toggle-favorites').addEventListener('click', () => {
    const currentTrack = music_list[track_index];
    const favorites = getFavorites();
    const isFavorite = favorites.some(fav => fav.id === currentTrack.id);

    if (isFavorite) {
        removeFromFavorites(currentTrack.id);
        document.querySelector('.favorites-btn i').classList.remove('active');
    } else {
        addToFavorites(currentTrack);
        document.querySelector('.favorites-btn i').classList.add('active');
    }
});
