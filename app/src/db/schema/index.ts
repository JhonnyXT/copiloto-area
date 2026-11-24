/**
 * Esquema completo de la base de datos, en español, organizado por dominio:
 *
 *   organizaciones.ts   el "org_id" de todo (multiusuario desde el día 1)
 *   usuarios.ts         login, sesiones y cuentas de Google (Better Auth)
 *   indicadores.ts      el tablero: catálogo de indicadores + sus mediciones semanales
 *   documentos.ts       el buscador: documentos subidos + sus fragmentos con embedding
 *   informes.ts         el informe semanal y las cifras que lleva
 *   auditoria.ts        registro de quién hizo qué
 *   relaciones.ts       cómo se conectan las tablas de arriba (para usar db.query.*)
 *
 * Para agregar un campo: edita el archivo del dominio, nunca este índice.
 * Para agregar una tabla nueva: créala en su propio archivo y expórtala aquí.
 */
export * from "./organizaciones";
export * from "./usuarios";
export * from "./indicadores";
export * from "./documentos";
export * from "./informes";
export * from "./auditoria";
export * from "./relaciones";
