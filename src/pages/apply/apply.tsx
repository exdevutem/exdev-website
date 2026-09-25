import "./apply.css";
import { useState, useRef } from "react";
import Modal from './components/modal/modal'; // sube un nivel y entra a la carpeta modal
import { useEffect } from "react";   // si no lo tienes ya
import { postularUsuario } from './services/applyService';

const preguntas = [
  {
    pregunta: "¿Solo pueden postular estudiantes de Ingeniería en Informática?",
    respuesta:
      "No, cualquier persona interesada en realizar proyectos de innovación puede unirse al club, independientemente de su carrera. Lo importante es tener ganas de aprender, colaborar y aportar con ideas creativas.",
  },
  {
    pregunta: "¿Necesito tener experiencia previa para ingresar al club?",
    respuesta:
      "No es necesario contar con experiencia previa. Nuestro objetivo es que los integrantes crezcan y se desarrollen dentro del club. Lo que más valoramos son las ganas de participar y comprometerse con las actividades.",
  },
];

function sanitizeTextInput(value: string): string {
  return value.replace(/[^\p{L}\p{N}\p{P}\p{Zs}\n]/gu, '');
}


function Apply() {

  const refs = {
  nombre: useRef<HTMLInputElement>(null),
  rut: useRef<HTMLInputElement>(null),
  edad: useRef<HTMLInputElement>(null),
  correo: useRef<HTMLInputElement>(null),
  carrera: useRef<HTMLDivElement>(null),
  anioIngreso: useRef<HTMLDivElement>(null),
  anioMalla: useRef<HTMLDivElement>(null),
  disponibilidad: useRef<HTMLDivElement>(null),
  areas: useRef<HTMLDivElement>(null), // si es un bloque de checkboxes
  ayudantia: useRef<HTMLTextAreaElement>(null), // si es un bloque de checkboxes
  unirse: useRef<HTMLTextAreaElement>(null), // si es un bloque de checkboxes
  proyectos: useRef<HTMLTextAreaElement>(null), // si es un bloque de checkboxes
  redes: useRef<HTMLTextAreaElement>(null), // si es un bloque de checkboxes
  nombresMas: useRef<HTMLTextAreaElement>(null), // si es un bloque de checkboxes
  pitch: useRef<HTMLTextAreaElement>(null), // si es un bloque de checkboxes
  apodo: useRef<HTMLTextAreaElement>(null), // si es un bloque de checkboxes
  //emojiAnimal: useRef<HTMLTextAreaElement>(null), // si es un bloque de checkboxes
  //momazo: useRef<HTMLTextAreaElement>(null), // si es un bloque de checkboxes
};
  //modal
  const [modalData, setModalData] = useState({
  isOpen: false,
  isSuccess: true,
  title: '',
  message: '',

});
  //Drop zone//
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Abrir el selector al hacer click en el botón
  const handleClick = () => {
    inputRef.current?.click();
  };

  // Manejo de archivos seleccionados
  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Evento cuando seleccionas archivo manualmente
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // Arrastrar y soltar
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

      // Estado para preguntas frecuentes
  const [abiertas, setAbiertas] = useState<number[]>([]);

  const togglePregunta = (index: number) => {
    if (abiertas.includes(index)) {
      setAbiertas(abiertas.filter((i) => i !== index));
    } else {
      setAbiertas([...abiertas, index]);
    }
  };


// Selectores

const [carrera, setCarrera] = useState("");
const [anioIngreso, setAnioIngreso] = useState("");
const [anioMalla, setAnioMalla] = useState("");
const [disponibilidad, setDisponibilidad] = useState("");

 // CAMPOS DE TEXTO
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [rut, setRut] = useState("");
  const [correo, setCorreo] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");

 // Otro campo
  const [otroChecked, setOtroChecked] = useState(false);
  const [otroTexto, setOtroTexto] = useState("");

 // Áreas seleccionadas
  const [areasSeleccionadas, setAreasSeleccionadas] = useState<string[]>([]);
  const areas = [
  "Frontend",
  "Backend",
  "Aplicaciones móviles",
  "Robótica",
  "Inteligencia Artificial",
  "Diseño",
  "Videojuegos",
  "UX/UI",
  "Fotografía",
  "Desarrollo web",
  "Machine Learning",
  "Base de datos",
  "Modelado 3D",
  "Ilustración",
  "Carpintería",
  "Community Manager",
  "Electrónica",
  "Edición de video",
  "Ciberseguridad",
  "Otro",
  ];

const selectCarrera = (valor: string) => setCarrera(valor);
const selectAnioIngreso = (valor: string) => setAnioIngreso(valor);
const selectAnioMalla = (valor: string) => setAnioMalla(valor);
const selectDisponibilidad = (valor: string) => setDisponibilidad(valor);

 // Handlers de inputs
    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let valor = e.target.value
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    .replace(/\s{2,}/g, ' ');

  if (valor.trim().split(/\s+/).length > 4) {
    valor = valor.trim().split(/\s+/).slice(0, 4).join(' ');
  }

  setNombre(valor);
};

