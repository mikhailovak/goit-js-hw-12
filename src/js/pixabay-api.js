import axios from "axios";

const API_KEY = "46942599-830cfdf21ab89ebfad31f139e";
const BASE_URL = "https://pixabay.com/api/";

export async function fetchData(query, page = 1) {
    const params = {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        per_page: 15, 
        page,         
    };

    try {
        const response = await axios.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
