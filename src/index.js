import 'material-design-icons/iconfont/material-icons.css';
import { error, notice, alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/core/dist/BrightTheme.css';

import searchFormTemplate from './templates/search-form.hbs'
import galleryItemsTemplate from './templates/gallery-items.hbs'
import additionalItemsTemplate from './templates/additional-gallery-items.hbs'
import specialItemTemplate from './templates/special-item.hbs';
import loadMoreButtonTemplate from './templates/load-more-button.hbs';
import scrollButtonTemplate from './templates/scroll-to-top-btn.hbs';
import './sass/main.scss';

defaultModules.set(PNotifyMobile, {});

const refs = {
    searchFormWrapper: document.querySelector('.search-form-wrapper'),
    gallery: document.querySelector('.gallery'),
    loadMoreWrapper: document.querySelector('.load-more-wrapper'),
    scrollBtn: null
};

const searchFormMarkup = searchFormTemplate();
refs.searchFormWrapper.innerHTML = searchFormMarkup;
refs.searchForm = document.getElementById('search-form');
refs.input = document.querySelector('.input');


refs.button = document.querySelector('.submit-button');
refs.searchForm.addEventListener('submit', onSubmit);

const BASE_URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal';
const API_KEY = '23015734-ca5f063b9797e09c36ee88a0d';

let request = null;
let page = null;

function onSubmit(event) {
    event.preventDefault();

    page = 1;
    request = refs.input.value.trim();

    if (request.length === 0) {
        return;
    }
    const url = `${BASE_URL}&q=${request}&page=${page}&per_page=12&key=${API_KEY}`
    return fetch(url)
        .then(response => response.json())
        .then(({ hits, totalHits }) => {
            console.log(hits);
            if (hits.length === 0) {
                error({
                    text: 'No matches found. Try another query!',
                    delay: 1500,
                    hide: true
                })
            }
            if (totalHits > 12) {
                const btnMarkup = loadMoreButtonTemplate();
                refs.loadMoreWrapper.innerHTML = btnMarkup;

                const scrollBtn = scrollButtonTemplate();
                if (refs.scrollBtn === null) {
                    document.body.insertAdjacentHTML('beforeend', scrollBtn);
                    refs.scrollBtn = document.querySelector('.scroll-btn');
                    refs.scrollBtn.addEventListener('click', () => {
                        window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                })
            })
                }
                
            }
            refs.loadMoreBtn = document.querySelector('.modal-button');
            refs.loadMoreBtn?.addEventListener('click', onClick);

            const galleryMarkup = galleryItemsTemplate(hits);
            refs.gallery.insertAdjacentHTML('afterbegin', galleryMarkup);
        
        }
    );
}

function onClick() {
    page += 1;
    fetch(`${BASE_URL}&q=${request}&page=${page}&per_page=12&key=${API_KEY}`)
        .then(response => response.json())
        .then(({ hits }) => {
            if (hits.length === 0) {
                alert({
                    text: 'No more images to load!',
                    delay: 1500,
                    hide: true
                })
            }
            const addGalleryMarkup = hits.map((hit, index) => {
                if (index === 0) {
                return specialItemTemplate(hit);
                }
                return additionalItemsTemplate(hit);
            }).join('');

            refs.gallery.insertAdjacentHTML('beforeend', addGalleryMarkup);
            
            let element = document.querySelector('.special');

            element?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            });
            element?.classList.remove('special');
        }
        )
}