// edad//
const handleEdadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const valor = e.target.value.replace(/\D/g, '').slice(0, 2);
  setEdad(valor);
};

//rut//
const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let raw = e.target.value.replace(/\D/g, '');
  if (raw.length > 9) raw = raw.slice(0, 9);
  let formatted = raw.length > 1
    ? raw.slice(0, raw.length - 1) + '-' + raw.slice(-1)
    : raw;
  formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  setRut(formatted);
};

// Manejo del input de correo
const handleCorreoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let valor = e.target.value.toLowerCase();

  // Si hay más de 2 partes por @, conservar solo la primera y la segunda
  const partes = valor.split("@");
  if (partes.length > 2) {
    valor = partes[0] + "@" + partes[1];
  }

  // Ahora separamos en antes y después del @ (si existe)
  const tieneArroba = valor.indexOf("@") !== -1;
  const [antesArroba, despuesArrobaRaw] = valor.split("@");

  // Permitir letras, números y puntos en la parte local
  let nuevaAntes = (antesArroba || "").replace(/[^a-z0-9.]/g, "");

  // Evitar múltiples puntos consecutivos
  nuevaAntes = nuevaAntes.replace(/\.{2,}/g, ".");

  // Evitar punto al inicio
  nuevaAntes = nuevaAntes.replace(/^\./, "");

  // Procesar la parte después de @ (mantenerla vacía si el usuario solo escribió '@')
  let nuevaDespues = "";
  if (tieneArroba) {
    // Si el usuario escribió '@' pero nada después, despuesArrobaRaw === "" (queremos conservar el @)
    // Permitimos solo letras en el dominio (utem.cl)
    nuevaDespues = (despuesArrobaRaw !== undefined) ? despuesArrobaRaw.replace(/[^a-z.]/g, "") : "";
    // También limitar a una sola ocurrencia de "utem.cl" parcial no es necesario aquí; la validación final lo hará
  }

  // Reconstruir: si había @, mantenerlo aunque nuevaDespues sea ""
  valor = nuevaAntes + (tieneArroba ? "@" + nuevaDespues : "");

  setCorreo(valor);
};




// Validar FUNCION//
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const nuevosErrores: {[key: string]: string} = {};

  // Nombre
  if (!nombre.trim()) nuevosErrores["nombre"] = "Debes ingresar tu nombre";

  // RUT
  const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
  if (!rut.trim()) {
    nuevosErrores["rut"] = "Debes ingresar tu RUT";
  } else if (!rutRegex.test(rut)) {
    nuevosErrores["rut"] = "Formato inválido. Ejemplo: 20.123.456-7";
  }

  // Edad
