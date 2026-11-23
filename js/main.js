/* Menu responsivo e destaque do link da seção atual */
(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const toggle = header && header.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  /* ---------- Menu hambúrguer ---------- */
  if (header && toggle && nav) {
    const desktop = window.matchMedia("(min-width: 60rem)");

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      nav.classList.toggle("is-open", open);
    };

    const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

    toggle.addEventListener("click", () => setOpen(!isOpen()));

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("click", (event) => {
      if (isOpen() && !header.contains(event.target)) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    header.addEventListener("focusout", (event) => {
      if (isOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
    });

    desktop.addEventListener("change", (event) => {
      if (event.matches) setOpen(false);
    });
  }

  /* ---------- Link ativo conforme a seção visível ---------- */
  const links = nav
    ? Array.from(nav.querySelectorAll('a[href^="#"]')).filter((a) => !a.classList.contains("btn"))
    : [];
  const sections = Array.from(document.querySelectorAll("main > section[id]"));

  if (links.length && sections.length && "IntersectionObserver" in window) {
    const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.removeAttribute("aria-current"));
          const current = byId.get(entry.target.id);
          if (current) current.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }
})();

/* ---------- Configurador de briefing: prévia, cópia e e-mail ---------- */
(() => {
  "use strict";
  const form = document.getElementById("builder-form");
  const output = document.getElementById("brief-output");
  const copyButton = document.getElementById("copy-brief");
  const emailLink = document.getElementById("email-brief");
  const status = document.getElementById("builder-status");
  if (!form || !output || !copyButton || !emailLink || !status) return;

  const value = (name) => form.elements.namedItem(name)?.value.trim() || "Não informado";
  const selectedSections = () => Array.from(form.querySelectorAll('input[name="sections"]:checked')).map((item) => item.value);
  const makeBrief = () => {
    const sections = selectedSections();
    return [
      "BRIEFING INICIAL — PROJETO DE SITE",
      `Tipo de site: ${value("site-type")}`,
      `Estilo: ${value("site-style")}`,
      `Preferência de cores: ${value("site-color")}`,
      `Seções: ${sections.length ? sections.join(", ") : "A definir"}`,
      `Detalhes: ${value("site-notes")}`
    ].join("\n");
  };
  const render = () => {
    const sections = selectedSections();
    const rows = [
      ["Tipo", value("site-type")], ["Estilo", value("site-style")],
      ["Cores", value("site-color")], ["Seções", sections.length ? sections.join(", ") : "A definir"],
      ["Detalhes", value("site-notes")]
    ];
    output.replaceChildren(...rows.map(([label, content]) => {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      p.append(strong, document.createTextNode(content));
      return p;
    }));
    emailLink.href = `mailto:felipeffsm@gmail.com?subject=${encodeURIComponent("Briefing de projeto de site")}&body=${encodeURIComponent(makeBrief())}`;
  };
  form.addEventListener("input", render);
  form.addEventListener("change", render);
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(makeBrief());
      status.textContent = "Briefing copiado. Agora é só colar onde preferir.";
    } catch {
      status.textContent = "Não foi possível copiar automaticamente neste navegador. Selecione e copie o resumo da prévia.";
    }
  });
  render();
})();


