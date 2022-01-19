// Unsplash API
const count = 20;
const API_KEY = 'u44XwGNny8w8s7SjnT_aDXfEQGGxQy0dWW4jFiFjdB8';
const API_URL = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&count=${count}`;

const state = {
  photosArray: [],
  ready: false,
  imagesLoaded: 0,
  totalImages: 0,
};

const imageContainer = document.querySelector('#image-container');
const loader = document.querySelector('#loader');

// Helper Functions
const setAttributes = (element, attributes) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

const showLoadingIcon = () => {
  loader.hidden = false;
};

const hideLoadingIcon = () => {
  loader.hidden = true;
};

const imageLoaded = () => {
  state.imagesLoaded++;
  console.log(state.imagesLoaded, state.totalImages);
  if (state.imagesLoaded === state.totalImages) {
    state.ready = true;
    hideLoadingIcon();
  }
};

const resetState = (newData) => {
  state.photosArray = newData;
  state.totalImages = newData.length;
  state.imagesLoaded = 0;
  state.ready = false;
};

// End Helper functions

const buildImageElement = (photoData) => {
  const anchorWrapper = document.createElement('a');
  setAttributes(anchorWrapper, {
    href: photoData.links.html,
    target: '_blank',
  });

  const img = document.createElement('img');
  setAttributes(img, {
    src: photoData.urls.regular,
    alt: photoData.alt_description,
    title: photoData.alt_description,
  });

  img.addEventListener('load', imageLoaded);

  anchorWrapper.appendChild(img);

  return anchorWrapper;
};

const displayPhotosToDOM = () => {
  state.photosArray.forEach((photo) => {
    const imageElement = buildImageElement(photo);
    imageContainer.appendChild(imageElement);
  });
};

const fetchPhotosFromAPI = () => {
  showLoadingIcon();
  fetch(API_URL)
    .then((resp) => resp.json())
    .then((data) => {
      resetState(data);
      displayPhotosToDOM();
    })
    .catch((err) => console.log(err));
};

window.addEventListener('scroll', (_e) => {
  const usersDistanceFromPageTop = window.scrollY;
  const totalHeightOfEntirePage = document.body.offsetHeight;

  const portionOfPageUnseen =
    (totalHeightOfEntirePage - usersDistanceFromPageTop) /
    totalHeightOfEntirePage;
  if (portionOfPageUnseen <= 0.2 && state.ready) {
    console.log('one third to the bottom');
    fetchPhotosFromAPI();
  }
});

window.addEventListener('load', fetchPhotosFromAPI);
