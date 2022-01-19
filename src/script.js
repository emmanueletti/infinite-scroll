const state = {
  photosArray: [],
  ready: false,
  imagesLoaded: 0,
  totalImages: 0,
  initialLoadComplete: false,
  // First download 5 images for fast performance, then change the count
  // to a higher value after initial load
  count: this.initialLoadComplete ? 20 : 5,
};

const API_KEY = 'u44XwGNny8w8s7SjnT_aDXfEQGGxQy0dWW4jFiFjdB8';
const API_URL = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&count=${state.count}`;

const imageContainer = document.querySelector('#image-container');
const loader = document.querySelector('#loader');

// Helper Functions
const setAttributes = (element, attributes) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

const hideLoadingIcon = () => {
  loader.hidden = true;
};

const imageLoaded = () => {
  state.initialLoadComplete = true;
  state.imagesLoaded++;
  if (state.imagesLoaded === state.totalImages) {
    state.ready = true;
    hideLoadingIcon();
  }
};

const resetState = (newData) => {
  state = {
    ...state,
    photosArray: newData,
    totalImages: newData.length,
    imageLoaded: 0,
    ready: false,
  };
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
    fetchPhotosFromAPI();
  }
});

window.addEventListener('load', fetchPhotosFromAPI);