/* ---------- Contato compatível com GitHub Pages: abre o cliente de e-mail ---------- */
(() => {
  "use strict";
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get("nome") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("mensagem") || "").trim();
      const body = `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`;
      const subject = `Contato pelo portfólio — ${name}`;
      status.textContent = "Abrindo seu aplicativo de e-mail com a mensagem preenchida.";
      window.location.href = `mailto:felipeffsm@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
/* Briefing visual: injeta uma prévia responsiva e atualiza conforme o formulário muda. */
(() => {
  "use strict";

  const form = document.getElementById("builder-form");
  const aside = document.querySelector(".brief-preview");
  const output = document.getElementById("brief-output");
  const colorInput = document.getElementById("site-color");
  if (!form || !aside || !output || !colorInput) return;

  // Separa a paleta selecionada do campo livre para não repetir a escolha no input.
  const customColorInput = colorInput;
  const colorLabel = customColorInput.previousElementSibling;
  customColorInput.id = "site-color-custom";
  customColorInput.name = "site-color-custom";
  customColorInput.placeholder = "Ex.: azul-marinho e cobre";
  if (colorLabel && colorLabel.tagName === "LABEL") {
    colorLabel.htmlFor = "site-color-custom";
    colorLabel.textContent = "Outra combinação? (opcional)";
  }
  const selectedColorInput = document.createElement("input");
  selectedColorInput.type = "hidden";
  selectedColorInput.id = "site-color";
  selectedColorInput.name = "site-color";
  selectedColorInput.value = "Azul e branco";
  customColorInput.before(selectedColorInput);
  let activePreset = "Azul e branco";

  const styles = `
    #monte .builder-grid { grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr); align-items:start; gap:clamp(1.5rem,3vw,3rem); }
    #monte .builder-form { padding:clamp(1rem,2.2vw,1.65rem); border:1px solid #263a56; border-radius:1rem; background:linear-gradient(145deg,#111c2c,#0c1320); }
    #monte .builder-form > label { margin-top:.4rem; color:#eff5ff; font-size:.9rem; font-weight:650; }
    #monte .builder-form input[type=text],#monte .builder-form select,#monte .builder-form textarea { border:1px solid #31445f; border-radius:.65rem; background:#080f1b; color:#eaf1fc; }
    #monte .builder-form select { min-height:3rem; }
    #monte .builder-form textarea { min-height:6rem; }
    #monte .builder-form fieldset { margin:.25rem 0; padding:0; border:0; }
    #monte .builder-form fieldset legend { margin-bottom:.75rem; color:#eff5ff; font-size:.9rem; font-weight:650; }
    #monte .builder-form .check-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:.6rem; }
    #monte .builder-form .check-grid label { min-height:2.5rem; padding:.42rem .55rem; border:1px solid #2b3e58; border-radius:.55rem; color:#aebdd1; font-size:.78rem; }
    #monte .builder-form .check-grid input { accent-color:#5b9cff; }
    .palette-choice-title { margin:.25rem 0 .2rem; color:#eff5ff; font-size:.88rem; font-weight:650; }
    #monte .builder-form label[for="site-color"] { margin:.25rem 0 -.35rem; color:#aebdd1; font-size:.76rem; font-weight:550; }
    .palette-presets { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.5rem; margin:.1rem 0 .45rem; }
    .palette-presets__button { display:flex; align-items:center; gap:.55rem; min-height:2.75rem; padding:.45rem .55rem; border:1px solid #2b3e58; border-radius:.6rem; background:#0a1220; color:#aebdd1; font:500 .72rem/1.2 Inter,system-ui,sans-serif; text-align:left; cursor:pointer; }
    .palette-presets__button[aria-pressed=true] { border-color:#619ce7; background:rgb(91 156 255 / .1); color:#f2f6ff; }
    .palette-presets__button:focus-visible { outline:2px solid #83b4ff; outline-offset:2px; }
    .palette-presets__swatches { display:flex; flex:0 0 2.1rem; height:1.3rem; overflow:hidden; border:1px solid rgb(255 255 255 / .18); border-radius:.28rem; }
    .palette-presets__swatches i { flex:1; }
    .brief-preview { display:grid; gap:.85rem; padding:clamp(1rem,2.2vw,1.5rem); border:1px solid #29415f; border-radius:1rem; background:linear-gradient(145deg,#111e30,#0a111d); box-shadow:0 24px 70px rgb(0 0 0 / .2); }
    .brief-preview__head { display:flex; align-items:start; justify-content:space-between; gap:.8rem; }
    .brief-preview__head .eyebrow { margin-bottom:.4rem; color:#7eaae1; font-size:.65rem; }
    .brief-preview__head h3 { max-width:22ch; margin:0; font-size:1.18rem; letter-spacing:-.04em; }
    .brief-preview__live { display:inline-flex; align-items:center; gap:.35rem; flex:0 0 auto; padding:.35rem .5rem; border:1px solid #245c4c; border-radius:999px; background:rgb(43 150 110 / .1); color:#8de0bc; font:700 .55rem/1 ui-monospace,monospace; letter-spacing:.1em; }
    .brief-preview__live i { width:.38rem; height:.38rem; border-radius:50%; background:#55d6a4; }
    .site-mockup { --mock-bg:#f3f7fc; --mock-surface:#fff; --mock-ink:#17324f; --mock-muted:#687d95; --mock-accent:#367fd0; --mock-soft:#e4effb; --mock-line:#dce7f3; overflow:hidden; border:1px solid #405879; border-radius:.85rem; background:#0a0f18; box-shadow:0 20px 50px rgb(0 0 0 / .35); }
    .mockup-browser-bar { display:grid; grid-template-columns:3.25rem 1fr 1.4rem; align-items:center; gap:.6rem; min-height:2rem; padding:.4rem .65rem; border-bottom:1px solid #2a3d57; background:#111c2b; color:#8194af; }
    .mockup-dots { display:flex; gap:.23rem; }.mockup-dots i { width:.38rem; height:.38rem; border-radius:50%; background:#f17e83; }.mockup-dots i:nth-child(2){background:#efbd61}.mockup-dots i:nth-child(3){background:#62c99b}
    .mockup-address { justify-self:center; width:min(100%,13rem); padding:.22rem .6rem; border:1px solid #2a3d57; border-radius:999px; background:#0a121f; color:#7185a1; text-align:center; font-size:.55rem; }
    .mockup-site { overflow:hidden; padding:clamp(.8rem,2vw,1.25rem); background:var(--mock-bg); color:var(--mock-ink); font-family:Inter,system-ui,sans-serif; transition:background .2s,color .2s; }
    .mockup-nav { display:flex; align-items:center; justify-content:space-between; gap:.5rem; padding-bottom:.8rem; border-bottom:1px solid var(--mock-line); }
    .mockup-brand { color:var(--mock-ink); font-size:clamp(.64rem,1.2vw,.85rem); font-weight:800; letter-spacing:-.06em; white-space:nowrap; }.mockup-brand span { color:var(--mock-accent); }
    .mockup-nav-items { display:flex; align-items:center; gap:clamp(.35rem,1.1vw,.8rem); color:var(--mock-muted); font-size:clamp(.42rem,.8vw,.57rem); }.mockup-nav-items span { white-space:nowrap; }
    .mockup-nav-cta { padding:.36rem .6rem; border-radius:.35rem; background:var(--mock-accent); color:white; font-size:clamp(.42rem,.8vw,.55rem); font-weight:700; white-space:nowrap; }
    .mockup-hero { display:grid; grid-template-columns:minmax(0,1.1fr) minmax(6rem,.9fr); gap:.6rem; align-items:center; min-height:11rem; padding:clamp(1rem,2.4vw,1.7rem) .25rem; }
    .mockup-eyebrow { display:block; margin-bottom:.5rem; color:var(--mock-accent); font-size:clamp(.4rem,.75vw,.55rem); font-weight:800; letter-spacing:.13em; }
    .mockup-hero h4 { max-width:19ch; margin:0; color:var(--mock-ink); font-size:clamp(1.1rem,2.5vw,1.8rem); font-weight:750; line-height:1.02; letter-spacing:-.065em; }
    .mockup-hero p { max-width:32ch; margin:.55rem 0 .75rem; color:var(--mock-muted); font-size:clamp(.48rem,.9vw,.65rem); line-height:1.55; }
    .mockup-action { display:inline-flex; align-items:center; gap:.65rem; padding:.45rem .65rem; border-radius:.35rem; background:var(--mock-accent); color:white; font-size:clamp(.45rem,.8vw,.58rem); font-weight:700; }
    .mockup-art { position:relative; display:grid; place-items:center; min-height:8.5rem; overflow:hidden; border-radius:.55rem; background:var(--mock-soft); }
    .mockup-art-card { position:absolute; width:58%; height:65%; border:1px solid var(--mock-line); border-radius:.5rem; background:var(--mock-surface); box-shadow:0 10px 25px rgb(18 39 65 / .12); }
    .mockup-art-card.back { transform:translate(13%,-9%) rotate(9deg); opacity:.7; }.mockup-art-card.front { display:flex; flex-direction:column; gap:.55rem; justify-content:center; padding:.65rem; transform:translate(-7%,4%) rotate(-5deg); }
    .mockup-art-card.front i,.mockup-art-card.front b,.mockup-art-card.front small { display:block; height:.27rem; border-radius:99px; background:var(--mock-line); }.mockup-art-card.front i { width:90%; }.mockup-art-card.front b { width:65%; }.mockup-art-card.front small { width:45%; background:var(--mock-soft); }.mockup-art-card.front span { width:1.2rem; height:1.2rem; border-radius:.35rem; background:var(--mock-accent); }
    .mockup-content { padding-top:.8rem; border-top:1px solid var(--mock-line); }.mockup-content-head { display:grid; gap:.25rem; margin-bottom:.55rem; }.mockup-content-head small { color:var(--mock-accent); font-size:.42rem; font-weight:800; letter-spacing:.12em; }.mockup-content-head b { color:var(--mock-ink); font-size:clamp(.65rem,1.15vw,.85rem); letter-spacing:-.035em; }
    .mockup-cards { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.45rem; }.mockup-card { display:grid; gap:.3rem; padding:.55rem; border:1px solid var(--mock-line); border-radius:.4rem; background:var(--mock-surface); }.mockup-card i { width:1rem; height:1rem; border-radius:.3rem; background:var(--mock-soft); box-shadow:inset 0 0 0 1px var(--mock-line); }.mockup-card b { overflow:hidden; color:var(--mock-ink); font-size:clamp(.48rem,.85vw,.6rem); text-overflow:ellipsis; white-space:nowrap; }.mockup-card span { width:90%; height:.2rem; border-radius:99px; background:var(--mock-line); }.mockup-card span:last-child { width:62%; }
    .site-mockup[data-style=elegant] .mockup-site { font-family:Georgia,serif; }.site-mockup[data-style=elegant] .mockup-hero h4 { font-family:Georgia,serif; font-weight:500; letter-spacing:-.045em; }.site-mockup[data-style=elegant] .mockup-nav-cta,.site-mockup[data-style=elegant] .mockup-action { border-radius:0; }
    .site-mockup[data-style=creative] .mockup-art { border-radius:2rem .3rem 2rem .3rem; }.site-mockup[data-style=creative] .mockup-hero h4 { letter-spacing:-.08em; }.site-mockup[data-style=creative] .mockup-art-card.front { transform:translate(-7%,4%) rotate(-11deg); }
    .site-mockup[data-style=simple] .mockup-art { display:none; }.site-mockup[data-style=simple] .mockup-hero { grid-template-columns:1fr; min-height:9rem; }
    .mockup-note { margin:-.25rem 0 .2rem; color:#7f91aa; font-size:.66rem; line-height:1.45; }
    .brief-summary { padding-top:.85rem; border-top:1px solid #2a3d57; }.brief-summary__top { display:flex; justify-content:space-between; gap:.5rem; margin-bottom:.65rem; }.brief-summary__top strong { font-size:.9rem; }.brief-summary__top small { color:#7086a5; font:600 .48rem ui-monospace,monospace; letter-spacing:.08em; }
    #brief-output { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.5rem; }.brief-summary #brief-output p { display:grid; gap:.25rem; min-width:0; margin:0; padding:.55rem .65rem; border:1px solid #263950; border-radius:.5rem; background:rgb(7 14 24 / .48); overflow-wrap:anywhere; color:#c0ccdc; font-size:.68rem; line-height:1.4; }.brief-summary #brief-output strong { color:#8fb7e7; font-size:.64rem; }
    @media(max-width:59.9375rem){#monte .builder-grid{grid-template-columns:minmax(0,1fr)}#monte .brief-preview{position:static}}
    @media(max-width:36rem){.mockup-hero{grid-template-columns:minmax(0,1.15fr) minmax(5rem,.85fr);min-height:9rem}.mockup-art{min-height:6.5rem}.mockup-nav-items{gap:.3rem}.mockup-nav-items span{font-size:.4rem}.mockup-nav-cta{padding:.3rem .4rem}.palette-presets__button{font-size:.66rem;padding:.4rem}.palette-presets__swatches{flex-basis:1.8rem;height:1.2rem}}
    @media(max-width:25rem){.mockup-nav-items{display:none}.mockup-hero h4{font-size:1rem}.mockup-hero p{font-size:.45rem}.mockup-cards{gap:.25rem}.mockup-card{padding:.35rem}}
    @media(prefers-reduced-motion:reduce){.mockup-site{transition:none}}
  `;
  const styleNode = document.createElement("style");
  styleNode.id = "briefing-visual-styles";
  styleNode.textContent = styles;
  document.head.append(styleNode);

  const presets = [
    { label: "Azul e branco", value: "Azul e branco", palette: "blue", swatches: ["#183a63", "#4d8fd7", "#f4f8fd"] },
    { label: "Preto e dourado", value: "Preto e dourado", palette: "gold", swatches: ["#181818", "#b88b45", "#f3e7c8"] },
    { label: "Verde e bege", value: "Verde e bege", palette: "green", swatches: ["#294b3c", "#7b9a7a", "#f0eee2"] },
    { label: "Roxo e lavanda", value: "Roxo e lavanda", palette: "violet", swatches: ["#38264e", "#9a7ac2", "#f3edf9"] },
    { label: "Terracota e areia", value: "Terracota e areia", palette: "warm", swatches: ["#613b30", "#c17c5b", "#f6e9da"] }
  ];
  const paletteHeading = document.createElement("p");
  paletteHeading.className = "palette-choice-title";
  paletteHeading.textContent = "Escolha uma paleta de cores";
  const paletteWrap = document.createElement("div");
  paletteWrap.className = "palette-presets";
  paletteWrap.setAttribute("aria-label", "Paletas de cores sugeridas");
  presets.forEach((preset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-presets__button";
    button.dataset.color = preset.value;
    button.setAttribute("aria-pressed", "false");
    const swatch = document.createElement("span");
    swatch.className = "palette-presets__swatches";
    preset.swatches.forEach((color) => {
      const stripe = document.createElement("i"); stripe.style.background = color; swatch.append(stripe);
    });
    const name = document.createElement("span"); name.textContent = preset.label;
    button.append(swatch, name);
    button.addEventListener("click", () => {
      activePreset = preset.value;
      selectedColorInput.value = preset.value;
      customColorInput.value = "";
      paletteWrap.querySelectorAll("button").forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
      customColorInput.dispatchEvent(new Event("input", { bubbles: true }));
    });
    paletteWrap.append(button);
  });
  colorLabel.before(paletteHeading, paletteWrap);
  customColorInput.addEventListener("input", () => {
    selectedColorInput.value = customColorInput.value.trim() || activePreset;
    paletteWrap.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(!customColorInput.value.trim() && button.dataset.color === activePreset)));
  });
  paletteWrap.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.color === activePreset)));

  const summaryTitle = aside.querySelector("h3")?.textContent || "Seu projeto, em resumo";
  const oldOutput = output;
  aside.replaceChildren();
  const head = document.createElement("div"); head.className = "brief-preview__head";
  const headCopy = document.createElement("div");
  const eyebrow = document.createElement("p"); eyebrow.className = "eyebrow"; eyebrow.textContent = "Visualização ao vivo";
  const h3 = document.createElement("h3"); h3.textContent = "Seu site começa a ganhar forma";
  headCopy.append(eyebrow, h3);
  const live = document.createElement("span"); live.className = "brief-preview__live"; live.innerHTML = "<i></i> AO VIVO";
  head.append(headCopy, live);

  const mockup = document.createElement("div"); mockup.className = "site-mockup"; mockup.id = "site-mockup";
  mockup.setAttribute("role", "img"); mockup.setAttribute("aria-label", "Prévia conceitual de site atualizada de acordo com as escolhas do briefing.");
  mockup.innerHTML = `
    <div class="mockup-browser-bar"><span class="mockup-dots"><i></i><i></i><i></i></span><span class="mockup-address">www.suaempresa.com.br</span><span>↗</span></div>
    <div class="mockup-site">
      <div class="mockup-nav"><strong class="mockup-brand" id="mockup-brand">SUA MARCA<span>.</span></strong><div class="mockup-nav-items" id="mockup-nav-items"><span>Sobre</span><span>Serviços</span><span>Contato</span></div><span class="mockup-nav-cta" id="mockup-nav-cta">Contato</span></div>
      <div class="mockup-hero"><div><small class="mockup-eyebrow" id="mockup-eyebrow">CONHEÇA NOSSA EMPRESA</small><h4 id="mockup-headline">Uma presença digital à altura da sua marca.</h4><p id="mockup-description">Apresente sua empresa, destaque seus diferenciais e aproxime sua marca de novos clientes.</p><span class="mockup-action" id="mockup-action">Conheça a empresa ↗</span></div><div class="mockup-art" aria-hidden="true"><div class="mockup-art-card back"></div><div class="mockup-art-card front"><span></span><i></i><b></b><small></small></div></div></div>
      <div class="mockup-content"><div class="mockup-content-head"><small>FEITO PARA VOCÊ</small><b id="mockup-section-title">Tudo o que sua empresa precisa</b></div><div class="mockup-cards" id="mockup-cards"><div class="mockup-card"><i></i><b>Sobre</b><span></span><span></span></div><div class="mockup-card"><i></i><b>Serviços</b><span></span><span></span></div><div class="mockup-card"><i></i><b>Contato</b><span></span><span></span></div></div></div>
    </div>`;
  const note = document.createElement("p"); note.className = "mockup-note"; note.textContent = "Prévia conceitual. O layout final é definido depois do alinhamento do projeto.";
  const summary = document.createElement("div"); summary.className = "brief-summary";
  const summaryHead = document.createElement("div"); summaryHead.className = "brief-summary__top";
  const summaryStrong = document.createElement("strong"); summaryStrong.textContent = summaryTitle;
  const summarySmall = document.createElement("small"); summarySmall.textContent = "ATUALIZADO AUTOMATICAMENTE";
  summaryHead.append(summaryStrong, summarySmall);
  summary.append(summaryHead, oldOutput);
  const liveText = document.createElement("p"); liveText.className = "mockup-note"; liveText.id = "mockup-live-description"; liveText.setAttribute("aria-live", "polite");
  aside.append(head, mockup, note, summary, liveText);

  const themes = {
    blue: { bg: "#f3f7fc", surface: "#fff", ink: "#17324f", muted: "#687d95", accent: "#367fd0", soft: "#e4effb", line: "#dce7f3" },
    gold: { bg: "#171717", surface: "#232323", ink: "#f5ead2", muted: "#c1b69e", accent: "#c29a54", soft: "#393021", line: "#51432b" },
    green: { bg: "#f0f1e8", surface: "#fff", ink: "#28483a", muted: "#718477", accent: "#638c70", soft: "#e2eadf", line: "#dce4d8" },
    violet: { bg: "#f4f0fa", surface: "#fff", ink: "#392a52", muted: "#827394", accent: "#8a68ba", soft: "#eee7f7", line: "#e4daef" },
    warm: { bg: "#f8f0e9", surface: "#fffaf5", ink: "#55372e", muted: "#96776a", accent: "#bd7455", soft: "#f3e2d7", line: "#ead9cc" }
  };
  const get = (name, fallback = "") => String(form.elements.namedItem(name)?.value || fallback).trim();
  const checkedSections = () => Array.from(form.querySelectorAll('input[name="sections"]:checked')).map((input) => input.value);
  const selectedPalette = () => {
    const color = get("site-color", "Azul e branco").toLocaleLowerCase("pt-BR");
    if (/dourad|gold|preto|black/.test(color)) return "gold";
    if (/verde|oliva|sage|musgo/.test(color)) return "green";
    if (/roxo|violet|lil[aá]s|lavanda/.test(color)) return "violet";
    if (/terracota|areia|laranja|telha|cobre/.test(color)) return "warm";
    return "blue";
  };
  const selectedStyle = () => {
    const styleValue = get("site-style", "Moderno e minimalista");
    if (/elegante/i.test(styleValue)) return "elegant";
    if (/criativo/i.test(styleValue)) return "creative";
    if (/simples/i.test(styleValue)) return "simple";
    return "modern";
  };
  const copyByType = () => {
    const type = get("site-type", "Site institucional");
    const options = {
      "Site institucional": ["SUA EMPRESA", "CONHEÇA NOSSA EMPRESA", "Uma presença digital à altura da sua marca.", "Apresente sua empresa, destaque seus diferenciais e aproxime sua marca de novos clientes.", "Conheça a empresa", "Tudo o que sua empresa precisa"],
      "Landing page": ["SUA MARCA", "UMA SOLUÇÃO PARA VOCÊ", "Transforme interesse em novas oportunidades.", "Uma página objetiva, com uma mensagem clara e um próximo passo para o seu cliente.", "Quero saber mais", "Por que escolher esta solução?"],
      "Portfólio": ["SEU NOME", "TRABALHOS SELECIONADOS", "Ideias e projetos em um só lugar.", "Apresente sua trajetória, mostre seus melhores trabalhos e conte o que você sabe fazer.", "Ver projetos", "Projetos em destaque"],
      "Loja virtual": ["SUA LOJA", "ESCOLHAS FEITAS PARA VOCÊ", "Encontre seus próximos produtos favoritos.", "Uma vitrine organizada para apresentar produtos e tornar a compra mais simples.", "Explorar produtos", "Destaques da loja"],
      "Blog": ["SEU BLOG", "IDEIAS E CONTEÚDO", "Boas histórias merecem ser compartilhadas.", "Organize seus conteúdos por temas e crie um espaço para informar, inspirar e conectar.", "Ler conteúdos", "Últimas publicações"],
      "Ainda não sei": ["SUA IDEIA", "VAMOS COMEÇAR", "Toda boa ideia merece ganhar forma.", "A estrutura e a apresentação serão definidas de acordo com o objetivo do seu projeto.", "Saiba mais", "Uma experiência pensada para você"]
    };
    return { type, values: options[type] || options["Site institucional"] };
  };
  const render = () => {
    const { type, values } = copyByType();
    const [brand, eyebrow, headline, description, action, sectionTitle] = values;
    const palette = selectedPalette();
    const paletteVars = themes[palette];
    const styleName = selectedStyle();
    const custom = get("site-color", "Azul e branco");
    mockup.dataset.palette = palette;
    mockup.dataset.style = styleName;
    const site = mockup.querySelector(".mockup-site");
    Object.entries(paletteVars).forEach(([key, value]) => site.style.setProperty(`--mock-${key}`, value));
    const brandNode = document.getElementById("mockup-brand");
    brandNode.replaceChildren(document.createTextNode(brand));
    const dot = document.createElement("span"); dot.textContent = "."; brandNode.append(dot);
    document.getElementById("mockup-eyebrow").textContent = eyebrow;
    document.getElementById("mockup-headline").textContent = headline;
    document.getElementById("mockup-description").textContent = description;
    document.getElementById("mockup-action").textContent = `${action} ↗`;
    document.getElementById("mockup-section-title").textContent = sectionTitle;

    const sections = checkedSections().filter((item) => item !== "Início");
    const navSections = (sections.length ? sections : ["Sobre", "Serviços", "Contato"]).slice(0, 3);
    document.getElementById("mockup-nav-items").replaceChildren(...navSections.map((name) => {
      const span = document.createElement("span");
      span.textContent = name === "Projetos ou produtos" ? (type === "Loja virtual" ? "Produtos" : "Projetos") : name;
      return span;
    }));
    const fallback = type === "Loja virtual" ? ["Novidades", "Mais vendidos", "Ofertas"] : type === "Portfólio" ? ["Projeto 01", "Projeto 02", "Projeto 03"] : type === "Blog" ? ["Artigos", "Guias", "Novidades"] : ["Sobre", "Serviços", "Contato"];
    const cardNames = (sections.length ? sections : fallback).slice(0, 3).map((name) => name === "Projetos ou produtos" ? (type === "Loja virtual" ? "Produtos" : "Projetos") : name);
    document.getElementById("mockup-cards").replaceChildren(...cardNames.map((name) => {
      const card = document.createElement("div"); card.className = "mockup-card";
      const icon = document.createElement("i");
      const heading = document.createElement("b"); heading.textContent = name;
      const line1 = document.createElement("span"); const line2 = document.createElement("span");
      card.append(icon, heading, line1, line2); return card;
    }));
    const humanStyle = get("site-style", "Moderno e minimalista").toLowerCase();
    document.getElementById("mockup-live-description").textContent = `Prévia de ${type.toLowerCase()}, com estilo ${humanStyle} e paleta ${custom.toLowerCase()}.`;
    mockup.setAttribute("aria-label", `Prévia conceitual de ${type.toLowerCase()}, estilo ${humanStyle}, paleta ${custom}. Não representa o site final.`);
    paletteWrap.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(!customColorInput.value.trim() && button.dataset.color === activePreset)));
  };
  form.addEventListener("input", render);
  form.addEventListener("change", render);
  render();
})();
