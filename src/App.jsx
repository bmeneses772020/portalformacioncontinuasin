import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  Unlock,
  RotateCcw,
  KeyRound,
  Trophy,
} from "lucide-react";

/* ============================================================ */
/* RUTA DE CURSOS — el orden de esta lista es el orden de la ruta */
/* ============================================================ */
const COURSES = [
  {
    id: "apa7",
    title: "APA 7",
    description:
      "Aprende a citar y referenciar con normas APA 7.ª edición: fundamentos, formato, encabezados, citas, referencias, y tablas y figuras.",
    duration: "2–3 horas",
    modules: "6 módulos",
    url: "https://aprendecursoapa.vercel.app/",
  },
  {
    id: "redaccion",
    title: "Expresión Escrita y Comprensión Lectora",
    description:
      "Mejora tu redacción y tu comprensión lectora: párrafos, gramática, lectura activa, resumen y edición de textos.",
    duration: "2–3 horas",
    modules: "6 módulos",
    url: "https://cursoexpresionescrita.vercel.app/",
  },
  {
    id: "metodologia",
    title: "Metodología de la Investigación para Docentes y Futuros Tutores",
    description:
      "Domina las decisiones metodológicas y orienta tesis y proyectos de grado: enfoques, problema y objetivos, literatura, diseño, muestra, instrumentos, análisis y tutoría.",
    duration: "5 horas",
    modules: "7 módulos",
    url: "https://cursotutorestfg.vercel.app/",
  },
];

/* Debe ser idéntico al de los tres cursos (archivo src/ec.js de cada curso). */
const SALT = "fc-educacion-continua-2026";
const STORAGE_KEY = "educacion-continua-progreso-v1";

function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
const tokenFor = (id) => hash(id + "|" + SALT);

function loadDone() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

function isUnlocked(done, index) {
  return index === 0 || Boolean(done[COURSES[index - 1].id]);
}

const INK = "#0B3D42";
const INK_SOFT = "#1B4C52";
const PAPER = "#F6F1E7";
const PAPER_CARD = "#FCFAF4";
const GOLD = "#C98A2E";
const WINE = "#7A2E3B";
const SAGE = "#4F7A5D";
const LINE = "#DDD3BE";
const TEXT = "#29291F";
const TEXT_SOFT = "#6b6b5f";

