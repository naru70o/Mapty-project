[1mdiff --git a/index.html b/index.html[m
[1mindex 3c94089..03575b3 100644[m
[1m--- a/index.html[m
[1m+++ b/index.html[m
[36m@@ -29,23 +29,8 @@[m
   </head>[m
   <body>[m
     <div class="sidebar">[m
[31m-      <div class="trash">[m
[31m-        <svg[m
[31m-          xmlns="http://www.w3.org/2000/svg"[m
[31m-          fill="none"[m
[31m-          viewBox="0 0 24 24"[m
[31m-          stroke-width="1.5"[m
[31m-          stroke="currentColor"[m
[31m-          class="trash"[m
[31m-        >[m
[31m-          <path[m
[31m-            stroke-linecap="round"[m
[31m-            stroke-linejoin="round"[m
[31m-            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"[m
[31m-          />[m
[31m-        </svg>[m
[31m-      </div>[m
       <img src="logo.png" alt="Logo" class="logo" />[m
[32m+[m
       <ul class="workouts">[m
         <form class="form hidden">[m
           <div class="form__row">[m
[36m@@ -85,10 +70,6 @@[m
 [m
         <!-- <li class="workout workout--running" data-id="1234567890">[m
           <h2 class="workout__title">Running on April 14</h2>[m
[31m-          <div><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">[m
[31m-  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />[m
[31m-</svg>[m
[31m-</div>[m
           <div class="workout__details">[m
             <span class="workout__icon">🏃‍♂️</span>[m
             <span class="workout__value">5.2</span>[m
[1mdiff --git a/script.js b/script.js[m
[1mindex e40b423..3b6799d 100644[m
[1m--- a/script.js[m
[1m+++ b/script.js[m
[36m@@ -7,8 +7,6 @@[m [mconst inputDistance = document.querySelector('.form__input--distance');[m
 const inputDuration = document.querySelector('.form__input--duration');[m
 const inputCadence = document.querySelector('.form__input--cadence');[m
 const inputElevation = document.querySelector('.form__input--elevation');[m
[31m-const deleteworkout = document.querySelector('.delete');[m
[31m-const deleteAllworkouts = document.querySelector('.trash');[m
 [m
 let map, mapEvent;[m
 [m
[36m@@ -84,16 +82,10 @@[m [mclass App {[m
   constructor() {[m
     this._getPosition();[m
     this._getLocalStorage();[m
[31m-    this._deleteWorkout();[m
 [m
     containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));[m
     inputType.addEventListener('change', this._toggleElevationField);[m
     form.addEventListener('submit', this._newWorkout.bind(this));[m
[31m-    deleteAllworkouts.addEventListener('click', this._deleteAllworkouts);[m
[31m-    deleteAllworkouts.addEventListener('click', this._deleteAllworkouts);[m
[31m-    document[m
[31m-      .querySelector('.delete')[m
[31m-      .addEventListener('click', this._deleteWorkout.bind(this));[m
   }[m
 [m
   _getPosition() {[m
[36m@@ -226,7 +218,7 @@[m [mclass App {[m
     // workout.click();[m
 [m
     // toggle input[m
[31m-    this._toggleElevationField();[m
[32m+[m[32m    this._toggleElevationFeild();[m
 [m
     // set local storage to all workouts[m
     this._setLocalStorage();[m
[36m@@ -254,9 +246,7 @@[m [mclass App {[m
     let html = `<li class="workout workout--${workout.type}" data-id="${[m
       workout.id[m
     }">[m
[31m-          <div class="workout__title"><h2>${workout.description}</h2>[m
[31m-          <h2 class="delete" data-id="${workout.id}">X</h2>[m
[31m-          </div>[m
[32m+[m[32m          <h2 class="workout__title">${workout.description}</h2>[m
           <div class="workout__details">[m
             <span class="workout__icon">${[m
               workout.type === 'running' ? '🏃‍♂️' : '🚴'[m
[36m@@ -318,36 +308,30 @@[m [mclass App {[m
     });[m
   }[m
 [m
[31m-  _deleteAllworkouts(e) {[m
[31m-    localStorage.removeItem('workouts');[m
[31m-    location.reload();[m
[31m-  }[m
[31m-[m
[31m-  _deleteWorkout(e) {[m
[31m-    // const buuf = this.#workouts.id;[m
[31m-    // localStorage.removeItem(buuf);[m
[31m-    console.log(e);[m
[31m-  }[m
[31m-[m
   //[m
   _setLocalStorage() {[m
     localStorage.setItem('workouts', JSON.stringify(this.#workouts));[m
[31m-    console.log();[m
   }[m
 [m
[32m+[m[32m  //[m
   _getLocalStorage() {[m
     const data = JSON.parse(localStorage.getItem('workouts'));[m
[32m+[m[32m    console.log(data);[m
 [m
     if (!data) return;[m
     this.#workouts = data;[m
 [m
[31m-    console.log(data);[m
[31m-    data.forEach(work => {[m
[32m+[m[32m    this.#workouts.forEach(work => {[m
       this._renderWorkout(work);[m
     });[m
   }[m
[32m+[m
[32m+[m[32m  _reset() {[m
[32m+[m[32m    localStorage.removeItem('workouts');[m
[32m+[m[32m    location.reload();[m
[32m+[m[32m  }[m
 }[m
 [m
 const app = new App();[m
 console.log(app);[m
[31m-console.log('soy naruto');[m
[32m+[m[32m// app._getPosition();[m
[1mdiff --git a/style.css b/style.css[m
[1mindex e7b9e24..5388f64 100644[m
[1m--- a/style.css[m
[1m+++ b/style.css[m
[36m@@ -55,37 +55,6 @@[m [ma:visited {[m
   margin-bottom: 4rem;[m
 }[m
 [m
[31m-.trash {[m
[31m-  height: 2.8rem;[m
[31m-  width: auto;[m
[31m-  display: flex;[m
[31m-  align-self: flex-end;[m
[31m-  opacity: 0.5;[m
[31m-  /* align-self: ; */[m
[31m-}[m
[31m-[m
[31m-/* [m
[31m-deleteAllworkouts.addEventListener('click', this._deleteAllworkouts);[m
[31m-    document[m
[31m-      .querySelector('.delete')[m
[31m-      .addEventListener('click', this._deleteWorkout.bind(this)); */[m
[31m-[m
[31m-.trash:hover {[m
[31m-  opacity: 1;[m
[31m-  transition: 1s;[m
[31m-  cursor: pointer;[m
[31m-}[m
[31m-[m
[31m-.delete {[m
[31m-  font-style: bold;[m
[31m-  opacity: 0.5;[m
[31m-}[m
[31m-[m
[31m-.delete:hover {[m
[31m-  opacity: 1;[m
[31m-  transition: 1s;[m
[31m-}[m
[31m-[m
 .workouts {[m
   list-style: none;[m
   height: 77vh;[m
[36m@@ -119,13 +88,6 @@[m [mdeleteAllworkouts.addEventListener('click', this._deleteAllworkouts);[m
   font-size: 1.7rem;[m
   font-weight: 600;[m
   grid-column: 1 / -1;[m
[31m-  display: flex;[m
[31m-  flex-direction: row;[m
[31m-  justify-content: space-between;[m
[31m-}[m
[31m-[m
[31m-h2 {[m
[31m-  font-size: 1.7rem;[m
 }[m
 [m
 .workout__details {[m
