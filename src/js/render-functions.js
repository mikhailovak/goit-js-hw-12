import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let lightbox = null;

export function renderImages(images, container) {
    const markup = images.map(image => `
        <li class="image-item">
            <a href="${image.largeImageURL}" class="gallery-link"> 
                <img src="${image.webformatURL}" alt="${image.tags}" />
                <div class="image-info">
                    <p><strong>Likes:</strong> ${image.likes}</p>
                    <p><strong>Views:</strong> ${image.views}</p>
                    <p><strong>Comments:</strong> ${image.comments}</p>
                    <p><strong>Downloads:</strong> ${image.downloads}</p>
                </div>
            </a>
        </li>
    `).join("");
    
    // container.innerHTML = markup;
    container.insertAdjacentHTML("beforeend", markup)
    
    if (!lightbox) {
        lightbox = new SimpleLightbox('.gallery-link', { captionsData: "alt", captionDelay: 250 });
    } else {
        lightbox.refresh();
    }
}

export function showNoResultsMessage() {
    iziToast.error({
        title: "Error",
        message: "Sorry, there are no images matching your search query. Please try again!",
        position: "topRight"
    });
}