const edadTrim = edad.trim();
if (!edadTrim) {
  nuevosErrores["edad"] = "Debes ingresar tu edad";
} else {
  const edadNum = parseInt(edadTrim, 10);

  // Si quieres QUE SEA estrictamente mayor a 18 (es decir: 19,20,...)
  if (isNaN(edadNum) || edadNum < 18) {
    nuevosErrores["edad"] = "Debes ser mayor de 18 años";
  }}

// Correo UTEM válido: permite "nombre@utem.cl" o "nombre.apellido@utem.cl"
const correoRegex = /^[a-z0-9]+(\.[a-z0-9]+)*@utem\.cl$/i;

// Uso en handleSubmit
if (!correo.trim()) {
  nuevosErrores["correo"] = "Debes ingresar tu correo";
} else if (!correoRegex.test(correo)) {
  nuevosErrores["correo"] =
    "Correo inválido. Ejemplo: juan.perez@utem.cl o jcortesa@utem.cl";
}

  // Selectores
  if (!carrera) nuevosErrores["carrera"] = "Debes seleccionar tu carrera";
  if (!anioIngreso) nuevosErrores["anioIngreso"] = "Debes seleccionar tu año de ingreso";
  else if (!añosIngreso.includes(anioIngreso)) nuevosErrores["anioIngreso"] = "Selecciona un año dentro de los últimos 10 años o el actual";
  if (!anioMalla) nuevosErrores["anioMalla"] = "Debes seleccionar tu año que cursas";
  if (!disponibilidad) nuevosErrores["disponibilidad"] = "Debes seleccionar tu disponibilidad";

  // Áreas: exactamente 3
  if (areasSeleccionadas.length === 0) 
    nuevosErrores["areas"] = "Debes seleccionar al menos 1 área";

  // Textareas
  const textareas = ["ayudantia", "unirse", "proyectos", "redes", "nombresMas", "pitch"];
  textareas.forEach(id => {
    const valor = (document.getElementById(id) as HTMLTextAreaElement | null)?.value;
    if (!valor || !valor.trim()) nuevosErrores[id] = "Este campo es obligatorio";
  });

  setErrores(nuevosErrores);
  if (Object.keys(nuevosErrores).length > 0) {
  const firstErrorKey = Object.keys(nuevosErrores)[0];
  refs[firstErrorKey as keyof typeof refs]?.current?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  return;
}
try{
        const datos = {
      nombre_completo: nombre,
      rut: (document.getElementById("rut") as HTMLInputElement)?.value.replace(/\./g, "") || "",
      edad: Number(edad),
      correo_institucional: correo,
      campus: obtenerCampusDesdeCarrera(carrera),
      carrera,
      anio_ingreso: Number(anioIngreso),
      anio_actual: Number(anioMalla),
      area_interes1: areasSeleccionadas[0] === "Otro" ? otroTexto : areasSeleccionadas[0] || null,
      area_interes2: areasSeleccionadas[1] === "Otro" ? otroTexto : areasSeleccionadas[1] || null,
      area_interes3: areasSeleccionadas[2] === "Otro" ? otroTexto : areasSeleccionadas[2] || null,
      ayudantias: (document.getElementById("ayudantia") as HTMLTextAreaElement)?.value || "",
      horas_disponibles_semanales: Number(disponibilidad.split(" ")[0]),
      motivo_postulacion: (document.getElementById("unirse") as HTMLTextAreaElement)?.value || "",
      proyecto_idea: (document.getElementById("proyectos") as HTMLTextAreaElement)?.value || "",
      portafolio: (document.getElementById("redes") as HTMLTextAreaElement)?.value || "",
      postulacion_conjunta: (document.getElementById("nombresMas") as HTMLTextAreaElement)?.value || null,
      pitch: (document.getElementById("pitch") as HTMLTextAreaElement)?.value || "",
      apodo: (document.getElementById("apodo") as HTMLTextAreaElement)?.value || ""
    };
    const result = await postularUsuario(datos);

    if (result?.responseCode === "I001") {
      setModalData({
        isOpen: true,
        isSuccess: true,
        title: "Postulación Exitosa",
        message: "¡Tu postulación ha sido enviada correctamente!",
        
      });
    } else {
      setModalData({
        isOpen: true,
        isSuccess: false,
        title: "Error en la Postulación",
        message: result?.message || "Ocurrió un error inesperado.",
        
      });
    }
}catch(error){
    console.error("❌ Error al enviar postulación:", error);
    setModalData({
      isOpen: true,
      isSuccess: false,
      title: "Error inesperado",
      message: "No se pudo procesar tu postulación. Intenta más tarde.",
     
    });
}

};



