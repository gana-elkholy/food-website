(function(){
  "use strict";

  const API = "https://www.themealdb.com/api/json/v1/1/";

  const CAT_AR = {
    Beef:"لحم بقري", Chicken:"دجاج", Dessert:"حلويات", Lamb:"لحم ضأن",
    Miscellaneous:"أطباق متنوعة", Pasta:"باستا", Pork:"لحم خنزير",
    Seafood:"مأكولات بحرية", Side:"طبق جانبي", Starter:"مقبلات",
    Vegan:"نباتي صرف", Vegetarian:"نباتي", Breakfast:"إفطار", Goat:"لحم ماعز"
  };

  const PILLS = [
    {key:"all", ar:"الكل"},
    {key:"Chicken", ar:"دجاج"},
    {key:"Beef", ar:"لحم بقري"},
    {key:"Seafood", ar:"مأكولات بحرية"},
    {key:"Vegetarian", ar:"نباتي"},
    {key:"Vegan", ar:"نباتي صرف"},
    {key:"Dessert", ar:"حلويات"},
    {key:"Pasta", ar:"باستا"},
    {key:"Breakfast", ar:"إفطار"},
    {key:"Starter", ar:"مقبلات"}
  ];

  const grid = document.getElementById("grid");
  const resultsTitle = document.getElementById("resultsTitle");
  const resultsSub = document.getElementById("resultsSub");
  const pillsBar = document.getElementById("pills");
  const spotlight = document.getElementById("spotlight");
  const overlay = document.getElementById("overlay");
  const modalContent = document.getElementById("modalContent");
  const favCountEl = document.getElementById("favCount");

  let mealCache = {};   // id -> {meal data..., isFull:boolean}
  let favorites = {};   // id -> {idMeal, strMeal, strMealThumb}
  let lastFocused = null;
  let activeKey = "all";

  function escapeHtml(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
    }[c]));
  }
  function arCat(name){ return CAT_AR[name] || name || ""; }

  async function fetchJSON(url){
    const res = await fetch(url);
    if(!res.ok) throw new Error("network");
    return res.json();
  }

  /* ---------------- Favorites (persistent storage) ---------------- */
  async function loadFavorites(){
    try{
      const r = await window.storage.get("favorites", false);
      favorites = r && r.value ? JSON.parse(r.value) : {};
    }catch(e){
      favorites = {};
    }
    updateFavCount();
  }
  async function saveFavorites(){
    try{
      await window.storage.set("favorites", JSON.stringify(favorites), false);
    }catch(e){ /* non-fatal: favorites just won't persist this session */ }
  }
  function updateFavCount(){
    favCountEl.textContent = Object.keys(favorites).length;
  }
  function isFav(id){ return !!favorites[id]; }
  async function toggleFavorite(meal, btn){
    if(favorites[meal.idMeal]){
      delete favorites[meal.idMeal];
      btn.classList.remove("is-fav");
      btn.setAttribute("aria-pressed","false");
    } else {
      favorites[meal.idMeal] = {idMeal:meal.idMeal, strMeal:meal.strMeal, strMealThumb:meal.strMealThumb};
      btn.classList.add("is-fav");
      btn.setAttribute("aria-pressed","true");
    }
    updateFavCount();
    await saveFavorites();
  }

  /* ---------------- Rendering ---------------- */
  function skeletonGrid(n){
    grid.innerHTML = Array.from({length:n}).map(() =>
      `<div class="skeleton skel-card"></div>`
    ).join("");
  }

  function errorState(retryFn){
    grid.innerHTML = `<div class="error-state">
      <p>تعذّر تحميل البيانات، تحقق من الاتصال وحاول مرة أخرى.</p>
      <button id="retryBtn">إعادة المحاولة</button>
    </div>`;
    document.getElementById("retryBtn").addEventListener("click", retryFn);
  }

  function emptyState(msg){
    grid.innerHTML = `<div class="empty-state">${escapeHtml(msg)}</div>`;
  }

  function cardHtml(meal){
    const id = meal.idMeal;
    const fav = isFav(id);
    const metaBits = [];
    if(meal.strCategory) metaBits.push(`<span class="tag">${escapeHtml(arCat(meal.strCategory))}</span>`);
    if(meal.strArea) metaBits.push(`<span class="tag">${escapeHtml(meal.strArea)}</span>`);
    return `
      <div class="card" data-id="${id}">
        <button class="heart-btn ${fav?'is-fav':''}" data-id="${id}" aria-pressed="${fav}" aria-label="إضافة إلى المفضلة">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M12 21s-7.5-4.6-10-9.3C.5 8.1 2.3 4.5 6 4c2.2-.3 4 .9 6 3 2-2.1 3.8-3.3 6-3 3.7.5 5.5 4.1 4 7.7C19.5 16.4 12 21 12 21z"/>
          </svg>
        </button>
        <div class="plate"><img src="${meal.strMealThumb}" alt="${escapeHtml(meal.strMeal)}" loading="lazy"></div>
        <h3 class="card-title">${escapeHtml(meal.strMeal)}</h3>
        <div class="card-meta">${metaBits.join("")}</div>
        <button class="card-btn" data-id="${id}">عرض الوصفة</button>
      </div>`;
  }

  function renderGrid(meals){
    if(!meals || !meals.length){
      emptyState("لا توجد أطباق لعرضها هنا حتى الآن.");
      return;
    }
    grid.innerHTML = meals.map(cardHtml).join("");
  }

  /* ---------------- Data loaders ---------------- */
  async function loadAll(){
    activeKey = "all";
    setActivePill("all");
    resultsTitle.textContent = "أطباق مقترحة";
    resultsSub.textContent = "";
    skeletonGrid(8);
    try{
      const data = await fetchJSON(API + "search.php?f=a");
      const meals = (data.meals || []).slice(0, 12);
      meals.forEach(m => mealCache[m.idMeal] = {...m, isFull:true});
      renderGrid(meals);
    }catch(e){
      errorState(loadAll);
    }
  }

  async function loadCategory(catKey, catLabel){
    activeKey = catKey;
    setActivePill(catKey);
    resultsTitle.textContent = "فئة: " + catLabel;
    resultsSub.textContent = "";
    skeletonGrid(8);
    try{
      const data = await fetchJSON(API + "filter.php?c=" + encodeURIComponent(catKey));
      const meals = (data.meals || []).slice(0, 12).map(m => ({...m, strCategory: catKey}));
      meals.forEach(m => {
        if(!mealCache[m.idMeal]) mealCache[m.idMeal] = {...m, isFull:false};
      });
      renderGrid(meals);
    }catch(e){
      errorState(() => loadCategory(catKey, catLabel));
    }
  }

  async function doSearch(term){
    activeKey = "search";
    setActivePill(null);
    resultsTitle.textContent = "نتائج البحث عن: " + escapeHtml(term);
    resultsSub.textContent = "";
    skeletonGrid(6);
    try{
      const data = await fetchJSON(API + "search.php?s=" + encodeURIComponent(term));
      const meals = data.meals || [];
      meals.forEach(m => mealCache[m.idMeal] = {...m, isFull:true});
      if(!meals.length){ emptyState(`لم نجد أطباقًا مطابقة لـ "${term}". جرّب كلمة أخرى.`); return; }
      renderGrid(meals);
    }catch(e){
      errorState(() => doSearch(term));
    }
  }

  function showFavorites(){
    activeKey = "favorites";
    setActivePill(null);
    resultsTitle.textContent = "أطباقك المفضلة";
    resultsSub.textContent = "";
    const list = Object.values(favorites);
    if(!list.length){
      emptyState("لم تُضِف أي طبق إلى المفضلة بعد — اضغط على ♡ في أي بطاقة لحفظها هنا.");
      return;
    }
    renderGrid(list);
  }

  async function fetchRandomSpotlight(){
    spotlight.innerHTML = `<div class="spotlight-skel skeleton"></div>`;
    try{
      const data = await fetchJSON(API + "random.php");
      const meal = data.meals[0];
      mealCache[meal.idMeal] = {...meal, isFull:true};
      spotlight.innerHTML = `
        <div class="plate"><img src="${meal.strMealThumb}" alt="${escapeHtml(meal.strMeal)}"></div>
        <div class="spotlight-name">${escapeHtml(meal.strMeal)}</div>
        <div class="spotlight-tags">
          <span class="tag">${escapeHtml(arCat(meal.strCategory))}</span>
          <span class="tag">${escapeHtml(meal.strArea)}</span>
        </div>
        <button class="btn-ghost" id="spotlightRecipeBtn" data-id="${meal.idMeal}">عرض الوصفة الكاملة</button>`;
      document.getElementById("spotlightRecipeBtn").addEventListener("click", () => openMealModal(meal.idMeal));
    }catch(e){
      spotlight.innerHTML = `<div class="empty-state" style="padding:20px;">تعذّر تحميل طبق اليوم.</div>`;
    }
  }

  /* ---------------- Modal ---------------- */
  function ingredientRows(meal){
    const rows = [];
    for(let i=1;i<=20;i++){
      const ing = meal["strIngredient"+i];
      const meas = meal["strMeasure"+i];
      if(ing && ing.trim()){
        rows.push(`<li><b>${escapeHtml(ing.trim())}</b><span>${escapeHtml((meas||"").trim())}</span></li>`);
      }
    }
    return rows.join("");
  }

  async function openMealModal(id){
    lastFocused = document.activeElement;
    overlay.classList.add("open");
    modalContent.innerHTML = `<p style="text-align:center;padding:40px 0;color:var(--muted);">جاري تحميل الوصفة…</p>`;
    document.getElementById("modalClose").focus();

    let meal = mealCache[id];
    if(!meal || !meal.isFull){
      try{
        const data = await fetchJSON(API + "lookup.php?i=" + encodeURIComponent(id));
        meal = {...data.meals[0], isFull:true};
        mealCache[id] = meal;
      }catch(e){
        modalContent.innerHTML = `<div class="error-state" style="border:none;">تعذّر تحميل تفاصيل الوصفة.</div>`;
        return;
      }
    }

    const ytBtn = meal.strYoutube
      ? `<a class="yt-link" href="${meal.strYoutube}" target="_blank" rel="noopener">▶ فيديو الطريقة</a>`
      : "";

    modalContent.innerHTML = `
      <div class="modal-head">
        <img src="${meal.strMealThumb}" alt="${escapeHtml(meal.strMeal)}">
        <div>
          <h3 id="modalTitle">${escapeHtml(meal.strMeal)}</h3>
          <div class="spotlight-tags" style="justify-content:flex-start;">
            <span class="tag">${escapeHtml(arCat(meal.strCategory))}</span>
            <span class="tag">${escapeHtml(meal.strArea)}</span>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div>
          <h4>المقادير</h4>
          <ul class="ingredients">${ingredientRows(meal)}</ul>
        </div>
        <div>
          <h4>طريقة التحضير <span class="instructions-tag">EN</span></h4>
          <p class="instructions">${escapeHtml(meal.strInstructions)}</p>
          ${ytBtn}
        </div>
      </div>`;
  }

  function closeModal(){
    overlay.classList.remove("open");
    modalContent.innerHTML = "";
    if(lastFocused) lastFocused.focus();
  }

  /* ---------------- Pills ---------------- */
  function setActivePill(key){
    document.querySelectorAll(".pill").forEach(p => {
      p.classList.toggle("active", p.dataset.key === key);
    });
  }

  function buildPills(){
    pillsBar.innerHTML = PILLS.map(p =>
      `<button class="pill" data-key="${p.key}">${escapeHtml(p.ar)}</button>`
    ).join("") + `<button class="pill" data-key="favorites">❤ المفضلة</button>`;

    pillsBar.addEventListener("click", e => {
      const btn = e.target.closest(".pill");
      if(!btn) return;
      const key = btn.dataset.key;
      if(key === "all") loadAll();
      else if(key === "favorites") showFavorites();
      else loadCategory(key, CAT_AR[key] || key);
    });
  }

  /* ---------------- Events ---------------- */
  grid.addEventListener("click", e => {
    const heart = e.target.closest(".heart-btn");
    const view = e.target.closest(".card-btn");
    if(heart){
      const id = heart.dataset.id;
      const meal = mealCache[id] || favorites[id];
      if(meal) toggleFavorite(meal, heart);
      return;
    }
    if(view){
      openMealModal(view.dataset.id);
    }
  });

  document.getElementById("searchForm").addEventListener("submit", e => {
    e.preventDefault();
    const term = document.getElementById("searchInput").value.trim();
    if(term) doSearch(term);
  });

  document.getElementById("favNavBtn").addEventListener("click", showFavorites);
  document.getElementById("surpriseBtn").addEventListener("click", fetchRandomSpotlight);
  document.getElementById("browseBtn").addEventListener("click", () => {
    document.getElementById("categories").scrollIntoView({behavior:"smooth", block:"start"});
  });

  document.getElementById("modalClose").addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if(e.target === overlay) closeModal(); });
  document.addEventListener("keydown", e => { if(e.key === "Escape" && overlay.classList.contains("open")) closeModal(); });

  /* ---------------- Init ---------------- */
  buildPills();
  loadFavorites().then(() => {
    loadAll();
    fetchRandomSpotlight();
  });
})();
