const API_KEY = "52746634-048ebfd846d8921f5de123532";
const BASE_URL = "https://pixabay.com/api/";
const perPage = 12;

let currentPage = 1;
let searchQuery = "";

const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");


async function fetchImages(query, page) {
  try {
    const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&per_page=${perPage}&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP Error: " + res.status);
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function renderImages(images) {
  const markup = images
    .map(
      (img) => `
    <li class="photo-card">
      <img src="${img.webformatURL}" alt="${img.tags}" />
      <div class="stats">
        <p><i class="material-icons">thumb_up</i>${img.likes}</p>
        <p><i class="material-icons">visibility</i>${img.views}</p>
        <p><i class="material-icons">comment</i>${img.comments}</p>
        <p><i class="material-icons">cloud_download</i>${img.downloads}</p>
      </div>
    </li>`
    )
    .join("");
  gallery.insertAdjacentHTML("beforeend", markup);
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  searchQuery = e.target.query.value.trim();
  if (!searchQuery) return;
  currentPage = 1;
  gallery.innerHTML = "";
  loadMoreBtn.hidden = false;

  const data = await fetchImages(searchQuery, currentPage);
  renderImages(data.hits);
});


loadMoreBtn.addEventListener("click", async () => {
  currentPage++;
  const data = await fetchImages(searchQuery, currentPage);
  renderImages(data.hits);

  const lastCard = document.querySelector(".gallery li:last-child");
  lastCard.scrollIntoView({ behavior: "smooth", block: "end" });
});