/////////////////////////////////////////////////////////////////////////////////////////////////////


const handleAreaChange = (area: string) => {
  let nuevas = [...areasSeleccionadas];

  if (nuevas.includes(area)) {
    // Quitar si ya estaba seleccionada
    nuevas = nuevas.filter(a => a !== area);

    if (area === "Otro") {
      setOtroChecked(false);
      setOtroTexto("");
    }
  } else {
    // Solo agregar si aún no hay 3 seleccionadas
    if (nuevas.length < 3) {
      nuevas.push(area);

      if (area === "Otro") setOtroChecked(true);
    } else {
      alert("Solo puedes seleccionar 3 áreas");
    }
  }

  setAreasSeleccionadas(nuevas);
};


  // mas compañeros//
const [nombresMas, setNombresMas] = useState("");
const handleNombresMasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let valor = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\-\s]/g, '')
                             .replace(/\-+/g, '-')
                             .replace(/\s{2,}/g, ' ');
  setNombresMas(valor);
};


// Estado para abrir/cerrar cada selector
const [carreraOpen, setCarreraOpen] = useState(false);
const [anioIngresoOpen, setAnioIngresoOpen] = useState(false);
const [anioMallaOpen, setAnioMallaOpen] = useState(false);
const [disponibilidadOpen, setDisponibilidadOpen] = useState(false);

