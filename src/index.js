import _, { add } from 'lodash';
import 'material-design-icons/iconfont/material-icons.css';

import searchFormTemplate from './templates/search-form.hbs'
import galleryItemsTemplate from './templates/gallery-items.hbs'
import additionalItemsTemplate from './templates/additional-gallery-items.hbs'
import specialItemTemplate from './templates/special-item.hbs';
import './sass/main.scss';


const refs = {
    searchForm: document.querySelector('.search-form-wrapper'),
    gallery: document.querySelector('.gallery'),
};

const searchFormMarkup = searchFormTemplate();
refs.searchForm.innerHTML = searchFormMarkup;

const debouncedOnInput = _.debounce(onInput, 500);

refs.query = document.querySelector('input');
refs.query.addEventListener('input', debouncedOnInput);

refs.button = document.querySelector('.modal-button');
refs.button.disabled = true;

const BASE_URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal';
const API_KEY = '23015734-ca5f063b9797e09c36ee88a0d';

let request = null;
let page = null;

function onInput(event) {
    page = 1;
    request = event.target.value.trim();

    if (request.length === 0) {
        return;
    }
    const url = `${BASE_URL}&q=${request}&page=${page}&per_page=12&key=${API_KEY}`
    return fetch(url)
        .then(response => response.json())
        .then(({ hits }) => {
            const galleryMarkup = galleryItemsTemplate(hits);
            refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup);
            refs.button.disabled = false;
        }
    );
}

refs.button.addEventListener('click', () => {
    page += 1;
    fetch(`${BASE_URL}&q=${request}&page=${page}&per_page=12&key=${API_KEY}`)
        .then(response => response.json())
        .then(({ hits }) => {
            const addGalleryMarkup = hits.map((hit, index) => {
                if (index === 0) {
                return specialItemTemplate(hit);
                }
                return additionalItemsTemplate(hit);
            }).join('');

            // const addGalleryMarkup = galleryItemsTemplate(hits);
            refs.gallery.insertAdjacentHTML('beforeend', addGalleryMarkup);
            
            let element = document.querySelector('.special');

            element.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            });
            element.classList.remove('special');
        }
        )
});

