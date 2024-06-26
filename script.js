'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const deleteworkout = document.querySelector('.delete');
const deleteAllworkouts = document.querySelector('.trash');

let map, mapEvent;

class workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April',
       'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min / km
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);

// ////////////////////////////////
// APPLICATION ARCHTECTURE

class App {
  #map;
  #mapZoomLevel = 16;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();
    this._getLocalStorage();
    this._deleteWorkout();

    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    form.addEventListener('submit', this._newWorkout.bind(this));
    deleteAllworkouts.addEventListener('click', this._deleteAllworkouts);
    deleteAllworkouts.addEventListener('click', this._deleteAllworkouts);
    document
      .querySelector('.delete')
      .addEventListener('click', this._deleteWorkout.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      // this._loadMap, will be treated as regular function
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert(`can't get your position`);
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(
      `https://www.google.com/maps/@${latitude},${longitude},11z?entry=ttu`
    );

    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    console.log(this.#map);
    console.log(coords);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // handling click on the map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutmarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
    console.log(mapE);
  }

  _hideForm() {
    // hide form + clean input feilds

    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  // _toggleElevationFeild() {
  // this is changing the steps of the casidence into metter or step, if it's
  //  running the cadence is gonna be step else it gonna be metter

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    // check if data is valid
    // helper functions
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    // get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // if workout running, create running object

    if (type === 'running') {
      const cadence = +inputCadence.value;
      // if we did this at the outside it gonna be
      // also to check the elevation, only one can't be defined at same time
      // the cadence and the elevation
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('inputs has to be a possitive number');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // if workout cycling, create cycling object

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return 'inputs has to be a possitive number';

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    // add new object to workout array
    this.#workouts.push(workout);
    console.log(workout);

    // render workout on the map as a marker
    this._renderWorkoutmarker(workout);

    // render workout on the lsit
    this._renderWorkout(workout);

    // Hide form + clear input fields
    this._hideForm();

    // using public interface
    // workout.click();

    // toggle input
    this._toggleElevationField();

    // set local storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkoutmarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴'}${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
          <div class="workout__title"><h2>${workout.description}</h2>
          <h2 class="delete" data-id="${workout.id}">X</h2>
          </div>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

    if (workout.type === 'running')
      html += ` <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>`;

    if (workout.type === 'cycling')
      html += `<div class="workout__details">
           <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      `;

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl);

    if (!workoutEl) return;
    // on the booK
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    console.log(workout);

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  /*
_newWorkout(e) {
    e.preventDefault();

    // check if data is valid
    // helper functions
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    // get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // if workout running, create running object

    if (type === 'running') {
      const cadence = +inputCadence.value;
      // deleteAllworkouts.style.display = 'flex';
      // if we did this at the outside it gonna be
      // also to check the elevation, only one can't be defined at same time
      // the cadence and the elevation
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        validInputs(distance, duration, cadence) ||
        allPositive(distance, duration, cadence)
      ) {
        deleteAllworkouts.style.display = 'flex';
        workout = new Running([lat, lng], distance, duration, cadence);
        // add new object to workout array
        this.#workouts.push(workout);
        console.log(workout);
        return;
      } else {
        return alert('inputs has to be a possitive number');
      }
    }

    // if workout cycling, create cycling object

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      // deleteAllworkouts.style.display = 'flex';
      if (
        validInputs(distance, duration, elevation) ||
        allPositive(distance, duration)
      ) {
        workout = new Cycling([lat, lng], distance, duration, elevation);
        deleteAllworkouts.style.display = 'flex';
        // add new object to workout array
        this.#workouts.push(workout);
        console.log(workout);
        return;
      } else {
        return alert('inputs has to be a possitive number');
      }
    }

*/

  _deleteAllworkouts(e) {
    localStorage.removeItem('workouts');
    location.reload();
  }

  _deleteWorkout(e) {
    // const buuf = this.#workouts.id;
    // localStorage.removeItem(buuf);
    console.log(e);
  }

  //
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    console.log();
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;
    this.#workouts = data;

    console.log(data);
    data.forEach(work => {
      this._renderWorkout(work);
    });
  }
}

const app = new App();
console.log(app);
console.log('soy naruto');