const toggleCarrera = () => setCarreraOpen(!carreraOpen);
const toggleAnioIngreso = () => setAnioIngresoOpen(!anioIngresoOpen);
const toggleAnioMalla = () => setAnioMallaOpen(!anioMallaOpen);
const toggleDisponibilidad = () => setDisponibilidadOpen(!disponibilidadOpen);

    //DATOS
  const carreras = {
 "Campus Central": [
        { id: 21047, nombre: "21047 Arquitectura"},
        { id: 21012, nombre: "21012 Contador Público y Auditor"},
        { id: 21033, nombre: "21033 Derecho"},
        { id: 21024, nombre: "21024 Diseño en Comunicación Visual"},
        { id: 21023, nombre: "21023 Diseño Industrial"},
        { id: 21074, nombre: "21074 Ingeniería Civil en Obras Civiles"},
        { id: 21087, nombre: "21087 Ingeniería Civil en Prevención de Riesgos y Medio Ambiente"},
        { id: 21032, nombre: "21032 Ingeniería en Construcción"},
        { id: 21053, nombre: "21053 Psicología"},
        { id: 21056, nombre: "21056 Química y Farmacia"},
        { id: 21034, nombre: "21034 Trabajo Social"}
    ],
    "Campus Ñuñoa": [
        { id: 21046, nombre: "21046 Bachillerato en Ciencias de la Ingeniería"},
        { id: 21071, nombre: "21071 Dibujante Proyectista"},
        { id: 21057, nombre: "21057 Ingeniería Civil Biomédica"},
        { id: 21075, nombre: "21075 Ingeniería Civil Electrónica"},
        { id: 21049, nombre: "21049 Ingeniería Civil en Ciencia de Datos"},
        { id: 21041, nombre: "21041 Ingeniería Civil en Computación Mención Informática"},
        { id: 21096, nombre: "21096 Ingeniería Civil en Mecánica"},
        { id: 21076, nombre: "21076 Ingeniería Civil Industrial"},
        { id: 21055, nombre: "21055 Ingeniería Civil Matemática"},
        { id: 21069, nombre: "21069 Ingeniería Civil Química"},
        { id: 21031, nombre: "21031 Ingeniería en Geomensura"},
        { id: 21030, nombre: "21030 Ingeniería en Informática"},
        { id: 21045, nombre: "21045 Ingeniería Industrial"},
        { id: 21073, nombre: "21073 Ingeniería en Biotecnología"},
        { id: 21054, nombre: "21054 Ingeniería en Alimentos"},
        { id: 21083, nombre: "21083 Química Industrial"}

    
    ],
    "Campus Providencia": [
        { id: 21089, nombre: "21089 Administración Pública"},
        { id: 21002, nombre: "21002 Bibliotecología y Documentación"},
        { id: 21048, nombre: "21048 Ingeniería Comercial"},
        { id: 21081, nombre: "21081 Ingeniería en Comercio Internacional"},
        { id: 21082, nombre: "21082 Ingeniería en Gestión Turística"}
    ]};

    const añosMalla = [
        { id: 1, nombre: "1° Año" }, { id: 2, nombre: "2° Año" },
        { id: 3, nombre: "3° Año" }, { id: 4, nombre: "4° Año" },
        { id: 5, nombre: "5° Año" }, { id: 6, nombre: "6° Año" }
    ];

        const horasDisponibles = [
        { id: 1, nombre: "1 hora" }, { id: 2, nombre: "2 horas" },
        { id: 3, nombre: "3 horas" }, { id: 4, nombre: "4 horas" },
        { id: 5, nombre: "5 horas" }, { id: 6, nombre: "6 horas" }
    ];

    const anioActualIngreso = Number(new Intl.DateTimeFormat('en', {
      year: 'numeric', timeZone: 'America/Santiago',
    }).format(new Date()));
    const añosIngreso = Array.from({ length: 11 }, (_, indice) => String(anioActualIngreso - indice));

  // Accordion preguntas frecuentes
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(null);
  const toggleQuestion = (index: number) =>
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);

  //MODAL//
  const [isModalOpen, setIsModalOpen] = useState(false);
//const [selectedMedia, setSelectedMedia] = useState<string>("");

//ERRORES//
const [errores, setErrores] = useState<{[key: string]: string}>({});


// Medios (GIFs/WebM) ubicados en public/assets
const mediaFiles = [
  "/assets/gif/gif1.gif",
  "/assets/gif/gif2.webm",
  "/assets/gif/gif3.gif",
  "/assets/gif/gif4.gif",
  "/assets/gif/gif5.gif",
];


useEffect(() => {
  if (isModalOpen) {
    const timer = setTimeout(() => {
      setIsModalOpen(false);
      // Reiniciar campos si quieres
      setNombre("");
      setRut("");
      setEdad("");
      setCorreo("");
      setCarrera("");
      setAnioIngreso("");
      setAnioMalla("");
      setDisponibilidad("");
      setAreasSeleccionadas([]);
      setOtroChecked(false);
      setOtroTexto("");
    }, 300000); // 3 segundos
    return () => clearTimeout(timer);
  }
}, [isModalOpen]);

