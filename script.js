:root{
    --bg-base:#1b130d;
    --bg-panel:#241a12;
    --bg-panel-2:#2c2014;
    --saffron:#e0a52e;
    --paprika:#c44536;
    --olive:#7a8450;
    --cream:#f3e9d2;
    --muted:#b7a78c;
    --line:rgba(243,233,210,.14);
    --shadow-lg:0 24px 60px -20px rgba(0,0,0,.65);
    --radius:18px;
  }

  *{box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{
    margin:0;
    background:
      radial-gradient(900px 500px at 85% -10%, rgba(224,165,46,.14), transparent 60%),
      radial-gradient(700px 400px at -10% 20%, rgba(196,69,54,.12), transparent 60%),
      var(--bg-base);
    color:var(--cream);
    font-family:'Tajawal', sans-serif;
    line-height:1.6;
  }
  img{max-width:100%;display:block;}
  button{font-family:inherit;cursor:pointer;}
  :focus-visible{outline:2px solid var(--saffron);outline-offset:3px;border-radius:6px;}
  ::selection{background:var(--saffron);color:var(--bg-base);}

  @media (prefers-reduced-motion: reduce){
    *,*::before,*::after{
      animation-duration:.01ms !important;
      animation-iteration-count:1 !important;
      transition-duration:.01ms !important;
      scroll-behavior:auto !important;
    }
  }

  .wrap{max-width:1180px;margin:0 auto;padding:0 24px;}

  /* ---------- Header ---------- */
  header{
    position:sticky;top:0;z-index:40;
    background:rgba(27,19,13,.86);
    backdrop-filter:blur(10px);
    border-bottom:1px solid var(--line);
  }
  .header-inner{
    display:flex;align-items:center;gap:20px;
    padding:14px 0;
  }
  .logo{
    font-family:'Aref Ruqaa',serif;
    font-size:26px;color:var(--saffron);
    white-space:nowrap;
  }
  .logo small{
    display:block;font-family:'Tajawal';font-size:11px;color:var(--muted);
    font-weight:400;letter-spacing:.5px;
  }
  .search-form{
    flex:1;display:flex;gap:8px;max-width:420px;margin-inline:auto;
  }
  .search-form input{
    flex:1;background:var(--bg-panel-2);border:1px solid var(--line);
    color:var(--cream);border-radius:999px;padding:10px 18px;font-size:14px;
  }
  .search-form input::placeholder{color:var(--muted);}
  .btn-search{
    background:var(--saffron);color:var(--bg-base);border:none;border-radius:999px;
    padding:10px 18px;font-weight:700;font-size:14px;
  }
  .fav-nav-btn{
    background:transparent;border:1px solid var(--line);color:var(--cream);
    border-radius:999px;padding:9px 16px;font-size:13px;font-weight:700;
    display:flex;align-items:center;gap:6px;white-space:nowrap;
  }
  .fav-nav-btn span{color:var(--paprika);}

  /* ---------- Hero ---------- */
  .hero{padding:64px 0 40px;}
  .hero-grid{
    display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center;
  }
  .eyebrow{
    color:var(--saffron);font-weight:800;font-size:13px;letter-spacing:2px;
    margin:0 0 14px;text-transform:uppercase;
  }
  .hero h1{
    font-family:'Aref Ruqaa',serif;font-weight:700;
    font-size:clamp(34px,5vw,54px);line-height:1.25;margin:0 0 18px;
  }
  .hero h1 em{color:var(--saffron);font-style:normal;}
  .hero p{color:var(--muted);font-size:16px;max-width:48ch;margin:0 0 28px;}
  .hero-actions{display:flex;gap:14px;flex-wrap:wrap;}
  .btn-primary,.btn-ghost{
    border-radius:999px;padding:13px 26px;font-size:15px;font-weight:700;border:1px solid transparent;
  }
  .btn-primary{background:var(--paprika);color:var(--cream);}
  .btn-primary:hover{background:#a8392c;}
  .btn-ghost{background:transparent;border-color:var(--line);color:var(--cream);}
  .btn-ghost:hover{border-color:var(--saffron);color:var(--saffron);}

  .spotlight{display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;}
  .plate{
    --size:260px;width:var(--size);height:var(--size);border-radius:50%;position:relative;
    background:conic-gradient(from -45deg, var(--saffron), var(--paprika) 50%, var(--saffron));
    padding:8px;box-shadow:var(--shadow-lg);flex-shrink:0;
  }
  .plate::after{
    content:"";position:absolute;inset:16px;border-radius:50%;
    border:2px dashed rgba(27,19,13,.4);pointer-events:none;
  }
  .plate img{
    width:100%;height:100%;object-fit:cover;border-radius:50%;
    background:var(--bg-base);padding:6px;box-sizing:border-box;
  }
  .spotlight-name{font-family:'Fraunces',serif;font-style:italic;font-size:22px;}
  .spotlight-tags{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;}
  .tag{
    background:var(--bg-panel-2);border:1px solid var(--line);color:var(--muted);
    font-size:12px;padding:5px 12px;border-radius:999px;
  }
  .spotlight-skel{width:var(--size,260px);height:260px;border-radius:50%;background:var(--bg-panel-2);}

  @media (prefers-reduced-motion: no-preference){
    .hero-text{animation:rise .7s ease both;}
    .spotlight{animation:rise .7s .12s ease both;}
    @keyframes rise{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
  }

  /* ---------- Categories ---------- */
  #categories{padding:8px 0 28px;}
  .pills{display:flex;gap:10px;overflow-x:auto;padding:4px 2px 14px;scroll-snap-type:x proximity;}
  .pills::-webkit-scrollbar{height:6px;}
  .pills::-webkit-scrollbar-thumb{background:var(--line);border-radius:999px;}
  .pill{
    flex:0 0 auto;scroll-snap-align:start;background:transparent;color:var(--cream);
    border:1px solid var(--line);border-radius:999px;padding:10px 20px;font-size:14px;
    transition:background .15s, color .15s, border-color .15s;
  }
  .pill:hover{border-color:var(--saffron);}
  .pill.active{background:var(--saffron);color:var(--bg-base);border-color:var(--saffron);font-weight:800;}

  /* ---------- Results ---------- */
  .results{padding:8px 0 80px;}
  .results-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:22px;}
  .results-head h2{font-family:'Fraunces',serif;font-weight:600;font-size:24px;margin:0;}
  .results-head span{color:var(--muted);font-size:13px;}

  .grid{
    display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:22px;
  }
  .card{
    background:var(--bg-panel);border:1px solid var(--line);border-radius:var(--radius);
    padding:20px 16px 18px;position:relative;text-align:center;
    transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  }
  .card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:rgba(224,165,46,.4);}
  .heart-btn{
    position:absolute;top:12px;left:12px;background:rgba(27,19,13,.6);border:1px solid var(--line);
    border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;
  }
  .heart-btn svg path{fill:transparent;stroke:var(--cream);stroke-width:1.6;transition:fill .2s,stroke .2s;}
  .heart-btn.is-fav svg path{fill:var(--paprika);stroke:var(--paprika);}
  .card .plate{--size:130px;margin:0 auto 14px;}
  .card-title{font-family:'Fraunces',serif;font-weight:600;font-style:italic;font-size:17px;margin:0 0 8px;direction:ltr;unicode-bidi:isolate;}
  .card-meta{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:14px;min-height:24px;}
  .card-btn{
    width:100%;background:transparent;border:1px solid var(--saffron);color:var(--saffron);
    border-radius:10px;padding:9px;font-size:13px;font-weight:700;
  }
  .card-btn:hover{background:var(--saffron);color:var(--bg-base);}

  .skeleton{background:linear-gradient(100deg,var(--bg-panel) 30%,var(--bg-panel-2) 50%,var(--bg-panel) 70%);background-size:200% 100%;}
  @media (prefers-reduced-motion: no-preference){
    .skeleton{animation:shimmer 1.3s infinite;}
    @keyframes shimmer{from{background-position:200% 0;}to{background-position:-200% 0;}}
  }
  .skel-card{height:268px;border-radius:var(--radius);}

  .empty-state, .error-state{
    text-align:center;padding:60px 20px;color:var(--muted);border:1px dashed var(--line);
    border-radius:var(--radius);grid-column:1/-1;
  }
  .error-state button{margin-top:14px;background:var(--paprika);color:var(--cream);border:none;border-radius:999px;padding:9px 22px;font-weight:700;}

  /* ---------- Modal ---------- */
  .overlay{
    position:fixed;inset:0;background:rgba(10,7,4,.78);backdrop-filter:blur(4px);
    display:none;align-items:flex-start;justify-content:center;padding:5vh 16px;z-index:100;overflow-y:auto;
  }
  .overlay.open{display:flex;}
  .modal{
    background:var(--bg-panel);border:1px solid var(--line);border-radius:20px;max-width:760px;width:100%;
    padding:28px;position:relative;
  }
  @media (prefers-reduced-motion: no-preference){
    .overlay.open .modal{animation:pop .25s ease both;}
    @keyframes pop{from{opacity:0;transform:scale(.96) translateY(8px);}to{opacity:1;transform:scale(1) translateY(0);}}
  }
  .modal-close{
    position:absolute;top:18px;left:18px;background:var(--bg-panel-2);border:1px solid var(--line);
    border-radius:50%;width:36px;height:36px;color:var(--cream);font-size:18px;line-height:1;
  }
  .modal-head{display:flex;gap:20px;align-items:center;margin-bottom:22px;flex-wrap:wrap;}
  .modal-head img{width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid var(--saffron);}
  .modal-head h3{font-family:'Fraunces',serif;font-style:italic;font-size:24px;margin:0 0 8px;direction:ltr;unicode-bidi:isolate;text-align:right;}
  .modal-body{display:grid;grid-template-columns:1fr 1.3fr;gap:28px;}
  .modal-body h4{font-size:14px;color:var(--saffron);margin:0 0 12px;}
  .ingredients{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;}
  .ingredients li{
    background:var(--bg-panel-2);border:1px solid var(--line);border-radius:10px;
    padding:8px 12px;font-size:13.5px;display:flex;justify-content:space-between;gap:10px;
  }
  .ingredients li b{color:var(--cream);}
  .ingredients li span{color:var(--muted);direction:ltr;}
  .instructions{font-size:14px;color:var(--cream);white-space:pre-line;}
  .instructions-tag{display:inline-block;font-size:10px;background:var(--bg-panel-2);color:var(--muted);
    border:1px solid var(--line);border-radius:5px;padding:2px 6px;margin-inline-start:6px;vertical-align:middle;}
  .yt-link{
    display:inline-flex;align-items:center;gap:8px;margin-top:18px;background:var(--olive);color:var(--cream);
    border-radius:999px;padding:9px 18px;font-size:13px;font-weight:700;text-decoration:none;
  }

  /* ---------- Footer ---------- */
  footer{border-top:1px solid var(--line);padding:26px 0;text-align:center;color:var(--muted);font-size:13px;}
  footer a{color:var(--saffron);text-decoration:none;}

  @media (max-width:880px){
    .hero-grid{grid-template-columns:1fr;text-align:center;}
    .hero p{margin-inline:auto;}
    .hero-actions{justify-content:center;}
    .modal-body{grid-template-columns:1fr;}
    .search-form{display:none;}
  }
  @media (max-width:520px){
    .header-inner{flex-wrap:wrap;}
    .modal-head{flex-direction:column;text-align:center;}
    .modal-head h3{text-align:center;}
}
