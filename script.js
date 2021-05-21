

// CODINGAN LEBIH RAPIH
const searchButton = document.querySelector('.search-button');

// karena proses get movies asynchronus maka kita harus memberi tanda asyncrhonus agar
// proses tersebut ditunggu selesai, dalam hal ini kita menunggu proses getmovies
searchButton.addEventListener('click', async function() {
    try {
        const inputKeyword = document.querySelector('.input-keyword');
        const movies = await getMovies(inputKeyword.value)
        updateUI(movies);
    } catch (err) {
        alert(err);
    }
});

// function tampilError(error) {
//     const errorUI = document.querySelector('.error-handling');
//     console.log(error);
//     errorUI.innerHTML = `<div class="col-md-5">
//     <div class="alert alert-danger" role="alert">
//         <h4 class="alert-heading">${error}</h4>
//     </div>
// </div>`;
// }
// event binding ( menit 10:10) -> untuk elemen yang dulu tidak ada sekarang ada
document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('modal-detail-button')) {
        const imdbid = e.target.dataset.imdbid;
        const movieDetail = await getMovieDetail(imdbid); // -> menunggu proses getMovieDetail selesai
        updateUIDetail(movieDetail);
    }
});

function getMovieDetail(imdbid) {
    return fetch('http://www.omdbapi.com/?&apikey=5baf3cbd&i=' + imdbid)
        .then(response => response.json())
        .then(m => m);
}

function updateUIDetail(m) {
    const detailMovie = showMovieDetail(m);
    const modalBodyDetail = document.querySelector('.modal-body');
    modalBodyDetail.innerHTML = detailMovie;
}

function getMovies(keyword) {
    return fetch(' http://www.omdbapi.com/?apikey=5baf3cbd&s=' + keyword)
        .then(response => {
            if (!response.ok) {
                // jika error kirimkan error ke catch
                throw new Error(response.statusText);
            }
            // jika berhasil
            return response.json();
        })
        .then(response => {
            if (response.Response == "False") { // -> jika Response dari variabel response false, 
                // untuk liat Response cek di console.log(response)
                throw new Error(response.Error);
            }
            return response.Search;
        });
}

function updateUI(movies) {
    let cards = '';
    movies.forEach(m => {
        cards += showCards(m);
    });
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = cards;
}

function showCards(m) {
    return `
            <div class="col-md-4 my-3">
                <div class="card">
                    <img src="${m.Poster}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${m.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                        <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#movieDetailModal"
                    data-imdbid="${m.imdbID}">Show Details</a>
                </div>
               </div>
            </div> `;
}

function showMovieDetail(m) {
    return `
          <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-3">
                                    <img src="${m.Poster}" class="img-fluid">
                                </div>
                                <div class="col-md">
                                    <ul class="list-group">
                                        <li class="list-group-item">
                                            <h4>${m.Title} (${m.Year})</h4>
                                        </li>
                                        <li class="list-group-item"><strong>Director:</strong> ${m.Director}></li>
                                        <li class="list-group-item"><strong>Actors:</strong> ${m.Actors}</li>
                                        <li class="list-group-item"><strong>Writer: </strong>${m.Writer}</li>
                                        <li class="list-group-item"><strong>Plot: </strong>${m.Plot}<br></li>
                                    </ul>
                                </div>
                            </div>
                        </div>`;
}