const obtenerCampusDesdeCarrera = (nombreCarrera: string): string => {
  for (const [campus, lista] of Object.entries(carreras)) {
    if (lista.some(c => c.nombre === nombreCarrera)) {
      return campus;
    }
  }
  return "Campus desconocido";
};


  return (
    <>

          {/* Main */}
      <main className="contenido">
        <section className="formulario-card">
  <div className="form-card">
    <div className="form-header">
      <h2>Formulario ExDev</h2>
      <p>¡Bienvenido/a al formulario de postulación ExDev! Queremos conocerte mejor para saber cómo puedes crecer con nosotros y cómo podemos trabajar juntos en proyectos increíbles. Este formulario no toma más de 5-7 minutos.</p>
    </div>

          <form id="miFormulario" onSubmit={handleSubmit}>
            {/* Campo 1 */}
            <label htmlFor="nombre">1. Nombre completo</label>
            <input ref={refs.nombre} type="text" value={nombre} onChange={handleNombreChange} required/>
            {errores["nombre"] && <p className="error">{errores["nombre"]}</p>}

            {/* Campo 2 */}
            <label htmlFor="rut">2. Rut</label>
            <input ref={refs.rut} type="text" id='rut' value={rut} onChange={handleRutChange} required />
            {errores["rut"] && <p className="error">{errores["rut"]}</p>}

            {/* Campo 3 */}
            <label htmlFor="edad">3. Edad</label>
            <input ref={refs.edad} type="text"   min={0} max={99}  placeholder="20" value={edad} onChange={handleEdadChange} required />
            {errores["edad"] && <p className="error">{errores["edad"]}</p>}

            {/* Campo 4 */}
            <label htmlFor="correo">4. Correo institucional</label>
            <input ref={refs.correo} type="text" placeholder="usuario@utem.cl" value={correo} onChange={handleCorreoChange}/>
            {errores["correo"] && <p className="error">{errores["correo"]}</p>}

            {/* Campo 5 */}
            <label>5. Carrera / especialidad</label>
            <div ref={refs.carrera} className="form-field selector-mobile">
            <button type="button" className="selector-btn" onClick={toggleCarrera}>
                {carrera || "Seleccionar carrera"}
            </button>
            {carreraOpen && (
                <ul className="custom-list">
                {Object.entries(carreras).map(([campus, lista]) => (
                    <li key={campus}>
                    <strong>{campus}</strong>
                    <ul>
                        {lista.map(c => (
                        <li
                            key={c.id}
                            onClick={() => {
                            selectCarrera(c.nombre);
                            setCarreraOpen(false);
                            }}
                        >
                            {c.nombre}
                        </li>
                        ))}
                    </ul>
                    </li>
                ))}
                </ul>
            )}
            </div>
            <input type="hidden" name="carrera" value={carrera} required />
            {errores["carrera"] && <p className="error">{errores["carrera"]}</p>}

            {/* Campo 6 */}
            <label>6. Año ingreso</label>
            <div ref={refs.anioIngreso} className="form-field selector-mobile">
            <button type="button" className="selector-btn" onClick={toggleAnioIngreso}>
                {anioIngreso || "Seleccionar año de ingreso"}
            </button>
            {anioIngresoOpen && (
                <ul className="custom-list">
                {añosIngreso.map(año => (
                    <li
                    key={año}
                    onClick={() => {
                        selectAnioIngreso(año);
                        setAnioIngresoOpen(false);
                    }}
                    >
                    {año}
                    </li>
                ))}
                </ul>
            )}
            </div>
            <input type="hidden" name="anioIngreso" value={anioIngreso} required />
            {errores["anioIngreso"] && <p className="error">{errores["anioIngreso"]}</p>}

            {/* Campo 7 */}
            <label>7. Año que cursa actualmente</label>
            <div ref={refs.anioMalla} className="form-field selector-mobile">
            <button type="button" className="selector-btn" onClick={toggleAnioMalla}>
                {anioMalla || "Seleccionar año que cursa"}
            </button>
            {anioMallaOpen && (
                <ul className="custom-list">
                {añosMalla.map(año => (
                    <li
                    key={año.id}
                    onClick={() => {
                        selectAnioMalla(String(año.id));
                        setAnioMallaOpen(false);
                    }}
                    >
                    {año.nombre}
                    </li>
                ))}
                </ul>
            )}
            </div>
            <input type="hidden" name="anioMalla" value={anioMalla} required />
            {errores["anioMalla"] && <p className="error">{errores["anioMalla"]}</p>}

            {/* Campo 8 */}
            <label>8. ¿En qué áreas te interesa participar o aprender?</label>
                <div ref={refs.areas} className="areas-container">
                {areas.map((area, i) => {
                    const selected = areasSeleccionadas.includes(area);
                    return (
                    <label key={i} className={`area-chip ${selected ? "selected" : ""}`}>
                        <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleAreaChange(area)}
                        />
                        <span className="chip-text">{area}</span>
                    </label>
                    );
                })}
                </div>

            {otroChecked && ( <input type="text" placeholder="Especifica otro" value={otroTexto} onChange={(e) => setOtroTexto(e.target.value)} />)}
            {errores["areas"] && <p className="error">{errores["areas"]}</p>}
  

            {/* Campos 9 a 18 */}
            <div>
            <label htmlFor="ayudantia">
              9. ¿Fuiste o eres ayudante en algún ramo?
            </label>
            <p className="campo-ayuda">
              En caso de que no, ¿te gustaría serlo? Cuéntanos brevemente.
            </p>
            <textarea 
                ref={refs.ayudantia} 
                id="ayudantia" 
                required
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.value = sanitizeTextInput(target.value);
                }}
                ></textarea>
          </div>
          {errores["ayudantia"] && <p className="error">{errores["ayudantia"]}</p>}

            <label>10. Horas semanales para el club</label>
            <div ref={refs.disponibilidad} className="form-field selector-mobile">
              <button type="button" className="selector-btn" onClick={toggleDisponibilidad}>
                {disponibilidad || "Seleccionar cantidad de horas"}
              </button>
              {disponibilidadOpen && (
                <ul className="custom-list">
                  {horasDisponibles.map(h => (
                    <li key={h.id} onClick={() => { selectDisponibilidad(h.nombre); setDisponibilidadOpen(false); }}>
                      {h.nombre}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input type="hidden" name="disponibilidad" value={disponibilidad} required />
            {errores["disponibilidad"] && <p className="error">{errores["disponibilidad"]}</p>}

          <div>
            <label htmlFor="unirse">
            11. ¿Por qué quieres unirte?
            </label>
            <p className="campo-ayuda">
              motivaciones, expectativas y lo que más te gustaría lograr con nosotros.
            </p>
            <textarea 
                ref={refs.unirse} 
                id="unirse" 
                required
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.value = sanitizeTextInput(target.value);
                }}
                ></textarea>
          </div>
          {errores["unirse"] && <p className="error">{errores["unirse"]}</p>}

             <div>
            <label htmlFor="proyectos">
            12. ¿Tienes algún proyecto en mente, que te gustaría desarrollar en Exdev?
            </label>
            <p className="campo-ayuda">
              Queremos conocer tus ideas, no importa si están en borrador.
            </p>
            <textarea 
                ref={refs.proyectos} 
                id="proyectos" 
                required
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.value = sanitizeTextInput(target.value);
                }}
                ></textarea>
          </div>
          {errores["proyectos"] && <p className="error">{errores["proyectos"]}</p>}

          <div>
            <label htmlFor="redes">
            13. ¿Tienes algún portafolio que quieras compartir?
            </label>
            <p className="campo-ayuda">
              Github, instagram, behance, etc.
            </p>
            <textarea 
                ref={refs.redes} 
                id="redes" 
                required
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.value = sanitizeTextInput(target.value);
                }}
                ></textarea>
          </div>
          {errores["redes"] && <p className="error">{errores["redes"]}</p>}

            <label>14. ¿Te estás postulando con alguien más? Déjanos sus nombres.</label>
            <textarea 
                ref={refs.nombresMas} 
                id="nombresMas" 
                required
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.value = sanitizeTextInput(target.value);
                }}
                ></textarea>
            {errores["nombreMas"] && <p className="error">{errores["nombreMas"]}</p>}

            <div>
            <label htmlFor="pitch">
            15. Describe un mini pitch sobre ti.
            </label>
            <p className="campo-ayuda">
              Cuéntanos en menos de 5 líneas quién eres, que te motiva y que te gusta hacer en tu tiempo libre.
            </p>
            <textarea 
                ref={refs.pitch} 
                id="pitch" 
                required
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.value = sanitizeTextInput(target.value);
                }}
                ></textarea>
          </div>
          {errores["pitch"] && <p className="error">{errores["pitch"]}</p>}

            <label>16. Apodo o nombre por el que prefieras ser llamado.</label>
            <textarea 
                ref={refs.apodo} 
                id="apodo" 
                required
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.value = sanitizeTextInput(target.value);
                }}
                ></textarea>
            {errores["apodo"] && <p className="error">{errores["apodo"]}</p>}
            {/*
            <label>17. Emoji de tu animal favorito (o uno que te represente)</label>
            <textarea ref={refs.emojiAnimal} id="emojiAnimal" placeholder="🦊" ></textarea>
            {errores["emojiAnimal"] && <p className="error">{errores["emojiAnimal"]}</p>}

            <div>
            <label htmlFor="momazo">
            18. Deja el último meme que te dio risa.
            </label>
            <p className="campo-ayuda">
              Link, imagen o descripción.
            </p>
            <textarea ref={refs.momazo} id="momazo" ></textarea>
          </div>
          {errores["momazo"] && <p className="error">{errores["momazo"]}</p>}

            <div>
                  
                  <div
                    id="drop-zone"
                    className="drop-zone"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{
                      border: "2px dashed #ccc",
                      padding: "20px",
                      textAlign: "center",
                      borderRadius: "10px",
                    }}
                  >
                    <p>📂 Arrastra tu meme aquí o haz click para subir</p>
                    <button type="button" className="btn-meme" onClick={handleClick}>
                      Seleccionar meme
                    </button>
                    <input
                      type="file"
                      ref={inputRef}
                      onChange={handleFileChange}
                      accept="image/*,image/gif"
                      style={{ display: "none" }}
                    />

                    
                    <div className="preview-files" style={{ marginTop: "15px" }}>
                      {files.map((file, i) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          width={100}
                          style={{ margin: "5px", borderRadius: "8px" }}
                        />
                      ))}
                    </div>
                  </div>
                  
                </div>
                */}
            <button type="submit" className="btn-enviar">Enviar</button>
          </form>

          {/* Preguntas frecuentes */}
            <section className="questions">
              <h2 className="subtitle3">Preguntas frecuentes</h2>
              <p className="questions__paragraph">Resuelve tus dudas antes de unirte.</p>
              <div className="questions__container">
                {preguntas.map((item, i) => (
                  <div key={i} className={`question ${abiertas.includes(i) ? "open" : ""}`}>
                    <div className="question__header" onClick={() => togglePregunta(i)}>
                      <span>{item.pregunta}</span>
                      <div className="arrow">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          className={`arrow-icon ${abiertas.includes(i) ? "open" : ""}`}
                        >
                          <path d="m6.293 13.293 1.414 1.414L12 10.414l4.293 4.293 1.414-1.414L12 7.586z" />
                        </svg>
                      </div>
                    </div>
                    <div
                      className="question__content"
                      style={{
                        maxHeight: abiertas.includes(i) ? "500px" : "0",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease",
                      }}
                    >
                      <p>{item.respuesta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
             </div>
        </section>
      </main>

          <Modal
            isOpen={modalData.isOpen}
            onClose={() => setModalData({ ...modalData, isOpen: false })}
           
            title={modalData.title}
            message={modalData.message}
            isSuccess={modalData.isSuccess}
            />



    </>
      );
}

export default Apply;