export default function App() {
  const [done, setDone] = useState(() => loadDone());
  const [notice, setNotice] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Procesa el regreso desde un curso: ?completado=<id>&t=<token>
  useEffect(() => {
    let params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch {
      return;
    }
    const id = params.get("completado");
    const t = params.get("t");
    if (!id) return;
    const index = COURSES.findIndex((c) => c.id === id);
    const current = loadDone();
    if (index === -1 || t !== tokenFor(id)) {
      setNotice({ kind: "error", text: "No pudimos validar la finalización de ese curso. Vuelve a abrir el curso y usa el botón del final." });
    } else if (!isUnlocked(current, index)) {
      setNotice({ kind: "error", text: "Ese curso aún no estaba desbloqueado. Completa primero el anterior." });
    } else {
      const next = { ...current, [id]: true };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      setDone(next);
      const following = COURSES[index + 1];
      setNotice({
        kind: "ok",
        text: following
          ? `¡Completaste «${COURSES[index].title}»! Se desbloqueó «${following.title}».`
          : `¡Completaste «${COURSES[index].title}»! Terminaste toda la ruta.`,
      });
    }
    try {
      window.history.replaceState({}, "", window.location.pathname);
    } catch {}
  }, []);

  const doneCount = COURSES.filter((c) => done[c.id]).length;

  function resetAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setDone({});
    setNotice(null);
    setConfirmReset(false);
  }

  return (
    <div className="ec-root">
      <Styles />

      <header className="ec-header">
        <BookOpen size={22} strokeWidth={2} />
        <div>
          <div className="ec-brand">Cursos Educación Continua</div>
          <div className="ec-brand-sub">Programa de formación docente · Msc. Betty Meneses Ayllón</div>
        </div>
      </header>

      <section className="ec-hero">
        <span className="ec-kicker">Ruta de tres cursos de autogestión</span>
        <h1>Completa un curso para desbloquear el siguiente</h1>
        <p className="ec-hero-sub">
          Avanza a tu ritmo: cada curso se habilita cuando terminas el anterior. Para entrar a cada uno necesitas el
          código de acceso que te entregue tu facilitadora.
        </p>
        <div className="ec-progress" aria-label="Progreso de la ruta">
          <div className="ec-progress-track">
            <div className="ec-progress-fill" style={{ width: `${(doneCount / COURSES.length) * 100}%` }} />
          </div>
          <span className="ec-progress-label">
            {doneCount} de {COURSES.length} cursos completados
          </span>
        </div>
      </section>

      {notice && (
        <div className={`ec-notice ${notice.kind === "ok" ? "ec-notice-ok" : "ec-notice-err"}`} role="status">
          {notice.text}
        </div>
      )}

      <section className="ec-section">
        <ol className="ec-list">
          {COURSES.map((c, i) => {
            const completed = Boolean(done[c.id]);
            const open = isUnlocked(done, i);
            const state = completed ? "completado" : open ? "disponible" : "bloqueado";
            return (
              <li className={`ec-card ec-card-${state}`} key={c.id} data-state={state} data-course={c.id}>
                <div className="ec-step">{i + 1}</div>
                <div className="ec-card-body">
                  <div className="ec-badges">
                    {completed && (
                      <span className="ec-badge ec-badge-done">
                        <CheckCircle2 size={13} strokeWidth={2} /> Completado
                      </span>
                    )}
                    {!completed && open && (
                      <span className="ec-badge ec-badge-open">
                        <Unlock size={13} strokeWidth={2} /> Disponible
                      </span>
                    )}
                    {!open && (
                      <span className="ec-badge ec-badge-locked">
                        <Lock size={13} strokeWidth={2} /> Bloqueado
                      </span>
                    )}
                  </div>
                  <h3>{c.title}</h3>
                  <p className="ec-card-desc">{c.description}</p>
                  <div className="ec-card-meta">
                    <span>
                      <Clock size={14} strokeWidth={2} /> {c.duration}
                    </span>
                    <span>
                      <Layers size={14} strokeWidth={2} /> {c.modules}
                    </span>
                  </div>
                  <div className="ec-card-footer">
                    {open ? (
                      <a className="ec-cta" href={`${c.url}?ec=1`} target="_blank" rel="noreferrer">
                        {completed ? "Repasar el curso" : "Entrar al curso"} <ArrowRight size={15} strokeWidth={2.2} />
                      </a>
                    ) : (
                      <span className="ec-locked-text">
                        <Lock size={14} strokeWidth={2} /> Termina «{COURSES[i - 1].title}» para desbloquearlo
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {doneCount === COURSES.length && (
        <section className="ec-section">
          <div className="ec-finish">
            <Trophy size={22} strokeWidth={2} />
            <div>
              <strong>¡Completaste la ruta de Educación Continua!</strong>
              <div>Puedes repasar cualquiera de los tres cursos cuando quieras.</div>
            </div>
          </div>
        </section>
      )}

      <section className="ec-section ec-section-alt">
        <h2>Cómo funciona</h2>
        <div className="ec-steps">
          <div className="ec-howto">
            <KeyRound size={20} strokeWidth={2} />
            <span>
              <strong>1. Ingresa con tu código.</strong> Cada curso pide el código de acceso que te dará tu facilitadora.
            </span>
          </div>
          <div className="ec-howto">
            <CheckCircle2 size={20} strokeWidth={2} />
            <span>
              <strong>2. Completa todas las lecciones.</strong> Tu avance se guarda solo, en este navegador.
            </span>
          </div>
          <div className="ec-howto">
            <Unlock size={20} strokeWidth={2} />
            <span>
              <strong>3. Vuelve y desbloquea.</strong> Al llegar al 100 %, usa el botón «Volver y desbloquear el siguiente».
            </span>
          </div>
        </div>
        <p className="ec-note">
          Tu progreso se guarda en el navegador que estás usando. Si cambias de computadora, tendrás que repetir los pasos
          desde el primer curso.
        </p>
        <div className="ec-reset">
          {!confirmReset ? (
            <button className="ec-reset-btn" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={14} /> Reiniciar mi progreso
            </button>
          ) : (
            <span className="ec-reset-confirm">
              Se borrará el avance de la ruta en este navegador.
              <button className="ec-reset-btn ec-reset-yes" onClick={resetAll}>
                Sí, reiniciar
              </button>
              <button className="ec-reset-btn" onClick={() => setConfirmReset(false)}>
                Cancelar
              </button>
            </span>
          )}
        </div>
      </section>

      <footer className="ec-footer">Msc. Betty Meneses Ayllón · Educación Continua</footer>
    </div>
  );
}

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&display=swap');
      .ec-root { min-height: 100vh; background: ${PAPER}; color: ${TEXT}; font-family: 'Inter', system-ui, sans-serif; }
      .ec-header { background: ${INK}; color: #fff; padding: 18px 24px; display: flex; align-items: center; gap: 12px; }
      .ec-brand { font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: 19px; }
      .ec-brand-sub { font-size: 12px; opacity: .8; }
      .ec-hero { max-width: 760px; margin: 0 auto; padding: 48px 16px 24px; text-align: center; }
      .ec-kicker { display: inline-block; color: ${GOLD}; font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; }
      .ec-hero h1 { font-family: 'Source Serif 4', Georgia, serif; color: ${INK}; font-size: 36px; line-height: 1.2; margin: 10px 0 14px; }
      .ec-hero-sub { color: ${TEXT_SOFT}; font-size: 16.5px; line-height: 1.6; margin: 0 auto 22px; max-width: 600px; }
      .ec-progress { max-width: 420px; margin: 0 auto; }
      .ec-progress-track { height: 8px; border-radius: 999px; background: ${LINE}; overflow: hidden; }
      .ec-progress-fill { height: 100%; background: ${SAGE}; transition: width .3s ease; }
      .ec-progress-label { display: block; margin-top: 8px; font-size: 13px; color: ${TEXT_SOFT}; }
      .ec-notice { max-width: 760px; margin: 8px auto 0; padding: 12px 16px; border-radius: 10px; font-size: 14.5px; }
      .ec-notice-ok { background: #E6F0E4; border: 1px solid #B9D3B4; color: #2E5A36; }
      .ec-notice-err { background: #F6E4E6; border: 1px solid #E0B9BE; color: ${WINE}; }
      .ec-section { max-width: 760px; margin: 0 auto; padding: 24px 16px; }
      .ec-section-alt { max-width: none; background: ${PAPER_CARD}; border-top: 1px solid ${LINE}; margin-top: 24px; padding-left: 0; padding-right: 0; }
      .ec-section-alt > * { max-width: 728px; margin-left: auto; margin-right: auto; padding-left: 16px; padding-right: 16px; }
      .ec-section h2 { font-family: 'Source Serif 4', Georgia, serif; color: ${INK}; font-size: 24px; margin: 0 0 16px; }
      .ec-section-alt > h2 { margin: 0 auto 16px; }
      .ec-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 16px; }
      .ec-card { display: flex; gap: 16px; background: ${PAPER_CARD}; border: 1px solid ${LINE}; border-radius: 12px; padding: 22px; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
      .ec-card-bloqueado { opacity: .72; background: #F1ECDF; }
      .ec-card-completado { border-color: #B9D3B4; }
      .ec-step { flex: none; width: 36px; height: 36px; border-radius: 50%; background: ${INK}; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: 'Source Serif 4', Georgia, serif; }
      .ec-card-bloqueado .ec-step { background: #9a9a8c; }
      .ec-card-completado .ec-step { background: ${SAGE}; }
      .ec-card-body { flex: 1; min-width: 0; }
      .ec-badges { margin-bottom: 8px; }
      .ec-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
      .ec-badge-done { background: #E6F0E4; color: #2E5A36; }
      .ec-badge-open { background: #F6E9D2; color: #8a5a13; }
      .ec-badge-locked { background: #E8E3D6; color: ${TEXT_SOFT}; }
      .ec-card h3 { font-family: 'Source Serif 4', Georgia, serif; color: ${INK}; font-size: 20px; line-height: 1.3; margin: 0 0 6px; }
      .ec-card-desc { margin: 0 0 12px; color: ${TEXT_SOFT}; font-size: 14.5px; line-height: 1.55; }
      .ec-card-meta { display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; color: ${TEXT_SOFT}; }
      .ec-card-meta span { display: inline-flex; align-items: center; gap: 5px; }
      .ec-card-footer { margin-top: 16px; }
      .ec-cta { display: inline-flex; align-items: center; gap: 8px; background: ${INK}; color: #fff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 14.5px; }
      .ec-cta:hover { background: ${INK_SOFT}; }
      .ec-locked-text svg { flex: none; }
      .ec-locked-text { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; color: ${TEXT_SOFT}; }
      .ec-finish { display: flex; gap: 14px; align-items: center; background: #E6F0E4; border: 1px solid #B9D3B4; border-radius: 12px; padding: 18px 20px; color: #2E5A36; }
      .ec-steps { display: grid; gap: 12px; margin-bottom: 14px; }
      .ec-howto { display: flex; gap: 12px; align-items: flex-start; color: ${TEXT}; font-size: 14.5px; line-height: 1.5; }
      .ec-howto svg { flex: none; color: ${GOLD}; margin-top: 2px; }
      .ec-note { color: ${TEXT_SOFT}; font-size: 13.5px; line-height: 1.55; }
      .ec-reset { margin-top: 8px; }
      .ec-reset-btn { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: 1px solid ${LINE}; color: ${TEXT_SOFT}; border-radius: 8px; padding: 6px 12px; font-size: 13px; cursor: pointer; margin-left: 8px; }
      .ec-reset > .ec-reset-btn { margin-left: 0; }
      .ec-reset-yes { color: ${WINE}; border-color: ${WINE}; }
      .ec-reset-confirm { font-size: 13px; color: ${TEXT_SOFT}; }
      .ec-footer { text-align: center; padding: 28px 16px 40px; font-size: 13px; color: ${TEXT_SOFT}; }
      @media (max-width: 560px) {
        .ec-hero h1 { font-size: 28px; }
        .ec-card { padding: 16px; gap: 12px; }
      }
    `}</style>
  );
}
