export const es = {
  meta: {
    title: "Laboratorio de traducción - traducción de ARNm y simulador de mutaciones",
  },

  languageToggle: {
    label: "Idioma",
    switchTo: "Cambiar idioma a inglés",
    english: "EN",
    spanish: "ES",
  },

  nav: {
    walkthroughIcon: "ADN",
    walkthroughWide: "Recorrido de traducción",
    walkthroughShort: "Traducción",
    mutationIcon: "Lab",
    mutationWide: "Simulador de mutaciones",
    mutationShort: "Mutación",
    codonIcon: "ARN",
    codonWide: "Tabla de codones",
    codonShort: "Codones",
    educationIcon: "Edu",
    educationWide: "Educación",
    educationShort: "Educación",
  },

  shared: {
    mrna: "ARNm",
    growingPolypeptide: "Polipéptido en crecimiento:",
    emergingPolypeptideAria: "Polipéptido en crecimiento saliendo del ribosoma",
    ribosomeAria: "Ribosoma",
    largeSubunitAria: "Subunidad grande 60S",
    smallSubunitAria: "Subunidad pequeña 40S",
    controls: {
      nextStep: "Siguiente paso ->",
      auto: "Auto",
      pause: "Pausa",
      reset: "Reiniciar",
      speed: "Velocidad",
    },
    phase: {
      init: "Fase 1: Iniciación",
      elong: "Fase 2: Elongación",
      term: "Fase 3: Terminación",
    },
    guidedTour: {
      introduction: "Introducción",
      stepOf: ({ current, total }) => `Paso ${current} de ${total}`,
      back: "Atrás",
      skip: "Omitir",
      next: "Siguiente",
      finish: "Finalizar",
    },
  },

  walkthrough: {
    readyTitle: "Listo",
    readyText:
      "Presiona <strong>Siguiente paso</strong> para comenzar. Recorreremos " +
      "las tres fases de la traducción: <em>iniciación</em>, <em>elongación</em> " +
      "y <em>terminación</em>. Cada paso explica exactamente qué hace el " +
      "ribosoma y por qué.",
    stepLabel: "Paso",
    currentCodon: "Codón actual",
    anticodon: "anticodón",
    waiting: "en espera",
    steps: {
      mrnaArrives: {
        title: "El ARNm llega al citoplasma",
        text:
          "El <strong>ARNm</strong> maduro salió del núcleo después de la " +
          "transcripción y el procesamiento (se agregó la caperuza 5', se " +
          "eliminaron los intrones y se añadió la cola poli-A). Ahora flota " +
          "en el citoplasma, con su secuencia de codones expuesta y lista " +
          "para leerse. La dirección siempre es <em>5' -> 3'</em>. Nuestro " +
          "ARNm tiene 8 codones: <em>AUG CCU GAA UUC GGA AAG CCA UGA</em>.",
      },
      smallSubunit: {
        title: "La subunidad pequeña 40S busca AUG",
        text:
          "La <strong>subunidad ribosomal pequeña 40S</strong>, cargada con " +
          "factores de iniciación y un <em>Met-ARNt iniciador</em> especial, " +
          "se une cerca de la caperuza 5' del ARNm. Luego <strong>escanea</strong> " +
          "el ARNm en dirección 5'->3' buscando el primer codón <em>AUG</em>. " +
          "El reconocimiento usa el <strong>consenso de Kozak</strong> (el " +
          "contexto de la secuencia alrededor), no solo el AUG. Por eso no " +
          "todos los AUG de un ARNm se usan como inicio.",
      },
      augFound: {
        title: "AUG encontrado - el Met-ARNt se fija en el sitio P",
        text:
          "El escáner encuentra <em>AUG</em>. El anticodón del ARNt iniciador " +
          "(<em>UAC</em>) se aparea con <em>AUG</em> y se fija en el " +
          "<strong>sitio P</strong> (sitio peptidil). Este es el " +
          "<strong>único</strong> ARNt que entra directamente al sitio P; " +
          "todos los ARNt posteriores deben entrar por el sitio A. El codón " +
          "de inicio también especifica <em>metionina</em> como primer " +
          "aminoácido.",
      },
      largeSubunit: {
        title: "La 60S se une -> ribosoma 80S ensamblado",
        text:
          "La <strong>subunidad grande 60S</strong> se une desde arriba y " +
          "forma el <strong>ribosoma 80S</strong> completo. Los factores de " +
          "iniciación son expulsados. Ahora el ribosoma tiene tres sitios " +
          "funcionales:<br><br>" +
          '<span style="color:var(--tx3)">Sitio E</span> (salida): por aquí ' +
          "salen los ARNt usados<br>" +
          '<span style="color:var(--pu)">Sitio P</span> (peptidil): ' +
          "sostiene el ARNt con la cadena en crecimiento<br>" +
          '<span style="color:var(--am)">Sitio A</span> (aminoacil): ' +
          "aquí llegan los ARNt nuevos<br><br>" +
          "El Met-ARNt está en el sitio P. El sitio A queda posicionado sobre " +
          "el <em>segundo codón</em> (CCU). " +
          '<strong class="hl-green">Iniciación completa - empieza la elongación!' +
          "</strong>",
      },
      arrive: {
        title: ({ aminoAcid, codon }) =>
          `El ARNt entrega ${aminoAcid} (codón ${codon})`,
        text: ({ aminoAcid, codon, anticodon }) =>
          "Un <strong>ARNt cargado</strong> que transporta <em>" +
          aminoAcid +
          '</em> entra al <strong style="color:var(--am)">sitio A</strong>. ' +
          "Su anticodón <em>" +
          anticodon +
          "</em> se aparea con el codón de ARNm <em>" +
          codon +
          "</em>. El ribosoma verifica la coincidencia. Si el anticodón no " +
          "complementa al codón, el ARNt se rechaza y otro lo intenta. Esta " +
          "es la <strong>implementación física del código genético</strong>: " +
          "el apareamiento codón-anticodón selecciona el aminoácido correcto." +
          "<br><br>Búscalo en la tabla: <em>" +
          codon +
          "</em> -> <em>" +
          aminoAcid +
          "</em>.",
      },
      bond: {
        title: ({ aminoAcid }) => `Se forma un enlace peptídico con ${aminoAcid}`,
        text:
          "La <strong>peptidil transferasa</strong> del ribosoma (catalizada " +
          "por el ARNr, por eso el ribosoma es una <em>ribozima</em>) " +
          "transfiere la cadena en crecimiento desde el ARNt del sitio P al " +
          "aminoácido del sitio A. Se forma un nuevo <strong>enlace " +
          "peptídico</strong> dentro del ribosoma. El ARNt del sitio P queda " +
          "vacío; el ARNt del sitio A lleva todo el polipéptido. Verás que " +
          "el nuevo aminoácido aparece en la cadena externa después de la " +
          "<strong>translocación</strong>, cuando ese peptidil-ARNt pase al " +
          "sitio P.",
      },
      shift: {
        title: "Translocación - el ribosoma avanza un codón",
        text:
          "El ribosoma se <strong>transloca</strong> un codón hacia adelante " +
          "(5'->3'). El ARNt vacío sale por el <strong>sitio E</strong>, el " +
          "peptidil-ARNt pasa de A a P, y un nuevo codón queda expuesto en " +
          "el <strong>sitio A</strong> ahora vacío. Este ciclo toma cerca de " +
          "<strong>0.5 segundos</strong> en una célula eucariota y agrega " +
          "aproximadamente 2 aminoácidos por segundo.",
      },
      stop: {
        title: ({ codon }) => `Codón STOP: ${codon}`,
        text: ({ codon }) =>
          "El sitio A ahora está posicionado sobre <em>" +
          codon +
          "</em>, un " +
          '<strong class="hl-coral">codón STOP</strong>. Ningún ARNt de la ' +
          "célula tiene un anticodón que coincida con un codón de parada. " +
          "En su lugar, una proteína llamada <strong>eRF1</strong> (factor " +
          "de liberación eucariota 1) imita la forma de un ARNt y entra al " +
          "sitio A. Reconoce el codón de parada y activa la " +
          "<strong>hidrólisis</strong>, rompiendo el enlace entre el " +
          "polipéptido y el ARNt del sitio P. La proteína completa queda libre.",
      },
      release: {
        title: "Proteína liberada - traducción completa!",
        text:
          "El <strong>polipéptido</strong> terminado " +
          "(Met-Pro-Glu-Phe-Gly-Lys-Pro) se libera. El ribosoma se " +
          "<strong>desensambla</strong> en sus subunidades 40S y 60S, que " +
          "se reciclan para el siguiente ARNm. La proteína ahora se " +
          "<strong>pliega</strong> en su conformación 3D, la forma que " +
          "determina su función.<br><br>" +
          "En tu flujo de IEI, las herramientas de anotación recorren este " +
          "mismo camino en reversa: parten de una variante VCF, determinan " +
          "qué codón afecta, buscan el cambio de aminoácido y evalúan si la " +
          "función de la proteína se altera.",
      },
    },
  },


  codonChart: {
    hero: {
      pillLabel: "ARN",
      pillText: "Codones interactivos",
      title: "Tabla de codones de ARN",
      lead:
        "Haz clic en un codón para ver el nombre completo del aminoácido y la información " +
        "relevante de inicio o parada.",
    },
    baseLegend: {
      aria: "Bases de ARN",
      U: "T(U) Uracilo",
      C: "C Citosina",
      A: "A Adenina",
      G: "G Guanina",
    },
    matrix: {
      aria: "Tabla interactiva de codones de ARN",
      windowTitle: "Matriz de codones",
      firstNucleotideShort: "1.º",
      secondNucleotide: "Segundo nucleótido",
      codonAria: ({ codon, name }) => codon + ": " + name,
    },
    detail: {
      aria: "Descripción del codón seleccionado",
      label: "Codón seleccionado",
    },
    aminoAcids: {
      alanine: "Alanina",
      arginine: "Arginina",
      asparagine: "Asparagina",
      asparticAcid: "Ácido aspártico",
      cysteine: "Cisteína",
      glutamicAcid: "Ácido glutámico",
      glutamine: "Glutamina",
      glycine: "Glicina",
      histidine: "Histidina",
      isoleucine: "Isoleucina",
      leucine: "Leucina",
      lysine: "Lisina",
      methionine: "Metionina",
      phenylalanine: "Fenilalanina",
      proline: "Prolina",
      serine: "Serina",
      stopSignal: "Señal de parada",
      threonine: "Treonina",
      tryptophan: "Triptófano",
      tyrosine: "Tirosina",
      valine: "Valina",
    },
    descriptions: {
      standard: ({ codon, name }) => codon + " codifica " + name + ".",
      start: ({ codon }) =>
        codon + " codifica metionina y suele ser el codón de inicio de la traducción.",
      stop: ({ codon }) =>
        codon + " es un codón de parada. Señala la terminación de la traducción y no codifica un aminoácido.",
    },
    tags: {
      start: "Codón de inicio",
      stop: "Codón de parada",
      single: "Aminoácido codificado por un solo codón",
    },
    groups: {
      hydrophobic: "Aminoácido hidrofóbico",
      polar: "Aminoácido hidrofílico sin carga",
      positive: "Aminoácido con carga positiva",
      negative: "Aminoácido con carga negativa",
      cysteine: "Cisteína",
      stop: "Codón de parada de traducción",
    },
    legend: {
      aria: "Leyenda de colores",
      hydrophobic: "Aminoácidos hidrofóbicos",
      start: "Codón de inicio de traducción",
      polar: "Aminoácidos hidrofílicos sin carga",
      positive: "Aminoácidos con carga positiva",
      negative: "Aminoácidos con carga negativa",
      cysteine: "Cisteína",
      stop: "Codones de parada de traducción",
    },
  },

  mutation: {
    labels: {
      mutantMrna: "ARNm mutante",
      originalMrna: "ARNm original",
      labTitle: "Laboratorio de mutaciones",
      animationTitle: "Animación",
      helpAria: "Abrir explicación guiada",
    },
    instructions: {
      html:
        "Haz clic en una base para <strong>cambiarla</strong>. Usa las " +
        "herramientas para <strong>eliminar</strong> o <strong>insertar</strong> " +
        "bases. Luego presiona <strong>Traducir mutante</strong> para analizar " +
        "el ARNm alterado.",
      clickBase: "Haz clic en una base para",
      change: "cambiarla",
      useTools: "Usa las herramientas para",
      delete: "eliminar",
      insert: "insertar",
      bases: "bases. Luego presiona",
      translateMutant: "Traducir mutante",
      analyze: "para analizar el ARNm alterado.",
    },
    tools: {
      change: "Cambiar base",
      delete: "Eliminar base",
      insert: "Insertar después",
    },
    actions: {
      translateMutant: "Traducir mutante ->",
      resetSequence: "Reiniciar secuencia",
    },
    sequenceEditor: {
      editBase: ({ index, base }) => `Editar base ${index}: ${base}`,
    },
    presetsTitle: "Preajustes",
    presets: {
      missense: {
        label: "Cambio sentido (mod)",
        title: "Cambio de sentido - Impacto moderado",
      },
      nonsense: {
        label: "Sin sentido (alto)",
        title: "Sin sentido - Impacto alto",
      },
      synonymous: {
        label: "Sinónima (bajo)",
        title: "Sinónima - Impacto bajo",
      },
      "frameshift-del": {
        label: "Corrimiento (del)",
        title: "Deleción con corrimiento - Impacto alto",
      },
      "frameshift-ins": {
        label: "Corrimiento (ins)",
        title: "Inserción con corrimiento - Impacto alto",
      },
      "start-lost": {
        label: "Inicio perdido (alto)",
        title: "Inicio perdido - Impacto alto",
      },
    },
    proteinComparison: {
      original: "Original:",
      mutant: "Mutante:",
      noProtein: "No se produjo proteína",
      stopCodonTitle: ({ stopCodon }) => `${stopCodon} codón STOP`,
    },
    analysis: {
      types: {
        noChange: "Sin cambio",
        startLost: "Inicio perdido",
        frameshiftIns: "Inserción con corrimiento",
        frameshiftDel: "Deleción con corrimiento",
        inFrameIns: "Inserción en marco",
        inFrameDel: "Deleción en marco",
        nonsense: "Sin sentido",
        missense: "Cambio de sentido",
        synonymous: "Sinónima",
      },
      impacts: {
        none: "Sin impacto",
        high: "Impacto alto",
        moderate: "Impacto moderado",
        low: "Impacto bajo",
      },
      explanations: {
        noChange:
          "La secuencia es idéntica a la original. No se ha aplicado ninguna mutación.",
        startLost: ({ mutantStart }) =>
          `El primer codón es "${mutantStart}", no AUG. La subunidad pequeña ` +
          "del ribosoma escanea en busca de AUG para iniciar la traducción; " +
          "sin él, no se produce proteína a partir de este ARNm. Es una de " +
          "las clases de variantes más dañinas.",
        inFrame: ({ lengthDiff }) =>
          `La longitud de la secuencia cambió en ${lengthDiff} bases, un ` +
          "múltiplo de 3. El marco de lectura se conserva, pero la proteína " +
          "gana o pierde uno o más aminoácidos. La función de la proteína " +
          "puede conservarse parcialmente.",
        frameshift: ({ lengthDiff }) =>
          `${Math.abs(lengthDiff)} base(s) ${
            lengthDiff > 0 ? "extra" : "faltante(s)"
          }. El número no es múltiplo de 3, así que el marco de lectura se ` +
          "desplaza desde el indel en adelante. Todos los codones posteriores " +
          "se leen incorrectamente, por lo general generando un STOP prematuro. " +
          "La función casi siempre se pierde.",
        nonsense: ({ stopCodonIndex, stopCodon, originalProteinLength }) =>
          `El codón ${stopCodonIndex + 1} ahora es un codón STOP (${stopCodon}). ` +
          "El ribosoma termina la traducción antes de tiempo y produce una " +
          `proteína truncada con ${stopCodonIndex} aminoácidos en lugar de ` +
          `${originalProteinLength}. Las proteínas truncadas casi siempre ` +
          "fallan al plegarse correctamente y suelen degradarse.",
        synonymous:
          "Las bases cambiaron, pero la proteína no cambió. Esto es posible " +
          "porque el código genético es degenerado: varios codones pueden " +
          "codificar el mismo aminoácido. Las variantes sinónimas suelen " +
          "tolerarse.",
        missense: ({ diffCount }) =>
          `${diffCount} aminoácido(s) difieren del original. Cada codón ` +
          "modificado ahora codifica un aminoácido diferente. Que la proteína " +
          "siga funcionando depende de qué residuos cambiaron y por cuáles " +
          "fueron reemplazados.",
      },
    },
    guide: {
      welcome: "Bienvenida",
      purposeTitle: "Simulador de mutaciones",
      purposeText:
        "Este laboratorio te permite cambiar una secuencia de ARNm. Cambia una secuencia de ARNm y observa cómo cambia el polipéptido que construye el ribosoma. La app puede usar la palabra proteína como abreviatura, pero esta vista se enfoca en la cadena producida por el ribosoma.",
      chooseTitle: "Elige una mutación",
      translateTitle: "Traducir mutante",
      translateText:
        "Después de elegir un preajuste o editar bases, haz clic en Traducir mutante. El simulador lee el ARNm mutante en codones y actualiza el resultado del polipéptido.",
      statusTitle: "Lee el impacto",
      statusStop: ({ stopCodon }) =>
        `Ahora la tarjeta de resultado nombra la mutación y su impacto. Aquí ${stopCodon} es un codón STOP, así que el ribosoma se detiene antes de tiempo.`,
      statusDefault:
        "Ahora la tarjeta de resultado nombra la mutación y explica por qué importa.",
      changedTitle: "Rastréalo hasta las bases",
      nextStepTitle: "Siguiente paso",
      nextStepText:
        "Siguiente paso avanza la traducción un evento a la vez. Aquí la guía ya pasó por AUG y CCU, así que Met y Pro se agregaron antes del codón STOP.",
      ribosomeTitle: "Observa el ribosoma",
      ribosomeText: ({ mutantCodon }) =>
        `Esta vista pausada muestra el ribosoma moviéndose por los codones. Se acerca a ${mutantCodon}, donde la traducción terminará temprano.`,
      autoTitle: "Auto",
      autoText:
        "Auto ejecuta los mismos pasos continuamente en vez de avanzar con un clic a la vez. En este ejemplo sin sentido, se detiene cuando alcanza el codón STOP temprano.",
      speedTitle: "Velocidad",
      speedText:
        "La velocidad controla qué tan rápido corre Auto. Un movimiento más lento suele ser mejor cuando un docente quiere que los estudiantes sigan cada codón.",
      compareTitle: "Compara los resultados",
      compareText: ({ stopCodon }) =>
        `Después de que la traducción llega a ${stopCodon}, compara los resultados. La cadena original continúa, pero la cadena mutante se detiene temprano y es más corta.`,
      resetTitle: "Reiniciar secuencia",
      resetText:
        "Reiniciar secuencia devuelve las bases al ARNm original y limpia el resultado para que los usuarios puedan probar otra mutación.",
      helpTitle: "Abrir ayuda de nuevo",
      helpText:
        "Presiona este signo de pregunta cuando quieras volver a ver estas explicaciones.",
      changedCodonFallback:
        "La base resaltada muestra dónde cambió el codón. En este ejemplo, la mutación crea un codón STOP.",
      changedCodon: ({
        codonLabel,
        originalCodon,
        mutantCodon,
        originalAminoAcid,
      }) =>
        `La base resaltada muestra dónde cambió ${codonLabel}: ${originalCodon} se convierte en ${mutantCodon}, así que ${originalAminoAcid} se convierte en STOP.`,
      codonNumber: ({ codonNumber }) => `codón ${codonNumber}`,
      thisCodon: "este codón",
      fallbackAminoAcid: "un aminoácido",
      nonsensePresetFallback:
        "Por ejemplo, puedes seleccionar Sin sentido (alto), que crea un codón STOP temprano. También puedes editar directamente las bases de arriba para crear una mutación específica en vez de usar un preajuste.",
      nonsensePreset: ({ originalCodon, mutantCodon }) =>
        `Por ejemplo, puedes seleccionar Sin sentido (alto). Cambia ${originalCodon} a ${mutantCodon}, creando un codón STOP temprano. También puedes editar directamente las bases de arriba para crear una mutación específica en vez de usar un preajuste.`,
      stopCodonFallback: "el codón STOP",
      stopFallback: "STOP",
    },
  },
};
