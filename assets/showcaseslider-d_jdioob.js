import{r as s,I as F,az as O,K as n,Y as w,v as t}from"./index-CbQNdiLY.js";const V="/assets/architecture_digital-D_2Z6-9c.jpg",q="/assets/web_apps_final_opt-DRw96U-6.mp4",B="/assets/automatizacion_final_opt-PcbcyLkv.mp4",H="/assets/marketing_final_opt-I7pGFp8a.mp4";n.registerPlugin(w);const L=[{id:"01",title:"PÁGINAS WEB Y APPS",subtitle:"Plataformas de Alto Impacto",desc:"Creamos activos digitales veloces y estables que cargan al instante y convierten visitas en clientes. Diseñados para escalar sin límites ni caídas.",fullDesc:"Construimos la interfaz de tu autoridad. Creamos plataformas web y aplicaciones de alto rendimiento que proyectan poder y escalan tu negocio sin límites.",humanDesc:"Tu negocio necesita un activo digital, no un folleto. Hacemos webs y apps que aguantan millones de usuarios y se cargan en milisegundos. Si no domina, no es AgencIA.",services:"Desarrollo Web de Élite, Aplicaciones Web a Medida, SaaS Escalables",humanServices:"Webs Premium, Apps para Negocio, Plataformas de Software",buttonCopy:"NIVEL DE ACCESO: HUMANO",year:"2025",img:V,video:q,path:"/infraestructura",ctaCopy:"CONSTRUIR ACTIVOS"},{id:"02",title:"AUTOMATIZACIÓN E IA",subtitle:"Flujos en Piloto Automático",desc:"Elimina las tareas repetitivas y administrativas. Implementamos asistentes con IA que atienden clientes, califican prospectos y operan tu negocio 24/7.",fullDesc:'Implementamos la "Plataforma 360", un ecosistema donde la IA asume el control operativo de tu negocio. Ventas, soporte y agendamiento ocurren solos con precisión absoluta.',humanDesc:"Imagina un ejército de clones perfectos que venden, atienden y organizan tu empresa mientras tú te enfocas en liderar su crecimiento.",services:"Agentes Autónomos de IA, Flujos Automáticos, Sistemas de Control",humanServices:"Vendedor IA 24/7, Procesos en Piloto Automático, Ahorro Operativo",buttonCopy:"VERSIÓN SIMPLIFICADA",year:"2025",img:"https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",video:B,path:"/automatizacion",ctaCopy:"ACTIVAR ECOSISTEMA"},{id:"03",title:"ESTRATEGIA Y MARKETING",subtitle:"Estrategias de Adquisición",desc:"Posicionamos tu marca como la autoridad de tu industria. Diseñamos embudos de adquisición y campañas que atraen clientes listos para comprar.",fullDesc:"Trascendemos lo visual para diseñar sistemas de dominio de mercado. Tu marca dejará de competir para empezar a reinar mediante estrategias de adquisición y conversión de alto impacto.",humanDesc:"El marketing de AgencIA no es publicidad, es conquista. Hacemos que tu marca se vea tan poderosa que la confianza de tus clientes sea absoluta y la competencia se vuelva irrelevante.",services:"Estrategia de Crecimiento, Marketing de Autoridad, Branding Pro",humanServices:"Ventas Escalables, Imagen de Líder, Campañas de Alto Impacto",buttonCopy:"ENTENDER EL CONCEPTO",year:"2025",img:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",video:H,path:"/identidad",ctaCopy:"DOMINAR MERCADO"}],Y=({initialHash:T})=>{const[r,z]=s.useState(()=>typeof window<"u"?window.innerWidth<=768:!1);s.useEffect(()=>{const e=()=>z(window.innerWidth<=768);return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[]);const D=F(),[x,v]=s.useState(null),[I,k]=s.useState(null),b=s.useRef(null),l=s.useRef(null),N=s.useRef([]),y=s.useRef([]),E=s.useRef([]),{lenis:C}=O(),[W,S]=s.useState("30vw");return s.useEffect(()=>{const e=()=>{const a=window.innerWidth;a<=768?S("85vw"):a<=1024?S("60vw"):a<=1440?S("40vw"):S("35vw")};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[]),s.useLayoutEffect(()=>{let e;const a=n.context(()=>{if(!l.current||!b.current)return;w.getById("showcase-scroll")?.kill(),w.getAll().filter(o=>o.vars.id?.startsWith("parallax-")).forEach(o=>o.kill());const h=n.matchMedia();h.add({isMobile:"(max-width: 768px)",isTablet:"(min-width: 769px) and (max-width: 1024px)",isLaptop:"(min-width: 1025px) and (max-width: 1440px)",isDesktop:"(min-width: 1441px)"},o=>{const{isMobile:g,isTablet:d,isLaptop:m}=o.conditions;g?(n.set(".showcase-headline",{minWidth:"90vw",marginRight:"5vw"}),n.set(l.current,{paddingLeft:"5vw",gap:0})):d?(n.set(".showcase-headline",{minWidth:"40vw",marginRight:"0"}),n.set(l.current,{paddingLeft:"6vw",gap:"4vw"})):m?(n.set(".showcase-headline",{minWidth:"35vw",marginRight:"0"}),n.set(l.current,{paddingLeft:"8vw",gap:"8vw"})):(n.set(".showcase-headline",{minWidth:"40vw",marginRight:"0"}),n.set(l.current,{paddingLeft:"10vw",gap:"12vw"}))});const R=()=>l.current?.scrollWidth||0,A=()=>window.innerWidth;h.add("all",()=>{const o=A(),d=-(R()-o);e=n.timeline({scrollTrigger:{trigger:b.current,start:"top top",end:"+=600%",pin:!1,scrub:.8,invalidateOnRefresh:!0,id:"showcase-scroll"}}),e.to({},{duration:o*.1});let m=0;N.current.forEach((i,u)=>{if(!i)return;const p=i.offsetLeft+i.offsetWidth/2;let f=o/2-p;f>0&&(f=0),f<d&&(f=d);const P=Math.abs(f-m);P>0&&e.to(l.current,{x:f,ease:"none",duration:P}),e.addLabel(`card-${u}`);const M=o*.05;e.to({},{duration:M}),m=f}),m>d&&e.to(l.current,{x:d,ease:"none",duration:Math.abs(d-m)}),e.to({},{duration:.15});const j=8;E.current.forEach((i,u)=>{if(!i||!y.current[u])return;const p=n.timeline({scrollTrigger:{trigger:y.current[u],containerAnimation:e,start:"left 100%",end:"right 0%",scrub:.1,id:`parallax-natural-${u}`}});p.set(i,{xPercent:0,scale:1,rotateY:0}),p.to(i,{xPercent:-j,scale:1.05,rotateY:3,duration:.35,ease:"power1.inOut"}),p.to(i,{xPercent:j,scale:1.05,rotateY:-3,duration:.3,ease:"none"}),p.to(i,{xPercent:0,scale:1,rotateY:0,duration:.35,ease:"power1.inOut"})})}),w.refresh()},b),c=T||window.location.hash;return c&&c.startsWith("#case-")&&C&&setTimeout(()=>{w.refresh();const h=w.getById("showcase-scroll");if(!h||!l.current)return;const R=c.replace("#case-",""),A=L.findIndex(g=>g.id===R),o=y.current[A];if(o){v(A),setTimeout(()=>v(null),6e3);const g=l.current.scrollWidth,d=window.innerWidth,m=g-d;let i=-(o.offsetLeft-(d-o.offsetWidth)/2);i>0&&(i=0),i<-m&&(i=-m);const u=i/-m*(1/1.8),p=h.start+u*(h.end-h.start);C.scrollTo(p,{duration:2,force:!0})}},800),()=>a.revert()},[T,C]),t.jsxs("div",{ref:b,className:"showcase-slider-container",style:{width:"100%",height:"100vh",overflow:"hidden",backgroundColor:"#FFF"},children:[t.jsxs("div",{ref:l,className:"showcase-track",style:{display:"flex",height:"100%",width:"fit-content",paddingLeft:"10vw",gap:"5vw"},children:[t.jsxs("div",{className:"showcase-headline",style:{minWidth:"40vw",height:"100%",display:"flex",flexDirection:"column",justifyContent:"center"},children:[t.jsxs("h2",{style:{fontSize:"clamp(3rem, 6vw, 8rem)",lineHeight:.9,color:"#000",marginBottom:"2rem",fontFamily:"var(--font-heading)",fontWeight:800,textShadow:"0px 10px 30px rgba(0,0,0,0.1)"},children:["INGENIERÍA",t.jsx("br",{}),t.jsx("span",{style:{color:"#CCC",whiteSpace:"nowrap"},children:"/// CREATIVA"})]}),t.jsxs("p",{style:{fontSize:"clamp(0.85rem, 4vw, 2.5rem)",maxWidth:"90vw",fontFamily:"var(--font-heading)",fontWeight:600,color:"#111",lineHeight:1.15,marginTop:"1.5rem",letterSpacing:"-0.02em",paddingBottom:"1rem",overflowWrap:"break-word",width:"100%"},children:["Construimos infraestructura",t.jsx("br",{}),t.jsx("span",{style:{color:"#666",fontWeight:400},children:"que piensa, escala y domina."})]})]}),L.map((e,a)=>t.jsxs("div",{ref:c=>{N.current[a]=c},className:"showcase-card",onClick:()=>D(e.path),style:{textDecoration:"none",width:W,maxWidth:W,minWidth:W,height:r?void 0:"80%",alignSelf:"center",display:"flex",flexDirection:"column",justifyContent:"flex-start",padding:r?"1.5rem":"2rem",boxSizing:"border-box",backgroundColor:"#FFFFFF",cursor:"none",flexShrink:0,transition:"all 0.5s cubic-bezier(0.19, 1, 0.22, 1)",zIndex:x===a||I===a?10:2,boxShadow:x===a?"0 0 100px rgba(0, 255, 153, 0.6)":I===a?"0 40px 80px rgba(0,0,0,0.3)":"0 30px 60px rgba(0,0,0,0.1)",border:x===a?"2px solid #00FF99":"1px solid rgba(0,0,0,0.05)",animation:x===a?"landingFlash 1.5s infinite alternate":"none",transform:I===a&&!r?"translateY(-10px) scale(1.02)":"none",borderRadius:"24px"},"data-cursor":"open","data-cursor-text":`ACCESO // ${e.id}`,onMouseEnter:()=>{v(a),k(a)},onMouseLeave:()=>{v(null),k(null)},children:[t.jsxs("div",{ref:c=>{y.current[a]=c},className:"showcase-media-window",style:{width:"100%",height:r?"250px":"auto",aspectRatio:r?"auto":"16/9",overflow:"hidden",borderRadius:"16px",marginBottom:"1rem",position:"relative",backgroundColor:"#000",boxShadow:"0 30px 60px rgba(0,0,0,0.7)",border:"1px solid rgba(0,0,0,0.05)",flexShrink:0,transform:"translateZ(0)",willChange:"transform"},children:[t.jsx("div",{style:{position:"absolute",inset:0,zIndex:2,pointerEvents:"none",boxShadow:"inset 0 0 100px rgba(0,0,0,0.6)",borderRadius:"16px"}}),e.video?t.jsx("video",{ref:c=>{E.current[a]=c},src:e.video,autoPlay:!0,muted:!0,loop:!0,playsInline:!0,"webkit-playsinline":"true",preload:"metadata",poster:e.img,className:"showcase-video",style:{width:"120%",height:"100%",objectFit:"cover",position:"absolute",left:"-10%",top:0,willChange:"transform",backfaceVisibility:"hidden",transform:"translate3d(0,0,0)",perspective:"1000px"}}):t.jsx("div",{ref:c=>{E.current[a]=c},className:"showcase-image",style:{width:"120%",height:"100%",backgroundImage:`url(${e.img})`,backgroundSize:"cover",backgroundPosition:"center",position:"absolute",left:"-10%",top:0,backfaceVisibility:"hidden"}})]}),t.jsxs("div",{style:{display:"flex",flexDirection:r?"column":"row",alignItems:"flex-start",justifyContent:"space-between",gap:r?"1rem":"0"},children:[t.jsxs("div",{children:[t.jsx("h3",{className:"showcase-title",style:{fontSize:"clamp(1.2rem, 3.5vw, 2.5rem)",fontWeight:800,margin:"0 0 0.25rem 0",color:"#000",textTransform:"uppercase",letterSpacing:"-1px",lineHeight:1},children:e.title}),t.jsx("p",{className:"showcase-subtitle",style:{fontSize:r?"0.8rem":"1rem",color:"#888",margin:0,fontFamily:"var(--font-mono)",textTransform:"uppercase",letterSpacing:"2px"},children:e.subtitle})]}),t.jsx("span",{style:{fontSize:r?"2.5rem":"4rem",fontWeight:800,color:"#AAAAAA",lineHeight:.8,alignSelf:r?"flex-end":"flex-start",opacity:.4},children:e.id})]}),t.jsx("p",{style:{marginTop:r?"0.5rem":"1.5rem",paddingTop:"0.1rem",fontSize:"clamp(0.9rem, 1vw, 1.1rem)",lineHeight:1.5,color:"#444",whiteSpace:"normal"},children:e.desc})]},a)),t.jsx("div",{style:{minWidth:"40vw"}})]}),t.jsx("style",{children:`
                @media (max-width: 768px) {
                    /* MOBILE: GSAP PINNING ENABLED (Vertical Scroll drives Horizontal movement) */
                    .showcase-slider-container {
                        height: 100vh !important;
                        overflow: hidden !important; /* Critical for Pinning */
                        background-color: #FFF !important;
                        display: flex;
                        align-items: center;
                    }

                    .showcase-track {
                        display: flex !important;
                        flex-direction: row !important;
                        width: max-content !important;
                        height: 100% !important;
                        padding: 0 5vw !important;
                        gap: 1rem !important;
                        /* Transform is handled by GSAP now */
                        align-items: center !important;
                    }

                    .showcase-headline {
                        min-width: 90vw !important; /* Wider headline on mobile */
                        height: auto !important;
                        margin-bottom: 0 !important;
                        margin-right: 1rem !important;
                        align-items: flex-start !important;
                        flex-shrink: 0;
                        padding-left: 1rem;
                    }

                    .showcase-card {
                        width: 85vw !important;
                        max-width: 85vw !important;
                        min-width: 85vw !important;
                        height: 80vh !important; /* SC: Increased to 80vh for max safe height */
                        margin: 0 !important;
                        padding: 1.5rem 1.5rem 3rem 1.5rem !important; /* SC: Extra bottom padding buffer */
                        flex-shrink: 0;
                        border-right: 1px solid rgba(0,0,0,0.05);
                        overflow-y: visible !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: flex-start !important;
                    }

                    .showcase-media-window {
                        height: 30% !important; /* SC: Reduced to 30% to prioritize text */
                        min-height: 140px !important;
                        flex-shrink: 0;
                        overflow: hidden !important;
                        margin-bottom: 1.5rem !important; /* Ensure gap */
                    }

                    .showcase-video, .showcase-image {
                        width: 160% !important; /* Max Mobile Parallax */
                        height: 100% !important;
                        left: -30% !important;
                        position: absolute !important;
                        top: 0 !important;
                        object-fit: cover !important;
                        backface-visibility: hidden !important;
                        /* transform: translate3d(0,0,0) !important; REMOVED TO ENABLE GSAP PARALLAX */
                    }

                    .floating-button {
                        display: none !important;
                    }
                }
            `})]})};export{Y as default};
