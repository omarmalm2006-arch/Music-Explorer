const genreFilter = document.getElementById("genreFilter");
const sortBy = document.getElementById("sortBy");
const tracksContainer = document.getElementById("tracksContainer");

const products = [
  {
    id: 1,
    name: "Hayart qalpy",
    category: "Classic",
    price: 350,
    rating: 10,
  },
  {
    id: 2,
    name: "Enta Omry",
    category: "Classic",
    price: 200,
    rating: 9,
  },
  {
    id: 3,
    name: "Hawel Teftekerny",
    category: "Classic",
    price: 220,
    rating: 9.5,
  },
  {
    id: 4,
    name: "Sendbad",
    category: "Rap",
    price: 200,
    rating: 8.7,
  },
  {
    id: 5,
    name: "Elshabab Nabara",
    category: "Public",
    price: 100,
    rating: 8.2,
  },
  {
    id: 6,
    name: "Bahari khater",
    category: "Public",
    price: 150,
    rating: 9.0,
  },
  {
    id: 7,
    name: "Wish You Were Here",
    category: "English",
    price: 300,
    rating: 9.7,
  },
  {
    id: 8,
    name: "Some Were Only We Knows",
    category: "English",
    price: 300,
    rating: 8.6,
  },
  {
    id: 9,
    name: "Apocalypse",
    category: "English",
    price: 300,
    rating: 10,
  },
];

let currentProducts = products;

function searchTracks(dataList, query) {
  if (!query || !query.trim()) return dataList;

  const lowerQuery = query.toLowerCase().trim();

  return dataList.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery),
  );
}

function displayTracks(products) {
  tracksContainer.innerHTML = "";

  products.forEach(function (product) {
    const isFav = favoritesList.some((f) => f.id === product.id);

    tracksContainer.innerHTML += `
      <div class="track-card">
        <div class="track-info">
          <h3>${product.name}</h3>

          <div class="track-meta">
            <span class="category-tag">${product.category}</span>

            <span class="rating-tag">
              <i class="fa-solid fa-star"></i> ${product.rating}
            </span>

            <span class="price-tag">$${product.price}</span>
          </div>
        </div>

        <div class="track-actions">
          <button
            class="btn-icon btn-fav ${isFav ? "active" : ""}"
            onclick="toggleFavorite(${product.id})"
          >
            <i class="fa-solid fa-heart"></i>
          </button>

          <button
            class="btn-icon btn-remove"
            onclick="deleteTrack(${product.id})"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  });
}

function filterByGenre(products, genre) {
  if (genre === "All") {
    return products;
  }

  return products.filter(function (product) {
    return product.category.toLowerCase() === genre.toLowerCase();
  });
}

function sortProducts(products, sortOption) {
  if (sortOption === "title-asc") {
    return products.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  if (sortOption === "title-desc") {
    return products.sort(function (a, b) {
      return b.name.localeCompare(a.name);
    });
  }

  if (sortOption === "rating-desc") {
    return products.sort(function (a, b) {
      return b.rating - a.rating;
    });
  }

  if (sortOption === "rating-asc") {
    return products.sort(function (a, b) {
      return a.rating - b.rating;
    });
  }

  return products;
}

let localTracks =
  JSON.parse(localStorage.getItem("custom_tracks")) || [];

let allProducts = [...products, ...localTracks];

currentProducts = allProducts;

let favoritesList =
  JSON.parse(localStorage.getItem("favorite_tracks")) || [];

function updateTracks() {
  const selectedGenre = genreFilter.value;
  const selectedSort = sortBy.value;

  let filteredProducts = filterByGenre(
    allProducts,
    selectedGenre
  );

  let sortedProducts = sortProducts(
    filteredProducts,
    selectedSort
  );

  displayTracks(sortedProducts);
  updateAnalytics(sortedProducts);
}

genreFilter.addEventListener("change", function () {
  updateTracks();
});

sortBy.addEventListener("change", function () {
  updateTracks();
});

function toggleFavorite(trackId) {
  let track = allProducts.find((p) => p.id === trackId);

  if (!track) return;

  let favIndex = favoritesList.findIndex(
    (f) => f.id === trackId
  );

  if (favIndex > -1) {
    favoritesList.splice(favIndex, 1);
  } else {
    favoritesList.push(track);
  }

  localStorage.setItem(
    "favorite_tracks",
    JSON.stringify(favoritesList)
  );

  renderFavorites();
  updateTracks();
}

function renderFavorites() {
  let favoritesContainer =
    document.getElementById("favoritesContainer");

  if (!favoritesContainer) return;

  if (favoritesList.length === 0) {
    favoritesContainer.innerHTML =
      `<p class="no-results">No favorite tracks added yet.</p>`;

    return;
  }

  favoritesContainer.innerHTML = "";

  favoritesList.forEach((track) => {
    favoritesContainer.innerHTML += `
      <div class="fav-card">
        <div>
          <h4>${track.name}</h4>

          <p>
            ${track.category} •
            <i class="fa-solid fa-star"></i>
            ${track.rating}
          </p>
        </div>

        <button
          class="btn-icon btn-remove"
          onclick="toggleFavorite(${track.id})"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
  });
}

let addForm = document.getElementById("addForm");

if (addForm) {
  addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let newTrack = {
      id: Date.now(),
      name: document
        .getElementById("trackName")
        .value
        .trim(),

      category:
        document.getElementById("trackCategory").value,

      rating: parseFloat(
        document.getElementById("trackRating").value
      ),

      price: parseFloat(
        document.getElementById("trackPrice").value
      ),
    };

    localTracks.push(newTrack);

    localStorage.setItem(
      "custom_tracks",
      JSON.stringify(localTracks)
    );

    allProducts.push(newTrack);

    addForm.reset();

    updateTracks();
  });
}

let searchInput =
  document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    let query = searchInput.value;

    let selectedGenre = genreFilter.value;
    let selectedSort = sortBy.value;

    let filtered = filterByGenre(
      allProducts,
      selectedGenre
    );

    let searched = searchTracks(filtered, query);

    let sorted = sortProducts(
      searched,
      selectedSort
    );

    displayTracks(sorted);
    updateAnalytics(sorted);
  });
}

function updateAnalytics(dataList) {
  let statTotalTracks =
    document.getElementById("statTotalTracks");

  let statAvgRating =
    document.getElementById("statAvgRating");

  let statTopTrack =
    document.getElementById("statTopTrack");

  let count = dataList.length;

  if (count === 0) {
    statTotalTracks.textContent = "0 Tracks";
    statAvgRating.textContent = "0.0";
    statTopTrack.textContent = "--";

    return;
  }

  let totalRating = dataList.reduce(
    (acc, item) => acc + Number(item.rating),
    0
  );

  let avgRating =
    (totalRating / count).toFixed(1);

  let topTrack =
    [...dataList].sort(
      (a, b) => b.rating - a.rating
    )[0];

  statTotalTracks.textContent =
    `${count} Tracks`;

  statAvgRating.textContent =
    `${avgRating}`;

  statTopTrack.textContent =
    topTrack.name;
}

function deleteTrack(trackId) {
  allProducts = allProducts.filter(
    (track) => track.id !== trackId
  );

  localTracks = localTracks.filter(
    (track) => track.id !== trackId
  );

  localStorage.setItem(
    "custom_tracks",
    JSON.stringify(localTracks)
  );

  favoritesList = favoritesList.filter(
    (track) => track.id !== trackId
  );

  localStorage.setItem(
    "favorite_tracks",
    JSON.stringify(favoritesList)
  );

  renderFavorites();
  updateTracks();
}

updateTracks();
renderFavorites();
