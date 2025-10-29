# DuruRack

DuruRack es una aplicación de blogging descentralizada y local-first que te permite crear, editar y compartir tu contenido sin depender de servidores centralizados. Tú tienes el control total de tus datos.

## ✨ Conceptos Clave

- **Archivos (Archives):** Un archivo es una colección autocontenida de publicaciones, similar a un blog o un cuaderno personal. Puedes tener múltiples archivos para diferentes temas.
- **Publicaciones (Posts):** Cada publicación es un documento individual dentro de un archivo. Están escritas en Markdown, permitiendo un formato de texto enriquecido de manera sencilla.
- **Local-First:** Todos tus datos (archivos y publicaciones) se guardan directamente en el `localStorage` de tu navegador. No se envía nada a un servidor externo, garantizando tu privacidad.
- **Portabilidad Total:** Puedes exportar cualquier archivo como un único archivo `.json`. Este archivo contiene todas tus publicaciones y se puede importar en cualquier otro dispositivo que ejecute DuruRack, permitiéndote mover o hacer una copia de seguridad de tu contenido fácilmente.

## 🚀 Características

- **Editor de Markdown:** Crea y edita publicaciones con un editor de Markdown simple y potente.
- **Vista Previa en Tiempo Real:** El contenido de Markdown se renderiza a un formato de texto enriquecido y estilizado para una lectura agradable.
- **Búsqueda Integrada:** Busca rápidamente a través de tus publicaciones por título, contenido o etiquetas.
- **Gestión de Archivos:** Crea nuevos archivos, importa archivos existentes desde un archivo `.json` o exporta los tuyos para compartirlos o hacer una copia de seguridad.
- **Sin Cuentas, Sin Servidores:** No es necesario registrarse. Simplemente abre la aplicación y empieza a escribir.
- **Eliminar Publicaciones:** Ahora puedes eliminar las publicaciones que ya no necesites.

## ✅ Cómo Sacar Tu Contenido (Exportar)

Tu contenido es tuyo y puedes llevártelo cuando quieras. El proceso es simple:

1.  Asegúrate de que el archivo que quieres exportar esté activo.
2.  Busca y haz clic en el botón **"Export Archive"** (normalmente tiene un icono de una nube con una flecha hacia arriba).
3.  La aplicación generará un archivo `.json` que se descargará en tu computadora. Este archivo contiene **todas las publicaciones y configuraciones** de ese archivo.
4.  Guarda este archivo en un lugar seguro. ¡Esa es tu copia de seguridad!

## 🛠️ Stack Tecnológico

Este proyecto está construido con un stack moderno y eficiente. Para ejecutarlo localmente o alojarlo tú mismo, necesitarás tener conocimientos de este ecosistema:

-   **Next.js:** Un framework de React para construir aplicaciones web del lado del servidor y estáticas.
-   **TypeScript:** Un superconjunto de JavaScript que añade tipado estático opcional.
-   **Tailwind CSS:** Un framework de CSS utility-first para un diseño rápido y personalizable.
-   **Shadcn/ui:** Una colección de componentes de interfaz de usuario reutilizables.
-   **Zustand:** Un gestor de estado pequeño y rápido para React.
