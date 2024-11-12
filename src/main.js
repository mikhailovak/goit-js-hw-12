import { fetchData } from './js/pixabay-api.js';
import { renderImages, showNoResultsMessage } from './js/render-functions.js';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".submit-form");
const list = document.querySelector(".list");
const loadMoreButton = document.querySelector(".load-more");
const loader = document.getElementById("loader");

form.addEventListener("submit", handleSearch);
loadMoreButton.addEventListener("click", handleLoadMore);

let page = 1;
let currentQuery = "";
let totalPages = 0; 



function toggleVisibility(element, show) {
    element.style.display = show ? "block" : "none";
}

function showLoader() {
    toggleVisibility(loader, true);
}

function hideLoader() {
    toggleVisibility(loader, false);
}

function clearGallery() {
    list.innerHTML = "";
}

async function handleSearch(event) {
    event.preventDefault();
    const query = event.currentTarget.elements.searchQuery.value.trim();

    if (query !== currentQuery) {
        currentQuery = query;
        page = 1;
        clearGallery();
        toggleVisibility(loadMoreButton, false);
    }

    if (query === "") {
        iziToast.warning({
            title: "Warning",
            message: "Please enter a search query!",
            position: "topRight"
        });
        return;
    }

    showLoader();

    try {
        const data = await fetchData(query, page);
        hideLoader();

        if (data.hits.length === 0) {
            clearGallery();
            showNoResultsMessage();
            toggleVisibility(loadMoreButton, false);
        } else {
            renderImages(data.hits, list);
            totalPages = Math.ceil(data.totalHits / 15); 
            page += 1;

            toggleVisibility(loadMoreButton, page <= totalPages);
        }
    } catch (error) {
        hideLoader();
        console.error("Error:", error);
        iziToast.error({
            title: "Error",
            message: "Something went wrong. Please try again later.",
            position: "topRight"
        });
    }
}

async function handleLoadMore() {
    showLoader();

    try {
        const data = await fetchData(currentQuery, page);
        hideLoader();

        if (data.hits.length > 0) {
            renderImages(data.hits, list);
            page += 1;

            const listItem = document.querySelector('.image-item');
            if (listItem) {
                const cardHeight = listItem.getBoundingClientRect().height;

                window.scrollBy({
                    top: cardHeight * 2,
                    behavior: 'smooth'
                });
            }

            const totalPages = Math.ceil(data.totalHits / 15);
            if (page > totalPages) {
                toggleVisibility(loadMoreButton, false);
                iziToast.info({
                    title: "Info",
                    message: "We're sorry, but you've reached the end of search results.",
                    position: "topRight"
                });
            }
        } else {
            toggleVisibility(loadMoreButton, false);
            iziToast.info({
                title: "Info",
                message: "No more images to load.",
                position: "topRight"
            });
        }
    } catch (error) {
        hideLoader();
        console.error("Error:", error);
        iziToast.error({
            title: "Error",
            message: "Something went wrong. Please try again later.",
            position: "topRight"
        });
    }
}
